# ADVUMAN - Complete Summary

## What This Is

A React + Supabase web app that delivers UK-India trade intelligence to subscribers. It monitors regulatory changes, tariff updates, and compliance risks, then surfaces them as alerts and signals.

---

## Architecture

```
React Frontend (Create React App)
    ↓
Supabase (Auth + PostgreSQL + Realtime)
    ↓
Webscraper → Populates tables with live data
```

No Express backend. Supabase handles everything.

---

## Views

| View | Who Sees It | Component |
|---|---|---|
| Landing | Public | `LandingPage.js` |
| Demo | Public (no login) | `DemoView.js` |
| Dashboard | Logged-in users | `DashboardNew.js` |
| Master Dashboard | Admin emails only | `MasterDashboard.js` |

---

## Database Tables (what the app actually uses)

| Table | Used By |
|---|---|
| `alerts` | LandingPage, DashboardNew, Alerts, hooks |
| `signals` | Signals, DashboardNew, hooks |
| `corridor_indexes` | LandingPage, DashboardNew, CorridorPage, hooks |
| `corridors` | WorldTradeMap, CorridorPage, hooks |
| `sectors` | CorridorPage, hooks |
| `disruptions` | Analytics |
| `risks` | Analytics |
| `sources` | Analytics |
| `user_profiles` | App.js, Settings, MasterDashboard |
| `stripe_payments` | MasterDashboard |
| `admin_query_log` | MasterDashboard |

---

## Custom Hooks (src/hooks.js)

```javascript
useAlerts(limit)       // → { alerts, loading, error }
useSignals(limit)      // → { signals, loading, error }
useIndexData(corridorId) // → { indexData: { rpi, lsi, cpi }, loading, error }
useSectors(corridorId) // → { sectors, loading, error }
useCorridors()         // → { corridors, loading, error }
```

All hooks subscribe to Supabase realtime and auto-update when data changes.

---

## Auth

- Email/password only (Supabase Auth)
- Signup creates a `user_profiles` row with `subscription_status: 'trial'` and a 14-day trial window
- Admin check is a hardcoded `ADMIN_EMAILS` array in `MasterDashboard.js` — update before deploying

---

## Dashboard Modules

| Module | Status |
|---|---|
| Dashboard (overview) | Live |
| Signals | Live |
| Analytics | Live |
| Alerts | Live |
| Risk Check | Static mock data (not connected to real analysis) |
| Settings | Live (profile, password, account deletion) |
| Briefs | Coming Soon placeholder |
| Precedents | Coming Soon placeholder |
| Ops Center | Coming Soon placeholder |

---

## Master Dashboard (Admin)

5 tabs:
- **Overview** — stats (users, MRR, alerts, signals) + recent payments
- **Users** — searchable, editable table of all `user_profiles`
- **Content** — add/edit/delete alerts and signals
- **Query Runner** — plain English → SQL via `admin_run_query` RPC, all queries logged
- **Stripe** — view/add/edit `stripe_payments` records (manual, no live Stripe integration)

---

## Setup Checklist

- [ ] Run `supabase-schema-complete.sql` in Supabase SQL Editor
- [ ] Run `seed-data.sql` for sample data
- [ ] Run `master-dashboard-schema.sql` for admin RPC and tables
- [ ] Enable realtime on: `alerts`, `signals`, `corridor_indexes`, `corridors`, `sectors`
- [ ] Update `ADMIN_EMAILS` in `MasterDashboard.js`
- [ ] Set `.env` with real Supabase URL and anon key
- [ ] Run `npm install` then `npm start`

---

## Known Limitations

- Risk Check returns hardcoded mock results — not real analysis
- Stripe tab is manual record-keeping only, no live Stripe webhook integration
- Briefs, Precedents, Ops Center are not built yet
