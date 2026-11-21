import { useEffect, useRef, useState } from 'react'

const WORKER = 'https://api.joshuawerlein.com'

const SUMMARY = 'Software engineer building production APIs, automated data workflows, and secure web platforms. Delivered five client systems and a published native Android app; experience spans Cloudflare Workers, D1/KV/R2, Astro/React, Java/Room, authentication, testing, and deployment.'

const SKILLS = [
  { category: 'Languages', items: 'TypeScript, JavaScript, Java, SQL, C#' },
  { category: 'Backend / Cloud', items: 'Cloudflare Workers, D1, KV, R2, REST APIs, authentication, serverless deployment, Workers AI' },
  { category: 'Frontend / Tools', items: 'Astro, React, Git/GitHub, CI/CD, Resend, Turnstile, Room/SQLite, Android, AWS' },
]

const EXPERIENCE = [
  {
    company: 'Grayz’n Buffalo Bar & Grill',
    url: 'https://grayznbuffalo.com',
    role: 'Software Engineer (Contract)',
    period: '2026',
    bullets: [
      'Built a production Astro/Cloudflare restaurant platform with authenticated management of menus, recurring specials, D1 data, KV sessions, and R2 images.',
      'Implemented a scheduled Facebook Graph and Workers AI pipeline to extract poster specials; source-date checks and guarded D1 writes prevent older posts from reversing newer corrections.',
    ],
  },
  {
    company: 'Friends of Lake Henry',
    url: 'https://friendsoflakehenry.com',
    role: 'Software Engineer (Contract)',
    period: '2025',
    bullets: [
      'Developed a nonprofit operations platform for raffle records, prize calendars, donors, events, and moderated community media using Astro, Cloudflare Workers, D1/KV/R2.',
      'Added Facebook Live and winner-photo automation with source verification, AI-assisted review holds, administrative correction paths, and documented release/rollback checks.',
    ],
  },
  {
    company: 'KIL Construction',
    url: 'https://kilcon.work',
    role: 'Software Engineer (Contract)',
    period: '2025',
    bullets: [
      'Created an Astro/Cloudflare business platform with authenticated admin workflows, R2-backed project galleries, review moderation, and Turnstile-protected contact handling.',
      'Implemented signed Meta webhook intake, deduplication, and gated Facebook photo imports; separated private review media from public gallery delivery.',
    ],
  },
  {
    company: 'Blair Sportsmen’s Club',
    url: 'https://blairsportsmensclub.com',
    role: 'Software Engineer (Contract)',
    period: '2025–2026',
    bullets: [
      'Built D1-backed availability and reservation workflows with durable request records, magic-link administration, events, and trap-league leaderboards.',
    ],
  },
  {
    company: 'Arkham Enterprises / Apex Solar',
    url: 'https://www.arkhamsolar.com',
    role: 'Software Engineer (Contract)',
    period: '2026',
    bullets: [
      'Built a React/Cloudflare lead-generation platform with multi-step quote forms, Resend delivery, URL-driven service context, structured metadata, and accessible navigation.',
    ],
  },
  {
    company: 'Best By Manager',
    url: 'https://play.google.com/store/apps/details?id=com.bestbymanager.app',
    role: 'Android Engineer',
    period: '2025',
    type: 'independent project',
    bullets: [
      'Published a Java/Room offline-first inventory app on Google Play with barcode scanning, expiration alerts, and Owner/Admin/Employee access control.',
    ],
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
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
      {/* Navbar — same visual treatment as main portfolio */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Resume navigation">
        <div className="navbar-inner">
          <a href="/" className="nav-logo" aria-label="Joshua Werlein — back to portfolio">
            JW
          </a>
          <a
            href="/"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-2)',
              letterSpacing: '0.01em',
              transition: 'color var(--transition)',
            }}
          >
            ← Portfolio
          </a>
          <div className="nav-actions">
            <a
              href="/Joshua-Werlein_Resume.pdf"
              download="Joshua-Werlein_Resume.pdf"
              onClick={handleDownload}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            >
              Download PDF ↓
            </a>
            <button
              className="theme-toggle"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      {/* Resume document */}
      <div className="r-doc-outer">
      <main className="r-doc" aria-label="Resume">

        {/* Header */}
        <header className="r-header">
          <h1 className="r-name">Joshua Werlein</h1>
          <div className="r-contact-list">
            <span className="r-contact-item">Mondovi, Wisconsin</span>
            <span className="r-sep">·</span>
            <a href="mailto:jjwerlein@gmail.com" className="r-contact-item">jjwerlein@gmail.com</a>
            <span className="r-sep">·</span>
            <a href="https://linkedin.com/in/joshua-werlein" target="_blank" rel="noreferrer" className="r-contact-item">LinkedIn</a>
            <span className="r-sep">·</span>
            <a href="https://github.com/joshua-werlein" target="_blank" rel="noreferrer" className="r-contact-item">GitHub</a>
            <span className="r-sep">·</span>
            <a href="/" className="r-contact-item">Portfolio</a>
          </div>
        </header>

        {/* Summary */}
        <div className="r-section" aria-labelledby="r-summary">
          <h2 id="r-summary" className="r-section-title">Professional Summary</h2>
          <p className="r-body">{SUMMARY}</p>
        </div>

        {/* Skills */}
        <div className="r-section" aria-labelledby="r-skills">
          <h2 id="r-skills" className="r-section-title">Technical Skills</h2>
          <div className="r-skills-grid">
            {SKILLS.map(g => (
              <div key={g.category} className="r-skill-row">
                <span className="r-skill-cat">{g.category}:</span>
                <span className="r-skill-items">{g.items}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="r-section" aria-labelledby="r-experience">
          <h2 id="r-experience" className="r-section-title">Professional Experience</h2>
          <div className="r-entries">
            {EXPERIENCE.map(e => (
              <div key={e.company} className="r-entry">
                <div className="r-entry-header">
                  <div>
                    <h3 className="r-entry-title">{e.role}</h3>
                    <div className="r-entry-sub">
                      <a href={e.url} target="_blank" rel="noreferrer" className="r-entry-company">{e.company}</a>
                      {e.type && <span className="r-entry-type">({e.type})</span>}
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

        {/* Education and certifications */}
        <div className="r-section" aria-labelledby="r-education">
          <h2 id="r-education" className="r-section-title">Education &amp; Certifications</h2>
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
      </div>

      <style>{`
        .r-page {
          min-height: 100vh;
          color: var(--text);
        }

        /* ── Document outer (centering + navbar offset) ── */
        .r-doc-outer {
          max-width: 920px;
          margin: 0 auto;
          padding: 80px 24px 80px;
        }

        /* ── Document surface ── */
        .r-doc {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 48px;
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
          .navbar { display: none !important; }

          html, body, .r-page {
            background: white !important;
            color: black !important;
          }

          body::before { display: none !important; }

          .r-doc-outer {
            max-width: 100% !important;
            padding: 0 !important;
          }

          .r-doc {
            background: white !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }

          .r-name { color: black !important; font-size: 22pt !important; }
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
          .r-doc-outer { padding: 80px 12px 48px; }
          .r-doc { padding: 28px 20px; }
          .r-contact-list { gap: 4px; }
          .r-sep { display: none; }
          .r-contact-item { display: block; width: 100%; }
          .r-entry-header { flex-direction: column; gap: 4px; }
        }
      `}</style>
    </div>
  )
}
