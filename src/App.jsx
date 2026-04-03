import { useState, useEffect, useRef } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import JobFitChecker from './components/JobFitChecker'
import Contact from './components/Contact'
import AdminPanel from './components/AdminPanel'
 
const WORKER = 'https://portfolio-worker.jjwerlein.workers.dev'
 
export { WORKER }
 
export default function App() {
  const [theme, setTheme] = useState('dark')
  const [scrolled, setScrolled] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const logoClickCount = useRef(0)
  const logoClickTimer = useRef(null)
 
  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])
 
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('portfolio-theme', next)
  }
 
  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
 
  // Hidden admin: 5 rapid clicks on logo
  const handleLogoClick = () => {
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
 
  const navLinks = [
    { label: 'About',      id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Projects',   id: 'projects' },
    { label: 'Skills',     id: 'skills' },
    { label: 'Job Fit',    id: 'jobfit' },
    { label: 'Contact',    id: 'contact' },
  ]
 
  return (
    <>
      {/* Navbar */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <div
            className="nav-logo"
            onClick={handleLogoClick}
            title="Joshua Werlein"
          >
            JW<span>.</span>
          </div>
 
          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.id}>
                <a onClick={() => scrollTo(l.id)} style={{ cursor: 'pointer' }}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
 
          <div className="nav-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a
              href="/resume.pdf"
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              onClick={() => {
                fetch(`${WORKER}/track`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ event: 'resume_download' }),
                }).catch(() => {})
              }}
              download
            >
              Resume ↓
            </a>
          </div>
        </div>
      </nav>
 
      {/* Page Sections */}
      <main>
        <Hero onScrollTo={scrollTo} />
        <div className="divider" />
        <About />
        <div className="divider" />
        <Experience />
        <div className="divider" />
        <Projects />
        <div className="divider" />
        <Skills />
        <div className="divider" />
        <JobFitChecker />
        <div className="divider" />
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