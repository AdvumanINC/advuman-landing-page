export default function CorridorStrip() {
  return (
    <div
      style={{
        borderTop:    '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background:   'rgba(255,255,255,0.015)',
        padding:      '0.9rem 2rem',
        display:      'flex',
        alignItems:   'center',
        gap:          '1.5rem',
        flexWrap:     'wrap',
        overflowX:    'auto',
      }}
    >
      {/* UK–India: ACTIVE */}
      <span
        style={{
          display:     'inline-flex',
          alignItems:  'center',
          gap:         '0.5rem',
          fontFamily:  "'DM Mono', monospace",
          fontSize:    '0.72rem',
          letterSpacing:'0.06em',
          color:       '#ff3b3b',
          border:      '1px solid rgba(255,59,59,0.3)',
          padding:     '0.25rem 0.6rem',
          borderRadius:'2px',
          whiteSpace:  'nowrap',
        }}
      >
        <span
          style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: '#ff3b3b',
            boxShadow: '0 0 6px rgba(255,59,59,0.6)',
            display: 'inline-block',
          }}
        />
        UK–India: ACTIVE
      </span>

      {/* UK–Egypt: Coming Soon */}
      <span
        style={{
          display:     'inline-flex',
          alignItems:  'center',
          gap:         '0.5rem',
          fontFamily:  "'DM Mono', monospace",
          fontSize:    '0.72rem',
          letterSpacing:'0.06em',
          color:       'rgba(255,255,255,0.3)',
          border:      '1px solid rgba(255,255,255,0.08)',
          padding:     '0.25rem 0.6rem',
          borderRadius:'2px',
          whiteSpace:  'nowrap',
        }}
      >
        UK–Egypt: Coming Soon
      </span>

      {/* Updated date */}
      <span
        style={{
          fontFamily:  "'Bebas Neue', sans-serif",
          fontSize:    '0.6rem',
          letterSpacing:'0.15em',
          color:       'rgba(255,255,255,0.2)',
          marginLeft:  'auto',
          whiteSpace:  'nowrap',
        }}
      >
        Updated 09 Apr 2026
      </span>
    </div>
  );
}
