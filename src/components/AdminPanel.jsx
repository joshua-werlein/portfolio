import { useState, useEffect, useRef } from 'react'
import { WORKER } from '../App'
 
const STATUS_OPTIONS = ['new', 'contacted', 'interviewing', 'closed', 'archived']
const STATUS_COLORS = {
  new:          { bg: 'rgba(0,229,255,0.1)',   text: 'var(--accent)',  border: 'rgba(0,229,255,0.2)' },
  contacted:    { bg: 'rgba(0,255,136,0.1)',   text: 'var(--green)',   border: 'rgba(0,255,136,0.2)' },
  interviewing: { bg: 'rgba(255,200,0,0.1)',   text: '#ffc800',        border: 'rgba(255,200,0,0.2)' },
  closed:       { bg: 'rgba(255,107,53,0.1)',  text: 'var(--orange)',  border: 'rgba(255,107,53,0.2)' },
  archived:     { bg: 'rgba(100,100,120,0.1)', text: 'var(--text-3)',  border: 'var(--border)' },
}
 
export default function AdminPanel({ workerUrl, onClose }) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(false)
  const [tab, setTab] = useState('leads')
 
  // Leads state
  const [leads, setLeads] = useState([])
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [noteText, setNoteText] = useState('')
  const noteSaveTimer = useRef(null)
 
  // Analytics state
  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
 
  const adminKey = useRef('')
 
  const handleLogin = async () => {
    if (!password.trim()) return
    // Verify by attempting to fetch leads
    try {
      const res = await fetch(`${workerUrl}/leads`, {
        headers: { 'x-admin-key': password },
      })
      if (res.status === 401) { setAuthError(true); return }
      if (!res.ok) throw new Error()
      adminKey.current = password
      setAuthed(true)
      const data = await res.json()
      setLeads(data.leads || [])
    } catch {
      setAuthError(true)
    }
  }
 
  const fetchLeads = async () => {
    setLeadsLoading(true)
    try {
      const res = await fetch(`${workerUrl}/leads`, {
        headers: { 'x-admin-key': adminKey.current },
      })
      const data = await res.json()
      setLeads(data.leads || [])
    } catch { /* silent */ }
    finally { setLeadsLoading(false) }
  }
 
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const res = await fetch(`${workerUrl}/analytics`, {
        headers: { 'x-admin-key': adminKey.current },
      })
      const data = await res.json()
      setAnalytics(data)
    } catch { /* silent */ }
    finally { setAnalyticsLoading(false) }
  }
 
  useEffect(() => {
    if (!authed) return
    if (tab === 'leads') fetchLeads()
    if (tab === 'analytics') fetchAnalytics()
  }, [authed, tab])
 
  // Auto-save notes after 1s pause
  const handleNoteChange = (val) => {
    setNoteText(val)
    clearTimeout(noteSaveTimer.current)
    noteSaveTimer.current = setTimeout(() => saveNote(val), 1000)
  }
 
  const saveNote = async (note) => {
    if (!selectedLead) return
    try {
      await fetch(`${workerUrl}/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey.current,
        },
        body: JSON.stringify({ notes: note }),
      })
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: note } : l))
    } catch { /* silent */ }
  }
 
  const updateStatus = async (leadId, status) => {
    try {
      await fetch(`${workerUrl}/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey.current,
        },
        body: JSON.stringify({ status }),
      })
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l))
      if (selectedLead?.id === leadId) setSelectedLead(prev => ({ ...prev, status }))
    } catch { /* silent */ }
  }
 
  const selectLead = (lead) => {
    setSelectedLead(lead)
    setNoteText(lead.notes || '')
  }
 
  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }
 
  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border-2)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: authed ? 900 : 400,
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
      }}>
 
        {/* ── Login screen ── */}
        {!authed ? (
          <div style={{ padding: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🔒</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 4 }}>
                Admin Access
              </h3>
              <p style={{ color: 'var(--text-3)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                Enter your admin key to continue
              </p>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setAuthError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Admin key"
              autoFocus
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'var(--surface)',
                border: `1px solid ${authError ? 'var(--orange)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                marginBottom: 12,
                outline: 'none',
              }}
            />
            {authError && (
              <p style={{ color: 'var(--orange)', fontSize: '0.78rem', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
                ⚠ Invalid key
              </p>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleLogin}>Unlock →</button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
                  Admin Panel
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['leads', 'analytics'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      style={{
                        padding: '5px 14px',
                        borderRadius: 6,
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: tab === t ? 'var(--accent)' : 'transparent',
                        color: tab === t ? '#000' : 'var(--text-2)',
                        border: tab === t ? 'none' : '1px solid var(--border)',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '1.2rem', cursor: 'pointer', padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>
 
            {/* ── Leads Tab ── */}
            {tab === 'leads' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', flex: 1, overflow: 'hidden', minHeight: 0 }}>
                {/* Lead list */}
                <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-3)' }}>
                      {leads.length} LEADS
                    </span>
                    <button className="btn btn-ghost" style={{ fontSize: '0.72rem', padding: '4px 10px' }} onClick={fetchLeads}>
                      ↻ Refresh
                    </button>
                  </div>
                  {leadsLoading ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      Loading...
                    </div>
                  ) : leads.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      No leads yet
                    </div>
                  ) : (
                    leads.map(lead => {
                      const sc = STATUS_COLORS[lead.status] || STATUS_COLORS.new
                      const isSelected = selectedLead?.id === lead.id
                      return (
                        <div
                          key={lead.id}
                          onClick={() => selectLead(lead)}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid var(--border)',
                            cursor: 'pointer',
                            background: isSelected ? 'var(--surface-2)' : 'transparent',
                            transition: 'background 0.15s',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{lead.name}</span>
                            <span style={{
                              fontSize: '0.65rem',
                              fontFamily: 'var(--font-mono)',
                              padding: '1px 7px',
                              borderRadius: 100,
                              background: sc.bg,
                              color: sc.text,
                              border: `1px solid ${sc.border}`,
                              flexShrink: 0,
                              marginLeft: 6,
                            }}>
                              {lead.status || 'new'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: 2 }}>{lead.email}</div>
                          {lead.subject && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {lead.subject}
                            </div>
                          )}
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
 
                {/* Lead detail */}
                <div style={{ overflowY: 'auto', padding: '20px' }}>
                  {!selectedLead ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginTop: 40 }}>
                      Select a lead to view details
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: 20 }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{selectedLead.name}</h3>
                        <a href={`mailto:${selectedLead.email}`} style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>{selectedLead.email}</a>
                        {selectedLead.subject && (
                          <div style={{ marginTop: 8, fontStyle: 'italic', color: 'var(--text-2)', fontSize: '0.875rem' }}>
                            "{selectedLead.subject}"
                          </div>
                        )}
                      </div>
 
                      {/* Status selector */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-3)', marginBottom: 8, letterSpacing: '0.08em' }}>
                          STATUS
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {STATUS_OPTIONS.map(s => {
                            const sc = STATUS_COLORS[s]
                            const active = (selectedLead.status || 'new') === s
                            return (
                              <button
                                key={s}
                                onClick={() => updateStatus(selectedLead.id, s)}
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: 100,
                                  fontSize: '0.72rem',
                                  fontFamily: 'var(--font-mono)',
                                  cursor: 'pointer',
                                  background: active ? sc.bg : 'transparent',
                                  color: active ? sc.text : 'var(--text-3)',
                                  border: `1px solid ${active ? sc.border : 'var(--border)'}`,
                                  transition: 'all 0.15s',
                                }}
                              >
                                {s}
                              </button>
                            )
                          })}
                        </div>
                      </div>
 
                      {/* Message */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-3)', marginBottom: 8, letterSpacing: '0.08em' }}>
                          MESSAGE
                        </div>
                        <div style={{
                          padding: '12px 14px',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.85rem',
                          color: 'var(--text-2)',
                          lineHeight: 1.65,
                          whiteSpace: 'pre-wrap',
                        }}>
                          {selectedLead.message}
                        </div>
                      </div>
 
                      {/* Notes (auto-save) */}
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-3)', marginBottom: 8, letterSpacing: '0.08em', display: 'flex', justifyContent: 'space-between' }}>
                          <span>NOTES</span>
                          <span style={{ color: 'var(--green)', fontSize: '0.62rem' }}>auto-saves</span>
                        </div>
                        <textarea
                          value={noteText}
                          onChange={e => handleNoteChange(e.target.value)}
                          placeholder="Add notes about this lead..."
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--text)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.85rem',
                            resize: 'vertical',
                            outline: 'none',
                            lineHeight: 1.6,
                          }}
                          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                          onBlur={e => e.target.style.borderColor = 'var(--border)'}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
 
            {/* ── Analytics Tab ── */}
            {tab === 'analytics' && (
              <div style={{ overflowY: 'auto', padding: 24, flex: 1 }}>
                {analyticsLoading ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginTop: 40 }}>
                    Loading analytics...
                  </div>
                ) : !analytics ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '0.8rem' }}>No data yet</div>
                ) : (
                  <>
                    {/* Summary cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                      {[
                        { label: 'Resume Downloads', value: analytics.resume_downloads ?? 0, icon: '📄', color: 'var(--accent)' },
                        { label: 'Contact Submissions', value: analytics.contact_submissions ?? 0, icon: '✉', color: 'var(--green)' },
                        { label: 'Total Project Clicks', value: analytics.total_project_clicks ?? 0, icon: '🔗', color: 'var(--orange)' },
                      ].map(stat => (
                        <div key={stat.label} className="card" style={{ padding: '18px 20px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{stat.icon}</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                            {stat.value}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-3)', marginTop: 6, letterSpacing: '0.05em' }}>
                            {stat.label.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>
 
                    {/* Per-project clicks */}
                    {analytics.project_clicks && (
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 14 }}>
                          PROJECT CLICKS
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {Object.entries(analytics.project_clicks).map(([project, count]) => {
                            const max = Math.max(...Object.values(analytics.project_clicks))
                            const pct = max > 0 ? (count / max) * 100 : 0
                            return (
                              <div key={project}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{project}</span>
                                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-2)' }}>{count}</span>
                                </div>
                                <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 3 }}>
                                  <div style={{
                                    height: '100%',
                                    width: `${pct}%`,
                                    background: 'var(--accent)',
                                    borderRadius: 3,
                                    transition: 'width 0.6s ease',
                                  }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}