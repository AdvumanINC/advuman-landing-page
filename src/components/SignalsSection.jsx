import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollCanvas from './ScrollCanvas';
import { SEQUENCES } from '../constants';

const { frameCount: SIG_FRAMES, scrollHeight: SIG_SCROLL } = SEQUENCES.signals;

const STEPS = [
  {
    num:    '01',
    title:  'Monitor the corridor',
    body:   'We track regulatory notices, port updates, carrier changes, and cost signals across the UK–India trade lane.',
    tag:    'Regulatory · Shipping · Cost',
  },
  {
    num:    '02',
    title:  'Read what matters',
    body:   'Signals are grouped into the three types of pressure that actually affect operators: compliance, shipping, and landed cost.',
    tag:    'What changed · Where pressure sits',
  },
  {
    num:    '03',
    title:  'Get the weekly pulse',
    body:   'Start with the free weekly corridor pulse. Upgrade for the full report, ranked threats, and broader checks delivered every Monday in plain English.',
    tag:    'Free pulse → Full report',
  },
];

export default function SignalsSection() {
  const sectionRef = useRef(null);
  const step1Ref   = useRef(null);
  const step2Ref   = useRef(null);
  const step3Ref   = useRef(null);
  const headerRef  = useRef(null);

  const stepRefs = [step1Ref, step2Ref, step3Ref];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sh = SIG_SCROLL;

      gsap.set([headerRef.current, ...stepRefs.map(r => r.current)], {
        opacity: 0, y: 28,
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
        .to(headerRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.05)
        .to(step1Ref.current,  { opacity: 1, y: 0, duration: 0.1 }, 0.18)
        .to(step2Ref.current,  { opacity: 1, y: 0, duration: 0.1 }, 0.35)
        .to(step3Ref.current,  { opacity: 1, y: 0, duration: 0.1 }, 0.52)
        .to([headerRef.current, ...stepRefs.map(r => r.current)], {
          opacity: 0, y: -12, duration: 0.12,
        }, 0.85);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} id="how-it-works">
      <ScrollCanvas
        sequence="signals"
        frameCount={SIG_FRAMES}
        scrollHeight={SIG_SCROLL}
      >
        <div className="h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-20 gap-10">

          {/* Header */}
          <div ref={headerRef}>
            <p className="section-label">How Advuman works</p>
            <h2
              className="section-title"
              style={{ maxWidth: '640px' }}
            >
              Three pressure layers.<br />
              <em style={{ fontStyle: 'italic', color: '#ffd700', fontWeight: 300 }}>
                One clear corridor state.
              </em>
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              color: 'rgba(232,228,220,0.6)',
              maxWidth: '520px',
              lineHeight: 1.65,
            }}>
              We turn scattered trade signals into one weekly read on where risk is
              building across the UK–India corridor.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-4xl">
            {STEPS.map(({ num, title, body, tag }, i) => (
              <div
                key={num}
                ref={stepRefs[i]}
                style={{
                  flex: 1,
                  padding: '1.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '2px',
                }}
              >
                <p style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,215,0,0.45)',
                  marginBottom: '1rem',
                }}>
                  {num}
                </p>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.4rem',
                  fontWeight: 400,
                  color: '#f5f0e8',
                  marginBottom: '0.75rem',
                }}>
                  {title}
                </h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  color: 'rgba(232,228,220,0.55)',
                  lineHeight: 1.6,
                  marginBottom: '1rem',
                }}>
                  {body}
                </p>
                <span style={{
                  display: 'inline-block',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.68rem',
                  letterSpacing: '0.04em',
                  color: 'rgba(255,215,0,0.5)',
                  background: 'rgba(255,215,0,0.06)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '2px',
                }}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollCanvas>
    </div>
  );
}
