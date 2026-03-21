import React, { useState, useEffect } from 'react';
import SeverityBadge from './SeverityBadge';
import Sparkline from './Sparkline';
import Signals from './Signals';
import RiskCheck from './RiskCheck';
import Analytics from './Analytics';
import Alerts from './Alerts';
import CorridorPage from './CorridorPage';
import Settings from './Settings';
import { COLORS, FONTS } from '../constants';
import { getChangeColor, getChangeIcon } from '../utils';
import { supabase } from '../supabaseClient';
import { useAlerts, useIndexData, useSignals } from '../hooks';

function DashboardNew({ onBackToLanding, userData }) {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [corridorView, setCorridorView] = useState(null);
  
  // Fetch data from database
  const { alerts, loading: alertsLoading } = useAlerts(10);
  const { indexData, loading: indexLoading } = useIndexData();
  const { signals, loading: signalsLoading } = useSignals(5);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '◆' },
    { id: 'signals', label: 'Signals', icon: '⚡' },
    { id: 'analytics', label: 'Analytics', icon: '▣' },
    { id: 'alerts', label: 'Alerts', icon: '●' },
    { id: 'briefs', label: 'Briefs', icon: '▤' },
    { id: 'precedents', label: 'Precedents', icon: '▦' },
    { id: 'riskcheck', label: 'Risk Check', icon: '◉' },
    { id: 'opscenter', label: 'Ops Center', icon: '▣' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ];

  const filtered = alerts.filter(a => filterSeverity === 'all' || a.severity === filterSeverity);

  const renderContent = () => {
    if (corridorView) {
      return <CorridorPage corridorId={corridorView} onBack={() => setCorridorView(null)} />;
    }
    
    switch(activeModule) {
      case 'signals': return <Signals />;
      case 'riskcheck': return <RiskCheck />;
      case 'analytics': return <Analytics />;
      case 'alerts': return <Alerts />;
      case 'briefs': return <ComingSoon title="Briefs" desc="Weekly intelligence briefings" />;
      case 'precedents': return <ComingSoon title="Precedents" desc="Historical trade case studies" />;
      case 'opscenter': return <ComingSoon title="Ops Center" desc="Operational command center" />;
      case 'settings': return <Settings userData={userData} />;
      default: return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f0ede6', marginBottom: 8 }}>
          Welcome back{userData?.full_name ? `, ${userData.full_name.split(' ')[0]}` : userData?.fullName ? `, ${userData.fullName.split(' ')[0]}` : ''}
        </h1>
        <p style={{ fontSize: 15, color: '#8a887f' }}>Here's what's happening in the UK-India trade corridor</p>
      </div>

      {!indexLoading && Object.keys(indexData).length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
          {Object.values(indexData).map(idx => (
            <div key={idx.abbrev} style={{ background: 'linear-gradient(135deg, #0e1014 0%, #0f101a 100%)', border: '1px solid #c8a93220', borderRadius: 8, padding: 28, transition: 'all 0.3s', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c8a93240'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#c8a93220'; e.currentTarget.style.transform = 'translateY(0)'; }}>
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
      )}

      {/* Recent Signals */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0ede6' }}>Latest Signals</h2>
          <button 
            onClick={() => setActiveModule('signals')}
            style={{ padding: '8px 16px', background: '#0e1014', border: '1px solid #2a2c34', borderRadius: 6, color: COLORS.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.target.style.borderColor = '#c8a93240'}
            onMouseLeave={(e) => e.target.style.borderColor = '#2a2c34'}
          >
            View All →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {signalsLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>Loading signals...</div>
          ) : signals.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>No signals available</div>
          ) : (
            signals.slice(0, 3).map(signal => (
              <div key={signal.id} style={{ background: '#0a0b0e', border: '1px solid #1a1c20', borderRadius: 8, padding: '20px', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c8a93220'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1a1c20'} onClick={() => setActiveModule('signals')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <SeverityBadge severity={signal.severity} />
                  <span style={{ fontSize: 11, fontFamily: FONTS.mono, color: '#666', fontWeight: 700 }}>{signal.category}</span>
                </div>
                <p style={{ fontSize: 15, color: '#f0ede6', lineHeight: 1.5, marginBottom: 12, fontWeight: 600 }}>{signal.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#666' }}>Impact: <span style={{ color: '#b0ae9f', fontWeight: 600 }}>{signal.impact}</span></span>
                  <span style={{ color: COLORS.primary, fontFamily: FONTS.mono, fontWeight: 700 }}>{signal.location}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0ede6' }}>Recent Alerts</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} style={{ background: '#0e1014', border: '1px solid #2a2c34', color: '#8a887f', padding: '8px 14px', borderRadius: 4, fontSize: 13, fontFamily: FONTS.mono, cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = COLORS.primary} onBlur={(e) => e.target.style.borderColor = '#2a2c34'}>
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button 
              onClick={() => setActiveModule('alerts')}
              style={{ padding: '8px 16px', background: '#0e1014', border: '1px solid #2a2c34', borderRadius: 6, color: COLORS.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.borderColor = '#c8a93240'}
              onMouseLeave={(e) => e.target.style.borderColor = '#2a2c34'}
            >
              View All →
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alertsLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading alerts...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No alerts found</div>
          ) : (
            filtered.slice(0, 5).map(alert => (
              <div key={alert.id} onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)} style={{ background: selectedAlert?.id === alert.id ? '#12131a' : '#0a0b0e', border: `1px solid ${selectedAlert?.id === alert.id ? '#c8a93240' : '#1a1c20'}`, borderRadius: 8, padding: '20px 24px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { if (selectedAlert?.id !== alert.id) e.currentTarget.style.borderColor = '#c8a93220'; }} onMouseLeave={(e) => { if (selectedAlert?.id !== alert.id) e.currentTarget.style.borderColor = '#1a1c20'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <SeverityBadge severity={alert.severity} />
                    <span style={{ fontSize: 12, fontFamily: FONTS.mono, color: '#666', background: '#ffffff08', padding: '4px 12px', borderRadius: 3, fontWeight: 700 }}>{alert.category}</span>
                  </div>
                  <span style={{ fontSize: 13, fontFamily: FONTS.mono, color: '#666', fontWeight: 700 }}>{new Date(alert.date).toLocaleDateString()}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f5f3ee', marginBottom: 10, lineHeight: 1.4 }}>{alert.title}</h3>
                <p style={{ fontSize: 15, color: '#b0ae9f', lineHeight: 1.6 }}>{alert.summary}</p>
                {selectedAlert?.id === alert.id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #1a1c20' }}>
                    <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg, #c8a93208 0%, #c8a93205 100%)', border: '1px solid #c8a93230', borderRadius: 6 }}>
                      <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: COLORS.primary, marginBottom: 8, fontWeight: 700 }}>ASSESSMENT</div>
                      <p style={{ fontSize: 13, color: '#b0ae9f', lineHeight: 1.7 }}>
                        {alert.severity === 'critical' ? 'Immediate action required. Review operations within 5 business days.' : 'Monitor closely and factor into planning.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#07080a', minHeight: '100vh', color: '#e8e6e1', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#0a0b0e', borderBottom: '1px solid #1a1c20', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="logo.jpeg" alt="Advuman" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: '#f0ede6' }}>ADVUMAN</span>
        </div>
        
        <input 
          placeholder="Search alerts, HS codes, sources..." 
          style={{ flex: 1, maxWidth: 500, margin: '0 32px', padding: '10px 18px', background: '#07080a', border: '1px solid #2a2c34', borderRadius: 6, color: '#e8e6e1', fontSize: 14, outline: 'none' }}
          onFocus={(e) => e.target.style.borderColor = COLORS.primary}
          onBlur={(e) => e.target.style.borderColor = '#2a2c34'}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#07080a', borderRadius: 20, fontSize: 11, fontFamily: FONTS.mono, color: COLORS.positive, fontWeight: 600 }}>
            <div style={{ width: 6, height: 6, background: COLORS.positive, borderRadius: '50%', boxShadow: `0 0 8px ${COLORS.positive}` }} />LIVE
          </div>
          <button onClick={onBackToLanding} style={{ padding: '8px 18px', background: '#0e1014', border: '1px solid #2a2c34', borderRadius: 6, color: '#8a887f', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.borderColor = '#c8a93240'} onMouseLeave={(e) => e.target.style.borderColor = '#2a2c34'}>Logout</button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: 240, background: '#0a0b0e', borderRight: '1px solid #1a1c20', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: '#555', letterSpacing: '0.12em', marginBottom: 12, fontWeight: 700 }}>NAVIGATION</div>
          </div>
          
          {menuItems.map(item => (
            <div 
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              style={{ 
                padding: '12px 20px', 
                cursor: 'pointer', 
                background: activeModule === item.id ? '#c8a93215' : 'transparent',
                borderLeft: `3px solid ${activeModule === item.id ? COLORS.primary : 'transparent'}`,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { if (activeModule !== item.id) e.currentTarget.style.background = '#ffffff05'; }}
              onMouseLeave={(e) => { if (activeModule !== item.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: activeModule === item.id ? '#f0ede6' : '#8a887f', fontWeight: activeModule === item.id ? 600 : 500 }}>{item.label}</span>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 'auto', padding: '20px' }}>
            <div style={{ padding: '16px', background: '#07080a', borderRadius: 6, border: '1px solid #1a1c20' }}>
              <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: '#666', marginBottom: 8, fontWeight: 600 }}>TRIAL STATUS</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#f0ede6', fontFamily: FONTS.mono, marginBottom: 4 }}>12</div>
              <div style={{ fontSize: 12, color: '#8a887f' }}>days remaining</div>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, background: '#08090b', overflowY: 'auto' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function ComingSoon({ title, desc }) {
  return (
    <div style={{ padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 64, marginBottom: 24, color: '#c8a932' }}>▣</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f0ede6', marginBottom: 12 }}>{title}</h2>
        <p style={{ fontSize: 15, color: '#8a887f', lineHeight: 1.7 }}>{desc} - Coming soon</p>
      </div>
    </div>
  );
}

export default DashboardNew;
