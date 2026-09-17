import { WORKER } from '../App'
import FeaturedProject from './FeaturedProject'

const FEATURED = [
  {
    id: 'grayzn',
    name: "Grayz'n Buffalo Bar & Grill",
    tagline: 'Restaurant operations platform · Astro + Cloudflare edge services',
    type: 'Web Platform',
    typeColor: '#B96B2D',
    problem:
      'A production restaurant client needed non-technical staff to manage menu content, recurring weekly specials, and images without any engineering involvement. The site also needed to surface a live Facebook feed — but fetching it in real-time during page loads risked showing nothing if the Facebook API was unavailable.',
    solution:
      'Built an Astro + Cloudflare platform with authenticated admin workflows for D1-backed menu content and R2-backed media. A separate scheduled Facebook Graph Worker caches feed and media data to KV, preserving last known-good content during refresh failures so visitors always see something.',
    architecture: [
      'Astro frontend on Cloudflare Pages; Worker for all dynamic routes and API handling',
      'D1-backed menu and weekly-special data with date-bound and recurring defaults for non-technical staff',
      'KV-backed admin sessions; R2-backed media pipeline with upload and delete workflows',
      'Scheduled Facebook Graph Worker: caches feed and media to KV, falls back to last known-good on API failure — prevents blank social sections during outages',
      'Turnstile-protected contact delivery through Resend with production security headers and staging no-index controls',
      'Responsive images, reduced-motion support, and keyboard-accessible interactive UI throughout',
    ],
    ownership:
      'Sole engineer. Designed, built, deployed, and maintained the complete system — including the admin panel, scheduled Worker, and production cutover.',
    outcome: 'Live production client platform at grayznbuffalo.com.',
    tags: ['Astro', 'Cloudflare Workers', 'D1', 'KV', 'R2', 'Turnstile', 'Resend', 'Facebook Graph API'],
    links: [
      { label: 'grayznbuffalo.com', url: 'https://grayznbuffalo.com', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/grayzn-buffalo', primary: false },
    ],
  },
  {
    id: 'bestby',
    name: 'Best By Manager',
    tagline: 'Native Android inventory app · Java + Room + Google Play',
    type: 'Android App',
    typeColor: '#34A853',
    problem:
      'Retail and food-service workers needed a shared-device Android app for tracking product expiration dates, scanning barcodes for instant product lookup, and receiving expiration alerts — with a permission model suited to team environments where multiple staff share one device.',
    solution:
      'Native Android kiosk app in Java with an offline-first Room/SQLite database. ZXing barcode scanning auto-populates product details from the Open Food Facts API. A three-tier permission system with biometric and PIN authentication supports Owner, Admin, and Employee access without requiring connectivity.',
    architecture: [
      'Offline-first Room (SQLite) database — fully functional without network connectivity',
      'ZXing barcode scanner integrated with Open Food Facts API for automatic product lookup',
      'Three-tier permission model: Owner (biometric), Admin (PIN + bcrypt), Employee — each with scoped access to products, alerts, and settings',
      'AlarmManager-based expiration notifications with configurable lead-time per product',
      'Jetpack components throughout: ViewModel, LiveData, Navigation, RecyclerView',
      'Full release lifecycle: closed beta, staged rollout, v2.0.0 production release on Google Play',
    ],
    ownership:
      "Sole engineer. Designed, developed, tested, and published through Google Play's full release pipeline — from closed beta through staged rollout to v2.0.0.",
    outcome: 'Published on Google Play. Progressed through closed beta → staged rollout → v2.0.0 with real users.',
    tags: ['Java', 'Android SDK', 'Room Database', 'Jetpack', 'ZXing', 'Biometric Auth', 'Google Play'],
    links: [
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.bestbymanager.app', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/BestByManager', primary: false },
    ],
  },
  {
    id: 'kilcon',
    name: 'KIL Construction',
    tagline: 'Serverless business platform · Cloudflare Workers + R2 + signed sessions',
    type: 'Web Platform',
    typeColor: '#F6821F',
    problem:
      "A construction company needed a professional web presence with a secure admin panel for managing project gallery media — without depending on a third-party CMS or auth service, and within Cloudflare's free tier.",
    solution:
      'Serverless content platform on Cloudflare Workers and Astro. Signed cookie sessions handle admin authentication with no external auth dependency. R2 stores project gallery media with a custom admin UI for upload, rename, and delete operations. All public endpoints are protected by Turnstile CAPTCHA and in-Worker IP rate limiting.',
    architecture: [
      'Cloudflare Workers serverless backend — zero cold starts, deployed to the edge globally',
      'Signed cookie sessions for admin authentication — no third-party auth service required',
      'Cloudflare R2 object storage with custom signed-URL access for project gallery media',
      'Turnstile CAPTCHA + in-Worker IP rate limiting on all public-facing endpoints',
      'Client review system: public submission, admin moderation with replies and featured reviews, aggregate rating summaries',
      'Architectural patterns established here (signed sessions, Turnstile + rate limiting, R2 pipeline) reused across Friends of Lake Henry and Blair Sportsmen\'s Club',
    ],
    ownership:
      'Sole engineer. Designed, built, deployed, and maintained end-to-end. Owned all production fixes and client feedback loops with zero downtime incidents.',
    outcome:
      "Live production site at kilcon.work. The security and infrastructure patterns built here became the foundation reused across subsequent client projects.",
    tags: ['Cloudflare Workers', 'Astro', 'JavaScript', 'R2', 'Turnstile', 'Signed Sessions', 'D1'],
    links: [
      { label: 'kilcon.work', url: 'https://kilcon.work', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/kilConstruction', primary: false },
    ],
  },
]

const SECONDARY = [
  {
    id: 'lakehenry',
    name: 'Friends of Lake Henry',
    tagline: 'Nonprofit platform — events, donations, moderated community photos',
    type: 'Web Platform',
    typeColor: '#3b9eff',
    description:
      'Single integrated Astro + Cloudflare codebase with API routes and session middleware in-repo. Admin backends for events, photo galleries, donor recognition, and raffle management behind signed-session auth, designed for non-technical board members.',
    tags: ['Cloudflare Workers', 'Astro', 'D1', 'KV', 'R2', 'Accessibility'],
    links: [
      { label: 'friendsoflakehenry.com', url: 'https://friendsoflakehenry.com', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/friends-of-lake-henry', primary: false },
    ],
  },
  {
    id: 'blair',
    name: "Blair Sportsmen's Club",
    tagline: 'Event & reservation platform — calendar, trap league scores',
    type: 'Web Platform',
    typeColor: '#2c583d',
    description:
      "Event and reservation platform for a recreational club established in 1968. Live barn-availability calendar with D1-backed reserved/booked/event states, calendar-to-form prefill, Turnstile-protected contact pipeline via Resend, and deep-linkable trap-league leaderboards.",
    tags: ['Cloudflare Workers', 'Astro', 'JavaScript', 'Turnstile', 'Resend', 'D1'],
    links: [
      { label: 'blairsportsmensclub.com', url: 'https://blairsportsmensclub.com', primary: true },
    ],
  },
  {
    id: 'arkham',
    name: 'Arkham Enterprises',
    tagline: 'Marketing & lead-gen site — React SPA + multi-step quote flows',
    type: 'Web Platform',
    typeColor: '#F4A100',
    description:
      'Marketing and lead-gen platform for a solar and construction company. React SPA served from a Cloudflare Worker with Resend-backed contact and multi-step quote-request forms, deep-linked service context via URL params, JSON-LD structured data, and WCAG AA accessibility.',
    tags: ['React', 'Cloudflare Workers', 'JavaScript', 'Resend', 'JSON-LD'],
    links: [
      { label: 'arkhamsolar.com', url: 'https://www.arkhamsolar.com', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/arkham-solar', primary: false },
    ],
  },
]

export default function SelectedWork() {
  const handleLinkClick = (projectId) => {
    fetch(`${WORKER}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'project_click', project: projectId }),
    }).catch(() => {})
  }

  return (
    <section id="work" aria-labelledby="selected-work-heading">
      <div className="container">
        <div className="section-label">01 / Selected Work</div>
        <h2 id="selected-work-heading" className="section-title">Production Systems</h2>
        <p className="section-sub">
          Five production client platforms and a published Android app — each owned from first commit to live deployment.
        </p>

        {/* Featured projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 64 }}>
          {FEATURED.map(project => (
            <FeaturedProject key={project.id} project={project} />
          ))}
        </div>

        {/* Secondary work */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-3)',
            marginBottom: 24,
          }}>
            More Work
          </h3>

          <div
            className="secondary-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }}
          >
            {SECONDARY.map(project => (
              <div
                key={project.id}
                className="card"
                style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: 3, background: project.typeColor, borderRadius: '16px 16px 0 0' }} />
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: project.typeColor,
                      background: `${project.typeColor}18`,
                      border: `1px solid ${project.typeColor}30`,
                      borderRadius: 100,
                      padding: '2px 8px',
                      letterSpacing: '0.05em',
                    }}>
                      {project.type}
                    </span>
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: 'var(--green)',
                      boxShadow: '0 0 0 3px rgba(0,255,136,0.12)',
                    }} />
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                    {project.name}
                  </h3>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
                    {project.tagline}
                  </p>

                  <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: 16, flex: 1 }}>
                    {project.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                    {project.tags.map(t => (
                      <span key={t} className="tag" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                    {project.links.map(l => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`btn ${l.primary ? 'btn-primary' : 'btn-outline'}`}
                        style={{ fontSize: '0.78rem', padding: '7px 12px', flex: l.primary ? 1 : 0 }}
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
      </div>

      <style>{`
        @media (max-width: 768px) {
          .secondary-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 900px) and (min-width: 769px) {
          .secondary-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}
