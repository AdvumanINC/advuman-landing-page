import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollCanvas from './ScrollCanvas';
import { SEQUENCES, CALENDLY_URL } from '../constants';

const { frameCount: ROI_FRAMES, scrollHeight: ROI_SCROLL } = SEQUENCES.roi;

const ROWS = [
  { label: 'Unexpected duty / cost shock', value: '£25,000', color: '#ff3b3b' },
  { label: 'Decision Support annual cost',  value: '£1,800',  color: '#00c896' },
  { label: 'Illustrative ROI',              value: '13.9×',   color: '#00c896' },
];

export default function RoiSection() {
  const sectionRef  = useRef(null);
  const headerRef   = useRef(null);
  const tableRef    = useRef(null);
  const narrativeRef= useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sh = ROI_SCROLL;

      gsap.set([headerRef.current, tableRef.current, narrativeRef.current], {
        opacity: 0, y: 20,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     `+=${sh}`,
          scrub:   0.4,
        },
      });

      tl
        .to(headerRef.current,   { opacity: 1, y: 0, duration: 0.15 }, 0.08)
        .to(tableRef.current,    { opacity: 1, y: 0, duration: 0.15 }, 0.25)
        .to(narrativeRef.current,{ opacity: 1, y: 0, duration: 0.15 }, 0.45)
        .to([headerRef.current, tableRef.current, narrativeRef.current], {
          opacity: 0, duration: 0.12,
        }, 0.84);
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
    <div ref={sectionRef}>
      <ScrollCanvas
        sequence="roi"
        frameCount={ROI_FRAMES}
        scrollHeight={ROI_SCROLL}
      >
        <div className="h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-20 gap-8 max-w-5xl">

          {/* Header */}
          <div ref={headerRef}>
            <p className="section-label">Return on intelligence</p>
            <h2 className="section-title" style={{ maxWidth: '580px' }}>
              One surprise can cost more
              <br />
              <em style={{ fontStyle: 'italic', color: '#ffd700', fontWeight: 300 }}>
                than months of monitoring.
              </em>
            </h2>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize:   '0.62rem',
              letterSpacing: '0.14em',
              color:      'rgba(255,255,255,0.25)',
              marginTop:  '0.5rem',
            }}>
              Illustrative UK–India scenario · Late tariff or corridor shock lands
              after orders are committed
            </p>
          </div>

          {/* ROI Table */}
          <div ref={tableRef} style={{ maxWidth: '520px' }}>
            {ROWS.map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  display:       'flex',
                  justifyContent:'space-between',
                  alignItems:    'center',
                  padding:       '1rem 0',
                  borderBottom:  '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize:   '0.9rem',
                  color:      'rgba(232,228,220,0.65)',
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:      '1.4rem',
                  letterSpacing: '0.04em',
                  color,
                }}>
                  {value}
                </span>
              </div>
            ))}
            <p style={{
              marginTop:  '0.75rem',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize:   '0.58rem',
              letterSpacing: '0.12em',
              color:      'rgba(255,255,255,0.2)',
            }}>
              Source logic drawn from Advuman's own UK–India importer scenario.
            </p>
          </div>

          {/* Narrative */}
          <div ref={narrativeRef} style={{ maxWidth: '520px' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize:   '1.45rem',
              fontStyle:  'italic',
              fontWeight: 300,
              color:      'rgba(245,240,232,0.85)',
              lineHeight: 1.55,
              marginBottom: '1rem',
            }}>
              The point is not a perfect prediction. It is an earlier action.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   '0.9rem',
              color:      'rgba(232,228,220,0.5)',
              lineHeight: 1.65,
              marginBottom: '1.5rem',
            }}>
              For regular operators, the commercial logic is simple: if earlier signal
              interpretation helps you accelerate clearance, reprice, reroute, or protect
              stock before the cost lands, the subscription can pay for itself quickly.
            </p>
            <button onClick={openCalendly} className="btn-ghost" style={{ pointerEvents: 'auto' }}>
              Book a Call for Decision Support
            </button>
          </div>
        </div>
      </ScrollCanvas>
    </div>
  );
}
