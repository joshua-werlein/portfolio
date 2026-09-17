import { WORKER } from '../App'

export default function ResumeCTA() {
  const handleDownload = () => {
    fetch(`${WORKER}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'resume_download' }),
    }).catch(() => {})
  }

  return (
    <section aria-labelledby="resume-cta-heading" style={{ padding: '64px 0' }}>
      <div className="container">
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 32,
          flexWrap: 'wrap',
        }} className="resume-cta-inner">
          <div>
            <h2
              id="resume-cta-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: 8,
                letterSpacing: '-0.01em',
              }}
            >
              Want the full picture?
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', maxWidth: 480, lineHeight: 1.65 }}>
              The full resume includes employment history, a complete technical skills breakdown,
              education, and certifications.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flexShrink: 0 }}>
            <a
              href="/resume"
              className="btn btn-primary"
              style={{ fontSize: '0.9rem' }}
            >
              View Resume
            </a>
            <a
              href="/Joshua-Werlein_Resume.pdf"
              className="btn btn-outline"
              download="Joshua-Werlein_Resume.pdf"
              onClick={handleDownload}
              style={{ fontSize: '0.9rem' }}
            >
              Download PDF ↓
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .resume-cta-inner {
            padding: 28px 24px !important;
          }
        }
      `}</style>
    </section>
  )
}
