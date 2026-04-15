import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CALENDLY_URL } from '../constants';

export default function Nav() {
  const progressRef = useRef(null);

  useEffect(() => {
    // ── Scroll progress bar (2px gold line at top) ─────────────────────
    const st = ScrollTrigger.create({
      start: 'top top',
      end:   'bottom bottom',
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.width = `${self.progress * 100}%`;
        }
      },
    });

    return () => st.kill();
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
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-transparent pointer-events-none">
        <div
          ref={progressRef}
          className="h-full"
          style={{
            width: '0%',
            background: 'linear-gradient(90deg, #ffd700, #ffec8b)',
            transition: 'width 0.08s linear',
          }}
        />
      </div>

      {/* Nav bar */}
      <nav
        className="fixed top-0.5 left-0 right-0 z-[99] flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: 'rgba(7,13,10,0.88)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-baseline gap-0"
          style={{ textDecoration: 'none' }}
        >
          <span
            className="text-[#f5f0e8] tracking-[0.12em] text-base"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            ADV
          </span>
          <span
            className="text-[#ffd700] tracking-[0.12em] text-base"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            U
          </span>
          <span
            className="text-[#f5f0e8] tracking-[0.12em] text-base"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            MAN
          </span>
        </a>

        {/* Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Proof',        href: '#hormuz' },
            { label: 'Pricing',      href: '#pricing' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-[#e8e4dc] text-xs tracking-wide hover:text-[#ffd700] transition-colors duration-150"
              style={{ fontFamily: "'DM Mono', monospace", textDecoration: 'none' }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button onClick={openCalendly} className="btn-primary text-xs py-2 px-5">
          Book a Call
        </button>
      </nav>
    </>
  );
}
