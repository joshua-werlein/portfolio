import { useState, useEffect, useRef } from 'react'
import Hero from './components/Hero'
import SelectedWork from './components/SelectedWork'
import Skills from './components/Skills'
import Background from './components/Background'
import JobFitChecker from './components/JobFitChecker'
import ResumeCTA from './components/ResumeCTA'
import Contact from './components/Contact'
import AdminPanel from './components/AdminPanel'

const WORKER = 'https://api.joshuawerlein.com'

export { WORKER }

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark')
  const [scrolled, setScrolled] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const logoClickCount = useRef(0)
  const logoClickTimer = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('portfolio-theme', next)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onScroll = () => { if (mobileMenuOpen) setMobileMenuOpen(false) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileMenuOpen])

  // Portfolio visit tracking — once per browser session, guarded against
  // React Strict Mode double-firing and SPA navigation re-mounts.
  useEffect(() => {
    if (sessionStorage.getItem('sv')) return
    sessionStorage.setItem('sv', '1')
    fetch(`${WORKER}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'site_visit' }),
    }).catch(() => {})
  }, [])

  // Hidden admin: 5 rapid clicks on logo
  const handleLogoClick = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })

    logoClickCount.current += 1
    clearTimeout(logoClickTimer.current)
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0
      setAdminOpen(true)
    } else {
      logoClickTimer.current = setTimeout(() => {
        logoClickCount.current = 0
      }, 1500)
    }
  }

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Primary navigation">
        <div className="navbar-inner">
          <div
            className="nav-logo"
            onClick={handleLogoClick}
            title="Joshua Werlein"
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleLogoClick()}
            aria-label="Joshua Werlein — home"
          >
            JW<span>.</span>
          </div>

          <ul className="nav-links" role="list">
            <li>
              <a href="#work" onClick={(e) => { e.preventDefault(); scrollTo('work') }}>
                Work
              </a>
            </li>
            <li>
              <a href="#skills" onClick={(e) => { e.preventDefault(); scrollTo('skills') }}>
                Skills
              </a>
            </li>
            <li>
              <a href="#background" onClick={(e) => { e.preventDefault(); scrollTo('background') }}>
                About
              </a>
            </li>
            <li>
              <a href="#jobfit" onClick={(e) => { e.preventDefault(); scrollTo('jobfit') }}>
                Job Fit
              </a>
            </li>
            <li>
              <a href="/resume">Resume</a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>
                Contact
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              className="nav-hamburger"
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
          <button onClick={() => scrollTo('work')}>Work</button>
          <button onClick={() => scrollTo('skills')}>Skills</button>
          <button onClick={() => scrollTo('background')}>About</button>
          <button onClick={() => scrollTo('jobfit')}>Job Fit</button>
          <a href="/resume" onClick={() => setMobileMenuOpen(false)}>Resume</a>
          <button onClick={() => scrollTo('contact')}>Contact</button>
        </nav>
      )}

      {/* Page Sections */}
      <main>
        <Hero onScrollTo={scrollTo} />
        <SelectedWork />
        <Skills />
        <Background />
        <JobFitChecker />
        <ResumeCTA />
        <Contact />
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 24px',
        textAlign: 'center',
        color: 'var(--text-3)',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-mono)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span>© {new Date().getFullYear()} Joshua Werlein — Built with React + Cloudflare</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="https://github.com/joshua-werlein" target="_blank" rel="noreferrer" style={{ color: 'var(--text-3)' }}>GitHub</a>
            <a href="https://linkedin.com/in/joshua-werlein" target="_blank" rel="noreferrer" style={{ color: 'var(--text-3)' }}>LinkedIn</a>
            <a href="mailto:jjwerlein@gmail.com" style={{ color: 'var(--text-3)' }}>Email</a>
          </div>
        </div>
      </footer>

      {/* Admin Panel */}
      {adminOpen && (
        <AdminPanel
          workerUrl={WORKER}
          onClose={() => setAdminOpen(false)}
        />
      )}
    </>
  )
}
