import { WORKER } from '../App'

export default function FeaturedProject({ project }) {
  const handleLinkClick = () => {
    fetch(`${WORKER}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'project_click', project: project.id }),
    }).catch(() => {})
  }

  const primaryLink = project.links.find(l => l.primary)
  const secondaryLinks = project.links.filter(l => !l.primary)

  return (
    <article
      aria-labelledby={`fp-${project.id}-title`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Accent bar */}
      <div style={{ height: 3, background: project.typeColor }} />

      {/* Header */}
      <div style={{
        padding: '24px 28px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: project.typeColor,
              background: `${project.typeColor}18`,
              border: `1px solid ${project.typeColor}30`,
              borderRadius: 100,
              padding: '2px 10px',
              letterSpacing: '0.05em',
            }}>
              {project.type}
            </span>
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
          <h3
            id={`fp-${project.id}-title`}
            style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}
          >
            {project.name}
          </h3>
          <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            {project.tagline}
          </p>
        </div>

        {/* Header links */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          {primaryLink && (
            <a
              href={primaryLink.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
              onClick={handleLinkClick}
            >
              {primaryLink.label} ↗
            </a>
          )}
          {secondaryLinks.map(l => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>

      {/* Body */}
      <div
        className="fp-body"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: 0,
        }}
      >
        {/* Left: case study content */}
        <div style={{ padding: '28px', borderRight: '1px solid var(--border)' }}>
          <CaseStudyBlock label="Problem" content={project.problem} />
          <CaseStudyBlock label="Solution" content={project.solution} />

          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
              marginBottom: 10,
            }}>
              Engineering / Architecture
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.architecture.map((item, i) => (
                <li key={i} style={{
                  display: 'flex',
                  gap: 10,
                  fontSize: '0.88rem',
                  color: 'var(--text-2)',
                  lineHeight: 1.6,
                }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: sidebar */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <CaseStudyBlock label="Outcome" content={project.outcome} />
          <CaseStudyBlock label="Ownership" content={project.ownership} />

          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
              marginBottom: 10,
            }}>
              Technologies
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.tags.map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .fp-body {
            grid-template-columns: 1fr !important;
          }
          .fp-body > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid var(--border);
          }
        }
      `}</style>
    </article>
  )
}

function CaseStudyBlock({ label, content }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--text-3)',
        marginBottom: 6,
      }}>
        {label}
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.7 }}>
        {content}
      </p>
    </div>
  )
}
