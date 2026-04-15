import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const STATES = [
  {
    state:  'ACTIVE',
    color:  '#ff3b3b',
    glow:   'rgba(255,59,59,0.2)',
    meaning:'Material risk. Act now.',
    action: '→ Review exposure now',
  },
  {
    state:  'WATCH',
    color:  '#ffd700',
    glow:   'rgba(255,215,0,0.15)',
    meaning:'Signal detected. Monitor.',
    action: '→ Increase monitoring',
  },
  {
    state:  'STABLE',
    color:  '#00c896',
    glow:   'rgba(0,200,150,0.12)',
    meaning:'Normal conditions. Continue.',
    action: '→ Continue normal operations',
  },
  {
    state:  'RECOVERY',
    color:  '#4488ff',
    glow:   'rgba(68,136,255,0.12)',
    meaning:'Pressure easing. Stay alert.',
    action: '→ Use the recovery window',
  },
];

export default function HealthStates() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.state-card', {
        opacity: 0, y: 28, stagger: 0.1, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}
    >
      <p className="section-label">How to read the corridor</p>
      <h2 className="section-title" style={{ marginBottom: '1rem' }}>
        Four states. Clear actions.
      </h2>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize:   '1rem',
        color:      'rgba(232,228,220,0.6)',
        maxWidth:   '520px',
        lineHeight: 1.7,
        marginBottom: '3rem',
      }}>
        Advuman translates corridor pressure into four operating states, each with a
        clear response posture.
      </p>

      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap:                 '1px',
        background:          'rgba(255,255,255,0.06)',
      }}>
        {STATES.map(({ state, color, glow, meaning, action }) => (
          <div
            key={state}
            className="state-card"
            style={{
              background: '#070d0a',
              padding:    '2rem 1.75rem',
            }}
          >
            {/* State dot + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <span style={{
                width: 9, height: 9,
                borderRadius: '50%',
                background:   color,
                boxShadow:    `0 0 10px ${color}`,
                display:      'inline-block',
                flexShrink:   0,
              }} />
              <span style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:      '0.8rem',
                letterSpacing: '0.16em',
                color,
              }}>
                {state}
              </span>
            </div>

            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize:   '1.25rem',
              fontWeight: 400,
              color:      '#f5f0e8',
              marginBottom: '0.75rem',
              lineHeight: 1.35,
            }}>
              {meaning}
            </p>

            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize:   '0.75rem',
              color:      color,
              letterSpacing: '0.03em',
            }}>
              {action}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
