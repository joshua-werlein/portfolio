export default function About() {
  const education = [
    {
      degree: 'B.S. Software Engineering',
      school: 'Western Governors University',
      year: '2025',
      icon: '🎓',
    },
    {
      degree: 'A.A.S. IT Software Developer',
      school: 'Chippewa Valley Technical College',
      year: '2024',
      icon: '🎓',
    },
  ]
 
  const certs = [
    { name: 'AWS Certified Cloud Practitioner', year: '2025', color: '#FF9900' },
    { name: 'CompTIA Project+', year: '2024', color: '#C8202F' },
  ]
 
  const facts = [
    { label: 'Location', value: 'Mondovi, WI', icon: '📍' },
    { label: 'Availability', value: 'Remote — Immediate', icon: '🟢' },
    { label: 'Focus', value: 'Full Stack / Android', icon: '⚡' },
    { label: 'Email', value: 'jjwerlein@gmail.com', icon: '✉️', link: 'mailto:jjwerlein@gmail.com' },
  ]
 
  return (
    <section id="about">
      <div className="container">
        <div className="section-label">About</div>
        <h2 className="section-title">Who I Am</h2>
 
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'start',
        }} className="about-grid">
 
          {/* Left: Bio */}
          <div className="animate-fade-up">
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 20, fontSize: '1.05rem' }}>
              I'm a software engineer based in western Wisconsin with a focus on shipping
              production-quality systems. My work spans Android development, serverless
              web APIs, and full-stack platforms — always with an emphasis on security,
              reliability, and owning the full release lifecycle.
            </p>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 20, fontSize: '1.05rem' }}>
              I recently completed a B.S. in Software Engineering at WGU while
              simultaneously delivering live client projects on Cloudflare's infrastructure
              and publishing a production Android app to Google Play. I work well
              independently, communicate clearly, and thrive in remote environments.
            </p>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontSize: '1.05rem' }}>
              I'm actively seeking remote software engineering roles where I can keep
              building things that matter — whether that's a consumer app, an internal
              tool, or a backend system someone depends on every day.
            </p>
 
            {/* Quick facts */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginTop: 32,
            }}>
              {facts.map(f => (
                <div key={f.label} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '12px 16px',
                }}>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', marginBottom: 4, letterSpacing: '0.05em' }}>
                    {f.icon} {f.label.toUpperCase()}
                  </div>
                  {f.link ? (
                    <a href={f.link} style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--accent)' }}>
                      {f.value}
                    </a>
                  ) : (
                    <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)' }}>
                      {f.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
 
          {/* Right: Education + Certs */}
          <div className="animate-fade-up animate-delay-2">
 
            {/* Education */}
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
                {education.map(e => (
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
 
            {/* Certifications */}
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
                {certs.map(c => (
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
 
              {/* Currently learning */}
              <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--accent-dim)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: 8 }}>
                  CURRENTLY LEARNING
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['React', 'Node.js', 'TypeScript'].map(t => (
                    <span key={t} className="tag tag-accent">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}