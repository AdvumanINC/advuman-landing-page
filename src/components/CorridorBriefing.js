import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { COLORS, FONTS } from '../constants';
import Sparkline from './Sparkline';

function CorridorBriefing({ corridorId }) {
  const [briefing, setBriefing] = useState(null);
  const [events, setEvents] = useState([]);
  const [signalHistory, setSignalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBriefingData();
    
    const channel = supabase
      .channel('corridor_briefing_updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'corridor_briefings', filter: `corridor_id=eq.${corridorId}` },
        () => loadBriefingData()
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'corridor_signal_snapshots', filter: `corridor_id=eq.${corridorId}` },
        () => loadBriefingData()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [corridorId]);

  const loadBriefingData = async () => {
    setLoading(true);
    
    const [briefingRes, eventsRes, signalsRes] = await Promise.all([
      supabase.from('corridor_briefings')
        .select('*')
        .eq('corridor_id', corridorId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single(),
      
      supabase.from('corridor_events')
        .select('*')
        .eq('corridor_id', corridorId)
        .order('event_date', { ascending: false })
        .limit(5),
      
      supabase.from('corridor_signal_snapshots')
        .select('*')
        .eq('corridor_id', corridorId)
        .order('snapshot_date', { ascending: false })
        .limit(12)
    ]);

    if (briefingRes.data) setBriefing(briefingRes.data);
    if (eventsRes.data) setEvents(eventsRes.data);
    if (signalsRes.data) setSignalHistory(signalsRes.data.reverse());
    
    setLoading(false);
  };

  const getRiskColor = (level) => {
    const colors = { critical: '#ff3b30', high: '#ff9500', medium: '#ffc700', low: '#00d084' };
    return colors[level] || '#666';
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        Loading intelligence briefing...
      </div>
    );
  }

  if (!briefing) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        No briefing data available
      </div>
    );
  }

  const rpiHistory = signalHistory.map(s => s.rpi_value);
  const lsiHistory = signalHistory.map(s => s.lsi_value);
  const cpiHistory = signalHistory.map(s => s.cpi_value);

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f0ede6', margin: 0 }}>
            Corridor Intelligence Briefing
          </h1>
          <div style={{
            padding: '6px 16px',
            background: getRiskColor(briefing.risk_level) + '20',
            border: `1px solid ${getRiskColor(briefing.risk_level)}40`,
            borderRadius: 4,
            fontSize: 12,
            fontFamily: FONTS.mono,
            color: getRiskColor(briefing.risk_level),
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            {briefing.risk_level}
          </div>
        </div>
        <div style={{ fontSize: 13, fontFamily: FONTS.mono, color: '#666' }}>
          Generated {new Date(briefing.generated_at).toLocaleString('en-GB', { 
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
          })}
        </div>
      </div>

      <div style={{ 
        background: '#0a0b0e', 
        border: '1px solid #1a1c20', 
        borderRadius: 8, 
        padding: '32px 36px',
        marginBottom: 24
      }}>
        <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: COLORS.primary, marginBottom: 16, fontWeight: 700, letterSpacing: '0.08em' }}>
          SITUATION SUMMARY
        </div>
        <p style={{ fontSize: 16, color: '#e8e6e1', lineHeight: 1.8, margin: 0 }}>
          {briefing.summary_text}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'RPI', value: briefing.rpi_value, history: rpiHistory, desc: 'Regulatory Pressure' },
          { label: 'LSI', value: briefing.lsi_value, history: lsiHistory, desc: 'Logistics Strain' },
          { label: 'CPI', value: briefing.cpi_value, history: cpiHistory, desc: 'Compliance Pressure' }
        ].map(index => (
          <div key={index.label} style={{ 
            background: '#0a0b0e', 
            border: '1px solid #1a1c20', 
            borderRadius: 8, 
            padding: '24px 28px' 
          }}>
            <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: '#666', marginBottom: 8, letterSpacing: '0.08em' }}>
              {index.desc}
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#f0ede6', fontFamily: FONTS.mono, marginBottom: 12 }}>
              {index.value.toFixed(1)}
            </div>
            <Sparkline data={index.history} color={COLORS.primary} width="100%" height={32} />
          </div>
        ))}
      </div>

      {events.length > 0 && (
        <div style={{ 
          background: '#0a0b0e', 
          border: '1px solid #1a1c20', 
          borderRadius: 8, 
          padding: '32px 36px' 
        }}>
          <div style={{ fontSize: 11, fontFamily: FONTS.mono, color: COLORS.primary, marginBottom: 20, fontWeight: 700, letterSpacing: '0.08em' }}>
            RECENT EVENTS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {events.map((event, idx) => (
              <div key={event.id} style={{ 
                display: 'flex', 
                gap: 20,
                paddingBottom: idx < events.length - 1 ? 16 : 0,
                borderBottom: idx < events.length - 1 ? '1px solid #1a1c20' : 'none'
              }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: getRiskColor(event.severity),
                  marginTop: 6,
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 15, color: '#f0ede6', fontWeight: 600 }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize: 12, fontFamily: FONTS.mono, color: '#666', whiteSpace: 'nowrap', marginLeft: 16 }}>
                      {new Date(event.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: '#8a887f', lineHeight: 1.6 }}>
                    {event.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CorridorBriefing;
