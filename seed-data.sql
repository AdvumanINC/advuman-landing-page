-- ============================================
-- SEED DATA - Sample data for testing
-- Run this AFTER running supabase-schema-complete.sql
-- ============================================

-- Insert Corridors
INSERT INTO corridors (name, origin_country, destination_country, description) VALUES
  ('UK-India Trade Corridor', 'United Kingdom', 'India', 'Primary trade route between UK and India'),
  ('US-India Trade Corridor', 'United States', 'India', 'Major trade route between US and India'),
  ('Germany-India Trade Corridor', 'Germany', 'India', 'EU-India trade via Germany'),
  ('UK-China Trade Corridor', 'United Kingdom', 'China', 'UK-China bilateral trade route'),
  ('Australia-India Trade Corridor', 'Australia', 'India', 'Indo-Pacific trade corridor')
ON CONFLICT DO NOTHING;

-- Get corridor IDs for reference
DO $$
DECLARE
  uk_india_id uuid;
  us_india_id uuid;
  germany_india_id uuid;
BEGIN
  SELECT id INTO uk_india_id FROM corridors WHERE name = 'UK-India Trade Corridor' LIMIT 1;
  SELECT id INTO us_india_id FROM corridors WHERE name = 'US-India Trade Corridor' LIMIT 1;
  SELECT id INTO germany_india_id FROM corridors WHERE name = 'Germany-India Trade Corridor' LIMIT 1;

  -- Insert Alerts
  INSERT INTO alerts (title, summary, severity, category, date, source, corridor_id, tags) VALUES
    ('India DPIIT Issues New FDI Policy Circular', 
     'Department for Promotion of Industry and Internal Trade released revised FDI guidelines affecting e-commerce, defence, and insurance sectors. UK firms with Indian JVs should review compliance within 90-day window.',
     'critical', 'Regulatory', CURRENT_DATE - 3, 'DPIIT Gazette Notification', uk_india_id, 
     ARRAY['FDI', 'compliance', 'e-commerce']),
    
    ('CBIC Revises Anti-Dumping Duties on UK Steel Imports',
     'Central Board of Indirect Taxes and Customs has initiated a sunset review of anti-dumping duties on certain steel products imported from the UK. Provisional duty rate increased from 12.4% to 18.7%.',
     'high', 'Tariff', CURRENT_DATE - 4, 'CBIC Notification No. 04/2026', uk_india_id,
     ARRAY['anti-dumping', 'steel', 'tariffs']),
    
    ('UK-India FTA Round 16 Concluded — Services Chapter Stalled',
     '16th round of UK-India FTA negotiations concluded in New Delhi. Progress on goods market access but services chapter remains contentious. Mode 4 (movement of natural persons) is the key sticking point.',
     'medium', 'Trade Agreement', CURRENT_DATE - 6, 'UK DBT Press Release / MEA Statement', uk_india_id,
     ARRAY['FTA', 'services', 'Mode 4']),
    
    ('RBI Tightens External Commercial Borrowing Norms',
     'Reserve Bank of India revised ECB framework. All-in-cost ceiling reduced by 50bps. UK lenders providing trade finance to Indian importers should review pricing structures.',
     'medium', 'Financial', CURRENT_DATE - 7, 'RBI/2026-27/14', uk_india_id,
     ARRAY['ECB', 'trade finance', 'RBI']),
    
    ('BIS Updates Quality Control Orders for Electronics',
     'Bureau of Indian Standards expanded mandatory certification list for electronic components. 47 new product categories added. UK electronics exporters have 180-day compliance window.',
     'low', 'Standards', CURRENT_DATE - 9, 'BIS QCO Notification', uk_india_id,
     ARRAY['BIS', 'electronics', 'certification']),
    
    ('India Raises Customs Duty on Medical Devices',
     'Union Budget 2026-27 increased basic customs duty on imported medical devices from 7.5% to 15%. Affects UK medtech exporters including diagnostics, implants, and surgical instruments.',
     'high', 'Tariff', CURRENT_DATE - 10, 'Finance Bill 2026', uk_india_id,
     ARRAY['medical devices', 'customs duty', 'budget']);

  -- Insert Signals
  INSERT INTO signals (location, category, description, confidence, impact, analyst_note, severity, hs_code, source, corridor_id) VALUES
    ('Mumbai Port', 'Logistics', 'Container dwell time increased by 18% due to customs system upgrade', 
     'High', 'Delay', 'Expect 2-3 day delays for next 10 days', 'medium', '8471', 'Port Authority', uk_india_id),
    
    ('New Delhi', 'Regulatory', 'DGFT circular on import licensing for electronics components',
     'Verified', 'Compliance', 'Mandatory for HS codes 8541-8542. 30-day implementation window', 'high', '8541', 'DGFT', uk_india_id),
    
    ('Chennai', 'Market', 'Steel prices up 12% following new quality control orders',
     'Medium', 'Cost', 'BIS certification now required. Factor 8-10% cost increase', 'medium', '7208', 'Market Intelligence', uk_india_id),
    
    ('Bangalore', 'Regulatory', 'IT services tax clarification issued by CBDT',
     'Verified', 'Tax', 'Withholding tax rate confirmed at 10% for UK entities', 'low', 'N/A', 'CBDT', uk_india_id),
    
    ('Kolkata Port', 'Logistics', 'Port strike averted - operations normal',
     'High', 'Positive', 'Wage agreement reached. No disruption expected', 'low', 'All', 'Port Union', uk_india_id);

  -- Insert Sectors
  INSERT INTO sectors (name, alert_count, risk_level, corridor_id) VALUES
    ('Pharmaceuticals', 12, 'high', uk_india_id),
    ('IT Services', 8, 'medium', uk_india_id),
    ('Textiles & Apparel', 6, 'medium', uk_india_id),
    ('Auto Components', 9, 'high', uk_india_id),
    ('Food & Agri', 4, 'low', uk_india_id),
    ('Medical Devices', 11, 'critical', uk_india_id),
    ('Electronics', 7, 'medium', uk_india_id),
    ('Steel & Metals', 10, 'high', uk_india_id);

  -- Insert Index History (30 days for UK-India)
  FOR i IN 0..29 LOOP
    INSERT INTO corridor_indexes (corridor_id, index_type, value, change_value, snapshot_date) VALUES
      (uk_india_id, 'RPI', 5.1 + (i * 0.07) + (random() * 0.3), 0.8, CURRENT_DATE - (29 - i)),
      (uk_india_id, 'LSI', 6.8 - (i * 0.035) + (random() * 0.2), -0.3, CURRENT_DATE - (29 - i)),
      (uk_india_id, 'CPI', 4.2 + (i * 0.08) + (random() * 0.2), 1.2, CURRENT_DATE - (29 - i));
  END LOOP;

  -- Insert Corridor Briefing
  INSERT INTO corridor_briefings (corridor_id, risk_level, rpi_value, lsi_value, cpi_value, summary_text) VALUES
    (uk_india_id, 'high', 7.2, 5.8, 6.5, 
     'Elevated regulatory pressure due to recent CBIC notifications on electronics imports and revised FDI guidelines. Port congestion at Mumbai affecting logistics timelines. Compliance requirements increasing across multiple sectors. Recommend enhanced monitoring and early engagement with customs brokers.');

  -- Insert Corridor Events
  INSERT INTO corridor_events (corridor_id, title, description, event_date, severity) VALUES
    (uk_india_id, 'CBIC Notification on Electronics', 'New import licensing requirements for HS codes 8541-8542', CURRENT_DATE - 2, 'high'),
    (uk_india_id, 'Mumbai Port Congestion', 'Container dwell time increased by 18% due to customs system upgrade', CURRENT_DATE - 5, 'medium'),
    (uk_india_id, 'BIS Quality Standards Update', 'Revised certification requirements for consumer electronics', CURRENT_DATE - 7, 'medium'),
    (uk_india_id, 'RBI Policy Announcement', 'New guidelines on foreign exchange transactions', CURRENT_DATE - 10, 'low'),
    (uk_india_id, 'DGFT Circular Released', 'Updated export-import policy for Q1 2026', CURRENT_DATE - 14, 'low');

  -- Insert Signal Snapshots (12 data points for charts)
  FOR i IN 0..11 LOOP
    INSERT INTO corridor_signal_snapshots (corridor_id, snapshot_date, rpi_value, lsi_value, cpi_value) VALUES
      (uk_india_id, CURRENT_DATE - (11 - i) * 2, 
       5.1 + (i * 0.175) + (random() * 0.3),
       6.8 - (i * 0.09) + (random() * 0.2),
       4.2 + (i * 0.19) + (random() * 0.2));
  END LOOP;

  -- Add data for other corridors
  INSERT INTO corridor_briefings (corridor_id, risk_level, rpi_value, lsi_value, cpi_value, summary_text) VALUES
    (us_india_id, 'medium', 5.5, 6.2, 5.8, 
     'Moderate risk environment with stable regulatory framework. Minor delays expected due to increased documentation requirements.'),
    (germany_india_id, 'low', 4.2, 4.8, 4.5, 
     'Low risk corridor with established compliance procedures. Smooth operations expected across all major ports.');

END $$;

-- Verify data
SELECT 'Corridors:', COUNT(*) FROM corridors;
SELECT 'Alerts:', COUNT(*) FROM alerts;
SELECT 'Signals:', COUNT(*) FROM signals;
SELECT 'Sectors:', COUNT(*) FROM sectors;
SELECT 'Indexes:', COUNT(*) FROM corridor_indexes;
SELECT 'Briefings:', COUNT(*) FROM corridor_briefings;
SELECT 'Events:', COUNT(*) FROM corridor_events;
SELECT 'Snapshots:', COUNT(*) FROM corridor_signal_snapshots;
