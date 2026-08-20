-- =============================================
-- Script 4: Login Rate Limiting (3 attempts / 15 min ban)
-- =============================================

-- Table: stores every login attempt
CREATE TABLE IF NOT EXISTS login_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  attempted_at timestamptz DEFAULT now() NOT NULL,
  success boolean DEFAULT false NOT NULL
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts (email, attempted_at DESC);

-- Enable RLS (only service_role can access via Edge Function)
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON login_attempts;
CREATE POLICY "Service role only" ON login_attempts
  FOR ALL USING (false);

-- Function: check if email is banned (>= 3 failed in last 15 min)
CREATE OR REPLACE FUNCTION is_email_banned(check_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT count(*) >= 3
  FROM login_attempts
  WHERE email = check_email
    AND success = false
    AND attempted_at > now() - interval '15 minutes';
$$;

-- Function: record a login attempt
CREATE OR REPLACE FUNCTION record_login_attempt(attempt_email text, was_success boolean)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO login_attempts (email, success) VALUES (attempt_email, was_success);
$$;

-- Function: clear attempts on successful login
CREATE OR REPLACE FUNCTION clear_login_attempts(clear_email text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM login_attempts WHERE email = clear_email;
$$;

-- Function: get remaining ban time in seconds (0 if not banned)
CREATE OR REPLACE FUNCTION get_ban_remaining(check_email text)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT CASE
    WHEN count(*) < 3 THEN 0
    ELSE EXTRACT(EPOCH FROM (
      (SELECT min(attempted_at) + interval '15 minutes'
       FROM login_attempts
       WHERE email = check_email AND success = false
       AND attempted_at > now() - interval '15 minutes')
      - now()
    ))::integer
  END
  FROM login_attempts
  WHERE email = check_email
    AND success = false
    AND attempted_at > now() - interval '15 minutes';
$$;
