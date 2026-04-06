# ADVUMAN - UK-India Trade Intelligence

React application for UK-India trade intelligence platform with real-time alerts, analytics, and risk assessment.

## Features

- User authentication (Email/Password)
- Real-time trade alerts and notifications
- Risk assessment and analytics dashboard
- UK-India trade corridor intelligence
- Proprietary indexes (RPI, LSI, CPI)
- Subscription-based pricing plans (£79/month Starter, £150/month Professional)
- Admin master dashboard with user/content/payment management

## Tech Stack

- **Frontend**: React 18 (Create React App)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Inline styles with custom design system

## Installation

```bash
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your Supabase credentials to `.env`:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Apply the database schema in Supabase SQL Editor:
```
Run the contents of supabase-schema-complete.sql
Then run seed-data.sql for sample data
```

## Running the Application

```bash
npm start
```

The application will open at http://localhost:3000

## Building for Production

```bash
npm run build
```

## Project Structure

```
advumanfrontned/
├── public/
│   ├── index.html
│   └── logo.jpeg
├── src/
│   ├── components/
│   │   ├── Alerts.js
│   │   ├── Analytics.js
│   │   ├── CorridorBriefing.js
│   │   ├── CorridorPage.js
│   │   ├── DashboardNew.js
│   │   ├── DemoView.js
│   │   ├── ErrorBoundary.js
│   │   ├── LandingPage.js
│   │   ├── LoginModal.js
│   │   ├── MasterDashboard.js
│   │   ├── ParticleGrid.js
│   │   ├── RiskCheck.js
│   │   ├── Settings.js
│   │   ├── SeverityBadge.js
│   │   ├── Signals.js
│   │   ├── SignupModal.js
│   │   ├── Sparkline.js
│   │   ├── TradeCorridorMap.js
│   │   └── WorldTradeMap.js
│   ├── App.js
│   ├── constants.js
│   ├── hooks.js
│   ├── index.css
│   ├── index.js
│   ├── supabaseClient.js
│   └── utils.js
├── .env
├── .env.example
├── package.json
└── README.md
```

## Admin Access

Admin emails are hardcoded in `src/components/MasterDashboard.js` in the `ADMIN_EMAILS` array. Update this list with real admin email addresses before deploying.

## License

Private - All rights reserved
