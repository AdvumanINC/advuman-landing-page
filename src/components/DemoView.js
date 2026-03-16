import React from 'react';
import { COLORS, FONTS } from '../constants';
import SeverityBadge from './SeverityBadge';
import Sparkline from './Sparkline';
import WorldTradeMap from './WorldTradeMap';
import { getChangeColor, getChangeIcon } from '../utils';
import { useAlerts, useIndexData } from '../hooks';

function DemoView({ onBack }) {
  const { alerts, loading: alertsLoading } = useAlerts(5);
  const { indexData, loading: indexLoading } = useIndexData();
  return (
    <div style={{ background: '#07080a', minHeight: '100vh', color: '#e8e6e1' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#0a0b0e', borderBottom: '1px solid #1a1c20', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="logo.jpeg" alt="Advuman" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: '#f0ede6' }}>ADVUMAN</span>
          <span style={{ fontSize: 11, color: '#666', fontFamily: FONTS.mono, marginLeft: 8, fontWeight: 600 }}>DEMO</span>
        </div>
        
        <button 
          onClick={onBack}
          style={{ padding: '8px 18px', background: '#0e1014', border: '1px solid #2a2c34', borderRadius: 6, color: '#8a887f', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.target.style.borderColor = '#c8a93240'}
          onMouseLeave={(e) => e.target.style.borderColor = '#2a2c34'}
        >
          ← Back to Home
        </button>
      </nav>

      <div style={{ padding: '32px 40px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f0ede6', marginBottom: 8 }}>
            UK-India Trade Intelligence Demo
          </h1>
          <p style={{ fontSize: 15, color: '#8a887f' }}>Preview of real-time trade corridor monitoring</p>
        </div>

        {/* World Trade Map */}
        <div style={{ marginBottom: 32 }}>
          <WorldTradeMap onCorridorClick={() => {}} />
        </div>

        {!indexLoading && Object.keys(indexData).length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
            {Object.values(indexData).map(idx => (
              <div key={idx.abbrev} style={{ background: 'linear-gradient(135deg, #0e1014 0%, #0f101a 100%)', border: '1px solid #c8a93220', borderRadius: 8, padding: 28, transition: 'all 0.3s', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, fontFamily: FONTS.mono, color: '#666', letterSpacing: '0.08em', marginBottom: 6, fontWeight: 600 }}>{idx.abbrev}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#b0ae9f' }}>{idx.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 36, fontWeight: 800, fontFamily: FONTS.mono, color: '#f0ede6' }}>{idx.value.toFixed(1)}</div>
                    <div style={{ fontSize: 12, fontFamily: FONTS.mono, color: getChangeColor(idx.change), fontWeight: 700, marginTop: 4 }}>{getChangeIcon(idx.change)} {Math.abs(idx.change).toFixed(1)}</div>
                  </div>
                </div>
                {idx.history.length > 0 && <Sparkline data={idx.history} color={getChangeColor(idx.change)} width="100%" height={40} />}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666', marginBottom: 32 }}>Loading indexes...</div>
        )}

        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0ede6', marginBottom: 16 }}>Recent Alerts</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alertsLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No alerts available</div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} style={{ background: '#0a0b0e', border: '1px solid #1a1c20', borderRadius: 8, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <SeverityBadge severity={alert.severity} />
                    <span style={{ fontSize: 12, fontFamily: FONTS.mono, color: '#666', background: '#ffffff08', padding: '4px 12px', borderRadius: 3, fontWeight: 700 }}>{alert.category}</span>
                  </div>
                  <span style={{ fontSize: 13, fontFamily: FONTS.mono, color: '#666', fontWeight: 700 }}>{new Date(alert.date).toLocaleDateString()}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f5f3ee', marginBottom: 10, lineHeight: 1.4 }}>{alert.title}</h3>
                <p style={{ fontSize: 15, color: '#b0ae9f', lineHeight: 1.6 }}>{alert.summary}</p>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: 40, padding: '32px', background: 'linear-gradient(135deg, #c8a93208 0%, #c8a93205 100%)', border: '1px solid #c8a93230', borderRadius: 8, textAlign: 'center' }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: '#f0ede6', marginBottom: 12 }}>
            Want full access?
          </h3>
          <p style={{ fontSize: 15, color: '#8a887f', marginBottom: 24 }}>
            Start your 14-day free trial to unlock all features, real-time alerts, and personalized intelligence.
          </p>
          <button 
            onClick={onBack}
            style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #c8a932 0%, #d4b744 100%)', color: '#07080a', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}

export default DemoView;
