/**
 * Portfolio Cloudflare Worker
 *
 * Endpoints:
 *   POST /analyze        — Groq (gpt-oss-120b) job fit analysis
 *   POST /contact        — Contact form → D1 leads table
 *   GET  /leads          — Admin: list all leads
 *   PATCH /leads/:id     — Admin: update status/notes
 *   POST /track          — Analytics event tracking → KV
 *   GET  /analytics      — Admin: get analytics summary
 *
 * /analyze failure alerting:
 *   On a Groq error response or an unparseable 200, sends a plain-text
 *   Resend email to jjwerlein@gmail.com ("[ALERT] Job Fit Checker — ..."),
 *   deduped per failure type via KV (env.ANALYTICS) for 6 hours.
 *
 * Secrets required (set via Cloudflare dashboard → Worker → Settings → Variables):
 *   GROQ_API_KEY          — from console.groq.com
 *   RESEND_API_KEY        — from resend.com (also used for /analyze failure alerts)
 *   ADMIN_KEY             — your chosen admin password
 *   ALLOWED_ORIGIN         — https://joshuawerlein.com (after deploy)
 *
 * Bindings required:
 *   DB                   — D1 database named: portfolio_db
 *   ANALYTICS            — KV namespace named: PORTFOLIO_ANALYTICS
 *   ANALYZE_LIMITER      — Rate Limiting binding: 3 requests / 60s, gates POST /analyze
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

const MODEL = 'openai/gpt-oss-120b'

const KNOWN_PROJECTS = ['bestby', 'kilcon', 'lakehenry', 'arkham', 'blair']

const PROFILE = `
Joshua Werlein is a full stack software engineer based in Mondovi, WI, available for remote work immediately. Four production client platforms live today plus a published native Android app; all client sites score 100 in Lighthouse Performance, Accessibility, and SEO.

EDUCATION:
- B.S. Software Engineering, Western Governors University (2025)
- A.A.S. IT Software Developer, Chippewa Valley Technical College (2024)

CERTIFICATIONS:
- AWS Certified Cloud Practitioner (2025)
- CompTIA Project+ (2024)

TECHNICAL SKILLS:
Languages: TypeScript, JavaScript, Java, SQL, C#
Web/Serverless: Cloudflare Workers, D1, KV, R2, Astro, React, Node.js, REST APIs, Resend
Android: Room Database, Jetpack Components, ZXing barcode scanning, Biometric auth
Cloud/DevOps: AWS, Cloudflare Pages, GitHub, CI/CD, MySQL
Security: Turnstile CAPTCHA, Rate limiting, Signed cookie sessions, bcrypt, WCAG AA accessibility

PRODUCTION EXPERIENCE:

1. Full Stack Developer (Contract, 2026) — Arkham Enterprises (Apex Solar & Construction), arkhamsolar.com
   - React + Framer Motion marketing/lead-gen site, Cloudflare Workers backend, spam-protected multi-step quote forms via Resend

2. Full Stack Developer (Contract, 2025-2026) — Blair Sportsmen's Club, blairsportsmensclub.com
   - Astro + Cloudflare Workers reservation platform: live availability calendar, Turnstile-protected booking pipeline, trap-league leaderboards

3. Full Stack Software Engineer (Contract, 2025) — KIL Construction & Friends of Lake Henry, kilcon.work, friendsoflakehenry.com
   - Two serverless platforms on Astro/Cloudflare Workers with D1, KV, R2: signed cookie sessions, Turnstile CAPTCHA, edge rate limiting, zero downtime
   - KIL: client review system (public submission, admin moderation with replies, aggregate ratings), R2-backed media pipeline
   - Friends of Lake Henry: admin CMS (events, moderated photos, donor recognition, raffle management) for non-technical board members

4. Android Engineer — Best By Manager (2025), Google Play: com.bestbymanager.app
   - Kiosk-style inventory app, closed beta through v2.0.0, offline-first Room DB, ZXing barcode scanning, Open Food Facts API
   - Three-tier permission model (Owner/Admin/Employee) with PIN sessions, bcrypt, biometric-gated owner controls
`

// ── HTML escape ───────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ── CORS ──────────────────────────────────────────────────────────────────────
function corsHeaders(origin, allowedOrigin) {
  // Never fall back to * — require explicit ALLOWED_ORIGIN secret
  const allowed = allowedOrigin
  const isAllowed = origin === allowed
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-key',
    'Access-Control-Max-Age': '86400',
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function withCors(response, cors) {
  const headers = new Headers(response.headers)
  Object.entries(cors).forEach(([k, v]) => headers.set(k, v))
  return new Response(response.body, { status: response.status, headers })
}

function isAdmin(request, env) {
  return request.headers.get('x-admin-key') === env.ADMIN_KEY
}

// ── Rate limiter (IP-based, KV-backed) ───────────────────────────────────────
const RATE_LIMIT     = 5    // max requests
const RATE_WINDOW_MS = 10 * 60 * 1000  // per 10 minutes

async function checkRateLimit(env, ip, route) {
  const key   = `rl:${route}:${ip}`
  const now   = Date.now()
  let record  = { count: 0, windowStart: now }

  try {
    const raw = await env.ANALYTICS.get(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (now - parsed.windowStart < RATE_WINDOW_MS) {
        record = parsed
      }
    }
  } catch { /* treat as fresh window */ }

  record.count += 1

  try {
    await env.ANALYTICS.put(key, JSON.stringify(record), {
      expirationTtl: Math.ceil(RATE_WINDOW_MS / 1000) + 60,
    })
  } catch { /* non-critical */ }

  return record.count > RATE_LIMIT
}

// ── Failure alerting (KV-deduped, Resend, non-blocking) ─────────────────────
const ALERT_DEDUP_TTL = 21600 // 6 hours — well above KV's 60s minimum, do not lower

async function shouldAlert(env, dedupKey) {
  try {
    const existing = await env.ANALYTICS.get(dedupKey)
    if (existing) return false
    await env.ANALYTICS.put(dedupKey, '1', { expirationTtl: ALERT_DEDUP_TTL })
    return true
  } catch {
    // Dedup check itself failed — alert anyway. A silently-skipped alert
    // due to a KV hiccup is worse than an occasional duplicate email.
    return true
  }
}

function sendAlert(env, ctx, subject, bodyText) {
  ctx.waitUntil((async () => {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'portfolio@joshuawerlein.com',
          to: 'jjwerlein@gmail.com',
          subject,
          text: bodyText,
        }),
      })
      if (!res.ok) {
        const errText = await res.text()
        console.error(`Alert email failed [${res.status}]:`, errText)
      }
    } catch (err) {
      console.error('Alert email threw:', err)
    }
  })())
}

// ── Input validation ──────────────────────────────────────────────────────────
function validateContact({ name, email, subject, message }) {
  const n = name?.trim()
  const e = email?.trim()
  const s = subject?.trim()
  const m = message?.trim()
  if (!n)              return 'Name is required'
  if (n.length > 100)  return 'Name too long'
  if (!e)              return 'Email is required'
  if (e.length > 254)  return 'Email too long'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return 'Invalid email'
  if (s && s.length > 200) return 'Subject too long'
  if (!m)              return 'Message is required'
  if (m.length > 2000) return 'Message too long (max 2000 chars)'
  return null
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || ''
    const cors   = corsHeaders(origin, env.ALLOWED_ORIGIN)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    // Request size limit — read body once, enforce hard cap, re-parse as JSON
    let bodyText
    try {
      bodyText = await request.text()
    } catch {
      return withCors(json({ error: 'Failed to read request body' }, 400), cors)
    }

    if (bodyText.length > 10000) {
      return withCors(json({ error: 'Request too large' }, 413), cors)
    }

    const parseBody = () => {
      try { return JSON.parse(bodyText) } catch { return null }
    }

    const url  = new URL(request.url)
    const path = url.pathname

    try {
      // ── POST /analyze ────────────────────────────────────────────────────
      if (path === '/analyze' && request.method === 'POST') {
        const body = parseBody()
        const { jobDescription } = body || {}

        if (!jobDescription || jobDescription.trim().length < 50) {
          return withCors(json({ error: 'Job description too short' }, 400), cors)
        }

        if (jobDescription.length > 6000) {
          return withCors(json({ error: 'Job description too long' }, 400), cors)
        }

        const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
        const { success } = await env.ANALYZE_LIMITER.limit({ key: ip })
        if (!success) {
          return withCors(json({ error: 'Too many requests. Please wait a minute and try again.' }, 429), cors)
        }

        const prompt = `You are analyzing job fit for a specific candidate. Return ONLY valid JSON, no markdown, no backticks.

CANDIDATE PROFILE:
${PROFILE}

JOB DESCRIPTION:
${jobDescription}

Return a JSON object with exactly these fields:
{
  "score": <integer 0-100>,
  "summary": "<one sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "recommendation": "<2-3 sentence recommendation for the hiring manager>"
}`

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: 'system', content: 'You are a job fit analyzer. Always respond with valid JSON only — no markdown, no backticks, no explanation.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.3,
            max_completion_tokens: 3000,
            reasoning_effort: 'low',
            include_reasoning: false,
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'job_fit_analysis',
                strict: true,
                schema: {
                  type: 'object',
                  properties: {
                    score: { type: 'integer' },
                    summary: { type: 'string' },
                    strengths: { type: 'array', items: { type: 'string' } },
                    gaps: { type: 'array', items: { type: 'string' } },
                    recommendation: { type: 'string' },
                  },
                  required: ['score', 'summary', 'strengths', 'gaps', 'recommendation'],
                  additionalProperties: false,
                },
              },
            },
          }),
        })

        if (!groqRes.ok) {
          const errText = await groqRes.text()
          let errCode = null
          try { errCode = JSON.parse(errText)?.error?.code } catch { /* body wasn't JSON */ }
          console.error(`Groq ${groqRes.status} [${errCode ?? 'unknown'}]:`, errText)

          if (await shouldAlert(env, 'alert:jobfit')) {
            sendAlert(
              env, ctx,
              `[ALERT] Job Fit Checker — Groq ${groqRes.status}`,
              `Job Fit Checker /analyze failed.\n\n` +
              `Status: ${groqRes.status}\n` +
              `Groq error code: ${errCode ?? 'unknown'}\n` +
              `Model: ${MODEL}\n` +
              `Time (UTC): ${new Date().toISOString()}\n\n` +
              `Raw response body:\n${errText}`
            )
          }

          return withCors(json({ error: 'AI service error', status: groqRes.status }, groqRes.status), cors)
        }

        const groqData    = await groqRes.json()
        const finishReason = groqData?.choices?.[0]?.finish_reason
        const rawText      = groqData?.choices?.[0]?.message?.content || ''
        const jsonMatch     = rawText.match(/\{[\s\S]*\}/)
        const cleaned       = jsonMatch ? jsonMatch[0] : rawText

        let result
        try {
          result = JSON.parse(cleaned)
        } catch {
          console.error(`Groq parse error [finish_reason=${finishReason ?? 'unknown'}], raw:`, rawText)

          if (await shouldAlert(env, 'alert:jobfit-parse')) {
            sendAlert(
              env, ctx,
              `[ALERT] Job Fit Checker — parse failure`,
              `Job Fit Checker /analyze got a 200 from Groq but the response body wasn't parseable JSON.\n\n` +
              `finish_reason: ${finishReason ?? 'unknown'}` +
              (finishReason === 'length' ? ' (likely a token-budget truncation, not malformed output)' : '') + `\n` +
              `Model: ${MODEL}\n` +
              `Time (UTC): ${new Date().toISOString()}\n\n` +
              `Raw content:\n${rawText}`
            )
          }

          return withCors(json({ error: 'Failed to parse AI response' }, 500), cors)
        }

        try {
          const current = await env.ANALYTICS.get('analyze_count')
          await env.ANALYTICS.put('analyze_count', String((parseInt(current) || 0) + 1))
        } catch { /* non-critical */ }

        return withCors(json(result), cors)
      }

      // ── POST /contact ────────────────────────────────────────────────────
      if (path === '/contact' && request.method === 'POST') {
        // Rate limit by IP
        const ip        = request.headers.get('CF-Connecting-IP') || 'unknown'
        const rateLimited = await checkRateLimit(env, ip, 'contact')
        if (rateLimited) {
          return withCors(json({ error: 'Too many requests. Please wait a few minutes.' }, 429), cors)
        }

        const { name, email, subject, message } = parseBody() || {}

        const validationError = validateContact({ name, email, subject, message })
        if (validationError) {
          return withCors(json({ error: validationError }, 400), cors)
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

        // Send email via Resend (HTML-escaped user content)
        try {
          const safeName    = escapeHtml(name.trim())
          const safeEmail   = escapeHtml(email.trim())
          const safeSubject = escapeHtml(subject?.trim() || '(none)')
          const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br>')

          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'portfolio@joshuawerlein.com',
              to: 'jjwerlein@gmail.com',
              subject: `Portfolio contact: ${subject?.trim() || 'New message'} from ${name.trim()}`,
              text: `New contact from joshuawerlein.com\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${subject?.trim() || '(none)'}\n\nMessage:\n${message.trim()}`,
              html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
                  <h2 style="color:#00e5ff;border-bottom:2px solid #00e5ff;padding-bottom:8px;">
                    New Portfolio Contact
                  </h2>
                  <table style="width:100%;border-collapse:collapse;">
                    <tr>
                      <td style="padding:8px 0;color:#888;width:80px;"><strong>Name</strong></td>
                      <td style="padding:8px 0;">${safeName}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#888;"><strong>Email</strong></td>
                      <td style="padding:8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#888;"><strong>Subject</strong></td>
                      <td style="padding:8px 0;">${safeSubject}</td>
                    </tr>
                  </table>
                  <div style="margin-top:24px;padding:16px;background:#f5f5f5;border-radius:8px;border-left:4px solid #00e5ff;">
                    <strong style="color:#888;">Message:</strong>
                    <p style="margin:8px 0 0;">${safeMessage}</p>
                  </div>
                  <p style="margin-top:24px;color:#aaa;font-size:12px;">
                    Sent from joshuawerlein.com
                  </p>
                </div>
              `,
            }),
          })
        } catch (emailErr) {
          console.error('Resend error:', emailErr)
          // Lead already saved — don't fail the request
        }

        return withCors(json({ success: true }), cors)
      }

      // ── GET /leads ───────────────────────────────────────────────────────
      if (path === '/leads' && request.method === 'GET') {
        if (!isAdmin(request, env)) {
          return withCors(json({ error: 'Unauthorized' }, 401), cors)
        }
        const result = await env.DB.prepare(
          `SELECT * FROM leads ORDER BY created_at DESC`
        ).all()
        return withCors(json({ leads: result.results }), cors)
      }

      // ── PATCH /leads/:id ─────────────────────────────────────────────────
      const leadMatch = path.match(/^\/leads\/(\d+)$/)
      if (leadMatch && request.method === 'PATCH') {
        if (!isAdmin(request, env)) {
          return withCors(json({ error: 'Unauthorized' }, 401), cors)
        }
        const id      = parseInt(leadMatch[1])
        const body    = parseBody() || {}
        const updates = []
        const values  = []

        if (body.status !== undefined) { updates.push('status = ?'); values.push(body.status) }
        if (body.notes  !== undefined) { updates.push('notes = ?');  values.push(body.notes)  }

        if (updates.length === 0) {
          return withCors(json({ error: 'Nothing to update' }, 400), cors)
        }

        values.push(id)
        await env.DB.prepare(
          `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`
        ).bind(...values).run()

        return withCors(json({ success: true }), cors)
      }

      // ── POST /track ──────────────────────────────────────────────────────
      if (path === '/track' && request.method === 'POST') {
        const { event, project } = parseBody() || {}
        try {
          if (event === 'resume_download') {
            const current = await env.ANALYTICS.get('resume_downloads')
            await env.ANALYTICS.put('resume_downloads', String((parseInt(current) || 0) + 1))
          }
          if (event === 'project_click' && KNOWN_PROJECTS.includes(project)) {
            const key     = `project_click_${project}`
            const current = await env.ANALYTICS.get(key)
            await env.ANALYTICS.put(key, String((parseInt(current) || 0) + 1))
          }
        } catch { /* non-critical */ }
        return withCors(json({ ok: true }), cors)
      }

      // ── GET /analytics ───────────────────────────────────────────────────
      if (path === '/analytics' && request.method === 'GET') {
        if (!isAdmin(request, env)) {
          return withCors(json({ error: 'Unauthorized' }, 401), cors)
        }

        const [resumeDownloads, contactSubmissions, analyzeCount] = await Promise.all([
          env.ANALYTICS.get('resume_downloads'),
          env.ANALYTICS.get('contact_submissions'),
          env.ANALYTICS.get('analyze_count'),
        ])

        const clickCounts = await Promise.all(
          KNOWN_PROJECTS.map(id => env.ANALYTICS.get(`project_click_${id}`))
        )

        const labels = {
          bestby:    'Best By Manager',
          kilcon:    'KIL Construction',
          lakehenry: 'Friends of Lake Henry',
          arkham:    'Arkham Enterprises',
          blair:     'Blair Sportsmen\'s Club',
        }
        const projectClicks = {}
        KNOWN_PROJECTS.forEach((id, i) => {
          projectClicks[labels[id]] = parseInt(clickCounts[i]) || 0
        })

        return withCors(json({
          resume_downloads:     parseInt(resumeDownloads)    || 0,
          contact_submissions:  parseInt(contactSubmissions) || 0,
          analyze_count:        parseInt(analyzeCount)       || 0,
          total_project_clicks: Object.values(projectClicks).reduce((a, b) => a + b, 0),
          project_clicks:       projectClicks,
        }), cors)
      }

      return withCors(json({ error: 'Not found' }, 404), cors)

    } catch (err) {
      console.error('Worker error:', err)
      return withCors(json({ error: 'Internal server error' }, 500), cors)
    }
  },

  // ── Scheduled canary ────────────────────────────────────────────────────
  // Cron schedule itself is set in the Cloudflare dashboard (Settings →
  // Trigger events), not here — this only fires on whatever schedule is
  // configured there. Minimal ping to catch a broken /analyze even when no
  // visitor has triggered it. Alerts through the same Resend/KV path as
  // Layer 1, under its own dedup key so it can't mask or be masked by a
  // live-traffic failure.
  async scheduled(event, env, ctx) {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: 'ping' }],
        max_completion_tokens: 5,
      }),
    })

    if (groqRes.ok) return

    const errText = await groqRes.text()
    let errCode = null
    try { errCode = JSON.parse(errText)?.error?.code } catch { /* body wasn't JSON */ }
    console.error(`Canary: Groq ${groqRes.status} [${errCode ?? 'unknown'}]:`, errText)

    if (await shouldAlert(env, 'alert:jobfit-canary')) {
      sendAlert(
        env, ctx,
        `[ALERT] Job Fit Checker canary — Groq ${groqRes.status}`,
        `Scheduled canary ping to Groq failed.\n\n` +
        `Status: ${groqRes.status}\n` +
        `Groq error code: ${errCode ?? 'unknown'}\n` +
        `Model: ${MODEL}\n` +
        `Time (UTC): ${new Date().toISOString()}\n\n` +
        `Raw response body:\n${errText}`
      )
    }
  },
}
