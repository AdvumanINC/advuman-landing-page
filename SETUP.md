# ADVUMAN - Setup Guide

## Quick Start

This is a React application that connects to Supabase for all backend services (auth, database, realtime).

### Prerequisites

- Node.js and npm installed
- Supabase account and project created

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Set up database schema:**

Run `supabase-schema-complete.sql` in your Supabase SQL Editor to create all required tables.

4. **Seed sample data (optional):**

Run `seed-data.sql` in your Supabase SQL Editor to populate test data.

5. **Start the application:**
```bash
npm start
```

The app will open at http://localhost:3000

---

## Database Tables

These are the tables the app reads from. Your webscraper should populate them:

| Table | Purpose |
|---|---|
| `alerts` | Trade alerts (severity, category, date, summary) |
| `signals` | Real-time intelligence signals (HS codes, analyst notes) |
| `corridor_indexes` | RPI, LSI, CPI index snapshots over time |
| `corridors` | Trade corridor definitions (e.g. UK-India) |
| `sectors` | Sector-specific data per corridor |
| `disruptions` | Monthly disruption counts (used in Analytics) |
| `risks` | Risk distribution data (used in Analytics) |
| `sources` | Source monitoring coverage (used in Analytics) |
| `user_profiles` | User account data, subscription status, trial dates |
| `stripe_payments` | Payment records |
| `admin_query_log` | Log of admin queries run via Master Dashboard |

---

## Webscraper Integration

Your webscraper should INSERT into these tables:

### Add Alert:
```sql
INSERT INTO alerts (title, summary, severity, category, date, source, corridor_id, tags)
VALUES ('Title', 'Summary', 'high', 'Regulatory', CURRENT_DATE, 'Source', '<corridor_id>', ARRAY['tag1']);
```

### Add Signal:
```sql
INSERT INTO signals (location, category, description, confidence, impact, analyst_note, severity, hs_code, source, corridor_id)
VALUES ('Mumbai', 'Logistics', 'Description', 'High', 'Delay', 'Note', 'medium', '8471', 'Source', '<corridor_id>');
```

### Update Indexes:
```sql
INSERT INTO corridor_indexes (corridor_id, index_type, value, change_value, snapshot_date)
VALUES ('<corridor_id>', 'RPI', 7.2, 0.8, CURRENT_DATE);
```

---

## Enable Realtime in Supabase

Go to **Database → Replication** and enable realtime for:
- `alerts`
- `signals`
- `corridor_indexes`
- `corridors`
- `sectors`

---

## Admin Setup

Admin access is controlled by a hardcoded email list in `src/components/MasterDashboard.js`:

```js
export const ADMIN_EMAILS = [
  'your-admin@email.com',
];
```

Update this with real admin email(s) before deploying.

The Master Dashboard also requires a Supabase RPC function `admin_run_query` — this is defined in `master-dashboard-schema.sql`.

---

## Building for Production

```bash
npm run build
```

Deploy the `build/` folder to any static host (Vercel, Netlify, AWS S3 + CloudFront).
