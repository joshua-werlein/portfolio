import { useState } from 'react'
 
const EXPERIENCES = [
  {
    id: 'freelance',
    role: 'Software Engineer — Contract',
    company: 'KIL Construction & Friends of Lake Henry',
    period: '2025',
    type: 'Freelance · Remote',
    status: 'live',
    links: [
      { label: 'kilcon.work', url: 'https://kilcon.work' },
      { label: 'friendsoflakehenry.com', url: 'https://friendsoflakehenry.com' },
    ],
    bullets: [
      'Designed and shipped serverless production platforms for real clients using signed cookie sessions, Turnstile CAPTCHA, and in-Worker IP rate limiting on Cloudflare\'s free tier.',
      'Built full-stack content platforms using Cloudflare Workers, R2, and Astro — including project galleries, media workflows, and secure admin tooling for image management.',
      'Adapted the same platform architecture for a nonprofit organization, delivering donation flows, event listings, and photo workflows while balancing accessibility and non-technical stakeholder needs.',
      'Owned deployments, production fixes, and client feedback loops end-to-end with zero downtime incidents.',
    ],
    tags: ['Cloudflare Workers', 'Astro', 'JavaScript', 'R2', 'CAPTCHA', 'Serverless'],
  },
  {
    id: 'bestby',
    role: 'Android Engineer',
    company: 'Best By Manager — Production App',
    period: '2025',
    type: 'Independent · Google Play',
    status: 'live',
    links: [
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.bestbymanager.app' },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/BestByManager' },
    ],
    bullets: [
      'Shipped a kiosk-style Android inventory management app to Google Play production — managed the full release lifecycle from closed beta through v2.0.0 launch.',
      'Architected a three-tier permission model (Owner, Admin, Employee) with PIN-based session management and bcrypt credential storage.',
      'Built an offline-first Room database with ZXing barcode scanning, Open Food Facts API integration, AlarmManager expiration notifications, and biometric-gated owner controls.',
      'Maintained and iterated post-launch based on real user feedback, shipping incremental improvements across multiple production releases.',
    ],
    tags: ['Java', 'Android', 'Room DB', 'Jetpack', 'ZXing', 'Biometrics'],
  },
]
 
export default function Experience() {
  const [expanded, setExpanded] = useState(null)
 
  return (
    <section id="experience">
      <div className="container">
        <div className="section-label">Experience</div>
        <h2 className="section-title">What I've Built</h2>
        <p className="section-sub">
          Production systems shipped to real users — not academic projects.
        </p>
 
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: 19,
            top: 8,
            bottom: 8,
            width: 2,
            background: 'var(--border)',
            borderRadius: 1,
          }} />
 
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {EXPERIENCES.map((exp, i) => (
              <div
                key={exp.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.15}s`, paddingLeft: 52, position: 'relative' }}
              >
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 20,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--surface)',
                  border: '2px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  zIndex: 1,
                }}>
                  {exp.id === 'freelance' ? '⚡' : '📱'}
                </div>
 
                {/* Card */}
                <div className="card" style={{ padding: '24px 28px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>
                        {exp.role}
                      </h3>
                      <div style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500, marginBottom: 4 }}>
                        {exp.company}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                          {exp.type}
                        </span>
                        <span style={{ color: 'var(--border-2)' }}>·</span>
                        {exp.links.map(l => (
                          <a
                            key={l.url}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-3)' }}
                          >
                            ↗ {l.label}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="tag">{exp.period}</span>
                      <span style={{
                        background: 'rgba(0,255,136,0.12)',
                        color: 'var(--green)',
                        border: '1px solid rgba(0,255,136,0.2)',
                        borderRadius: 100,
                        padding: '2px 10px',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.05em',
                      }}>
                        LIVE
                      </span>
                    </div>
                  </div>
 
                  {/* Expandable bullets */}
                  <div style={{
                    maxHeight: expanded === exp.id ? 400 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.35s ease',
                  }}>
                    <ul style={{ marginTop: 16, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {exp.bullets.map((b, bi) => (
                        <li key={bi} style={{
                          display: 'flex',
                          gap: 10,
                          color: 'var(--text-2)',
                          fontSize: '0.9rem',
                          lineHeight: 1.65,
                        }}>
                          <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>▸</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
 
                  {/* Tags + toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {exp.tags.map(t => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: '0.78rem', padding: '6px 12px', flexShrink: 0 }}
                      onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                    >
                      {expanded === exp.id ? '▲ Less' : '▼ Details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}