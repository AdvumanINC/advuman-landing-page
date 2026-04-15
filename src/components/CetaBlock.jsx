import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CetaBlock() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(['.ceta-text', '.ceta-stat'], {
        opacity: 0, y: 24, stagger: 0.1, duration: 0.65, ease: 'power2.out',
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
      <div style={{
        display:    'grid',
        gridTemplateColumns: '1fr auto',
        gap:        '4rem',
        alignItems: 'start',
      }}>
        {/* Text */}
        <div className="ceta-text">
          <p className="section-label">UK–India context</p>
          <h2
            className="section-title"
            style={{ maxWidth: '520px', marginBottom: '1.25rem' }}
          >
            Trade opportunity is rising.
            <br />
            <em style={{ fontStyle: 'italic', color: '#ffd700', fontWeight: 300 }}>
              Corridor risk still matters.
            </em>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize:   '0.95rem',
            color:      'rgba(232,228,220,0.6)',
            maxWidth:   '480px',
            lineHeight: 1.7,
          }}>
            The UK–India trade environment is changing, but lower tariffs do not remove
            operational risk. Compliance complexity, logistics pressure, and cost shocks
            remain live concerns for operators on this corridor. The opportunity is real —
            so is the need for a cleaner signal on where risk is building.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           '2rem',
          minWidth:      '200px',
        }}>
          {[
            {
              value: '£36bn+',
              label: 'UK–India bilateral trade in goods and services',
            },
            {
              value: '90%+',
              label: 'Tariff-line changes increase opportunity, but also compliance complexity',
            },
          ].map(({ value, label }) => (
            <div key={value} className="ceta-stat">
              <p style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:      'clamp(2rem, 4vw, 3rem)',
                color:         '#ffd700',
                letterSpacing: '0.02em',
                lineHeight:    1,
                marginBottom:  '0.5rem',
              }}>
                {value}
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize:   '0.82rem',
                color:      'rgba(232,228,220,0.45)',
                lineHeight: 1.55,
                maxWidth:   '200px',
              }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
