import { useState } from 'react'
import { WORKER } from '../App'
 
const INITIAL = { name: '', email: '', subject: '', message: '' }
 
const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'jjwerlein@gmail.com',
    href: 'mailto:jjwerlein@gmail.com',
    icon: '✉',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/joshua-werlein',
    href: 'https://linkedin.com/in/joshua-werlein',
    icon: '🔗',
  },
  {
    label: 'GitHub',
    value: 'github.com/joshua-werlein',
    href: 'https://github.com/joshua-werlein',
    icon: '⌥',
  },
  {
    label: 'Location',
    value: 'Mondovi, WI — Remote Ready',
    href: null,
    icon: '📍',
  },
]
 
export default function Contact() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'
  const [errors, setErrors] = useState({})
 
  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 20) e.message = 'Message is too short (min 20 chars)'
    return e
  }
 
  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setStatus('sending')
    try {
      const res = await fetch(`${WORKER}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      setStatus('success')
      setForm(INITIAL)
    } catch {
      setStatus('error')
    }
  }
 
  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(ev => ({ ...ev, [field]: null }))
  }
 
  return (
    <section id="contact">
      <div className="container">
        <div className="section-label">Contact</div>
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-sub">
          Open to remote full-time roles, contract work, and interesting conversations.
        </p>
 
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: 40,
          alignItems: 'start',
        }} className="contact-grid">
 
          {/* Left: contact info */}
          <div className="animate-fade-up">
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 32, fontSize: '0.95rem' }}>
              Whether you have a role to discuss, a project in mind, or just want to
              connect — I'm happy to hear from you. I typically respond within one
              business day.
            </p>
 
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {CONTACT_LINKS.map(link => (
                <div key={link.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}>
                  <span style={{ fontSize: '1.1rem', width: 24, textAlign: 'center', flexShrink: 0 }}>
                    {link.icon}
                  </span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 2 }}>
                      {link.label.toUpperCase()}
                    </div>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}
                      >
                        {link.value}
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>
                        {link.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
 
            {/* Availability badge */}
            <div style={{
              marginTop: 24,
              padding: '14px 18px',
              background: 'rgba(0,255,136,0.07)',
              border: '1px solid rgba(0,255,136,0.2)',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span className="status-dot" />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>
                Available for remote work — <strong style={{ color: 'var(--text)' }}>immediate start</strong>
              </span>
            </div>
          </div>
 
          {/* Right: form */}
          <div className="card animate-fade-up animate-delay-2" style={{ padding: '28px 28px' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 10 }}>
                  Message Sent!
                </h3>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>
                  Thanks for reaching out. I'll get back to you within one business day.
                </p>
                <button
                  className="btn btn-outline"
                  onClick={() => setStatus(null)}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Name + Email row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                  <Field
                    label="Name"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Your name"
                    error={errors.name}
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="your@email.com"
                    error={errors.email}
                  />
                </div>
 
                <Field
                  label="Subject"
                  value={form.subject}
                  onChange={set('subject')}
                  placeholder="What's this about? (optional)"
                />
 
                <Field
                  label="Message"
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Tell me about the role, project, or whatever's on your mind..."
                  multiline
                  error={errors.message}
                />
 
                {status === 'error' && (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(255,107,53,0.1)',
                    border: '1px solid rgba(255,107,53,0.25)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--orange)',
                    fontSize: '0.82rem',
                  }}>
                    ⚠ Something went wrong. Please try again or email me directly.
                  </div>
                )}
 
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem' }}
                  onClick={handleSubmit}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 14, height: 14,
                        border: '2px solid rgba(0,0,0,0.3)',
                        borderTopColor: '#000',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                      Sending...
                    </span>
                  ) : 'Send Message →'}
                </button>
 
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                  I'll respond within 1 business day.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
 
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
 
function Field({ label, value, onChange, placeholder, type = 'text', multiline, error }) {
  const base = {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--surface-2)',
    border: `1px solid ${error ? 'var(--orange)' : 'var(--border)'}`,
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  }
 
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        letterSpacing: '0.08em',
        color: 'var(--text-3)',
        marginBottom: 6,
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          style={{ ...base, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = error ? 'var(--orange)' : 'var(--border)'}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={base}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = error ? 'var(--orange)' : 'var(--border)'}
        />
      )}
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--orange)', marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}