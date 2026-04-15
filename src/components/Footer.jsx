export default function Footer() {
  return (
    <footer
      style={{
        borderTop:  '1px solid rgba(255,255,255,0.06)',
        padding:    '3rem 2rem',
        maxWidth:   '1100px',
        margin:     '0 auto',
      }}
    >
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'flex-start',
        flexWrap:       'wrap',
        gap:            '2rem',
        marginBottom:   '2.5rem',
      }}>
        {/* Brand */}
        <div>
          <p style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      '1.1rem',
            letterSpacing: '0.12em',
            color:         '#f5f0e8',
            marginBottom:  '0.5rem',
          }}>
            ADVUMAN
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize:   '0.82rem',
            color:      'rgba(232,228,220,0.35)',
            maxWidth:   '280px',
            lineHeight: 1.55,
          }}>
            Trade risk intelligence for UK companies on the UK–India corridor.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Proof',        href: '#hormuz' },
              { label: 'Pricing',      href: '#pricing' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                style={{
                  fontFamily:  "'Inter', sans-serif",
                  fontSize:    '0.82rem',
                  color:       'rgba(232,228,220,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = '#ffd700'}
                onMouseLeave={e => e.target.style.color = 'rgba(232,228,220,0.4)'}
              >
                {label}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'hello@advuman.com', href: 'mailto:hello@advuman.com' },
              { label: 'LinkedIn',          href: 'https://linkedin.com' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{
                  fontFamily:  "'Inter', sans-serif",
                  fontSize:    '0.82rem',
                  color:       'rgba(232,228,220,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = '#ffd700'}
                onMouseLeave={e => e.target.style.color = 'rgba(232,228,220,0.4)'}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        flexWrap:       'wrap',
        gap:            '0.75rem',
        borderTop:      '1px solid rgba(255,255,255,0.05)',
        paddingTop:     '1.5rem',
      }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize:   '0.68rem',
          color:      'rgba(255,255,255,0.2)',
          letterSpacing: '0.04em',
        }}>
          © 2026 Advuman Ltd · Launch corridor: UK–India
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms',         href: '/terms' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize:   '0.68rem',
                color:      'rgba(255,255,255,0.2)',
                textDecoration: 'none',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
