import { useState } from 'react'
 
const EXPERIENCES = [
  {
    id: 'grayzn',
    role: 'Software Engineer — Contract',
    company: 'Grayz’n Buffalo Bar & Grill',
    period: '2026',
    type: 'Freelance · Remote',
    status: 'live',
    links: [
      { label: 'grayznbuffalo.com', url: 'https://grayznbuffalo.com' },
    ],
    bullets: [
      'Delivered an Astro + Cloudflare restaurant platform using D1, KV, and R2, with authenticated workflows for menu content, recurring weekly specials, and managed images.',
      'Built a scheduled Facebook Graph Worker that caches feed/media data and preserves the last known-good feed during refresh failures; integrated Turnstile-protected contact delivery through Resend.',
      'Owned staging, accessibility, responsive performance work, and production cutover preparation for a live small-business platform.',
    ],
    tags: ['Astro', 'Cloudflare Workers', 'D1', 'KV', 'R2', 'Turnstile', 'Resend'],
  },
  {
    id: 'arkham',
    role: 'Software Engineer — Contract',
    company: 'Arkham Enterprises (Apex Solar and Construction)',
    period: '2026',
    type: 'Freelance · Remote',
    status: 'live',
    links: [
      { label: 'arkhamsolar.com', url: 'https://arkhamsolar.com' },
    ],
    bullets: [
      'Built a marketing and lead-generation platform for a solar and construction company — React SPA served from a Cloudflare Worker with contact and multi-step quote-request forms wired to a Workers backend via Resend.',
      'Implemented deep-linked quote flows (?type= URL params) so service pages, ads, and AI agents can drop prospects directly into a pre-filled quote form.',
      'Shipped LocalBusiness JSON-LD structured data, llms.txt agent discoverability, and WCAG AA accessibility — 100 Lighthouse scores across Performance, Accessibility, SEO, and Agentic Browsing.',
    ],
    tags: ['React', 'Cloudflare Workers', 'JavaScript', 'Resend', 'JSON-LD', 'Serverless'],
  },
  {
    id: 'kilcon',
    role: 'Software Engineer — Contract',
    company: 'KIL Construction',
    period: '2025',
    type: 'Freelance · Remote',
    status: 'live',
    links: [
      { label: 'kilcon.work', url: 'https://kilcon.work' },
    ],
    bullets: [
      'Designed and shipped a serverless content platform on Cloudflare Workers and Astro with signed cookie sessions, Turnstile CAPTCHA, and edge rate limiting — all on Cloudflare\'s free tier.',
      'Built a full client-review system: public submission, admin moderation with replies and featured reviews, and aggregate rating summaries served through a dedicated Worker API.',
      'Delivered an R2-backed media pipeline with secure admin tooling for uploading, renaming, and deleting project gallery assets.',
      'Owned deployments, production fixes, and client feedback loops end-to-end with zero downtime incidents.',
    ],
    tags: ['Cloudflare Workers', 'Astro', 'JavaScript', 'R2', 'D1', 'Serverless'],
  },
  {
    id: 'folh',
    role: 'Software Engineer — Contract',
    company: 'Friends of Lake Henry',
    period: '2025',
    type: 'Freelance · Remote · Nonprofit',
    status: 'live',
    links: [
      { label: 'friendsoflakehenry.com', url: 'https://friendsoflakehenry.com' },
    ],
    bullets: [
      'Built a nonprofit platform with a custom admin CMS as a single integrated Astro + Cloudflare codebase, with API routes and session middleware in-repo rather than KIL Construction\'s separate service-bound Workers',
      'Built admin backends for events, photo galleries, donor recognition, and raffle management behind signed-session auth middleware, designed for non-technical board members.',
      'Implemented a community photo submission workflow with admin moderation, backed by Cloudflare R2.',
      'Balanced WCAG accessibility requirements with a non-technical stakeholder audience across the full content lifecycle.',
    ],
    tags: ['Cloudflare Workers', 'Astro', 'JavaScript', 'R2', 'Admin CMS', 'Accessibility'],
  },
  {
    id: 'blair',
    role: 'Software Engineer — Contract',
    company: "Blair Sportsmen's Club",
    period: '2025–2026',
    type: 'Freelance · Remote · Nonprofit',
    status: 'live',
    links: [
      { label: 'blairsportsmensclub.com', url: 'https://blairsportsmensclub.com' },
    ],
    bullets: [
      'Built an event and reservation platform for a recreational club — live barn-availability calendar with reserved, booked, and event states rendered from a Workers API.',
      'Implemented calendar-to-form prefill: selecting an open date populates a reservation request with the chosen date, reason, and message, feeding a Turnstile-protected contact pipeline delivering via Resend.',
      'Shipped trap-league score leaderboards with per-event round breakdowns in a deep-linkable modal (#trap-scores routing), plus Google Maps directions integration.',
    ],
    tags: ['Cloudflare Workers', 'Astro', 'JavaScript', 'Turnstile', 'Resend', 'Serverless'],
  },
];
 
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
                        color: 'var(--tag-green)',
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