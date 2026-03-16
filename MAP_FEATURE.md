# World Trade Corridor Map

## Overview

Interactive world map visualization showing all active trade corridors with real-time risk assessment and color-coded routes based on database intelligence.

## Features

### 🗺️ Interactive Map
- **SVG-based world map** with simplified continent outlines
- **Curved route visualization** between origin and destination countries
- **Animated flow particles** on hover showing trade direction
- **Pulsing country markers** for active trade hubs
- **Grid background** for professional appearance

### 🎨 Color-Coded Risk Levels
Routes are color-coded based on latest corridor briefing data:

| Risk Level | Color | Hex Code |
|------------|-------|----------|
| Critical | Red | #ff3b30 |
| High | Orange | #ff9500 |
| Medium | Yellow | #ffc700 |
| Low | Green | #00d084 |
| Normal | Gold | #c8a932 |

### 📊 Real-Time Data Integration
- Fetches corridors from `corridors` table
- Loads latest risk assessment from `corridor_briefings` table
- Displays RPI, LSI, CPI values in hover tooltip
- Auto-updates via Supabase real-time subscriptions

### 🎯 Interactive Elements

#### Hover Effects
- Route highlights with glow effect
- Animated particles flowing along route
- Detailed tooltip showing:
  - Corridor name
  - Origin → Destination
  - Risk level badge
  - RPI, LSI, CPI values
  - "Click to view full briefing" CTA

#### Click Actions
- Click on route → Navigate to corridor detail page
- Click on corridor in list → Navigate to corridor detail page

### 📍 Supported Countries

Currently configured coordinates for:
- United Kingdom (UK)
- India (IN)
- United States (US)
- China (CN)
- Germany (DE)
- Japan (JP)
- Australia (AU)
- Brazil (BR)
- South Africa (ZA)
- UAE (AE)
- Singapore (SG)
- Canada (CA)
- France (FR)
- Italy (IT)
- Spain (ES)
- Netherlands (NL)

## Component Structure

### WorldTradeMap.js
Main map component with:
- SVG map rendering
- Route drawing logic
- Real-time data fetching
- Interactive hover/click handlers
- Statistics dashboard

### Integration Points

#### Dashboard
```javascript
<WorldTradeMap onCorridorClick={(corridorId) => setCorridorView(corridorId)} />
```

#### Demo View
```javascript
<WorldTradeMap onCorridorClick={() => {}} />
```

## Database Schema

### Required Tables

#### corridors
```sql
- id (uuid)
- name (text)
- origin_country (text)
- destination_country (text)
- created_at (timestamp)
```

#### corridor_briefings
```sql
- id (uuid)
- corridor_id (uuid) FK
- risk_level (text) -- 'critical', 'high', 'medium', 'low'
- rpi_value (numeric)
- lsi_value (numeric)
- cpi_value (numeric)
- generated_at (timestamp)
```

## Visual Elements

### Map Statistics
Displays 4 key metrics:
1. **Total Corridors** - Count of all active corridors
2. **Critical Risk** - Count of corridors with critical risk
3. **High Risk** - Count of corridors with high risk
4. **Monitored** - Count of corridors with active briefings

### Legend
Shows all 5 risk levels with color indicators

### Corridor List
Below the map, shows all corridors with:
- Risk indicator dot
- Corridor name
- Origin → Destination
- "View →" button

## Animations

### Route Animations
- **Hover**: Solid line with glow effect
- **Default**: Dashed line with reduced opacity
- **Flow Particles**: 3 animated dots moving along route (4s duration)

### Country Markers
- **Pulse Effect**: Expanding ring animation (2s loop)
- **Glow**: Subtle shadow effect
- **Label**: Country code above marker

## Customization

### Adding New Countries
Edit `countryCoordinates` object in WorldTradeMap.js:
```javascript
const countryCoordinates = {
  'Country Name': { x: 50, y: 30, label: 'CC' }
};
```
- `x`: Horizontal position (0-100)
- `y`: Vertical position (0-60)
- `label`: 2-letter country code

### Adjusting Route Curves
Modify `drawCurvedPath` function:
```javascript
const curveOffset = distance * 0.15; // Adjust curve height
```

### Changing Colors
Update `getRiskColor` function with custom hex codes

## Performance

- **Optimized SVG rendering** for smooth animations
- **Conditional rendering** of hover effects
- **Real-time subscriptions** only for relevant tables
- **Efficient data fetching** with Promise.all

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (responsive SVG)

## Future Enhancements

- [ ] Zoom and pan functionality
- [ ] Filter corridors by risk level
- [ ] Historical route comparison
- [ ] Trade volume visualization
- [ ] 3D globe view option
- [ ] Export map as image
- [ ] Custom corridor creation
- [ ] Multi-leg route support
