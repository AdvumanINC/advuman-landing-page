# Real-Time Data Setup - ADVUMAN

## Overview

The app fetches all data from Supabase and subscribes to real-time changes via Supabase channels. When your webscraper inserts new data, the UI updates automatically — no page refresh needed.

---

## Custom Hooks (src/hooks.js)

Five hooks handle all data fetching and real-time subscriptions:

### useAlerts(limit)
```javascript
const { alerts, loading } = useAlerts(10);
// Fetches from `alerts` table, ordered by date desc
```

### useSignals(limit)
```javascript
const { signals, loading } = useSignals(5);
// Fetches from `signals` table, ordered by created_at desc
```

### useIndexData(corridorId)
```javascript
const { indexData, loading } = useIndexData();
// Fetches from `corridor_indexes`, returns { rpi: {...}, lsi: {...}, cpi: {...} }
```

### useSectors(corridorId)
```javascript
const { sectors, loading } = useSectors();
// Fetches from `sectors` table, optional filter by corridor_id
```

### useCorridors()
```javascript
const { corridors, loading } = useCorridors();
// Fetches active corridors from `corridors` table
```

Each hook subscribes to Postgres changes on its table and re-fetches automatically when data changes.

---

## Which Components Use Real-Time Data

| Component | Hooks Used |
|---|---|
| `LandingPage.js` | `useAlerts(4)`, `useIndexData()` |
| `DashboardNew.js` | `useAlerts(10)`, `useIndexData()`, `useSignals(5)` |
| `Signals.js` | `useSignals()` |
| `Analytics.js` | Direct Supabase queries to `disruptions`, `risks`, `sources` |
| `CorridorPage.js` | `useIndexData(corridorId)`, `useSectors(corridorId)`, `useCorridors()` |

---

## Expected Table Schemas

#### `alerts`
`id, title, summary, severity, category, date, source, corridor_id, tags, created_at`

#### `signals`
`id, location, category, description, confidence, impact, analyst_note, severity, hs_code, source, corridor_id, created_at`

#### `corridor_indexes`
`id, corridor_id, index_type (RPI/LSI/CPI), value, change_value, snapshot_date`

#### `corridors`
`id, name, is_active`

#### `sectors`
`id, corridor_id, name, alert_count`

#### `disruptions`
`id, month, count`

#### `risks`
`id, category, count, color`

#### `sources`
`id, source, alerts`

---

## How Real-Time Works

1. Webscraper inserts a row into Supabase
2. Supabase fires a Postgres change event
3. The relevant hook catches it and re-fetches
4. React re-renders the component with new data

All users see the update simultaneously with no page reload.

---

## Troubleshooting

**No data showing?**
- Check `.env` has correct `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
- Verify schema SQL ran without errors
- Check browser console for Supabase errors

**Data not updating in real-time?**
- Go to Supabase → Database → Replication and confirm realtime is enabled for the relevant tables
- Check Network tab for an active WebSocket connection

**Loading forever?**
- Confirm your Supabase project is active (not paused on free tier)
