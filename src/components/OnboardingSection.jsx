import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CALENDLY_URL } from '../constants';

const STEPS = [
  {
    num:  '01',
    title:'Sign up for the free pulse',
    body: 'Enter your email and get the UK–India Corridor Pulse. No credit card. No login. Just a clear weekly read in your inbox.',
    cta:  { label: 'Sign Up Free →', href: '#final-cta' },
  },
  {
    num:  '02',
    title:'Read the corridor every Monday',
    body: 'The weekly brief lands in your inbox. Corridor state, pressure breakdown, and what to watch this week. Human-reviewed, no jargon.',
    cta:  null,
  },
  {
    num:  '03',
    title:'Book a call for Decision Support',
    body: 'If you need tailored interpretation, stronger alerting, or a monthly operator review, book a 15-minute call to get started.',
    cta:  { label: 'Book a Call →', calendly: true },
  },
];

export default function OnboardingSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.onboarding-step', {
        opacity: 0, y: 28, stagger: 0.14, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
      style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}
    >
      <p className="section-label">Getting started</p>
      <h2 className="section-title" style={{ marginBottom: '3rem' }}>
        Up and running in one week.
      </h2>

      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap:                 '1px',
        background:          'rgba(255,255,255,0.06)',
      }}>
        {STEPS.map(({ num, title, body, cta }) => (
          <div
            key={num}
            className="onboarding-step"
            style={{ background: '#070d0a', padding: '2.25rem 2rem' }}
          >
            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      '2rem',
              letterSpacing: '0.02em',
              color:         'rgba(255,215,0,0.18)',
              lineHeight:    1,
              marginBottom:  '1.25rem',
            }}>
              {num}
            </p>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize:   '1.3rem',
              fontWeight: 400,
              color:      '#f5f0e8',
              marginBottom: '0.75rem',
            }}>
              {title}
            </h3>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   '0.87rem',
              color:      'rgba(232,228,220,0.5)',
              lineHeight: 1.65,
              marginBottom: cta ? '1.25rem' : 0,
            }}>
              {body}
            </p>
            {cta && (
              cta.calendly ? (
                <button onClick={openCalendly} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '0.55rem 1.1rem' }}>
                  {cta.label}
                </button>
              ) : (
                <a href={cta.href} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '0.55rem 1.1rem', display: 'inline-flex' }}>
                  {cta.label}
                </a>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
