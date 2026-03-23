-- ============================================================
-- MASTER DASHBOARD SCHEMA
-- Only 3 emails have access (enforced at RLS level)
-- ============================================================

-- 1. Master admins whitelist
CREATE TABLE IF NOT EXISTS master_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed the 3 allowed emails (replace with real ones)
INSERT INTO master_admins (email) VALUES
  ('admin1@yourdomain.com'),
  ('admin2@yourdomain.com'),
  ('admin3@yourdomain.com')
ON CONFLICT (email) DO NOTHING;

-- Helper function: is current user a master admin?
CREATE OR REPLACE FUNCTION is_master_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM master_admins
    WHERE email = auth.jwt() ->> 'email'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- 2. Stripe Payments table
-- ============================================================
CREATE TABLE IF NOT EXISTS stripe_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free',          -- free | starter | pro | enterprise
  status TEXT NOT NULL DEFAULT 'incomplete',  -- active | past_due | canceled | incomplete
  amount_cents INTEGER,
  currency TEXT DEFAULT 'gbp',
  interval TEXT DEFAULT 'month',              -- month | year
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE stripe_payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own payment record
CREATE POLICY "Users view own payments"
  ON stripe_payments FOR SELECT
  USING (auth.uid() = user_id);

-- Only master admins can do everything
CREATE POLICY "Admins full access payments"
  ON stripe_payments FOR ALL
  USING (is_master_admin());

CREATE TRIGGER update_stripe_payments_updated_at
  BEFORE UPDATE ON stripe_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 3. Admin query log (audit trail for natural-language queries)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_query_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email TEXT NOT NULL,
  natural_query TEXT NOT NULL,
  generated_sql TEXT NOT NULL,
  rows_affected INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_query_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access query log"
  ON admin_query_log FOR ALL
  USING (is_master_admin());

-- ============================================================
-- 4. Extend user_profiles with subscription fields
-- ============================================================
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP WITH TIME ZONE;

-- Allow admins to read/write all user profiles
CREATE POLICY "Admins full access user_profiles"
  ON user_profiles FOR ALL
  USING (is_master_admin());

-- Allow admins to read/write all alerts
CREATE POLICY "Admins full access alerts"
  ON alerts FOR ALL
  USING (is_master_admin());

-- Allow admins to read/write all signals
CREATE POLICY "Admins full access signals"
  ON signals FOR ALL
  USING (is_master_admin());

-- Allow admins to read/write all risk assessments
CREATE POLICY "Admins full access risk_assessments"
  ON risk_assessments FOR ALL
  USING (is_master_admin());

-- ============================================================
-- 5. Stripe webhook events log (raw events from Stripe)
-- ============================================================
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access webhook events"
  ON stripe_webhook_events FOR ALL
  USING (is_master_admin());

-- ============================================================
-- 6. Useful admin views
-- ============================================================

-- Overview: users with their payment status
CREATE OR REPLACE VIEW admin_users_overview AS
SELECT
  up.user_id,
  up.full_name,
  up.email,
  up.company_name,
  up.trade_corridor,
  up.subscription_status,
  up.plan,
  up.plan_expires_at,
  sp.stripe_subscription_id,
  sp.status AS stripe_status,
  sp.plan AS stripe_plan,
  sp.amount_cents,
  sp.currency,
  sp.current_period_end,
  up.created_at
FROM user_profiles up
LEFT JOIN stripe_payments sp ON sp.user_id = up.user_id;

-- Revenue summary
CREATE OR REPLACE VIEW admin_revenue_summary AS
SELECT
  plan,
  status,
  currency,
  COUNT(*) AS count,
  SUM(amount_cents) AS total_cents
FROM stripe_payments
GROUP BY plan, status, currency;

-- ============================================================
-- 7. RPC: admin_run_query
-- Executes arbitrary SQL, only callable by master admins.
-- Returns rows as JSONB array.
-- ============================================================
CREATE OR REPLACE FUNCTION admin_run_query(sql_query TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  IF NOT is_master_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  EXECUTE 'SELECT jsonb_agg(row_to_json(t)) FROM (' || sql_query || ') t' INTO result;
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
