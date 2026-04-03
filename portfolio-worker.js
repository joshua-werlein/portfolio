/**
 * Portfolio Cloudflare Worker
 * 
 * Endpoints:
 *   POST /analyze        — Gemini Flash job fit analysis
 *   POST /contact        — Contact form → D1 leads table
 *   GET  /leads          — Admin: list all leads
 *   PATCH /leads/:id     — Admin: update status/notes
 *   POST /track          — Analytics event tracking → KV
 *   GET  /analytics      — Admin: get analytics summary
 * 
 * Secrets required (set via Cloudflare dashboard → Worker → Settings → Variables):
 *   GEMINI_API_KEY       — from aistudio.google.com
 *   ADMIN_KEY            — your chosen admin password
 *   ALLOWED_ORIGIN       — https://joshuawerlein.com (after deploy)
 * 
 * Bindings required:
 *   DB                   — D1 database named: portfolio_db
 *   ANALYTICS            — KV namespace named: PORTFOLIO_ANALYTICS
 * 
 * D1 Migration (run once in D1 console):
 *   CREATE TABLE IF NOT EXISTS leads (
 *     id INTEGER PRIMARY KEY AUTOINCREMENT,
 *     name TEXT NOT NULL,
 *     email TEXT NOT NULL,
 *     subject TEXT,
 *     message TEXT NOT NULL,
 *     status TEXT DEFAULT 'new',
 *     notes TEXT DEFAULT '',
 *     created_at TEXT DEFAULT (datetime('now'))
 *   );
 */
 
const PROFILE = `
Joshua Werlein is a full stack software engineer based in Mondovi, WI, available for remote work immediately.
 
EDUCATION:
- B.S. Software Engineering, Western Governors University (2025)
- A.A.S. IT Software Developer, Chippewa Valley Technical College (2024)
 
CERTIFICATIONS:
- AWS Certified Cloud Practitioner (2025)
- CompTIA Project+ (2024)
 
TECHNICAL SKILLS:
Languages: Java, JavaScript, SQL, C#
Android: Android SDK, Room Database, Jetpack Components, ZXing barcode scanning, Biometric auth
Web/Serverless: Cloudflare Workers, Cloudflare R2, Astro, REST APIs, Signed sessions
Cloud/DevOps: AWS, Cloudflare Pages, GitHub, CI/CD, MySQL
Security: Turnstile CAPTCHA, Rate limiting, Signed cookie sessions, bcrypt
Currently Learning: React, Node.js, TypeScript
 
PRODUCTION EXPERIENCE:
 
1. Freelance Software Engineer (2025) — KIL Construction & Friends of Lake Henry
   - Designed and shipped serverless production platforms using Cloudflare Workers, R2, and Astro
   - Implemented signed cookie sessions, Turnstile CAPTCHA, and IP rate limiting
   - Built full media workflow admin tooling for non-technical clients
   - Live sites: kilcon.work, friendsoflakehenry.com
 
2. Android Engineer — Best By Manager (2025)
   - Shipped kiosk-style inventory app to Google Play (production)
   - Full release lifecycle from closed beta through v2.0.0
   - Three-tier permission model (Owner/Admin/Employee) with bcrypt + biometrics
   - Offline-first Room DB, ZXing barcode scanning, Open Food Facts API, AlarmManager notifications
   - Play Store: com.bestbymanager.app
`
 
// ── CORS helpers ──────────────────────────────────────────────────────────────
 
function corsHeaders(origin, allowedOrigin) {
  const allowed = allowedOrigin || '*'
  const isAllowed = allowed === '*' || origin === allowed
  return {
    'Access-Control-Allow-Origin': isAllowed ? (origin || '*') : allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-key',
    'Access-Control-Max-Age': '86400',
  }
}
 
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
}
 
function withCors(response, cors) {
  const headers = new Headers(response.headers)
  Object.entries(cors).forEach(([k, v]) => headers.set(k, v))
  return new Response(response.body, { status: response.status, headers })
}
 
// ── Auth helper ───────────────────────────────────────────────────────────────
 
function isAdmin(request, env) {
  const key = request.headers.get('x-admin-key')
  return key === env.ADMIN_KEY
}
 
// ── Main handler ──────────────────────────────────────────────────────────────
 
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN)
 
    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }
 
    const url = new URL(request.url)
    const path = url.pathname
 
    try {
      // ── POST /analyze ──────────────────────────────────────────────────────
      if (path === '/analyze' && request.method === 'POST') {
        const { jobDescription } = await request.json()
 
        if (!jobDescription || jobDescription.trim().length < 50) {
          return withCors(json({ error: 'Job description too short' }, 400), cors)
        }
 
        const prompt = `You are analyzing job fit for a specific candidate. Respond ONLY with valid JSON — no markdown, no backticks, no preamble.
 
CANDIDATE PROFILE:
${PROFILE}
 
JOB DESCRIPTION:
${jobDescription}
 
Analyze how well this candidate matches the job. Return this exact JSON structure:
{
  "score": <integer 0-100>,
  "summary": "<one sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap or thing to highlight 1>", "<gap 2>"],
  "recommendation": "<2-3 sentence actionable recommendation for the hiring manager or recruiter>"
}`
 
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
            }),
          }
        )
 
        if (!geminiRes.ok) {
          const err = await geminiRes.text()
          console.error('Gemini error:', err)
          return withCors(json({ error: 'AI service error' }, 502), cors)
        }
 
        const geminiData = await geminiRes.json()
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const cleaned = rawText.replace(/```json|```/g, '').trim()
 
        let result
        try {
          result = JSON.parse(cleaned)
        } catch {
          return withCors(json({ error: 'Failed to parse AI response' }, 500), cors)
        }
 
        // Track usage in KV
        try {
          const current = await env.ANALYTICS.get('analyze_count')
          await env.ANALYTICS.put('analyze_count', String((parseInt(current) || 0) + 1))
        } catch { /* non-critical */ }
 
        return withCors(json(result), cors)
      }
 
      // ── POST /contact ──────────────────────────────────────────────────────
      if (path === '/contact' && request.method === 'POST') {
        const { name, email, subject, message } = await request.json()
 
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
          return withCors(json({ error: 'Missing required fields' }, 400), cors)
        }
 
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return withCors(json({ error: 'Invalid email' }, 400), cors)
        }
 
        // Save to D1
        await env.DB.prepare(
          `INSERT INTO leads (name, email, subject, message, status, notes)
           VALUES (?, ?, ?, ?, 'new', '')`
        ).bind(
          name.trim(),
          email.trim().toLowerCase(),
          subject?.trim() || '',
          message.trim()
        ).run()
 
        // Track submission count
        try {
          const current = await env.ANALYTICS.get('contact_submissions')
          await env.ANALYTICS.put('contact_submissions', String((parseInt(current) || 0) + 1))
        } catch { /* non-critical */ }
 
        // TODO: Add Resend email notification here once RESEND_API_KEY secret is added
        // Example:
        // await fetch('https://api.resend.com/emails', {
        //   method: 'POST',
        //   headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     from: 'portfolio@joshuawerlein.com',
        //     to: 'jjwerlein@gmail.com',
        //     subject: `Portfolio contact: ${subject || 'New message'} from ${name}`,
        //     text: `From: ${name} <${email}>\n\n${message}`,
        //   }),
        // })
 
        return withCors(json({ success: true }), cors)
      }
 
      // ── GET /leads ─────────────────────────────────────────────────────────
      if (path === '/leads' && request.method === 'GET') {
        if (!isAdmin(request, env)) {
          return withCors(json({ error: 'Unauthorized' }, 401), cors)
        }
 
        const result = await env.DB.prepare(
          `SELECT * FROM leads ORDER BY created_at DESC`
        ).all()
 
        return withCors(json({ leads: result.results }), cors)
      }
 
      // ── PATCH /leads/:id ───────────────────────────────────────────────────
      const leadMatch = path.match(/^\/leads\/(\d+)$/)
      if (leadMatch && request.method === 'PATCH') {
        if (!isAdmin(request, env)) {
          return withCors(json({ error: 'Unauthorized' }, 401), cors)
        }
 
        const id = parseInt(leadMatch[1])
        const body = await request.json()
        const updates = []
        const values = []
 
        if (body.status !== undefined) { updates.push('status = ?'); values.push(body.status) }
        if (body.notes !== undefined)  { updates.push('notes = ?');  values.push(body.notes) }
 
        if (updates.length === 0) {
          return withCors(json({ error: 'Nothing to update' }, 400), cors)
        }
 
        values.push(id)
        await env.DB.prepare(
          `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`
        ).bind(...values).run()
 
        return withCors(json({ success: true }), cors)
      }
 
      // ── POST /track ────────────────────────────────────────────────────────
      if (path === '/track' && request.method === 'POST') {
        const { event, project } = await request.json()
 
        try {
          if (event === 'resume_download') {
            const current = await env.ANALYTICS.get('resume_downloads')
            await env.ANALYTICS.put('resume_downloads', String((parseInt(current) || 0) + 1))
          }
 
          if (event === 'project_click' && project) {
            const key = `project_click_${project}`
            const current = await env.ANALYTICS.get(key)
            await env.ANALYTICS.put(key, String((parseInt(current) || 0) + 1))
          }
        } catch { /* non-critical */ }
 
        return withCors(json({ ok: true }), cors)
      }
 
      // ── GET /analytics ─────────────────────────────────────────────────────
      if (path === '/analytics' && request.method === 'GET') {
        if (!isAdmin(request, env)) {
          return withCors(json({ error: 'Unauthorized' }, 401), cors)
        }
 
        const [resumeDownloads, contactSubmissions, analyzeCount] = await Promise.all([
          env.ANALYTICS.get('resume_downloads'),
          env.ANALYTICS.get('contact_submissions'),
          env.ANALYTICS.get('analyze_count'),
        ])
 
        const projectIds = ['bestby', 'kilcon', 'lakehenry']
        const clickCounts = await Promise.all(
          projectIds.map(id => env.ANALYTICS.get(`project_click_${id}`))
        )
 
        const projectClicks = {}
        projectIds.forEach((id, i) => {
          const labels = { bestby: 'Best By Manager', kilcon: 'KIL Construction', lakehenry: 'Friends of Lake Henry' }
          projectClicks[labels[id]] = parseInt(clickCounts[i]) || 0
        })
 
        return withCors(json({
          resume_downloads:     parseInt(resumeDownloads) || 0,
          contact_submissions:  parseInt(contactSubmissions) || 0,
          analyze_count:        parseInt(analyzeCount) || 0,
          total_project_clicks: Object.values(projectClicks).reduce((a, b) => a + b, 0),
          project_clicks:       projectClicks,
        }), cors)
      }
 
      // ── 404 ────────────────────────────────────────────────────────────────
      return withCors(json({ error: 'Not found' }, 404), cors)
 
    } catch (err) {
      console.error('Worker error:', err)
      return withCors(json({ error: 'Internal server error' }, 500), cors)
    }
  },
}