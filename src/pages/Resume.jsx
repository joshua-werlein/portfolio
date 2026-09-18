import { useEffect, useRef, useState } from 'react'

const WORKER = 'https://api.joshuawerlein.com'

const SKILLS = [
  { category: 'Languages', items: ['Java', 'JavaScript', 'TypeScript', 'SQL', 'C#'] },
  { category: 'Web & Serverless', items: ['Cloudflare Workers', 'D1', 'KV', 'R2', 'Astro', 'React', 'Node.js', 'REST APIs', 'Resend'] },
  { category: 'Android', items: ['Android SDK', 'Room Database', 'Jetpack Components', 'ZXing / Barcode', 'Biometric Auth', 'Google Play'] },
  { category: 'Cloud & DevOps', items: ['AWS (CCP)', 'Cloudflare Pages', 'GitHub / Git', 'CI/CD', 'MySQL'] },
  { category: 'Security', items: ['Turnstile CAPTCHA', 'Rate Limiting', 'Signed Cookie Sessions', 'bcrypt', 'WCAG AA'] },
]

const EXPERIENCE = [
  {
    company: "Grayz'n Buffalo Bar & Grill",
    url: 'https://grayznbuffalo.com',
    role: 'Software Engineer — Contract',
    period: '2026',
    type: 'Freelance · Remote',
    bullets: [
      'Delivered an Astro + Cloudflare restaurant platform using D1, KV, and R2 for menu content, recurring weekly specials, admin sessions, and managed media.',
      'Built a scheduled Facebook Graph Worker that caches feed and media to KV and preserves last known-good content during refresh failures.',
      'Owned staging controls, accessibility, responsive performance, and production cutover for a live small-business platform.',
    ],
  },
  {
    company: 'Arkham Enterprises (Apex Solar & Construction)',
    url: 'https://www.arkhamsolar.com',
    role: 'Software Engineer — Contract',
    period: '2026',
    type: 'Freelance · Remote',
    bullets: [
      'Built a React SPA marketing and lead-gen site served from a Cloudflare Worker with spam-protected contact and multi-step quote-request forms via Resend.',
      'Implemented deep-linked quote flows (?type= URL params) for service pages, ads, and AI agent handoffs.',
      'Shipped LocalBusiness JSON-LD structured data, llms.txt agent discoverability, and WCAG AA accessibility.',
    ],
  },
  {
    company: "Blair Sportsmen's Club",
    url: 'https://blairsportsmensclub.com',
    role: 'Software Engineer — Contract',
    period: '2025–2026',
    type: 'Freelance · Remote · Nonprofit',
    bullets: [
      'Built an event and reservation platform: D1-backed availability calendar, calendar-to-form prefill, and Turnstile-protected contact pipeline via Resend.',
      'Shipped trap-league leaderboards with per-event round breakdowns in a deep-linkable modal (#trap-scores routing).',
    ],
  },
  {
    company: 'KIL Construction',
    url: 'https://kilcon.work',
    role: 'Software Engineer — Contract',
    period: '2025',
    type: 'Freelance · Remote',
    bullets: [
      'Designed and shipped a serverless content platform on Cloudflare Workers and Astro with signed cookie sessions, Turnstile CAPTCHA, and edge rate limiting.',
      'Built an R2-backed media pipeline and a full client-review system with public submission, admin moderation, and aggregate rating summaries.',
      'Owned deployments, production fixes, and client feedback loops end-to-end with zero downtime incidents.',
    ],
  },
  {
    company: 'Friends of Lake Henry',
    url: 'https://friendsoflakehenry.com',
    role: 'Software Engineer — Contract',
    period: '2025',
    type: 'Freelance · Remote · Nonprofit',
    bullets: [
      'Built a nonprofit platform as a single integrated Astro + Cloudflare codebase with API routes and session middleware in-repo.',
      'Delivered admin backends for events, photo galleries, donor recognition, and raffle management behind signed-session auth, designed for non-technical board members.',
    ],
  },
]

const PROJECTS = [
  {
    name: 'Best By Manager',
    url: 'https://play.google.com/store/apps/details?id=com.bestbymanager.app',
    period: '2025',
    description: 'Native Android kiosk app for product expiration tracking in retail and food-service environments. Published to Google Play through a full release lifecycle: closed beta, staged rollout, v2.0.0 in production.',
    bullets: [
      'Offline-first Room/SQLite database — fully functional without network connectivity.',
      'ZXing barcode scanner integrated with the Open Food Facts API for automatic product lookup.',
      'Three-tier permission model: Owner (biometric), Admin (PIN + bcrypt), Employee — each with scoped access.',
      'AlarmManager-based expiration alerts with configurable lead-time per product.',
    ],
    tags: 'Java · Android SDK · Room Database · Jetpack · ZXing · Biometric Auth',
  },
]

const EDUCATION = [
  { degree: 'B.S. Software Engineering', school: 'Western Governors University', year: '2025' },
  { degree: 'A.A.S. IT Software Developer', school: 'Chippewa Valley Technical College', year: '2024' },
]

const CERTS = [
  { name: 'AWS Certified Cloud Practitioner', year: '2025' },
  { name: 'CompTIA Project+', year: '2024' },
]

export default function Resume() {
  const viewFired = useRef(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark')
  const [controlsVisible, setControlsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const prefersReduced = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    if (prefersReduced.current) return
    const onScroll = () => {
      const y = window.scrollY
      if (y < 60) {
        setControlsVisible(true)
      } else {
        setControlsVisible(y < lastScrollY.current)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (viewFired.current) return
    viewFired.current = true
    fetch(`${WORKER}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'resume_view' }),
    }).catch(() => {})
  }, [])

  const handleDownload = () => {
    fetch(`${WORKER}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'resume_download' }),
    }).catch(() => {})
  }

  return (
    <div className="r-page">
      {/* Controls */}
      <div
        className={`r-controls${controlsVisible ? '' : ' r-controls--hidden'}`}
        role="navigation"
        aria-label="Resume page controls"
      >
        <a href="/" className="r-back">
          ← Back to Portfolio
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'none',
              border: '1px solid var(--border-2)',
              borderRadius: 6,
              padding: '6px 10px',
              color: 'var(--text-2)',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <a
            href="/Joshua-Werlein_Resume.pdf"
            download="Joshua-Werlein_Resume.pdf"
            onClick={handleDownload}
            className="r-download btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            Download PDF ↓
          </a>
        </div>
      </div>

      {/* Resume document */}
      <main className="r-doc" aria-label="Resume">

        {/* Header */}
        <header className="r-header">
          <div>
            <h1 className="r-name">Joshua Werlein</h1>
            <p className="r-title">Full-Stack Software Engineer</p>
          </div>
          <div className="r-contact-list">
            <a href="mailto:jjwerlein@gmail.com" className="r-contact-item">jjwerlein@gmail.com</a>
            <span className="r-sep">·</span>
            <span className="r-contact-item">Mondovi, WI — Remote Ready</span>
            <span className="r-sep">·</span>
            <a href="https://linkedin.com/in/joshua-werlein" target="_blank" rel="noreferrer" className="r-contact-item">linkedin.com/in/joshua-werlein</a>
            <span className="r-sep">·</span>
            <a href="https://github.com/joshua-werlein" target="_blank" rel="noreferrer" className="r-contact-item">github.com/joshua-werlein</a>
          </div>
        </header>

        {/* Summary */}
        <div className="r-section" aria-labelledby="r-summary">
          <h2 id="r-summary" className="r-section-title">Summary</h2>
          <p className="r-body">
            Full-stack software engineer with production experience delivering end-to-end web platforms and a
            published native Android application. Work spans Cloudflare edge infrastructure (Workers, D1, KV, R2),
            Astro and React frontends, and native Android development in Java. Comfortable owning the full release
            lifecycle — from architecture through deployment and ongoing maintenance. Open to remote software
            engineering roles.
          </p>
        </div>

        {/* Skills */}
        <div className="r-section" aria-labelledby="r-skills">
          <h2 id="r-skills" className="r-section-title">Technical Skills</h2>
          <div className="r-skills-grid">
            {SKILLS.map(g => (
              <div key={g.category} className="r-skill-row">
                <span className="r-skill-cat">{g.category}:</span>
                <span className="r-skill-items">{g.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="r-section" aria-labelledby="r-experience">
          <h2 id="r-experience" className="r-section-title">Client Experience</h2>
          <div className="r-entries">
            {EXPERIENCE.map(e => (
              <div key={e.company} className="r-entry">
                <div className="r-entry-header">
                  <div>
                    <h3 className="r-entry-title">{e.role}</h3>
                    <div className="r-entry-sub">
                      <a href={e.url} target="_blank" rel="noreferrer" className="r-entry-company">{e.company}</a>
                      <span className="r-sep">·</span>
                      <span className="r-entry-type">{e.type}</span>
                    </div>
                  </div>
                  <span className="r-entry-period">{e.period}</span>
                </div>
                <ul className="r-bullets">
                  {e.bullets.map((b, i) => (
                    <li key={i} className="r-bullet">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="r-section" aria-labelledby="r-projects">
          <h2 id="r-projects" className="r-section-title">Projects</h2>
          <div className="r-entries">
            {PROJECTS.map(p => (
              <div key={p.name} className="r-entry">
                <div className="r-entry-header">
                  <div>
                    <h3 className="r-entry-title">
                      <a href={p.url} target="_blank" rel="noreferrer" className="r-entry-company">{p.name}</a>
                    </h3>
                    <div className="r-entry-type" style={{ marginTop: 2 }}>{p.tags}</div>
                  </div>
                  <span className="r-entry-period">{p.period}</span>
                </div>
                <p className="r-body" style={{ marginBottom: 8 }}>{p.description}</p>
                <ul className="r-bullets">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="r-bullet">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="r-section" aria-labelledby="r-education">
          <h2 id="r-education" className="r-section-title">Education</h2>
          <div className="r-entries">
            {EDUCATION.map(e => (
              <div key={e.degree} className="r-entry">
                <div className="r-entry-header">
                  <div>
                    <h3 className="r-entry-title">{e.degree}</h3>
                    <div className="r-entry-type">{e.school}</div>
                  </div>
                  <span className="r-entry-period">{e.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="r-section" aria-labelledby="r-certs">
          <h2 id="r-certs" className="r-section-title">Certifications</h2>
          <div className="r-entries">
            {CERTS.map(c => (
              <div key={c.name} className="r-entry">
                <div className="r-entry-header">
                  <h3 className="r-entry-title">{c.name}</h3>
                  <span className="r-entry-period">{c.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <style>{`
        .r-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* ── Controls bar ── */
        .r-controls {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
          transition: transform 0.25s ease;
        }

        .r-controls--hidden {
          transform: translateY(-100%);
        }

        @media (prefers-reduced-motion: reduce) {
          .r-controls { transition: none; }
          .r-controls--hidden { transform: none; }
        }

        .r-back {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-2);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.15s;
        }

        .r-back:hover { color: var(--text); opacity: 1; }

        /* ── Document ── */
        .r-doc {
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* ── Header ── */
        .r-header {
          margin-bottom: 36px;
          padding-bottom: 24px;
          border-bottom: 2px solid var(--accent);
        }

        .r-name {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 5vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }

        .r-title {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          color: var(--accent);
          letter-spacing: 0.04em;
          margin-bottom: 14px;
        }

        .r-contact-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
        }

        .r-contact-item {
          color: var(--text-2);
          text-decoration: none;
          font-family: var(--font-mono);
        }

        .r-contact-item:hover { color: var(--accent); opacity: 1; }

        .r-sep { color: var(--border-2); }

        /* ── Sections ── */
        .r-section {
          margin-bottom: 36px;
        }

        .r-section-title {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 18px;
        }

        /* ── Body text ── */
        .r-body {
          font-size: 0.9rem;
          color: var(--text-2);
          line-height: 1.75;
        }

        /* ── Skills ── */
        .r-skills-grid {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .r-skill-row {
          font-size: 0.88rem;
          line-height: 1.6;
        }

        .r-skill-cat {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-3);
          font-weight: 500;
          margin-right: 8px;
        }

        .r-skill-items {
          color: var(--text-2);
        }

        /* ── Entries ── */
        .r-entries {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .r-entry {
          break-inside: avoid;
        }

        .r-entry-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }

        .r-entry-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .r-entry-sub {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }

        .r-entry-company {
          font-size: 0.88rem;
          color: var(--accent);
          font-weight: 500;
          text-decoration: none;
        }

        .r-entry-company:hover { opacity: 0.8; }

        .r-entry-type {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-3);
        }

        .r-entry-period {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-3);
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── Bullets ── */
        .r-bullets {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin: 0;
          padding: 0;
        }

        .r-bullet {
          display: flex;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-2);
          line-height: 1.65;
          list-style: none;
        }

        .r-bullet::before {
          content: '·';
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 0.05em;
        }

        /* ── Print styles ── */
        @media print {
          .r-controls { display: none !important; }

          html, .r-page {
            background: white !important;
            color: black !important;
          }

          .r-doc {
            max-width: 100% !important;
            padding: 0 !important;
          }

          .r-name { color: black !important; font-size: 22pt !important; }
          .r-title { color: #333 !important; }
          .r-section-title { color: #333 !important; border-color: #ccc !important; }
          .r-header { border-color: #333 !important; }
          .r-contact-item, .r-sep { color: #444 !important; }
          .r-entry-title { color: black !important; }
          .r-entry-company { color: #333 !important; }
          .r-entry-type, .r-entry-period, .r-skill-cat { color: #555 !important; }
          .r-body, .r-bullet, .r-skill-items { color: #222 !important; }
          .r-bullet::before { color: #333 !important; }

          .r-entry { break-inside: avoid; }
          .r-section { break-inside: avoid; page-break-inside: avoid; }
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .r-doc { padding: 24px 16px 48px; }
          .r-contact-list { gap: 4px; }
          .r-sep { display: none; }
          .r-contact-item { display: block; width: 100%; }
          .r-entry-header { flex-direction: column; gap: 4px; }
        }
      `}</style>
    </div>
  )
}
