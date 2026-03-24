-- ============================================================
-- SEED DATA
-- Run AFTER supabase-schema-complete.sql
-- Then run AFTER master-dashboard-schema.sql
-- Safe to re-run (uses ON CONFLICT DO NOTHING)
-- ============================================================

-- Clear existing seed data so re-runs are clean
TRUNCATE corridor_signal_snapshots, corridor_events, corridor_briefings,
         corridor_indexes, sectors, signals, alerts, corridors
RESTART IDENTITY CASCADE;

-- ============================================================
-- Corridors
-- ============================================================
INSERT INTO corridors (id, name, origin_country, destination_country, description, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'UK-India Trade Corridor',        'United Kingdom', 'India',   'Primary trade route between UK and India',  true),
  ('22222222-2222-2222-2222-222222222222', 'US-India Trade Corridor',        'United States',  'India',   'Major trade route between US and India',     true),
  ('33333333-3333-3333-3333-333333333333', 'Germany-India Trade Corridor',   'Germany',        'India',   'EU-India trade via Germany',                 true),
  ('44444444-4444-4444-4444-444444444444', 'UK-China Trade Corridor',        'United Kingdom', 'China',   'UK-China bilateral trade route',             true),
  ('55555555-5555-5555-5555-555555555555', 'Australia-India Trade Corridor', 'Australia',      'India',   'Indo-Pacific trade corridor',                true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Alerts (uses corridor_id — matches supabase-schema-complete.sql)
-- ============================================================
INSERT INTO alerts (title, summary, severity, category, date, source, corridor_id, tags) VALUES
  (
    'India DPIIT Issues New FDI Policy Circular',
    'Department for Promotion of Industry and Internal Trade released revised FDI guidelines affecting e-commerce, defence, and insurance sectors. UK firms with Indian JVs should review compliance within 90-day window.',
    'critical', 'Regulatory', CURRENT_DATE - 3,
    'DPIIT Gazette Notification',
    '11111111-1111-1111-1111-111111111111',
    ARRAY['FDI', 'compliance', 'e-commerce']
  ),
  (
    'CBIC Revises Anti-Dumping Duties on UK Steel Imports',
    'Central Board of Indirect Taxes and Customs has initiated a sunset review of anti-dumping duties on certain steel products imported from the UK. Provisional duty rate increased from 12.4% to 18.7%.',
    'high', 'Tariff', CURRENT_DATE - 4,
    'CBIC Notification No. 04/2026',
    '11111111-1111-1111-1111-111111111111',
    ARRAY['anti-dumping', 'steel', 'tariffs']
  ),
  (
    'UK-India FTA Round 16 Concluded — Services Chapter Stalled',
    '16th round of UK-India FTA negotiations concluded in New Delhi. Progress on goods market access but services chapter remains contentious. Mode 4 (movement of natural persons) is the key sticking point.',
    'medium', 'Trade Agreement', CURRENT_DATE - 6,
    'UK DBT Press Release / MEA Statement',
    '11111111-1111-1111-1111-111111111111',
    ARRAY['FTA', 'services', 'Mode 4']
  ),
  (
    'RBI Tightens External Commercial Borrowing Norms',
    'Reserve Bank of India revised ECB framework. All-in-cost ceiling reduced by 50bps. UK lenders providing trade finance to Indian importers should review pricing structures.',
    'medium', 'Financial', CURRENT_DATE - 7,
    'RBI/2026-27/14',
    '11111111-1111-1111-1111-111111111111',
    ARRAY['ECB', 'trade finance', 'RBI']
  ),
  (
    'BIS Updates Quality Control Orders for Electronics',
    'Bureau of Indian Standards expanded mandatory certification list for electronic components. 47 new product categories added. UK electronics exporters have 180-day compliance window.',
    'low', 'Standards', CURRENT_DATE - 9,
    'BIS QCO Notification',
    '11111111-1111-1111-1111-111111111111',
    ARRAY['BIS', 'electronics', 'certification']
  ),
  (
    'India Raises Customs Duty on Medical Devices',
    'Union Budget 2026-27 increased basic customs duty on imported medical devices from 7.5% to 15%. Affects UK medtech exporters including diagnostics, implants, and surgical instruments.',
    'high', 'Tariff', CURRENT_DATE - 10,
    'Finance Bill 2026',
    '11111111-1111-1111-1111-111111111111',
    ARRAY['medical devices', 'customs duty', 'budget']
  ),
  (
    'DGFT Circular on Import Licensing for Electronics',
    'Directorate General of Foreign Trade issued new import licensing requirements for HS codes 8541-8542. 30-day implementation window for existing importers.',
    'high', 'Regulatory', CURRENT_DATE - 2,
    'DGFT Circular No. 12/2026',
    '11111111-1111-1111-1111-111111111111',
    ARRAY['DGFT', 'electronics', 'import licensing']
  ),
  (
    'Mumbai Port Congestion — Container Dwell Times Up 18%',
    'Container dwell time at JNPT increased by 18% due to customs system upgrade. Expect 2-3 day delays for the next 10 days. Air freight recommended for time-sensitive shipments.',
    'medium', 'Logistics', CURRENT_DATE - 1,
    'JNPT Port Authority',
    '11111111-1111-1111-1111-111111111111',
    ARRAY['Mumbai', 'port', 'logistics', 'delay']
  );

-- ============================================================
-- Signals
-- ============================================================
INSERT INTO signals (location, category, description, confidence, impact, analyst_note, severity, hs_code, source, corridor_id) VALUES
  (
    'Mumbai Port', 'Logistics',
    'Container dwell time increased by 18% due to customs system upgrade',
    'High', 'Delay',
    'Expect 2-3 day delays for next 10 days. Consider air freight for urgent shipments.',
    'medium', '8471', 'JNPT Port Authority',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'New Delhi', 'Regulatory',
    'DGFT circular on import licensing for electronics components — HS 8541-8542',
    'Verified', 'Compliance',
    'Mandatory for HS codes 8541-8542. 30-day implementation window. Engage customs broker immediately.',
    'high', '8541', 'DGFT',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Chennai', 'Market',
    'Steel prices up 12% following new BIS quality control orders',
    'Medium', 'Cost',
    'BIS certification now required. Factor 8-10% cost increase into pricing models.',
    'medium', '7208', 'Market Intelligence',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Bangalore', 'Regulatory',
    'IT services withholding tax rate confirmed at 10% for UK entities by CBDT',
    'Verified', 'Tax',
    'No change from previous rate. Confirmation removes uncertainty for UK IT service exporters.',
    'low', 'N/A', 'CBDT',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Kolkata Port', 'Logistics',
    'Port strike averted — operations fully normal after wage agreement',
    'High', 'Positive',
    'Wage agreement reached. No disruption expected. Backlog clearing within 48 hours.',
    'low', 'All', 'Port Union',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'London', 'Regulatory',
    'HMRC updates rules on VAT treatment for UK-India digital services exports',
    'Verified', 'Compliance',
    'New guidance effective Q2 2026. UK exporters of digital services to Indian B2C customers should review VAT registration obligations.',
    'medium', 'N/A', 'HMRC',
    '11111111-1111-1111-1111-111111111111'
  );

-- ============================================================
-- Sectors
-- ============================================================
INSERT INTO sectors (name, alert_count, risk_level, corridor_id) VALUES
  ('Pharmaceuticals',      12, 'high',     '11111111-1111-1111-1111-111111111111'),
  ('IT Services',           8, 'medium',   '11111111-1111-1111-1111-111111111111'),
  ('Textiles & Apparel',    6, 'medium',   '11111111-1111-1111-1111-111111111111'),
  ('Auto Components',       9, 'high',     '11111111-1111-1111-1111-111111111111'),
  ('Food & Agri',           4, 'low',      '11111111-1111-1111-1111-111111111111'),
  ('Medical Devices',      11, 'critical', '11111111-1111-1111-1111-111111111111'),
  ('Electronics',           7, 'medium',   '11111111-1111-1111-1111-111111111111'),
  ('Steel & Metals',       10, 'high',     '11111111-1111-1111-1111-111111111111');

-- ============================================================
-- Corridor Indexes (30 days of history)
-- ============================================================
INSERT INTO corridor_indexes (corridor_id, index_type, value, change_value, snapshot_date)
SELECT
  '11111111-1111-1111-1111-111111111111',
  idx,
  CASE idx
    WHEN 'RPI' THEN 5.1 + (i * 0.07) + (random() * 0.3)
    WHEN 'LSI' THEN 6.8 - (i * 0.035) + (random() * 0.2)
    WHEN 'CPI' THEN 4.2 + (i * 0.08) + (random() * 0.2)
  END,
  CASE idx WHEN 'RPI' THEN 0.8 WHEN 'LSI' THEN -0.3 WHEN 'CPI' THEN 1.2 END,
  CURRENT_DATE - (29 - i)
FROM generate_series(0, 29) AS i,
     unnest(ARRAY['RPI','LSI','CPI']) AS idx;

-- ============================================================
-- Corridor Signal Snapshots (12 data points for charts)
-- ============================================================
INSERT INTO corridor_signal_snapshots (corridor_id, snapshot_date, rpi_value, lsi_value, cpi_value)
SELECT
  '11111111-1111-1111-1111-111111111111',
  CURRENT_DATE - (11 - i) * 2,
  5.1 + (i * 0.175) + (random() * 0.3),
  6.8 - (i * 0.09)  + (random() * 0.2),
  4.2 + (i * 0.19)  + (random() * 0.2)
FROM generate_series(0, 11) AS i;

-- ============================================================
-- Corridor Briefings
-- ============================================================
INSERT INTO corridor_briefings (corridor_id, risk_level, rpi_value, lsi_value, cpi_value, summary_text) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'high', 7.2, 5.8, 6.5,
    'Elevated regulatory pressure due to recent CBIC notifications on electronics imports and revised FDI guidelines. Port congestion at Mumbai affecting logistics timelines. Compliance requirements increasing across multiple sectors. Recommend enhanced monitoring and early engagement with customs brokers.'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'medium', 5.5, 6.2, 5.8,
    'Moderate risk environment with stable regulatory framework. Minor delays expected due to increased documentation requirements.'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'low', 4.2, 4.8, 4.5,
    'Low risk corridor with established compliance procedures. Smooth operations expected across all major ports.'
  );

-- ============================================================
-- Corridor Events
-- ============================================================
INSERT INTO corridor_events (corridor_id, title, description, event_date, severity) VALUES
  ('11111111-1111-1111-1111-111111111111', 'CBIC Notification on Electronics',  'New import licensing requirements for HS codes 8541-8542',          CURRENT_DATE - 2,  'high'),
  ('11111111-1111-1111-1111-111111111111', 'Mumbai Port Congestion',             'Container dwell time increased by 18% due to customs system upgrade', CURRENT_DATE - 5,  'medium'),
  ('11111111-1111-1111-1111-111111111111', 'BIS Quality Standards Update',       'Revised certification requirements for consumer electronics',          CURRENT_DATE - 7,  'medium'),
  ('11111111-1111-1111-1111-111111111111', 'RBI Policy Announcement',            'New guidelines on foreign exchange transactions',                      CURRENT_DATE - 10, 'low'),
  ('11111111-1111-1111-1111-111111111111', 'DGFT Circular Released',             'Updated export-import policy for Q1 2026',                            CURRENT_DATE - 14, 'low');

-- ============================================================
-- Verify counts
-- ============================================================
SELECT 'corridors'               AS table_name, COUNT(*) AS rows FROM corridors
UNION ALL SELECT 'alerts',                COUNT(*) FROM alerts
UNION ALL SELECT 'signals',               COUNT(*) FROM signals
UNION ALL SELECT 'sectors',               COUNT(*) FROM sectors
UNION ALL SELECT 'corridor_indexes',      COUNT(*) FROM corridor_indexes
UNION ALL SELECT 'corridor_briefings',    COUNT(*) FROM corridor_briefings
UNION ALL SELECT 'corridor_events',       COUNT(*) FROM corridor_events
UNION ALL SELECT 'corridor_signal_snapshots', COUNT(*) FROM corridor_signal_snapshots;
