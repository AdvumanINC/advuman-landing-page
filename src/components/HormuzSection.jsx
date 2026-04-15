import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollCanvas from './ScrollCanvas';
import { SEQUENCES } from '../constants';

const { frameCount: HOR_FRAMES, scrollHeight: HOR_SCROLL } = SEQUENCES.hormuz;

const EVENTS = [
  {
    date:  '25 Feb 2026',
    label: 'Carrier reversals, warnings, and insurance pressure flagged',
    badge: 'Corridor: WATCH',
    color: '#ffd700',
    critical: false,
  },
  {
    date:  '28 Feb 2026',
    label: 'First strike — risk escalates',
    badge: 'Risk escalates',
    color: '#ff6b6b',
    critical: false,
  },
  {
    date:  '2 Mar 2026',
    label: 'Major carriers suspend Hormuz crossings',
    badge: 'Corridor: ACTIVE',
    color: '#ff3b3b',
    critical: true,
  },
  {
    date:  '4 Mar 2026',
    label: 'Ships idle — freight shock visible',
    badge: 'Operational impact becomes obvious',
    color: '#ff3b3b',
    critical: true,
  },
];

export default function HormuzSection() {
  const sectionRef  = useRef(null);
  const headerRef   = useRef(null);
  const event0Ref   = useRef(null);
  const event1Ref   = useRef(null);
  const event2Ref   = useRef(null);
  const event3Ref   = useRef(null);
  const proofRef    = useRef(null);
  const eventRefs   = [event0Ref, event1Ref, event2Ref, event3Ref];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sh = HOR_SCROLL;

      gsap.set([headerRef.current, ...eventRefs.map(r => r.current), proofRef.current], {
        opacity: 0, x: -20,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     `+=${sh}`,
          scrub:   0.35,
        },
      });

      tl
        .to(headerRef.current,    { opacity: 1, x: 0, duration: 0.1 }, 0.04)
        .to(eventRefs[0].current, { opacity: 1, x: 0, duration: 0.1 }, 0.18)
        .to(eventRefs[1].current, { opacity: 1, x: 0, duration: 0.1 }, 0.30)
        .to(eventRefs[2].current, { opacity: 1, x: 0, duration: 0.1 }, 0.44)
        .to(eventRefs[3].current, { opacity: 1, x: 0, duration: 0.1 }, 0.56)
        .to(proofRef.current,     { opacity: 1, x: 0, duration: 0.1 }, 0.68)
        .to([headerRef.current, ...eventRefs.map(r => r.current), proofRef.current], {
          opacity: 0, duration: 0.12,
        }, 0.87);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} id="hormuz">
      <ScrollCanvas
        sequence="hormuz"
        frameCount={HOR_FRAMES}
        scrollHeight={HOR_SCROLL}
      >
        <div className="h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-20 gap-8 max-w-4xl">

          {/* Header */}
          <div ref={headerRef}>
            <p className="section-label">Case study · UK–India · Feb–Mar 2026</p>
            <h2
              className="section-title"
              style={{ maxWidth: '620px' }}
            >
              We caught the Hormuz escalation
              <br />
              <em style={{ fontStyle: 'italic', color: '#ffd700', fontWeight: 300 }}>
                before the disruption fully hit operators.
              </em>
            </h2>
          </div>

          {/* Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {EVENTS.map(({ date, label, badge, color, critical }, i) => (
              <div
                key={date}
                ref={eventRefs[i]}
                style={{
                  display:    'flex',
                  alignItems: 'flex-start',
                  gap:        '1.25rem',
                  padding:    '1.1rem 1.4rem',
                  background: critical
                    ? 'rgba(255,59,59,0.05)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${critical
                    ? 'rgba(255,59,59,0.2)'
                    : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '2px',
                }}
              >
                {/* Date */}
                <div style={{ minWidth: '110px' }}>
                  <span style={{
                    fontFamily:    "'Bebas Neue', sans-serif",
                    fontSize:      '0.72rem',
                    letterSpacing: '0.1em',
                    color,
                    display:       'block',
                  }}>
                    {date}
                  </span>
                </div>

                {/* Dot */}
                <span style={{
                  marginTop: '0.3rem',
                  width: 7, height: 7,
                  borderRadius: '50%',
                  background: color,
                  boxShadow: critical ? `0 0 8px ${color}80` : 'none',
                  display: 'inline-block',
                  flexShrink: 0,
                }} />

                {/* Content */}
                <div>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize:   '0.9rem',
                    color:      '#f5f0e8',
                    marginBottom: '0.35rem',
                  }}>
                    {label}
                  </p>
                  <span style={{
                    fontFamily:    "'DM Mono', monospace",
                    fontSize:      '0.68rem',
                    letterSpacing: '0.04em',
                    color,
                    background:    `${color}12`,
                    padding:       '0.15rem 0.5rem',
                    borderRadius:  '2px',
                  }}>
                    {badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Proof note */}
          <div
            ref={proofRef}
            style={{
              padding:    '1.25rem 1.5rem',
              background: 'rgba(255,215,0,0.04)',
              border:     '1px solid rgba(255,215,0,0.15)',
              borderRadius: '2px',
              maxWidth:   '580px',
            }}
          >
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize:   '1.15rem',
              fontStyle:  'italic',
              color:      'rgba(232,228,220,0.8)',
              lineHeight: 1.6,
            }}>
              Three days is the difference between rerouting cargo and watching it sit
              in a port. The Advuman signal on 25 February gave operators a structured
              read before the cost became visible.
            </p>
          </div>
        </div>
      </ScrollCanvas>
    </div>
  );
}
