# ADVUMAN - UK-India Trade Intelligence

React application for UK-India trade intelligence platform with real-time alerts, analytics, and risk assessment.

## Features

- User authentication (Email/Password, GitHub OAuth, SSO)
- Real-time trade alerts and notifications
- Risk assessment and analytics dashboard
- UK-India trade corridor intelligence
- Proprietary indexes (RPI, LSI, CPI)
- Subscription-based pricing plans

## Tech Stack

- **Frontend**: React
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Inline styles with custom design system
- **Data**: External webscraper integration

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
```sql
-- Run the contents of supabase-schema.sql in your Supabase SQL Editor
```

## Running the Application

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
```

## Data Integration

This application expects data to be populated in Supabase tables by your external webscraper. The React app reads from these tables in real-time.

## Project Structure

```
advuman/
├── public/
│   ├── index.html
│   └── logo.jpeg
├── src/
│   ├── components/
│   │   ├── Alerts.js
│   │   ├── Analytics.js
│   │   ├── AuthPage.js
│   │   ├── Dashboard.js
│   │   ├── DashboardNew.js
│   │   ├── LandingPage.js
│   │   ├── LoginModal.js
│   │   ├── ParticleGrid.js
│   │   ├── RiskCheck.js
│   │   ├── SeverityBadge.js
│   │   ├── Signals.js
│   │   ├── SignupModal.js
│   │   └── Sparkline.js
│   ├── App.js
│   ├── constants.js
│   ├── index.css
│   ├── index.js
│   ├── supabaseClient.js
│   └── utils.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## License

Private - All rights reserved
