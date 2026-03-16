-- ============================================
-- ADVUMAN - Complete Database Schema
-- No Express backend needed - Supabase handles everything!
-- ============================================

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_end_date TIMESTAMP WITH TIME ZONE,
  subscription_status TEXT DEFAULT 'trial',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Corridors Table
CREATE TABLE IF NOT EXISTS corridors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts Table (replaces SAMPLE_ALERTS)
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  source TEXT,
  corridor_id UUID REFERENCES corridors(id),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Signals Table (replaces hardcoded signals)
CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence TEXT NOT NULL,
  impact TEXT NOT NULL,
  analyst_note TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  hs_code TEXT,
  source TEXT,
  corridor_id UUID REFERENCES corridors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes Table (replaces INDEX_DATA)
CREATE TABLE IF NOT EXISTS corridor_indexes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corridor_id UUID REFERENCES corridors(id),
  index_type TEXT NOT NULL CHECK (index_type IN ('RPI', 'LSI', 'CPI')),
  value NUMERIC NOT NULL,
  change_value NUMERIC,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sectors Table (replaces SECTORS)
CREATE TABLE IF NOT EXISTS sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  alert_count INTEGER DEFAULT 0,
  risk_level TEXT CHECK (risk_level IN ('critical', 'high', 'medium', 'low')),
  corridor_id UUID REFERENCES corridors(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Corridor Briefings Table
CREATE TABLE IF NOT EXISTS corridor_briefings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corridor_id UUID REFERENCES corridors(id),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('critical', 'high', 'medium', 'low')),
  rpi_value NUMERIC NOT NULL,
  lsi_value NUMERIC NOT NULL,
  cpi_value NUMERIC NOT NULL,
  summary_text TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Corridor Events Table
CREATE TABLE IF NOT EXISTS corridor_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corridor_id UUID REFERENCES corridors(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Corridor Signal Snapshots (for historical charts)
CREATE TABLE IF NOT EXISTS corridor_signal_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corridor_id UUID REFERENCES corridors(id),
  snapshot_date DATE NOT NULL,
  rpi_value NUMERIC NOT NULL,
  lsi_value NUMERIC NOT NULL,
  cpi_value NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Alert Preferences Table
CREATE TABLE IF NOT EXISTS user_alert_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_alerts BOOLEAN DEFAULT true,
  in_app_alerts BOOLEAN DEFAULT true,
  whatsapp_alerts BOOLEAN DEFAULT false,
  critical_only BOOLEAN DEFAULT false,
  frequency TEXT DEFAULT 'realtime',
  categories JSONB DEFAULT '{"regulatory": true, "logistics": true, "tariff": true, "standards": false, "financial": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Risk Assessments Table
CREATE TABLE IF NOT EXISTS risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product TEXT NOT NULL,
  trade_value NUMERIC,
  hs_code TEXT,
  origin TEXT NOT NULL,
  experience TEXT NOT NULL,
  assessment_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Corridors (public read)
ALTER TABLE corridors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view corridors" ON corridors FOR SELECT USING (true);

-- Alerts (public read)
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view alerts" ON alerts FOR SELECT USING (true);

-- Signals (public read)
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view signals" ON signals FOR SELECT USING (true);

-- Indexes (public read)
ALTER TABLE corridor_indexes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view indexes" ON corridor_indexes FOR SELECT USING (true);

-- Sectors (public read)
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view sectors" ON sectors FOR SELECT USING (true);

-- Briefings (public read)
ALTER TABLE corridor_briefings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view briefings" ON corridor_briefings FOR SELECT USING (true);

-- Events (public read)
ALTER TABLE corridor_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON corridor_events FOR SELECT USING (true);

-- Snapshots (public read)
ALTER TABLE corridor_signal_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view snapshots" ON corridor_signal_snapshots FOR SELECT USING (true);

-- User Alert Preferences
ALTER TABLE user_alert_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own alert preferences" ON user_alert_preferences FOR ALL USING (auth.uid() = user_id);

-- Risk Assessments
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own risk assessments" ON risk_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create risk assessments" ON risk_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_alert_preferences_updated_at ON user_alert_preferences;
CREATE TRIGGER update_user_alert_preferences_updated_at 
  BEFORE UPDATE ON user_alert_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sectors_updated_at ON sectors;
CREATE TRIGGER update_sectors_updated_at 
  BEFORE UPDATE ON sectors 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_alerts_corridor ON alerts(corridor_id);
CREATE INDEX IF NOT EXISTS idx_alerts_date ON alerts(date DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);

CREATE INDEX IF NOT EXISTS idx_signals_corridor ON signals(corridor_id);
CREATE INDEX IF NOT EXISTS idx_signals_created ON signals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_corridor_indexes_corridor ON corridor_indexes(corridor_id);
CREATE INDEX IF NOT EXISTS idx_corridor_indexes_date ON corridor_indexes(snapshot_date DESC);

CREATE INDEX IF NOT EXISTS idx_briefings_corridor ON corridor_briefings(corridor_id);
CREATE INDEX IF NOT EXISTS idx_briefings_generated ON corridor_briefings(generated_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_corridor ON corridor_events(corridor_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON corridor_events(event_date DESC);

CREATE INDEX IF NOT EXISTS idx_snapshots_corridor ON corridor_signal_snapshots(corridor_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_date ON corridor_signal_snapshots(snapshot_date DESC);

-- ============================================
-- ENABLE REALTIME
-- ============================================

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE corridors;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE signals;
ALTER PUBLICATION supabase_realtime ADD TABLE corridor_indexes;
ALTER PUBLICATION supabase_realtime ADD TABLE sectors;
ALTER PUBLICATION supabase_realtime ADD TABLE corridor_briefings;
ALTER PUBLICATION supabase_realtime ADD TABLE corridor_events;
ALTER PUBLICATION supabase_realtime ADD TABLE corridor_signal_snapshots;
