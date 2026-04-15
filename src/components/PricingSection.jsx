import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CALENDLY_URL } from '../constants';

const PLANS = [
  {
    tier:       'Corridor Pulse',
    price:      'Free',
    desc:       'For operators who want a fast public read on UK–India corridor conditions.',
    features:   [
      'Public corridor state',
      'Weekly email pulse',
      'Top public-safe signals',
      'Rare major alerts',
    ],
    cta:        { label: 'Get the Weekly Pulse', href: '#final-cta', primary: false },
    note:       'No login required',
    featured:   false,
    style:      {},
  },
  {
    tier:       'Basic EWS',
    price:      '£18/mo',
    desc:       'For operators who want the full weekly report without paying for high-touch analyst support.',
    features:   [
      'Full weekly signal report',
      'Top 5 ranked threats',
      'One sector lens',
      'Templated action prompts',
      'Archive access',
      'Richer alert emails',
    ],
    cta:        { label: 'Unlock Basic EWS', href: '#final-cta', primary: true },
    note:       'Best for regular corridor monitoring',
    featured:   true,
    badge:      'RECOMMENDED',
    style:      {
      border:     '1px solid rgba(255,215,0,0.35)',
      background: 'rgba(255,215,0,0.015)',
    },
  },
  {
    tier:       'Decision Support',
    price:      '£150/mo',
    desc:       'For teams that need deeper interpretation, stronger monitoring, and tailored decision support.',
    features:   [
      'Everything in Basic EWS',
      'Tailored interpretation',
      'Stronger alerting',
      'Custom monitoring logic',
      'Monthly operator review',
    ],
    cta:        { label: 'Book a Call', calendly: true, primary: false },
    note:       'For higher-touch operational support',
    featured:   false,
    style:      {
      border:     '1px solid rgba(68,136,255,0.18)',
      background: 'rgba(68,136,255,0.03)',
    },
  },
];

export default function PricingSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pricing-card', {
        opacity: 0, y: 36, stagger: 0.14, duration: 0.7, ease: 'power2.out',
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
      id="pricing"
      style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}
    >
      <p className="section-label">What you get</p>
      <h2 className="section-title">Intelligence, not noise.</h2>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize:   '1rem',
        color:      'rgba(232,228,220,0.6)',
        maxWidth:   '580px',
        lineHeight: 1.7,
        marginBottom: '0.75rem',
      }}>
        Choose the level of corridor intelligence that fits how you operate. Start free.
        Upgrade when you need more depth, stronger alerts, and tailored interpretation.
      </p>
      <p style={{
        fontFamily:    "'DM Mono', monospace",
        fontSize:      '0.72rem',
        color:         'rgba(255,215,0,0.5)',
        marginBottom:  '3rem',
        letterSpacing: '0.04em',
      }}>
        Built for UK operators trading with India, not a generic global news feed.
      </p>

      {/* Cards */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
        gap:                 '1px',
        background:          'rgba(255,255,255,0.06)',
      }}>
        {PLANS.map(({ tier, price, desc, features, cta, note, featured, badge, style }) => (
          <div
            key={tier}
            className="pricing-card"
            style={{
              background: '#070d0a',
              padding:    '2rem',
              position:   'relative',
              ...style,
            }}
          >
            {/* Recommended badge */}
            {badge && (
              <span style={{
                position:      'absolute',
                top:           '-1px',
                left:          '50%',
                transform:     'translateX(-50%)',
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:      '0.58rem',
                letterSpacing: '0.18em',
                background:    '#ffd700',
                color:         '#1e1800',
                padding:       '0.2rem 0.85rem',
                borderRadius:  '0 0 2px 2px',
              }}>
                {badge}
              </span>
            )}

            <p style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:      '0.62rem',
              letterSpacing: '0.18em',
              color:         'rgba(255,215,0,0.55)',
              marginBottom:  '0.85rem',
              marginTop:     badge ? '0.75rem' : 0,
            }}>
              {tier}
            </p>

            <p style={{
              fontFamily:    "'Cormorant Garamond', Georgia, serif",
              fontSize:      '2.5rem',
              fontWeight:    400,
              color:         '#f5f0e8',
              lineHeight:    1,
              marginBottom:  '0.85rem',
            }}>
              {price}
            </p>

            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   '0.85rem',
              color:      'rgba(232,228,220,0.55)',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
              minHeight:  '3.5rem',
            }}>
              {desc}
            </p>

            {/* Features */}
            <ul style={{ listStyle: 'none', marginBottom: '1.75rem' }}>
              {features.map(f => (
                <li key={f} style={{
                  display:    'flex',
                  alignItems: 'flex-start',
                  gap:        '0.6rem',
                  fontFamily: "'Inter', sans-serif",
                  fontSize:   '0.85rem',
                  color:      'rgba(232,228,220,0.65)',
                  padding:    '0.35rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ color: '#00c896', marginTop: '0.15rem', flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            {cta.calendly ? (
              <button
                onClick={openCalendly}
                className={cta.primary ? 'btn-primary' : 'btn-ghost'}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {cta.label}
              </button>
            ) : (
              <a
                href={cta.href}
                className={cta.primary ? 'btn-primary' : 'btn-ghost'}
                style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
              >
                {cta.label}
              </a>
            )}

            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize:   '0.68rem',
              color:      'rgba(255,255,255,0.25)',
              marginTop:  '0.85rem',
              textAlign:  'center',
            }}>
              {note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
