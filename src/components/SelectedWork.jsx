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
      'Restaurant staff needed to manage menus, specials, and media without engineering help. Facebook specials graphics meant duplicate website entry. Automation had to respect source chronology and later staff corrections.',
    solution:
      'Built an Astro 7 and Cloudflare platform with D1-backed menus, staff administration, R2 media, and operational analytics. A scheduled Worker uses Workers AI to extract specials from Facebook posters, verifies source dates and printed prices, and commits eligible updates with guarded D1 transactions. Newer verified posts take precedence, while older unchanged posts cannot undo a later staff correction.',
    architecture: [
      'Astro on Cloudflare Pages, with Workers, D1 data, KV sessions, and R2 staff media workflows',
      'Structured weekly specials with recurring defaults, source timestamps, revision checks, and atomic D1 writes',
      'Workers AI vision extracts same-day Facebook offers and printed service times; unchanged posts are processed once',
      'Deterministic Lunch / All Day / Nightly reconciliation removes repeated All Day offers, in either post order',
      'Sunday-night Monday–Sunday provisioning from recurring defaults, with Monday fallback and automation-eligible blanks',
      'Independent public Facebook feed retains last-known-good content; Turnstile, Resend, and security headers protect public workflows',
    ],
    ownership:
      'Sole engineer. Designed, built, deployed, and maintain the full production platform.',
    outcome: 'Live restaurant operations with mobile staff admin, automated specials, and production analytics.',
    tags: ['Astro', 'Cloudflare Workers', 'D1', 'KV', 'R2', 'Workers AI', 'Turnstile', 'Resend', 'Facebook Graph API', 'GitHub Actions'],
    links: [
      { label: 'grayznbuffalo.com', url: 'https://grayznbuffalo.com', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/grayzn-buffalo', primary: false },
    ],
  },
 {
    id: 'lakehenry',
    name: 'Friends of Lake Henry',
    tagline: 'Nonprofit operations · Raffles, Facebook Live, and verified photo automation',
    type: 'Web Platform',
    typeColor: '#3b9eff',
    problem:
      'A lake-restoration nonprofit needed an easy-to-manage website plus dependable time-sensitive fundraising workflows. Volunteers needed to publish events, donors, winners and photos while outside Facebook data and image evidence could arrive late or be ambiguous.',
    solution:
      'Built an Astro and Cloudflare platform with authenticated administrative tools, D1/KV/R2 storage, raffle/prize records, and dedicated Facebook Live and winner-photo Workers. Added source validation, review holds, diagnostics, and recovery procedures to avoid silently publishing uncertain results.',
    architecture: [
      'Astro on Cloudflare Pages with protected server routes and content administration',
      'D1 records for events, donors, raffle winners, photo imports and prize workflows',
      'KV-based configuration and sessions; R2 for managed gallery and event images',
      'Dedicated Workers for Facebook Live discovery and winner-photo intake',
      'AI-assisted photo extraction with evidence checks and manual review for ambiguous results',
      'Documented test, staging and rollback processes for time-sensitive production changes',
    ],
    ownership:
      'Sole engineer responsible for architecture, deployment, support, and ongoing automation improvements.',
    outcome:
      'Production nonprofit platform supporting public event information, donor recognition, and operational raffle workflows.',
    tags: ['Astro', 'TypeScript', 'Cloudflare Workers', 'D1', 'KV', 'R2', 'Facebook Graph API', 'Automation'],
    links: [
      { label: 'friendsoflakehenry.com', url: 'https://friendsoflakehenry.com', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/friends-of-lake-henry', primary: false },
    ],
  },
  {
    id: 'kilcon',
    name: 'KIL Construction',
    tagline: 'Construction content platform · Astro + Cloudflare Workers + D1/R2',
    type: 'Web Platform',
    typeColor: '#F6821F',
    problem:
      'A construction company needed a professional site with secure, low-maintenance project galleries and customer reviews. Facebook photos also needed to reach the website without duplicating older, manually uploaded project images or exposing private media.',
    solution:
      'Built an Astro 5 website on Cloudflare Pages with independently deployed gallery/reviews and contact Workers, signed admin sessions, D1-backed project and photo records, R2 media, and moderated reviews. Added signature-verified Meta webhooks for new Page posts, an admin photo-comparison workflow for historical imports, and safeguards that require explicit approval before older photos are published.',
    architecture: [
      'Astro 5 server-rendered site on Cloudflare Pages with separate gallery/reviews and contact Workers',
      'D1 stores project and album mappings, photo metadata, visibility, historical review decisions, and import state; R2 stores actual image files, including restricted private media',
      'Meta Page webhook verification, deduplicated new-post imports, bounded retries, and feature-gated album discovery',
      'Admin comparison of Facebook versus website photos with perceptual-hash duplicate hints and Import / Skip / Review later decisions',
      'Manual R2 galleries and Facebook-managed projects in the admin, with hide, restore, move, and confirmation-protected deletion controls',
      'Signed cookie sessions, image access checks, request rate limits, Turnstile-protected contact, and Resend delivery',
    ],
    ownership:
      'Sole engineer responsible for architecture, implementation, deployment, security fixes, and ongoing client support.',
    outcome:
      'Production website at kilcon.work with secure gallery administration, Facebook new-post automation, and controlled historical photo reconciliation. Broad historical import and automated album discovery remain separately gated.',
    tags: ['Astro', 'Cloudflare Workers', 'D1', 'R2', 'Facebook Graph API', 'Webhooks', 'JavaScript', 'Turnstile', 'Resend'],
    links: [
      { label: 'kilcon.work', url: 'https://kilcon.work', primary: true },
      { label: 'GitHub', url: 'https://github.com/joshua-werlein/kilConstruction', primary: false },
    ],
  }
]

const SECONDARY = [
  {
    id: 'bestby',
    name: 'Best By Manager',
    tagline: 'Native Android inventory app · Java + Room + Google Play',
    type: 'Android App',
    typeColor: '#34A853',
    description:
      'Published, offline-first Android inventory app with barcode scanning, expiration alerts, and role-based access for shared devices.',
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

                  {project.architecture && (
                    <details className="secondary-case-study">
                      <summary>View case study</summary>
                      <p>{project.problem}</p>
                      <p>{project.solution}</p>
                      <ul>
                        {project.architecture.map(item => <li key={item}>{item}</li>)}
                      </ul>
                      <p>{project.ownership}</p>
                      <p>{project.outcome}</p>
                    </details>
                  )}

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
        .secondary-case-study {
          color: var(--text-2);
          font-size: 0.85rem;
          line-height: 1.65;
          margin-bottom: 16px;
        }
        .secondary-case-study summary {
          color: var(--accent);
          cursor: pointer;
        }
        .secondary-case-study p, .secondary-case-study ul {
          margin-top: 8px;
        }
        .secondary-case-study ul {
          list-style: disc;
          padding-left: 20px;
        }
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
