const SKILL_GROUPS = [
  {
    category: 'Languages',
    icon: '{ }',
    skills: [
      { name: 'Java', level: 3 },
      { name: 'JavaScript', level: 3 },
      { name: 'SQL', level: 3 },
      { name: 'C#', level: 2 },
    ],
  },
  {
    category: 'Android',
    icon: '📱',
    skills: [
      { name: 'Android SDK', level: 3 },
      { name: 'Room Database', level: 3 },
      { name: 'Jetpack Components', level: 3 },
      { name: 'ZXing / Barcode', level: 2 },
      { name: 'Biometric Auth', level: 2 },
    ],
  },
  {
    category: 'Web & Serverless',
    icon: '☁',
    skills: [
      { name: 'Cloudflare Workers', level: 3 },
      { name: 'Cloudflare R2', level: 3 },
      { name: 'Astro', level: 3 },
      { name: 'REST APIs', level: 3 },
      { name: 'Auth / Sessions', level: 2 },
    ],
  },
  {
    category: 'Cloud & DevOps',
    icon: '⚙',
    skills: [
      { name: 'AWS (CCP)', level: 2 },
      { name: 'Cloudflare Pages', level: 3 },
      { name: 'GitHub / Git', level: 3 },
      { name: 'CI/CD', level: 2 },
      { name: 'MySQL', level: 2 },
    ],
  },
  {
    category: 'Security',
    icon: '🔒',
    skills: [
      { name: 'Turnstile CAPTCHA', level: 3 },
      { name: 'Rate Limiting', level: 3 },
      { name: 'Signed Sessions', level: 3 },
      { name: 'bcrypt', level: 2 },
    ],
  },
  {
    category: 'Currently Learning',
    icon: '⚡',
    learning: true,
    skills: [
      { name: 'React', level: 1 },
      { name: 'Node.js', level: 1 },
      { name: 'TypeScript', level: 1 },
    ],
  },
]
 
const LEVEL_LABEL = ['', 'Familiar', 'Proficient', 'Production']
const LEVEL_COLOR = ['', 'var(--text-3)', 'var(--accent)', 'var(--green)']
 
export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <div className="section-label">Skills</div>
        <h2 className="section-title">Technical Stack</h2>
        <p className="section-sub">
          Tools I've used in production systems — not just tutorials.
        </p>
 
        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: 20,
          marginBottom: 40,
          flexWrap: 'wrap',
        }}>
          {[1, 2, 3].map(l => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1, 2, 3].map(pip => (
                  <div key={pip} style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: pip <= l ? LEVEL_COLOR[l] : 'var(--surface-2)',
                    border: `1px solid ${pip <= l ? LEVEL_COLOR[l] : 'var(--border)'}`,
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                {LEVEL_LABEL[l]}
              </span>
            </div>
          ))}
        </div>
 
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {SKILL_GROUPS.map((group, gi) => (
            <div
              key={group.category}
              className="card animate-fade-up"
              style={{
                animationDelay: `${gi * 0.08}s`,
                padding: '22px 22px',
                background: group.learning ? 'var(--accent-dim)' : 'var(--surface)',
                border: group.learning ? '1px solid rgba(0,229,255,0.18)' : '1px solid var(--border)',
              }}
            >
              {/* Category header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 18,
                paddingBottom: 14,
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: '1rem' }}>{group.icon}</span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: group.learning ? 'var(--accent)' : 'var(--text)',
                }}>
                  {group.category}
                </span>
                {group.learning && (
                  <span style={{
                    marginLeft: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--accent)',
                    background: 'rgba(0,229,255,0.1)',
                    border: '1px solid rgba(0,229,255,0.2)',
                    borderRadius: 100,
                    padding: '1px 8px',
                    letterSpacing: '0.05em',
                  }}>
                    IN PROGRESS
                  </span>
                )}
              </div>
 
              {/* Skills list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.skills.map(skill => (
                  <div key={skill.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'var(--text)',
                      fontWeight: 400,
                    }}>
                      {skill.name}
                    </span>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                      {[1, 2, 3].map(pip => (
                        <div key={pip} style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: pip <= skill.level
                            ? LEVEL_COLOR[skill.level]
                            : 'var(--surface-2)',
                          border: `1px solid ${pip <= skill.level
                            ? LEVEL_COLOR[skill.level]
                            : 'var(--border)'}`,
                          transition: 'all 0.2s',
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
 
        {/* Bottom note */}
        <p style={{
          marginTop: 32,
          textAlign: 'center',
          color: 'var(--text-3)',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
        }}>
          All "Production" skills are backed by live deployed systems.
        </p>
      </div>
    </section>
  )
}