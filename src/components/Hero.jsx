import { useEffect, useRef } from 'react'
 
export default function Hero({ onScrollTo }) {
  const headingRef = useRef(null)
 
  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(32px)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [])
 
  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 80 }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 64,
          alignItems: 'center',
        }}
          className="hero-grid"
        >
          {/* Left: Text */}
          <div ref={headingRef}>
            {/* Status badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 100,
              padding: '6px 14px',
              marginBottom: 28,
            }}>
              <span className="status-dot" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)', letterSpacing: '0.05em' }}>
                Open to remote opportunities
              </span>
            </div>
 
            {/* Name */}
            <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: 16 }}>
              Joshua<br />
              <span style={{ color: 'var(--accent)' }}>Werlein</span>
            </h1>
 
            {/* Title */}
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              color: 'var(--text-2)',
              marginBottom: 20,
              letterSpacing: '0.02em',
            }}>
              Full Stack Software Engineer
            </p>
 
            {/* Summary */}
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-2)',
              maxWidth: 520,
              lineHeight: 1.7,
              marginBottom: 36,
            }}>
              I build production systems — Android apps, serverless APIs, and modern web
              platforms. Comfortable owning the full release lifecycle from first commit to
              live deployment.
            </p>
 
            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <button
                className="btn btn-primary"
                onClick={() => onScrollTo('projects')}
              >
                View Projects →
              </button>
              <button
                className="btn btn-outline"
                onClick={() => onScrollTo('contact')}
              >
                Get In Touch
              </button>
            </div>
 
            {/* Social links */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
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
          <div className="hero-photo-wrap animate-fade-up animate-delay-3" style={{ position: 'relative' }}>
            {/* Accent ring */}
            <div style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              background: `conic-gradient(var(--accent) 0deg 90deg, transparent 90deg 360deg)`,
              zIndex: 0,
              opacity: 0.6,
            }} />
            <div style={{
              position: 'relative',
              width: 220,
              height: 220,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid var(--bg)',
              zIndex: 1,
            }}>
              <img
                src="/me.jpg"
                alt="Joshua Werlein"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.parentElement.style.background = 'var(--surface-2)'
                  e.target.parentElement.innerHTML = '<span style="display:flex;align-items:center;justify-content:center;height:100%;font-size:4rem;">👤</span>'
                }}
              />
            </div>
            {/* Floating badge */}
            <div style={{
              position: 'absolute',
              bottom: -8,
              right: -16,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '8px 14px',
              zIndex: 2,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-3)', marginBottom: 2 }}>based in</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>Mondovi, WI</div>
            </div>
          </div>
        </div>
 
        {/* Scroll indicator */}
        <div
          style={{
            marginTop: 64,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 6,
            cursor: 'pointer',
            opacity: 0.5,
          }}
          onClick={() => onScrollTo('about')}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-3)' }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: 'var(--text-3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'var(--accent)',
              animation: 'scrollDrop 1.5s ease infinite',
            }} />
          </div>
        </div>
      </div>
 
      <style>{`
        @keyframes scrollDrop {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        @media (max-width: 640px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-photo-wrap {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
 
function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}
 
function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
 