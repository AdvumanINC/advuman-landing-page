import React, { useState } from 'react';
import SeverityBadge from './SeverityBadge';
import { COLORS, FONTS } from '../constants';
import { useSignals } from '../hooks';

function Signals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedSignal, setSelectedSignal] = useState(null);
  
  const { signals, loading } = useSignals();

  const filtered = signals.filter(s => {
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    if (searchTerm && !s.description.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !s.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(s.hs_code && s.hs_code.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    return true;
  });

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f0ede6', marginBottom: 8 }}>Signals</h1>
        <p style={{ fontSize: 15, color: '#8a887f' }}>Real-time trade intelligence updates from official sources</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input 
          placeholder="Search by HS code, location, or keyword..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '12px 18px', background: '#0e1014', border: '1px solid #2a2c34', borderRadius: 6, color: '#e8e6e1', fontSize: 14, outline: 'none' }}
          onFocus={(e) => e.target.style.borderColor = COLORS.primary}
          onBlur={(e) => e.target.style.borderColor = '#2a2c34'}
        />
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '12px 18px', background: '#0e1014', border: '1px solid #2a2c34', borderRadius: 6, color: '#8a887f', fontSize: 14, fontFamily: FONTS.mono, cursor: 'pointer' }}
          onFocus={(e) => e.target.style.borderColor = COLORS.primary}
          onBlur={(e) => e.target.style.borderColor = '#2a2c34'}
        >
          <option value="all">All Categories</option>
          <option value="Logistics">Logistics</option>
          <option value="Regulatory">Regulatory</option>
          <option value="Market">Market</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading signals...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No signals found</div>
        ) : (
          filtered.map(signal => (
            <div 
              key={signal.id}
              onClick={() => setSelectedSignal(selectedSignal?.id === signal.id ? null : signal)}
              style={{ 
                background: selectedSignal?.id === signal.id ? '#12131a' : '#0a0b0e', 
                border: `1px solid ${selectedSignal?.id === signal.id ? '#c8a93240' : '#1a1c20'}`, 
                borderRadius: 8, 
                padding: '24px 28px', 
                cursor: 'pointer', 
                transition: 'all 0.2s' 
              }}
              onMouseEnter={(e) => { if (selectedSignal?.id !== signal.id) e.currentTarget.style.borderColor = '#c8a93220'; }}
              onMouseLeave={(e) => { if (selectedSignal?.id !== signal.id) e.currentTarget.style.borderColor = '#1a1c20'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <SeverityBadge severity={signal.severity} />
                  <span style={{ fontSize: 12, fontFamily: FONTS.mono, color: '#666', background: '#ffffff08', padding: '4px 12px', borderRadius: 3, fontWeight: 700 }}>{signal.category}</span>
                </div>
                <span style={{ fontSize: 13, fontFamily: FONTS.mono, color: '#c8a932', fontWeight: 700 }}>{signal.location}</span>
              </div>

              <p style={{ fontSize: 17, color: '#f0ede6', marginBottom: 12, lineHeight: 1.5, fontWeight: 600 }}>{signal.description}</p>

              <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
                <div><span style={{ color: '#666' }}>Confidence:</span> <span style={{ color: '#b0ae9f', fontWeight: 600 }}>{signal.confidence}</span></div>
                <div><span style={{ color: '#666' }}>Impact:</span> <span style={{ color: '#b0ae9f', fontWeight: 600 }}>{signal.impact}</span></div>
                <div><span style={{ color: '#666' }}>HS Code:</span> <span style={{ color: '#c8a932', fontFamily: FONTS.mono, fontWeight: 700 }}>{signal.hs_code || 'N/A'}</span></div>
              </div>

              {selectedSignal?.id === signal.id && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #1a1c20' }}>
                  <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #c8a93208 0%, #c8a93205 100%)', border: '1px solid #c8a93230', borderRadius: 6 }}>
                    <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: COLORS.primary, marginBottom: 8, fontWeight: 700, letterSpacing: '0.08em' }}>ANALYST NOTE</div>
                    <p style={{ fontSize: 14, color: '#b0ae9f', lineHeight: 1.7 }}>{signal.analyst_note}</p>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
                    Source: <span style={{ color: '#8a887f' }}>{signal.source}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Signals;
