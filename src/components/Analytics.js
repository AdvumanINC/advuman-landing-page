import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { COLORS, FONTS } from '../constants';

function Analytics() {
  const [disruptionData, setDisruptionData] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [sourceCoverage, setSourceCoverage] = useState([]);

  useEffect(() => {
    fetchData();
    const channel = subscribeRealtime();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    const { data: disruptions } = await supabase
      .from('disruptions')
      .select('*');

    const { data: risks } = await supabase
      .from('risks')
      .select('*');

    const { data: sources } = await supabase
      .from('sources')
      .select('*');

    setDisruptionData(disruptions || []);
    setRiskDistribution(risks || []);
    setSourceCoverage(sources || []);
  };

  const subscribeRealtime = () => {
    const channel = supabase
      .channel('analytics-live')

      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'disruptions' },
        () => fetchData()
      )

      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'risks' },
        () => fetchData()
      )

      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sources' },
        () => fetchData()
      )

      .subscribe();

    return channel;
  };

  const maxDisruption = Math.max(
    ...disruptionData.map(d => d.count || 0),
    1
  );

  const totalRisk = riskDistribution.reduce(
    (sum, r) => sum + (r.count || 0),
    0
  );

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f0ede6', marginBottom: 8 }}>
          Analytics
        </h1>
        <p style={{ fontSize: 15, color: '#8a887f' }}>
          Trade intelligence metrics and trends
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        
        {/* Disruptions Chart */}
        <div style={{ background: '#0a0b0e', border: '1px solid #1a1c20', borderRadius: 8, padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0ede6', marginBottom: 24 }}>
            Trade Disruptions Over Time
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 240 }}>
            {disruptionData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                
                <div style={{ width: '100%', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      background: 'linear-gradient(180deg, #c8a932 0%, #d4b744 100%)',
                      borderRadius: '4px 4px 0 0',
                      height: `${(d.count / maxDisruption) * 100}%`,
                      position: 'relative'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: -24,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#f0ede6',
                      fontFamily: FONTS.mono
                    }}>
                      {d.count}
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: 12, color: '#666', fontFamily: FONTS.mono }}>
                  {d.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution */}
        <div style={{ background: '#0a0b0e', border: '1px solid #1a1c20', borderRadius: 8, padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0ede6', marginBottom: 24 }}>
            Risk Distribution
          </h3>

          {riskDistribution.map((r, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#b0ae9f' }}>{r.category}</span>
                <span style={{ color: '#f0ede6' }}>{r.count}</span>
              </div>

              <div style={{ width: '100%', height: 8, background: '#07080a' }}>
                <div
                  style={{
                    width: `${(r.count / totalRisk) * 100}%`,
                    height: '100%',
                    background: r.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Coverage */}
      <div style={{ background: '#0a0b0e', border: '1px solid #1a1c20', borderRadius: 8, padding: 32 }}>
        <h3 style={{ color: '#f0ede6', marginBottom: 24 }}>
          Source Monitoring Coverage
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {sourceCoverage.map((s, i) => (
            <div key={i} style={{ padding: 20, background: '#07080a' }}>
              <div style={{ color: '#b0ae9f' }}>{s.source}</div>
              <div style={{ fontSize: 28, color: '#f0ede6' }}>
                {s.alerts}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;