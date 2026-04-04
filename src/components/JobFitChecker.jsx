import { useState } from 'react'
import { WORKER } from '../App'
 
const PLACEHOLDER = `Paste a job description here and I'll analyze how well Joshua's skills and experience match the role...
 
Example: "We're looking for a full stack engineer with experience in JavaScript, REST APIs, cloud infrastructure, and shipping production systems. Experience with Android a plus."`
 
export default function JobFitChecker() {
  const [jobText, setJobText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
 
  const analyze = async () => {
    if (!jobText.trim() || jobText.trim().length < 50) {
      setError('Please paste a full job description (at least 50 characters).')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${WORKER}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jobText }),
      })
      if (res.status === 429) {
        setError('AI analyzer is temporarily rate limited. Please try again in a few minutes.')
        return
      }
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError('Analysis failed. Please try again in a moment.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
 
  const scoreColor = (score) => {
    if (score >= 75) return 'var(--green)'
    if (score >= 50) return 'var(--accent)'
    return 'var(--orange)'
  }
 
  const scoreLabel = (score) => {
    if (score >= 75) return 'Strong Match'
    if (score >= 50) return 'Good Match'
    if (score >= 30) return 'Partial Match'
    return 'Low Match'
  }
 
  return (
    <section id="jobfit">
      <div className="container">
        <div className="section-label">AI Tool</div>
        <h2 className="section-title">Job Fit Checker</h2>
        <p className="section-sub">
          Paste any job description and get an instant AI analysis of how Joshua's skills and experience align with the role.
        </p>
 
        <div style={{
          display: 'grid',
          gridTemplateColumns: result ? '1fr 1fr' : '1fr',
          gap: 28,
          transition: 'grid-template-columns 0.3s ease',
        }} className="jobfit-grid">
 
          {/* Input panel */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.1rem' }}>🤖</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
                  Job Description
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--text-3)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 100,
                padding: '2px 8px',
              }}>
                Powered by Llama 3.3
              </span>
            </div>
 
            {/* Textarea */}
            <textarea
              value={jobText}
              onChange={e => { setJobText(e.target.value); setError(null) }}
              placeholder={PLACEHOLDER}
              style={{
                width: '100%',
                minHeight: 220,
                padding: '16px 20px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                color: 'var(--text)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                lineHeight: 1.65,
              }}
            />
 
            {/* Footer */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-3)' }}>
                {jobText.length > 0 ? `${jobText.length} chars` : 'Paste a job description above'}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                {jobText && (
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.78rem', padding: '7px 12px' }}
                    onClick={() => { setJobText(''); setResult(null); setError(null) }}
                  >
                    Clear
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  style={{ fontSize: '0.82rem', padding: '8px 18px', minWidth: 100 }}
                  onClick={analyze}
                  disabled={loading || !jobText.trim()}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        width: 12, height: 12,
                        border: '2px solid rgba(0,0,0,0.3)',
                        borderTopColor: '#000',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                      Analyzing...
                    </span>
                  ) : 'Analyze Fit →'}
                </button>
              </div>
            </div>
 
            {error && (
              <div style={{
                margin: '0 20px 16px',
                padding: '10px 14px',
                background: 'rgba(255,107,53,0.1)',
                border: '1px solid rgba(255,107,53,0.25)',
                borderRadius: 'var(--radius)',
                color: 'var(--orange)',
                fontSize: '0.82rem',
              }}>
                ⚠ {error}
              </div>
            )}
          </div>
 
          {/* Results panel */}
          {result && (
            <div className="card animate-fade-up" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Score header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}>
                {/* Score ring */}
                <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="28" fill="none" stroke="var(--surface-2)" strokeWidth="6" />
                    <circle
                      cx="36" cy="36" r="28"
                      fill="none"
                      stroke={scoreColor(result.score)}
                      strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - result.score / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 36 36)"
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: scoreColor(result.score), lineHeight: 1 }}>
                      {result.score}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-3)' }}>/ 100</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: scoreColor(result.score) }}>
                    {scoreLabel(result.score)}
                  </div>
                  <div style={{ color: 'var(--text-2)', fontSize: '0.82rem', marginTop: 4 }}>
                    {result.summary}
                  </div>
                </div>
              </div>
 
              {/* Breakdown */}
              <div style={{ padding: '20px 24px', overflowY: 'auto', maxHeight: 320 }}>
                {result.strengths?.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--green)', letterSpacing: '0.1em', marginBottom: 8 }}>
                      ✓ STRENGTHS
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {result.strengths.map((s, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.84rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                          <span style={{ color: 'var(--green)', flexShrink: 0 }}>+</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
 
                {result.gaps?.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--orange)', letterSpacing: '0.1em', marginBottom: 8 }}>
                      △ GAPS / TO HIGHLIGHT
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {result.gaps.map((g, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.84rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                          <span style={{ color: 'var(--orange)', flexShrink: 0 }}>△</span>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
 
                {result.recommendation && (
                  <div style={{
                    padding: '12px 14px',
                    background: 'var(--accent-dim)',
                    border: '1px solid rgba(0,229,255,0.15)',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.84rem',
                    color: 'var(--text-2)',
                    lineHeight: 1.6,
                  }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>💡 Recommendation: </span>
                    {result.recommendation}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
 
        {/* Disclaimer */}
        <p style={{
          marginTop: 20,
          color: 'var(--text-3)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          textAlign: 'center',
        }}>
          AI analysis via Google Llama 3.3 (Groq) — results are a guide, not a guarantee.
        </p>
      </div>
 
      <style>{`
        @media (max-width: 768px) {
          .jobfit-grid {
            grid-template-columns: 1fr !important;
          }
        }
        textarea::placeholder {
          color: var(--text-3);
        }
      `}</style>
    </section>
  )
}