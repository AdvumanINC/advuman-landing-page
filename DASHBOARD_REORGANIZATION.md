# Dashboard Reorganization - ADVUMAN

## Changes Made

### Dashboard (DashboardNew.js)
The dashboard now focuses on essential real-time data:

#### 1. **Proprietary Indexes (Top Section)**
- RPI (Regulatory Pressure Index)
- LSI (Logistics Strain Index)  
- CPI (Cost Pressure Index)
- Each shows current value, change indicator, and sparkline chart
- Updates in real-time from `corridor_indexes` table

#### 2. **Latest Signals (Middle Section)**
- Shows 3 most recent trade signals
- Displays severity, category, description, impact, and location
- Click "View All →" to see full signals page
- Updates in real-time from `signals` table

#### 3. **Recent Alerts (Bottom Section)**
- Shows 5 most recent alerts (expandable to 10)
- Filter by severity (All, Critical, High, Medium, Low)
- Click any alert to expand and see assessment
- Click "View All →" to see full alerts page
- Updates in real-time from `alerts` table

### Landing Page (LandingPage.js)
Added new "Global Coverage" section:

#### **World Trade Map Section**
- Interactive world map showing all trade corridors
- Real-time risk assessment for each route
- Hover over routes to see:
  - Corridor name and countries
  - Risk level (Critical, High, Medium, Low, Normal)
  - RPI, LSI, CPI values for that corridor
- Color-coded routes based on risk level
- Animated flow particles on hover
- Statistics showing total corridors and risk breakdown
- Located between "How It Works" and "Proprietary Indexes" sections

## Data Flow

### Dashboard Data Sources
1. **useAlerts(10)** - Fetches 10 most recent alerts
2. **useIndexData()** - Fetches all index data (RPI, LSI, CPI)
3. **useSignals(5)** - Fetches 5 most recent signals

### Landing Page Data Sources
1. **useAlerts(4)** - For scrolling ticker
2. **useIndexData()** - For index cards
3. **WorldTradeMap** - Fetches corridors and briefings directly

## Benefits of New Layout

### Dashboard
✓ Cleaner, more focused interface
✓ Essential data at a glance
✓ Better information hierarchy
✓ Faster load times (less data per view)
✓ Clear navigation to detailed views
✓ More space for critical alerts

### Landing Page
✓ Showcases global capabilities
✓ Interactive visual element
✓ Demonstrates real-time monitoring
✓ Impressive for potential customers
✓ Shows breadth of coverage

## User Experience Flow

1. **Landing Page**: See global map → Understand scope
2. **Sign Up/Login**: Create account
3. **Dashboard**: See personalized data → Quick overview
4. **Signals Page**: Deep dive into trade signals
5. **Alerts Page**: Manage alert preferences
6. **Analytics**: Detailed analysis and trends

## Database Tables Used

### Dashboard
- `corridor_indexes` - Index values and history
- `signals` - Trade intelligence signals
- `alerts` - Trade alerts and notifications

### Landing Page Map
- `corridors` - Trade corridor definitions
- `corridor_briefings` - Risk assessments per corridor

## Next Steps

1. Populate `corridors` table with trade routes
2. Add `corridor_briefings` with risk assessments
3. Ensure `signals` table has recent data
4. Test real-time updates on dashboard
5. Verify map interactions work correctly

## Removing Test Features

Once you've verified everything works, remove:
- DBTest component (`src/components/DBTest.js`)
- Test DB button from landing page
- DBTest route from App.js
