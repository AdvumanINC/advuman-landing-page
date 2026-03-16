# Adding Trade Corridors to Database

## Quick Setup

### Step 1: Add Corridors

Run this SQL in your Supabase SQL Editor to add sample corridors:

```sql
-- Insert sample trade corridors
INSERT INTO corridors (name, origin_country, destination_country) VALUES
  ('UK-India Trade Corridor', 'United Kingdom', 'India'),
  ('US-India Trade Corridor', 'United States', 'India'),
  ('Germany-India Trade Corridor', 'Germany', 'India'),
  ('UK-China Trade Corridor', 'United Kingdom', 'China'),
  ('US-China Trade Corridor', 'United States', 'China'),
  ('UK-UAE Trade Corridor', 'United Kingdom', 'UAE'),
  ('India-Singapore Trade Corridor', 'India', 'Singapore'),
  ('UK-Japan Trade Corridor', 'United Kingdom', 'Japan'),
  ('Australia-India Trade Corridor', 'Australia', 'India'),
  ('Canada-India Trade Corridor', 'Canada', 'India');
```

### Step 2: Add Sample Briefings (Optional)

Add sample risk assessments for visualization:

```sql
-- Get corridor IDs first
DO $$
DECLARE
  uk_india_id uuid;
  us_india_id uuid;
  germany_india_id uuid;
BEGIN
  -- Get corridor IDs
  SELECT id INTO uk_india_id FROM corridors WHERE name = 'UK-India Trade Corridor';
  SELECT id INTO us_india_id FROM corridors WHERE name = 'US-India Trade Corridor';
  SELECT id INTO germany_india_id FROM corridors WHERE name = 'Germany-India Trade Corridor';
  
  -- Insert sample briefings
  INSERT INTO corridor_briefings (corridor_id, risk_level, rpi_value, lsi_value, cpi_value, summary_text) VALUES
    (uk_india_id, 'high', 7.2, 6.8, 7.5, 'Elevated regulatory pressure due to recent CBIC notifications on electronics imports. Port congestion at Mumbai affecting logistics timelines.'),
    (us_india_id, 'medium', 5.5, 6.2, 5.8, 'Moderate risk environment with stable regulatory framework. Minor delays expected due to increased documentation requirements.'),
    (germany_india_id, 'low', 4.2, 4.8, 4.5, 'Low risk corridor with established compliance procedures. Smooth operations expected across all major ports.');
END $$;
```

### Step 3: Add Signal Snapshots (Optional)

Add historical data for charts:

```sql
-- Add 30 days of signal history for UK-India corridor
DO $$
DECLARE
  corridor_id uuid;
  i integer;
BEGIN
  SELECT id INTO corridor_id FROM corridors WHERE name = 'UK-India Trade Corridor';
  
  FOR i IN 0..29 LOOP
    INSERT INTO corridor_signal_snapshots (corridor_id, snapshot_date, rpi_value, lsi_value, cpi_value)
    VALUES (
      corridor_id,
      CURRENT_DATE - (29 - i),
      6.5 + (random() * 1.5),  -- RPI between 6.5-8.0
      6.0 + (random() * 1.5),  -- LSI between 6.0-7.5
      7.0 + (random() * 1.0)   -- CPI between 7.0-8.0
    );
  END LOOP;
END $$;
```

### Step 4: Add Events (Optional)

Add recent events for timeline:

```sql
-- Add sample events
DO $$
DECLARE
  corridor_id uuid;
BEGIN
  SELECT id INTO corridor_id FROM corridors WHERE name = 'UK-India Trade Corridor';
  
  INSERT INTO corridor_events (corridor_id, title, description, event_date, severity) VALUES
    (corridor_id, 'CBIC Notification on Electronics', 'New import licensing requirements for HS codes 8541-8542', CURRENT_DATE - 2, 'high'),
    (corridor_id, 'Mumbai Port Congestion', 'Container dwell time increased by 18% due to customs system upgrade', CURRENT_DATE - 5, 'medium'),
    (corridor_id, 'BIS Quality Standards Update', 'Revised certification requirements for consumer electronics', CURRENT_DATE - 7, 'medium'),
    (corridor_id, 'RBI Policy Announcement', 'New guidelines on foreign exchange transactions', CURRENT_DATE - 10, 'low'),
    (corridor_id, 'DGFT Circular Released', 'Updated export-import policy for Q1 2026', CURRENT_DATE - 14, 'low');
END $$;
```

## Map Visualization

After adding corridors, the map will automatically:
- ✅ Display routes between countries
- ✅ Color-code based on risk levels
- ✅ Show hover tooltips with details
- ✅ Enable click-through to corridor pages

## Supported Countries

Make sure your corridors use these exact country names:

- United Kingdom
- India
- United States
- China
- Germany
- Japan
- Australia
- Brazil
- South Africa
- UAE
- Singapore
- Canada
- France
- Italy
- Spain
- Netherlands

## Adding New Countries

To add a new country to the map:

1. **Add coordinates** in `WorldTradeMap.js`:
```javascript
const countryCoordinates = {
  'New Country': { x: 55, y: 35, label: 'NC' }
};
```

2. **Add corridor** in database:
```sql
INSERT INTO corridors (name, origin_country, destination_country) 
VALUES ('UK-NewCountry Trade Corridor', 'United Kingdom', 'New Country');
```

## Webscraper Integration

Your webscraper should:

1. **Update briefings** regularly:
```sql
INSERT INTO corridor_briefings (corridor_id, risk_level, rpi_value, lsi_value, cpi_value, summary_text)
VALUES (?, ?, ?, ?, ?, ?);
```

2. **Add signal snapshots** daily:
```sql
INSERT INTO corridor_signal_snapshots (corridor_id, snapshot_date, rpi_value, lsi_value, cpi_value)
VALUES (?, CURRENT_DATE, ?, ?, ?);
```

3. **Create events** when detected:
```sql
INSERT INTO corridor_events (corridor_id, title, description, event_date, severity)
VALUES (?, ?, ?, ?, ?);
```

## Real-Time Updates

The map automatically updates when:
- New corridors are added
- Briefings are updated
- Risk levels change

No page refresh needed! 🚀

## Testing

1. **Add a corridor**: Run Step 1 SQL
2. **Check map**: Should see new route
3. **Add briefing**: Run Step 2 SQL
4. **Check color**: Route should change color based on risk
5. **Hover route**: Should see tooltip with data
6. **Click route**: Should navigate to corridor page

## Troubleshooting

### Route not showing?
- Check country name spelling (case-sensitive)
- Verify country exists in `countryCoordinates`
- Check browser console for errors

### Wrong color?
- Verify `risk_level` in briefings table
- Must be: 'critical', 'high', 'medium', 'low'
- Check latest briefing is being fetched

### No tooltip data?
- Ensure briefing exists for corridor
- Check RPI, LSI, CPI values are numeric
- Verify corridor_id matches

## Example: Complete Corridor Setup

```sql
-- 1. Add corridor
INSERT INTO corridors (name, origin_country, destination_country) 
VALUES ('UK-France Trade Corridor', 'United Kingdom', 'France')
RETURNING id;

-- 2. Add briefing (use returned ID)
INSERT INTO corridor_briefings (corridor_id, risk_level, rpi_value, lsi_value, cpi_value, summary_text)
VALUES (
  '<corridor_id_from_step_1>',
  'low',
  3.5,
  4.2,
  3.8,
  'Stable trade environment with minimal regulatory changes expected.'
);

-- 3. View on map
-- Route should appear between UK and France with green color (low risk)
```
