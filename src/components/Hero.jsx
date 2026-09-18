import { WORKER } from '../App'

export default function Hero({ onScrollTo }) {
  return (
    <section id="hero" style={{ paddingTop: 120, paddingBottom: 96 }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr minmax(0, 220px)',
            gap: 64,
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left: Text */}
          <div className="hero-text-col">
            {/* Status badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 100,
              padding: '6px 14px',
              marginBottom: 24,
            }}>
              <span className="status-dot" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)', letterSpacing: '0.05em' }}>
                Open to remote opportunities
              </span>
            </div>

            {/* Role — primary heading */}
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16, color: 'var(--text)' }}>
              Full-Stack Software Engineer
            </h1>

            {/* Value proposition */}
            <p style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
              fontWeight: 600,
              color: 'var(--accent)',
              marginBottom: 20,
              lineHeight: 1.4,
              maxWidth: 520,
            }}>
              Building production web applications and infrastructure for real businesses.
            </p>

            {/* Name */}
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 14,
              letterSpacing: '-0.01em',
            }}>
              Joshua Werlein
            </p>

            {/* Supporting copy */}
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-2)',
              maxWidth: 500,
              lineHeight: 1.75,
              marginBottom: 36,
            }}>
              I own work across the full stack — from application and database architecture
              through edge deployment on Cloudflare. Five production client platforms shipped,
              plus a published native Android app with real users.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
              <button
                className="btn btn-primary"
                onClick={() => onScrollTo('work')}
              >
                View Work →
              </button>
              <a
                href="/resume"
                className="btn btn-outline"
              >
                View Resume
              </a>
              <button
                className="btn btn-ghost"
                onClick={() => onScrollTo('contact')}
                style={{ color: 'var(--text-3)' }}
              >
                Contact
              </button>
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://github.com/joshua-werlein"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--text-3)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <GithubIcon /> github.com/joshua-werlein
              </a>
              <span style={{ color: 'var(--border-2)' }}>·</span>
              <a
                href="https://linkedin.com/in/joshua-werlein"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--text-3)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <LinkedInIcon /> linkedin.com/in/joshua-werlein
              </a>
            </div>
          </div>

          {/* Right: Headshot */}
          <div className="hero-photo-wrap" style={{ position: 'relative' }}>
            <div style={{
              width: 220,
              height: 220,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid var(--accent)',
              flexShrink: 0,
            }}>
              <img
                src="/me.jpg"
                alt="Joshua Werlein"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.parentElement.style.background = 'var(--surface-2)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-text-col {
          position: relative;
          isolation: isolate;
        }

        .hero-text-col::before {
          content: '';
          position: absolute;
          inset: -8px -40px -8px -40px;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(ellipse 85% 90% at 0% 50%, #0a0a0f 35%, rgba(10,10,15,0) 100%);
        }

        [data-theme="light"] .hero-text-col::before {
          background: radial-gradient(ellipse 85% 90% at 0% 50%, #f4f4f8 35%, rgba(244,244,248,0) 100%);
        }

        .hero-text-col > * {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 640px) {
          .hero-text-col::before {
            inset: -8px;
            background: #0a0a0f;
          }
          [data-theme="light"] .hero-text-col::before {
            background: #f4f4f8;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-photo-wrap {
            display: none;
          }
          #hero {
            padding-top: 96px !important;
            padding-bottom: 64px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-text-col::before { transition: none; }
        }
      `}</style>
    </section>
  )
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
