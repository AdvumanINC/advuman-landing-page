# 🚀 Database Setup Guide - Remove Hardcoded Data

## ✅ You DO NOT Need Express Backend!

Supabase provides everything:
- PostgreSQL database
- RESTful API (automatic)
- Real-time subscriptions
- Authentication
- Row Level Security

## Step 1: Apply New Schema

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the contents of `supabase-schema-complete.sql`
4. Paste and click **"Run"**
5. Wait for success message

This creates all necessary tables:
- `corridors` - Trade routes
- `alerts` - Trade alerts (replaces SAMPLE_ALERTS)
- `signals` - Intelligence signals
- `corridor_indexes` - Index data (replaces INDEX_DATA)
- `sectors` - Sector monitoring (replaces SECTORS)
- `corridor_briefings` - Risk assessments
- `corridor_events` - Timeline events
- `corridor_signal_snapshots` - Historical data

## Step 2: Seed Sample Data

1. In Supabase SQL Editor
2. Copy contents of `seed-data.sql`
3. Paste and click **"Run"**
4. Verify data counts at the end

This populates:
- 5 corridors (UK-India, US-India, etc.)
- 6 alerts
- 5 signals
- 8 sectors
- 30 days of index history
- 1 briefing
- 5 events
- 12 signal snapshots

## Step 3: Enable Realtime (if not auto-enabled)

1. Go to **Database** → **Replication**
2. Enable realtime for these tables:
   - corridors
   - alerts
   - signals
   - corridor_indexes
   - sectors
   - corridor_briefings
   - corridor_events
   - corridor_signal_snapshots

## Step 4: Test the Application

```bash
npm start
```

### What You Should See:

**Landing Page:**
- Scrolling alerts from database
- Index cards with real data
- All styling intact

**Demo View:**
- World map with corridors
- Index cards with charts
- 5 recent alerts

**Dashboard (after login):**
- World map with corridors
- Index cards with charts
- Recent alerts
- All modules working

## Changes Made

### ✅ Removed Hardcoded Data:
- ❌ `SAMPLE_ALERTS` constant
- ❌ `INDEX_DATA` constant
- ❌ `SECTORS` constant
- ❌ Hardcoded signals in Signals.js

### ✅ Added Database Integration:
- ✅ Custom hooks in `hooks.js`
- ✅ Real-time subscriptions
- ✅ Automatic data fetching
- ✅ Loading states

### ✅ Updated Components:
- `DashboardNew.js` - Uses `useAlerts()` and `useIndexData()`
- `DemoView.js` - Uses `useAlerts()` and `useIndexData()`
- `LandingPage.js` - Uses `useAlerts()` and `useIndexData()`
- `Signals.js` - Uses `useSignals()`

## Custom Hooks Available

### useAlerts(limit)
```javascript
const { alerts, loading } = useAlerts(5);
// Returns latest alerts, optional limit
```

### useSignals(limit)
```javascript
const { signals, loading } = useSignals();
// Returns all signals
```

### useSectors(corridorId)
```javascript
const { sectors, loading } = useSectors();
// Returns sectors, optional filter by corridor
```

### useIndexData(corridorId)
```javascript
const { indexData, loading } = useIndexData();
// Returns { rpi: {...}, lsi: {...}, cpi: {...} }
```

### useCorridors()
```javascript
const { corridors, loading } = useCorridors();
// Returns all active corridors
```

## Data Flow

```
Your Webscraper
    ↓
Supabase Tables
    ↓
Custom Hooks (with real-time)
    ↓
React Components
    ↓
User sees live data
```

## Webscraper Integration

Your webscraper should INSERT data into these tables:

### Add Alert:
```sql
INSERT INTO alerts (title, summary, severity, category, date, source, corridor_id, tags)
VALUES ('Title', 'Summary', 'high', 'Regulatory', CURRENT_DATE, 'Source', '<corridor_id>', ARRAY['tag1', 'tag2']);
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

### Update Briefing:
```sql
INSERT INTO corridor_briefings (corridor_id, risk_level, rpi_value, lsi_value, cpi_value, summary_text)
VALUES ('<corridor_id>', 'high', 7.2, 5.8, 6.5, 'Summary text');
```

## Real-Time Updates

All components automatically update when:
- New alerts added
- Indexes updated
- Signals created
- Briefings generated

No page refresh needed! 🎉

## Troubleshooting

### No data showing?
1. Check Supabase SQL Editor for errors
2. Verify seed data ran successfully
3. Check browser console for errors
4. Verify RLS policies are correct

### Data not updating?
1. Check realtime is enabled
2. Verify websocket connection in Network tab
3. Check Supabase logs

### Loading forever?
1. Check `.env` file has correct credentials
2. Verify Supabase project is active
3. Check network connectivity

## Benefits

### ✅ No Express Backend Needed
- Supabase handles everything
- Less infrastructure to maintain
- Lower costs
- Faster development

### ✅ Real-Time by Default
- Instant updates across all users
- No polling required
- WebSocket connections managed

### ✅ Scalable
- Supabase handles millions of rows
- Automatic indexing
- Built-in caching

### ✅ Secure
- Row Level Security
- JWT authentication
- Encrypted connections

## Next Steps

1. ✅ Run schema SQL
2. ✅ Run seed data SQL
3. ✅ Test application
4. 🔄 Connect your webscraper
5. 📊 Monitor data flow
6. 🚀 Deploy to production

## Production Checklist

- [ ] Schema applied
- [ ] Seed data loaded
- [ ] Realtime enabled
- [ ] RLS policies verified
- [ ] Indexes created
- [ ] Webscraper connected
- [ ] Data flowing correctly
- [ ] Real-time updates working
- [ ] All components tested
- [ ] Performance optimized

## Support Files

- `supabase-schema-complete.sql` - Complete schema
- `seed-data.sql` - Sample data
- `hooks.js` - Custom React hooks
- `ADD_CORRIDORS.md` - Corridor setup guide
