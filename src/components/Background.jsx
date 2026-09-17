const ENGAGEMENTS = [
  {
    id: 'grayzn',
    company: "Grayz'n Buffalo Bar & Grill",
    url: 'https://grayznbuffalo.com',
    role: 'Software Engineer — Contract',
    type: 'Freelance · Remote',
    period: '2026',
    context: 'Restaurant operations platform — Astro + Cloudflare with D1, KV, R2, and a scheduled Facebook Graph integration.',
  },
  {
    id: 'arkham',
    company: 'Arkham Enterprises (Apex Solar & Construction)',
    url: 'https://www.arkhamsolar.com',
    role: 'Software Engineer — Contract',
    type: 'Freelance · Remote',
    period: '2026',
    context: 'Marketing and lead-gen platform — React SPA on Cloudflare Workers with multi-step quote flows and structured metadata.',
  },
  {
    id: 'blair',
    company: "Blair Sportsmen's Club",
    url: 'https://blairsportsmensclub.com',
    role: 'Software Engineer — Contract',
    type: 'Freelance · Remote · Nonprofit',
    period: '2025–2026',
    context: 'Event and reservation platform — D1-backed availability calendar, Turnstile-protected contact pipeline, and trap-league scoring.',
  },
  {
    id: 'kilcon',
    company: 'KIL Construction',
    url: 'https://kilcon.work',
    role: 'Software Engineer — Contract',
    type: 'Freelance · Remote',
    period: '2025',
    context: 'Serverless business platform — Cloudflare Workers with signed-session auth, R2 media pipeline, and rate-limited public endpoints.',
  },
  {
    id: 'folh',
    company: 'Friends of Lake Henry',
    url: 'https://friendsoflakehenry.com',
    role: 'Software Engineer — Contract',
    type: 'Freelance · Remote · Nonprofit',
    period: '2025',
    context: 'Nonprofit CMS — single integrated Astro + Cloudflare codebase with admin workflows for events, donor recognition, and photo submissions.',
  },
]

const EDUCATION = [
  {
    degree: 'B.S. Software Engineering',
    school: 'Western Governors University',
    year: '2025',
  },
  {
    degree: 'A.A.S. IT Software Developer',
    school: 'Chippewa Valley Technical College',
    year: '2024',
  },
]

const CERTS = [
  { name: 'AWS Certified Cloud Practitioner', year: '2025', color: '#FF9900' },
  { name: 'CompTIA Project+', year: '2024', color: '#C8202F' },
]

export default function Background() {
  return (
    <section id="background" aria-labelledby="background-heading">
      <div className="container">
        <div className="section-label">03 / Background</div>
        <h2 id="background-heading" className="section-title">Background</h2>

        {/* Bio */}
        <div style={{ maxWidth: 680, marginBottom: 56 }}>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 16, fontSize: '1.05rem' }}>
            Software engineer based in western Wisconsin with a focus on shipping production-quality systems
            across the full stack — Android applications, serverless web APIs, and client platforms built on
            Cloudflare's edge infrastructure.
          </p>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontSize: '1.05rem' }}>
            Completed a B.S. in Software Engineering at WGU while simultaneously delivering live client
            projects and publishing a production Android app to Google Play. Open to remote software
            engineering roles where I can own meaningful work end-to-end.
          </p>
        </div>

        <div
          className="background-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gap: 48,
            alignItems: 'start',
          }}
        >
          {/* Left: Engagements */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
              marginBottom: 20,
            }}>
              Freelance Engineering
            </h3>

            <div style={{ position: 'relative' }}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute',
                left: 11,
                top: 8,
                bottom: 8,
                width: 1,
                background: 'var(--border)',
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {ENGAGEMENTS.map((eng, i) => (
                  <div
                    key={eng.id}
                    style={{
                      paddingLeft: 36,
                      paddingBottom: i < ENGAGEMENTS.length - 1 ? 28 : 0,
                      position: 'relative',
                    }}
                  >
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 6,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--surface)',
                      border: '2px solid var(--border-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 2 }}>
                          {eng.company}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--text-3)',
                          marginBottom: 6,
                        }}>
                          {eng.role} · {eng.type}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                        <span className="tag">{eng.period}</span>
                        <a
                          href={eng.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            color: 'var(--text-3)',
                          }}
                          aria-label={`Visit ${eng.company} website (opens in new tab)`}
                        >
                          ↗
                        </a>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.87rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                      {eng.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Education + Certs */}
          <div>
            <div style={{ marginBottom: 36 }}>
              <h3 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-3)',
                marginBottom: 16,
              }}>Education</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {EDUCATION.map(e => (
                  <div key={e.degree} className="card" style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>
                          {e.degree}
                        </div>
                        <div style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>
                          {e.school}
                        </div>
                      </div>
                      <span className="tag" style={{ marginLeft: 12, flexShrink: 0 }}>{e.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-3)',
                marginBottom: 16,
              }}>Certifications</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CERTS.map(c => (
                  <div key={c.name} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 4,
                        height: 36,
                        borderRadius: 2,
                        background: c.color,
                        flexShrink: 0,
                      }} />
                      <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{c.name}</span>
                    </div>
                    <span className="tag" style={{ flexShrink: 0 }}>{c.year}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--accent-dim)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: 8 }}>
                  CURRENTLY EXPLORING
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['AI/LLM APIs', 'Durable Objects'].map(t => (
                    <span key={t} className="tag tag-accent">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .background-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
