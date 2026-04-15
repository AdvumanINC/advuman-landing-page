import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { CALENDLY_URL, TALLY_FALLBACK_URL } from '../constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function FinalCTA() {
  const sectionRef  = useRef(null);
  const [email,    setEmail]    = useState('');
  const [error,    setError]    = useState('');
  const [status,   setStatus]   = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(['.final-header', '.final-form'], {
        opacity: 0, y: 28, stagger: 0.15, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  function validate() {
    if (!email.trim()) { setError('Please enter your email address.'); return false; }
    if (!EMAIL_RE.test(email)) { setError('Please enter a valid email address.'); return false; }
    setError('');
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, corridor: 'uk-india', tier: 'pulse' }),
        signal:  AbortSignal.timeout(8000),
      });

      if (res.ok || res.status === 201) {
        setStatus('success');
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch {
      // API unavailable — open Tally fallback
      window.open(TALLY_FALLBACK_URL, '_blank', 'noopener');
      setStatus('idle');
    }
  }

  function openCalendly(e) {
    e.preventDefault();
    if (typeof window.Calendly !== 'undefined') {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener');
    }
  }

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      style={{
        padding:         '7rem 2rem',
        maxWidth:        '800px',
        margin:          '0 auto',
        textAlign:       'center',
      }}
    >
      {/* Header */}
      <div className="final-header">
        <p className="section-label" style={{ marginBottom: '1rem' }}>
          Start with the free pulse
        </p>
        <h2
          className="section-title"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)', marginBottom: '1.25rem' }}
        >
          Know before the cost
          <br />
          <em style={{ fontStyle: 'italic', color: '#ffd700', fontWeight: 300 }}>
            is already locked in.
          </em>
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize:   '1rem',
          color:      'rgba(232,228,220,0.6)',
          maxWidth:   '520px',
          margin:     '0 auto 3rem',
          lineHeight: 1.7,
        }}>
          Join the free UK–India Corridor Pulse for the weekly digest, public corridor
          state, and major alerts. Upgrade when you need fuller reports and stronger
          support.
        </p>
      </div>

      {/* Form */}
      <div className="final-form">
        {status === 'success' ? (
          /* Success state */
          <div style={{
            padding:    '2rem',
            background: 'rgba(0,200,150,0.08)',
            border:     '1px solid rgba(0,200,150,0.25)',
            borderRadius: '2px',
            marginBottom: '2rem',
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize:   '1.5rem',
              color:      '#00c896',
              marginBottom: '0.5rem',
            }}>
              ✓ You're on the list.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   '0.9rem',
              color:      'rgba(232,228,220,0.6)',
            }}>
              First pulse lands Monday.
            </p>
          </div>
        ) : (
          /* Email form */
          <form
            id="waitlist-form"
            onSubmit={handleSubmit}
            noValidate
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '0.75rem',
              marginBottom:   '1.5rem',
            }}
          >
            <div style={{
              display: 'flex',
              gap:     '0',
              width:   '100%',
              maxWidth:'480px',
            }}>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="your@company.com"
                aria-label="Email address"
                style={{
                  flex:         1,
                  padding:      '0.75rem 1.1rem',
                  background:   'rgba(255,255,255,0.05)',
                  border:       `1px solid ${error ? 'rgba(255,59,59,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  borderRight:  'none',
                  borderRadius: '2px 0 0 2px',
                  color:        '#f5f0e8',
                  fontFamily:   "'Inter', sans-serif",
                  fontSize:     '0.9rem',
                  outline:      'none',
                  minWidth:     0,
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.4)'; }}
                onBlur={e => { e.target.style.borderColor = error ? 'rgba(255,59,59,0.5)' : 'rgba(255,255,255,0.12)'; }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary"
                style={{ borderRadius: '0 2px 2px 0', flexShrink: 0 }}
              >
                {status === 'loading' ? '...' : 'Get the Weekly Pulse'}
              </button>
            </div>

            {/* Inline error */}
            {error && (
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize:   '0.72rem',
                color:      '#ff3b3b',
                letterSpacing: '0.03em',
              }}>
                {error}
              </p>
            )}

            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize:   '0.68rem',
              color:      'rgba(255,255,255,0.25)',
              letterSpacing: '0.04em',
            }}>
              First brief arrives Monday · No credit card · Unsubscribe anytime
            </p>
          </form>
        )}

        {/* Secondary CTA */}
        <button onClick={openCalendly} className="btn-ghost">
          Book a Call for Decision Support
        </button>
      </div>
    </section>
  );
}
