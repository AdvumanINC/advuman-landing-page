import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { COLORS, FONTS } from '../constants';
import CorridorBriefing from './CorridorBriefing';
import Sparkline from './Sparkline';

function CorridorPage({ corridorId, onBack }) {
  const [corridor, setCorridor] = useState(null);
  const [signalHistory, setSignalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCorridorData();
  }, [corridorId]);

  const loadCorridorData = async () => {
    const [corridorRes, signalsRes] = await Promise.all([
      supabase.from('corridors').select('*').eq('id', corridorId).single(),
      supabase.from('corridor_signal_snapshots')
        .select('*')
        .eq('corridor_id', corridorId)
        .order('snapshot_date', { ascending: false })
        .limit(30)
    ]);

    if (corridorRes.data) setCorridor(corridorRes.data);
    if (signalsRes.data) setSignalHistory(signalsRes.data.reverse());
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        Loading corridor data...
      </div>
    );
  }

  if (!corridor) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        Corridor not found
      </div>
    );
  }

  const rpiHistory = signalHistory.map(s => s.rpi_value);
  const lsiHistory = signalHistory.map(s => s.lsi_value);
  const cpiHistory = signalHistory.map(s => s.cpi_value);

  return (
    <div style={{ minHeight: '100vh', background: '#07080a' }}>
      <div style={{ 
        background: '#0a0b0e', 
        borderBottom: '1px solid #1a1c20',
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f0ede6', margin: 0, marginBottom: 6 }}>
            {corridor.name} Trade Corridor
          </h1>
          <div style={{ fontSize: 14, color: '#666' }}>
            {corridor.origin_country} → {corridor.destination_country}
          </div>
        </div>
        <button
          onClick={onBack}
          style={{
            padding: '10px 24px',
            background: '#0e1014',
            border: '1px solid #2a2c34',
            borderRadius: 6,
            color: '#8a887f',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.borderColor = COLORS.primary}
          onMouseLeave={(e) => e.target.style.borderColor = '#2a2c34'}
        >
          ← Back to Dashboard
        </button>
      </div>

      <CorridorBriefing corridorId={corridorId} />

      {signalHistory.length > 0 && (
        <div style={{ padding: '0 40px 40px' }}>
          <div style={{ 
            background: '#0a0b0e', 
            border: '1px solid #1a1c20', 
            borderRadius: 8, 
            padding: '32px 36px' 
          }}>
            <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: COLORS.primary, marginBottom: 24, fontWeight: 700, letterSpacing: '0.08em' }}>
              SIGNAL TREND ANALYSIS
            </div>
            
            <div style={{ display: 'grid', gap: 32 }}>
              {[
                { label: 'Regulatory Pressure Index', key: 'rpi', data: rpiHistory, color: '#ff6b6b' },
                { label: 'Logistics Strain Index', key: 'lsi', data: lsiHistory, color: '#ffb347' },
                { label: 'Compliance Pressure Index', key: 'cpi', data: cpiHistory, color: COLORS.primary }
              ].map(chart => (
                <div key={chart.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 15, color: '#f0ede6', fontWeight: 600 }}>
                      {chart.label}
                    </div>
                    <div style={{ fontSize: 24, fontFamily: FONTS.mono, fontWeight: 800, color: chart.color }}>
                      {chart.data[chart.data.length - 1]?.toFixed(1)}
                    </div>
                  </div>
                  <Sparkline data={chart.data} color={chart.color} width="100%" height={60} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CorridorPage;
