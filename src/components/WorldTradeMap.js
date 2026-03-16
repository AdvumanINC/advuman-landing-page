import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { COLORS, FONTS } from '../constants';

function WorldTradeMap({ onCorridorClick }) {
  const [corridors, setCorridors] = useState([]);
  const [briefings, setBriefings] = useState({});
  const [hoveredCorridor, setHoveredCorridor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMapData();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('map_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'corridors' },
        () => loadMapData()
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'corridor_briefings' },
        () => loadMapData()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const loadMapData = async () => {
    // Load corridors
    const { data: corridorData } = await supabase
      .from('corridors')
      .select('*');
    
    if (corridorData) {
      setCorridors(corridorData);
      
      // Load latest briefing for each corridor
      const briefingPromises = corridorData.map(corridor =>
        supabase
          .from('corridor_briefings')
          .select('risk_level, rpi_value, lsi_value, cpi_value')
          .eq('corridor_id', corridor.id)
          .order('generated_at', { ascending: false })
          .limit(1)
          .single()
      );
      
      const briefingResults = await Promise.all(briefingPromises);
      const briefingMap = {};
      
      corridorData.forEach((corridor, idx) => {
        if (briefingResults[idx].data) {
          briefingMap[corridor.id] = briefingResults[idx].data;
        }
      });
      
      setBriefings(briefingMap);
    }
    
    setLoading(false);
  };

  // Country coordinates (percentage-based positioning)
  const countryCoordinates = {
    'United Kingdom': { x: 48, y: 28, label: 'UK' },
    'India': { x: 72, y: 48, label: 'IN' },
    'United States': { x: 20, y: 35, label: 'US' },
    'China': { x: 78, y: 38, label: 'CN' },
    'Germany': { x: 50, y: 28, label: 'DE' },
    'Japan': { x: 85, y: 38, label: 'JP' },
    'Australia': { x: 82, y: 70, label: 'AU' },
    'Brazil': { x: 32, y: 65, label: 'BR' },
    'South Africa': { x: 52, y: 72, label: 'ZA' },
    'UAE': { x: 60, y: 48, label: 'AE' },
    'Singapore': { x: 76, y: 55, label: 'SG' },
    'Canada': { x: 18, y: 25, label: 'CA' },
    'France': { x: 49, y: 30, label: 'FR' },
    'Italy': { x: 51, y: 32, label: 'IT' },
    'Spain': { x: 47, y: 32, label: 'ES' },
    'Netherlands': { x: 49, y: 27, label: 'NL' }
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      critical: '#ff3b30',
      high: '#ff9500',
      medium: '#ffc700',
      low: '#00d084',
      normal: COLORS.primary
    };
    return colors[riskLevel?.toLowerCase()] || COLORS.primary;
  };

  const getCorridorRiskLevel = (corridorId) => {
    return briefings[corridorId]?.risk_level || 'normal';
  };

  const drawCurvedPath = (start, end) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate control point for curve
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    
    // Curve upward for better visibility
    const curveOffset = distance * 0.15;
    const controlX = midX;
    const controlY = midY - curveOffset;
    
    return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#666',
        background: '#0a0b0e',
        border: '1px solid #1a1c20',
        borderRadius: 8
      }}>
        Loading world map...
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#0a0b0e', 
      border: '1px solid #1a1c20', 
      borderRadius: 8, 
      padding: '32px',
      position: 'relative'
    }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0ede6', marginBottom: 4 }}>
              Global Trade Corridors
            </h3>
            <p style={{ fontSize: 13, color: '#666' }}>
              Real-time risk assessment across {corridors.length} active trade routes
            </p>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '6px 12px', 
            background: '#07080a', 
            borderRadius: 20, 
            fontSize: 11, 
            fontFamily: FONTS.mono, 
            color: COLORS.positive, 
            fontWeight: 600 
          }}>
            <div style={{ 
              width: 6, 
              height: 6, 
              background: COLORS.positive, 
              borderRadius: '50%', 
              boxShadow: `0 0 8px ${COLORS.positive}` 
            }} />
            LIVE
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        paddingBottom: '50%',
        background: 'linear-gradient(180deg, #07080a 0%, #0e1014 100%)',
        borderRadius: 8,
        border: '1px solid #1a1c20',
        overflow: 'hidden'
      }}>
        <svg 
          viewBox="0 0 100 60" 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%',
            top: 0,
            left: 0
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1a1c20" strokeWidth="0.1"/>
            </pattern>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a0b0e" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#07080a" stopOpacity="0.8"/>
            </linearGradient>
          </defs>
          <rect width="100" height="60" fill="url(#grid)" />

          {/* Simplified continents */}
          <g opacity="0.15" fill="#2a2c34" stroke="#3a3c44" strokeWidth="0.2">
            {/* North America */}
            <path d="M 10 18 L 15 15 L 22 16 L 28 20 L 30 28 L 28 35 L 22 38 L 18 36 L 15 32 L 12 28 L 10 22 Z" />
            {/* South America */}
            <path d="M 26 48 L 30 46 L 34 50 L 36 58 L 34 66 L 30 68 L 26 64 L 24 56 L 26 50 Z" />
            {/* Europe */}
            <path d="M 44 22 L 48 20 L 52 22 L 54 26 L 52 30 L 48 32 L 44 30 L 42 26 Z" />
            {/* Africa */}
            <path d="M 46 38 L 50 36 L 56 40 L 58 48 L 56 58 L 52 66 L 48 68 L 44 62 L 44 50 L 46 42 Z" />
            {/* Asia */}
            <path d="M 58 24 L 68 22 L 78 26 L 84 32 L 86 38 L 82 44 L 74 46 L 66 44 L 60 38 L 58 30 Z" />
            {/* Australia */}
            <path d="M 76 60 L 82 58 L 88 62 L 88 68 L 84 72 L 78 72 L 74 68 L 76 64 Z" />
          </g>

          {/* Draw corridor routes */}
          {corridors.map((corridor) => {
            const origin = countryCoordinates[corridor.origin_country];
            const destination = countryCoordinates[corridor.destination_country];
            
            if (!origin || !destination) return null;

            const riskLevel = getCorridorRiskLevel(corridor.id);
            const color = getRiskColor(riskLevel);
            const isHovered = hoveredCorridor === corridor.id;

            return (
              <g key={corridor.id}>
                {/* Glow effect for hovered route */}
                {isHovered && (
                  <path
                    d={drawCurvedPath(origin, destination)}
                    stroke={color}
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.3"
                    filter={`blur(2px)`}
                  />
                )}
                
                {/* Main route line */}
                <path
                  d={drawCurvedPath(origin, destination)}
                  stroke={color}
                  strokeWidth={isHovered ? 0.8 : 0.5}
                  fill="none"
                  strokeDasharray={isHovered ? "0" : "3,2"}
                  opacity={isHovered ? 1 : 0.7}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={() => setHoveredCorridor(corridor.id)}
                  onMouseLeave={() => setHoveredCorridor(null)}
                  onClick={() => onCorridorClick && onCorridorClick(corridor.id)}
                />

                {/* Animated flow particles */}
                {isHovered && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <circle key={i} r="0.5" fill={color} opacity="0.8">
                        <animateMotion
                          dur="4s"
                          repeatCount="indefinite"
                          begin={`${i * 1.3}s`}
                          path={drawCurvedPath(origin, destination)}
                        />
                      </circle>
                    ))}
                  </>
                )}
              </g>
            );
          })}

          {/* Draw country markers */}
          {Object.entries(countryCoordinates).map(([country, coords]) => {
            const hasCorridors = corridors.some(
              c => c.origin_country === country || c.destination_country === country
            );
            
            if (!hasCorridors) return null;

            return (
              <g key={country}>
                {/* Outer ring */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="1.5"
                  fill="none"
                  stroke={COLORS.primary}
                  strokeWidth="0.2"
                  opacity="0.5"
                />
                {/* Inner dot */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="0.8"
                  fill={COLORS.primary}
                  opacity="0.9"
                />
                {/* Pulse animation */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="0.8"
                  fill="none"
                  stroke={COLORS.primary}
                  strokeWidth="0.3"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    from="0.8"
                    to="2"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Country label */}
                <text
                  x={coords.x}
                  y={coords.y - 2.5}
                  fontSize="1.5"
                  fill="#8a887f"
                  textAnchor="middle"
                  fontFamily={FONTS.mono}
                  fontWeight="600"
                >
                  {coords.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredCorridor && corridors.find(c => c.id === hoveredCorridor) && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(10, 11, 14, 0.98)',
            border: `1px solid ${getRiskColor(getCorridorRiskLevel(hoveredCorridor))}60`,
            borderRadius: 8,
            padding: '16px 20px',
            pointerEvents: 'none',
            backdropFilter: 'blur(12px)',
            zIndex: 10,
            minWidth: 240,
            boxShadow: `0 8px 32px ${getRiskColor(getCorridorRiskLevel(hoveredCorridor))}20`
          }}>
            {(() => {
              const corridor = corridors.find(c => c.id === hoveredCorridor);
              const briefing = briefings[hoveredCorridor];
              const riskLevel = getCorridorRiskLevel(hoveredCorridor);
              const color = getRiskColor(riskLevel);
              
              return (
                <>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f0ede6', marginBottom: 6 }}>
                    {corridor.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', fontFamily: FONTS.mono, marginBottom: 12 }}>
                    {corridor.origin_country} → {corridor.destination_country}
                  </div>
                  
                  {briefing && (
                    <>
                      <div style={{ 
                        display: 'inline-block',
                        padding: '4px 10px',
                        background: color + '20',
                        border: `1px solid ${color}40`,
                        borderRadius: 4,
                        fontSize: 10,
                        fontFamily: FONTS.mono,
                        color: color,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginBottom: 12
                      }}>
                        {riskLevel} Risk
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                        {[
                          { label: 'RPI', value: briefing.rpi_value },
                          { label: 'LSI', value: briefing.lsi_value },
                          { label: 'CPI', value: briefing.cpi_value }
                        ].map(idx => (
                          <div key={idx.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: '#666', fontFamily: FONTS.mono, marginBottom: 2 }}>
                              {idx.label}
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: color, fontFamily: FONTS.mono }}>
                              {idx.value.toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  <div style={{ fontSize: 11, color: COLORS.primary, marginTop: 8, fontWeight: 600, textAlign: 'center' }}>
                    Click to view full briefing
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        gap: 20, 
        marginTop: 24, 
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '16px',
        background: '#07080a',
        borderRadius: 6,
        border: '1px solid #1a1c20'
      }}>
        {[
          { level: 'critical', label: 'Critical Risk', icon: '●' },
          { level: 'high', label: 'High Risk', icon: '●' },
          { level: 'medium', label: 'Medium Risk', icon: '●' },
          { level: 'low', label: 'Low Risk', icon: '●' },
          { level: 'normal', label: 'Normal', icon: '●' }
        ].map(item => (
          <div key={item.level} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: getRiskColor(item.level), fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 12, color: '#8a887f', fontWeight: 500 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Corridor Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16, 
        marginTop: 24 
      }}>
        {[
          { label: 'Total Corridors', value: corridors.length, color: COLORS.primary },
          { 
            label: 'Critical Risk', 
            value: Object.values(briefings).filter(b => b.risk_level === 'critical').length,
            color: '#ff3b30'
          },
          { 
            label: 'High Risk', 
            value: Object.values(briefings).filter(b => b.risk_level === 'high').length,
            color: '#ff9500'
          },
          { 
            label: 'Monitored', 
            value: Object.keys(briefings).length,
            color: COLORS.positive
          }
        ].map((stat, idx) => (
          <div key={idx} style={{ 
            background: '#07080a', 
            border: '1px solid #1a1c20', 
            borderRadius: 6, 
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 11, color: '#666', marginBottom: 8, fontFamily: FONTS.mono }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, fontFamily: FONTS.mono }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorldTradeMap;
