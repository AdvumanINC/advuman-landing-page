import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { COLORS, FONTS } from '../constants';

function TradeCorridorMap({ onCorridorClick }) {
  const [corridors, setCorridors] = useState([]);
  const [hoveredCorridor, setHoveredCorridor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCorridors();
  }, []);

  const loadCorridors = async () => {
    const { data, error } = await supabase
      .from('corridors')
      .select('*');
    
    if (data) {
      setCorridors(data);
    }
    setLoading(false);
  };

  // Country coordinates (approximate center points)
  const countryCoordinates = {
    'United Kingdom': { x: 48, y: 28 },
    'India': { x: 72, y: 48 },
    'United States': { x: 20, y: 35 },
    'China': { x: 78, y: 38 },
    'Germany': { x: 50, y: 28 },
    'Japan': { x: 85, y: 38 },
    'Australia': { x: 82, y: 70 },
    'Brazil': { x: 32, y: 65 },
    'South Africa': { x: 52, y: 72 },
    'UAE': { x: 60, y: 48 },
    'Singapore': { x: 76, y: 55 },
    'Canada': { x: 18, y: 25 }
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      critical: '#ff3b30',
      high: '#ff9500',
      medium: '#ffc700',
      low: '#00d084',
      normal: COLORS.primary
    };
    return colors[riskLevel] || COLORS.primary;
  };

  const getCorridorRiskLevel = (corridor) => {
    // This would come from your latest briefing data
    // For now, we'll use a placeholder
    return corridor.risk_level || 'normal';
  };

  const drawCurvedPath = (start, end) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 8; // Arc upward
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        Loading map...
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
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f0ede6', marginBottom: 8 }}>
          Global Trade Corridors
        </h3>
        <p style={{ fontSize: 13, color: '#666' }}>
          Click on a corridor to view detailed intelligence
        </p>
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
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1a1c20" strokeWidth="0.2"/>
            </pattern>
          </defs>
          <rect width="100" height="60" fill="url(#grid)" />

          {/* Simplified world map outline */}
          <g opacity="0.3" stroke="#2a2c34" strokeWidth="0.3" fill="none">
            {/* Europe */}
            <path d="M 45 25 L 48 24 L 50 26 L 52 25 L 54 27 L 52 29 L 48 30 L 46 28 Z" />
            {/* Asia */}
            <path d="M 60 30 L 70 28 L 80 32 L 85 35 L 82 42 L 75 45 L 68 43 L 62 38 Z" />
            {/* North America */}
            <path d="M 15 20 L 25 18 L 30 25 L 28 35 L 22 38 L 18 32 L 15 28 Z" />
            {/* South America */}
            <path d="M 28 50 L 32 48 L 35 55 L 33 65 L 30 68 L 28 62 Z" />
            {/* Africa */}
            <path d="M 48 42 L 52 40 L 56 45 L 58 55 L 54 65 L 50 68 L 46 62 L 48 50 Z" />
            {/* Australia */}
            <path d="M 78 62 L 85 60 L 88 65 L 86 72 L 80 74 L 76 70 Z" />
          </g>

          {/* Draw corridor routes */}
          {corridors.map((corridor, idx) => {
            const origin = countryCoordinates[corridor.origin_country];
            const destination = countryCoordinates[corridor.destination_country];
            
            if (!origin || !destination) return null;

            const riskLevel = getCorridorRiskLevel(corridor);
            const color = getRiskColor(riskLevel);
            const isHovered = hoveredCorridor === corridor.id;

            return (
              <g key={corridor.id}>
                {/* Route line */}
                <path
                  d={drawCurvedPath(origin, destination)}
                  stroke={color}
                  strokeWidth={isHovered ? 0.6 : 0.4}
                  fill="none"
                  strokeDasharray={isHovered ? "0" : "2,2"}
                  opacity={isHovered ? 1 : 0.6}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    filter: isHovered ? `drop-shadow(0 0 4px ${color})` : 'none'
                  }}
                  onMouseEnter={() => setHoveredCorridor(corridor.id)}
                  onMouseLeave={() => setHoveredCorridor(null)}
                  onClick={() => onCorridorClick && onCorridorClick(corridor.id)}
                />

                {/* Animated flow dots */}
                {isHovered && (
                  <>
                    <circle r="0.4" fill={color} opacity="0.8">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={drawCurvedPath(origin, destination)}
                      />
                    </circle>
                    <circle r="0.4" fill={color} opacity="0.6">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        begin="1s"
                        path={drawCurvedPath(origin, destination)}
                      />
                    </circle>
                  </>
                )}
              </g>
            );
          })}

          {/* Draw country markers */}
          {corridors.map((corridor) => {
            const origin = countryCoordinates[corridor.origin_country];
            const destination = countryCoordinates[corridor.destination_country];
            
            return (
              <g key={`markers-${corridor.id}`}>
                {origin && (
                  <g>
                    <circle
                      cx={origin.x}
                      cy={origin.y}
                      r="1.2"
                      fill="#07080a"
                      stroke={COLORS.primary}
                      strokeWidth="0.3"
                    />
                    <circle
                      cx={origin.x}
                      cy={origin.y}
                      r="0.5"
                      fill={COLORS.primary}
                    />
                  </g>
                )}
                {destination && (
                  <g>
                    <circle
                      cx={destination.x}
                      cy={destination.y}
                      r="1.2"
                      fill="#07080a"
                      stroke={COLORS.primary}
                      strokeWidth="0.3"
                    />
                    <circle
                      cx={destination.x}
                      cy={destination.y}
                      r="0.5"
                      fill={COLORS.primary}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredCorridor && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(10, 11, 14, 0.95)',
            border: '1px solid #c8a93240',
            borderRadius: 6,
            padding: '12px 16px',
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)',
            zIndex: 10
          }}>
            {corridors.find(c => c.id === hoveredCorridor) && (
              <>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0ede6', marginBottom: 4 }}>
                  {corridors.find(c => c.id === hoveredCorridor).name}
                </div>
                <div style={{ fontSize: 12, color: '#666', fontFamily: FONTS.mono }}>
                  {corridors.find(c => c.id === hoveredCorridor).origin_country} → {corridors.find(c => c.id === hoveredCorridor).destination_country}
                </div>
                <div style={{ fontSize: 11, color: COLORS.primary, marginTop: 6, fontWeight: 600 }}>
                  Click to view details
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        gap: 24, 
        marginTop: 24, 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {[
          { level: 'critical', label: 'Critical Risk' },
          { level: 'high', label: 'High Risk' },
          { level: 'medium', label: 'Medium Risk' },
          { level: 'low', label: 'Low Risk' },
          { level: 'normal', label: 'Normal' }
        ].map(item => (
          <div key={item.level} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 24, 
              height: 3, 
              background: getRiskColor(item.level),
              borderRadius: 2
            }} />
            <span style={{ fontSize: 12, color: '#8a887f', fontFamily: FONTS.mono }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Corridor List */}
      <div style={{ marginTop: 32 }}>
        <div style={{ 
          fontSize: 11, 
          fontFamily: FONTS.mono, 
          color: COLORS.primary, 
          marginBottom: 16, 
          fontWeight: 700,
          letterSpacing: '0.08em'
        }}>
          ACTIVE CORRIDORS
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {corridors.map(corridor => {
            const riskLevel = getCorridorRiskLevel(corridor);
            const color = getRiskColor(riskLevel);
            
            return (
              <div
                key={corridor.id}
                onClick={() => onCorridorClick && onCorridorClick(corridor.id)}
                onMouseEnter={() => setHoveredCorridor(corridor.id)}
                onMouseLeave={() => setHoveredCorridor(null)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  background: hoveredCorridor === corridor.id ? '#12131a' : '#07080a',
                  border: `1px solid ${hoveredCorridor === corridor.id ? color + '40' : '#1a1c20'}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 10px ${color}40`
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f0ede6', marginBottom: 2 }}>
                      {corridor.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', fontFamily: FONTS.mono }}>
                      {corridor.origin_country} → {corridor.destination_country}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: COLORS.primary, fontWeight: 600 }}>
                  View →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TradeCorridorMap;
