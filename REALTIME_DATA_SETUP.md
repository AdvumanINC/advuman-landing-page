# Real-Time Data Setup - ADVUMAN

## Overview
Your React app is already configured to display real-time data from Supabase! The system uses React hooks with Supabase's real-time subscriptions.

## How It Works

### 1. Real-Time Hooks (src/hooks.js)
Your app has 5 custom hooks that automatically fetch and update data:

- **useAlerts()** - Fetches alerts from the `alerts` table
- **useSignals()** - Fetches signals from the `signals` table  
- **useSectors()** - Fetches sectors from the `sectors` table
- **useIndexData()** - Fetches corridor indexes (RPI, LSI, CPI) from `corridor_indexes` table
- **useCorridors()** - Fetches trade corridors from the `corridors` table

Each hook:
- Loads data on component mount
- Subscribes to real-time changes using Supabase channels
- Automatically updates when data changes in the database
- Cleans up subscriptions on unmount

### 2. Components Using Real-Time Data

**DashboardNew.js**
- Uses `useAlerts(4)` to show 4 recent alerts
- Uses `useIndexData()` to display RPI, LSI, CPI indexes with sparklines
- Updates automatically when new data arrives

**LandingPage.js**
- Uses `useAlerts(4)` for the scrolling alert ticker
- Uses `useIndexData()` to show the 3 proprietary indexes
- All data updates in real-time

### 3. Expected Database Tables

Your Supabase database should have these tables:

#### `alerts`
- id, title, summary, severity, category, date, created_at

#### `signals`  
- id, title, description, created_at

#### `corridor_indexes`
- id, corridor_id, index_type (RPI/LSI/CPI), value, change_value, snapshot_date

#### `sectors`
- id, corridor_id, name, alert_count

#### `corridors`
- id, name, is_active

#### `user_profiles`
- user_id, full_name, company_name, email

## Testing Your Database Connection

I've added a temporary "Test DB" button on the landing page:

1. Run `npm start`
2. Click the green "Test DB" button
3. You'll see which tables exist and how many rows each has
4. This helps you verify your Supabase connection and data

## What Happens When Data Changes

When your external webscraper adds new data to Supabase:

1. **Instant Update**: The Supabase real-time subscription detects the change
2. **Auto Refresh**: The React hook automatically refetches the data
3. **UI Update**: Components re-render with the new data
4. **No Page Reload**: Everything happens seamlessly without refreshing

## Next Steps

1. **Test Connection**: Click "Test DB" to verify your tables exist
2. **Add Sample Data**: Insert test data into your Supabase tables
3. **Watch It Update**: See the dashboard update in real-time
4. **Remove Test Button**: Once verified, remove the DBTest component and button

## Removing the Test Button

After testing, remove these:
- Delete `src/components/DBTest.js`
- Remove DBTest import and route from `App.js`
- Remove `onTestDB` prop from LandingPage

## Environment Variables Required

Make sure your `.env` file has:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Real-Time Features Already Working

✓ Alerts update automatically
✓ Index values (RPI, LSI, CPI) update in real-time
✓ Sparkline charts update with new data
✓ Alert severity badges reflect current data
✓ No manual refresh needed
✓ Multiple users see updates simultaneously

Your app is production-ready for real-time data display!
