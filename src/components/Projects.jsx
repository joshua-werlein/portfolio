import { useState } from 'react'
import { WORKER } from '../App'
 
const PROJECTS = [
  {
    id: 'bestby',
    name: 'Best By Manager',
    tagline: 'Inventory & expiration tracking app for Android',
    impact: 'Published to Google Play — full release lifecycle from closed beta → v2.0.0 with real users',
    description:
      'A kiosk-style Android app that helps retail and food-service workers track product expiration dates. Features barcode scanning, offline-first storage, push notifications, and a tiered permission system for team environments.',
    architecture: [
      'Offline-first Room (SQLite) database — works fully without connectivity',
      'ZXing barcode scanner integrated with Open Food Facts API for auto product lookup',
      'Three-tier permission model: Owner (biometric), Admin (PIN), Employee — bcrypt credential storage',
      'AlarmManager expiration notifications with configurable lead-time per product',
      'Jetpack components throughout: ViewModel, LiveData, Navigation, RecyclerView',
      'Full release lifecycle: closed beta, staged rollout, v2.0.0 production on Google Play',
    ],
    tags: ['Java', 'Android', 'Room DB', 'Jetpack', 'ZXing', 'Biometrics', 'Google Play'],
    links: [
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.bestbymanager.app', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein', primary: false },
    ],
    type: 'Android App',
    typeColor: '#34A853',
  },
  {
    id: 'kilcon',
    name: 'KIL Construction',
    tagline: 'Serverless business platform for a construction company',
    impact: 'Live production site — signed sessions, CAPTCHA, rate limiting, full media workflow on Cloudflare free tier',
    description:
      'A full-stack content platform built on Cloudflare Workers and Astro. Includes project gallery, contact workflows, and a secure admin panel for uploading, renaming, and deleting media assets stored in Cloudflare R2.',
    architecture: [
      'Cloudflare Workers serverless backend — zero cold start, deployed to the edge',
      'Astro frontend for fast static rendering with islands architecture',
      'Cloudflare R2 object storage for project media — custom signed-URL access',
      'Signed cookie sessions for admin authentication — no third-party auth dependency',
      'Cloudflare Turnstile CAPTCHA + in-Worker IP rate limiting on all public endpoints',
      'Custom admin API: upload, rename, delete operations with session-gated middleware',
    ],
    tags: ['Cloudflare Workers', 'Astro', 'JavaScript', 'R2', 'Turnstile', 'Serverless'],
    links: [
      { label: 'kilcon.work', url: 'https://kilcon.work', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/kilConstruction', primary: false },
    ],
    type: 'Web Platform',
    typeColor: '#F6821F',
  },
  {
    id: 'lakehenry',
    name: 'Friends of Lake Henry',
    tagline: 'Nonprofit web platform with donations, events & media',
    impact: 'Live production site — same secure architecture adapted for a nonprofit with non-technical stakeholders',
    description:
      'Adapted the same Cloudflare Workers + Astro platform for a nonprofit lake association. Delivers donation workflows, event listings, and photo galleries while balancing accessibility needs and a non-technical admin audience.',
    architecture: [
      'Forked and adapted from KIL Construction architecture — shared core, divergent UX',
      'Donation workflow with external payment integration and confirmation handling',
      'Event calendar with admin-managed listings via the secure content API',
      'Photo gallery backed by Cloudflare R2 with admin upload/delete workflow',
      'Accessibility-first frontend — designed for non-technical board members to manage content',
      'Same signed session + Turnstile + rate limiting security stack as KIL Construction',
    ],
    tags: ['Cloudflare Workers', 'Astro', 'JavaScript', 'R2', 'Nonprofit', 'Accessibility'],
    links: [
      { label: 'friendsoflakehenry.com', url: 'https://friendsoflakehenry.com', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/friends-of-lake-henry', primary: false },
    ],
    type: 'Web Platform',
    typeColor: '#0070cc',
  },
]
 
export default function Projects() {
  const [expanded, setExpanded] = useState(null)
 
  const handleLinkClick = (projectId) => {
    fetch(`${WORKER}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'project_click', project: projectId }),
    }).catch(() => {})
  }
 
  return (
    <section id="projects">
      <div className="container">
        <div className="section-label">Projects</div>
        <h2 className="section-title">Things I've Shipped</h2>
        <p className="section-sub">
          Production deployments with real users — each one owned start to finish.
        </p>
 
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              className="card animate-fade-up"
              style={{
                animationDelay: `${i * 0.1}s`,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                padding: 0,
                overflow: 'hidden',
              }}
            >
              {/* Card top accent bar */}
              <div style={{ height: 3, background: project.typeColor, borderRadius: '16px 16px 0 0' }} />
 
              <div style={{ padding: '24px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Type badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
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
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--green)',
                    boxShadow: '0 0 0 3px rgba(0,255,136,0.15)',
                  }} />
                </div>
 
                {/* Title */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 6 }}>
                  {project.name}
                </h3>
                <p style={{ color: 'var(--text-3)', fontSize: '0.82rem', marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
                  {project.tagline}
                </p>
 
                {/* Impact line */}
                <div style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${project.typeColor}`,
                  borderRadius: '0 var(--radius) var(--radius) 0',
                  padding: '10px 14px',
                  marginBottom: 14,
                  fontSize: '0.82rem',
                  color: 'var(--text-2)',
                  lineHeight: 1.5,
                }}>
                  📌 {project.impact}
                </div>
 
                {/* Description */}
                <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: 16, flex: 1 }}>
                  {project.description}
                </p>
 
                {/* Architecture toggle */}
                <div style={{ marginBottom: 16 }}>
                  <button
                    className="btn btn-ghost"
                    style={{
                      fontSize: '0.75rem',
                      padding: '6px 0',
                      color: 'var(--text-3)',
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 6,
                    }}
                    onClick={() => setExpanded(expanded === project.id ? null : project.id)}
                  >
                    <span style={{
                      display: 'inline-block',
                      transition: 'transform 0.2s',
                      transform: expanded === project.id ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}>▶</span>
                    Architecture details
                  </button>
 
                  <div style={{
                    maxHeight: expanded === project.id ? 500 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.35s ease',
                  }}>
                    <ul style={{
                      marginTop: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 7,
                      paddingLeft: 4,
                    }}>
                      {project.architecture.map((item, ai) => (
                        <li key={ai} style={{
                          display: 'flex',
                          gap: 8,
                          fontSize: '0.82rem',
                          color: 'var(--text-2)',
                          lineHeight: 1.5,
                        }}>
                          <span style={{ color: 'var(--accent)', flexShrink: 0 }}>·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
 
                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                  {project.tags.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
 
                {/* Links */}
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  {project.links.map(l => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`btn ${l.primary ? 'btn-primary' : 'btn-outline'}`}
                      style={{ fontSize: '0.8rem', padding: '8px 14px', flex: l.primary ? 1 : 0 }}
                      onClick={() => handleLinkClick(project.id)}
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}