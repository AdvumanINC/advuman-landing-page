# ADVUMAN - React Setup Guide

## Quick Start

This is a pure React application that connects to Supabase for backend services.

### Prerequisites

- Node.js and npm installed
- Supabase account and project created
- Your webscraper ready to populate data

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env` and add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Set up database schema:**

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor to create all required tables.

4. **Start the application:**
```bash
npm start
```

The app will open at http://localhost:3000

### Database Tables

Your webscraper should populate these Supabase tables:

- `user_profiles` - User account information
- `corridors` - Trade corridor definitions (UK-India, etc.)
- `corridor_signal_snapshots` - Historical index values (RPI, LSI, CPI)
- `corridor_events` - Trade events and alerts
- `corridor_briefings` - Generated intelligence briefings

### Features

- ✅ User authentication (Email/Password, GitHub OAuth)
- ✅ Real-time trade alerts and notifications
- ✅ Risk assessment dashboard
- ✅ Trade corridor intelligence
- ✅ Proprietary indexes (RPI, LSI, CPI)
- ✅ Real-time data updates via Supabase subscriptions

### Architecture

```
React Frontend (Port 3000)
    ↓
Supabase Backend
    ↓
Your Webscraper → Populates Tables
```

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deployment

Deploy the `build/` folder to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Support

For issues or questions, refer to:
- Supabase docs: https://supabase.com/docs
- React docs: https://react.dev
