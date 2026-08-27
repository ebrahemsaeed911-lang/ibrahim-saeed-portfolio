-- =============================================
-- Script 5: Email Allowlist (authorized admin email)
-- =============================================
-- Even if the single account is deleted, ONLY the
-- email in allowed_admin_emails can register.

-- Table: authorized emails
CREATE TABLE IF NOT EXISTS allowed_admin_emails (
  email text PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

-- Seed the allowed email (edit this manually to change)
INSERT INTO allowed_admin_emails (email)
VALUES ('ebrahemsaeed911@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Updated function: block multi-registration AND non-allowed emails
CREATE OR REPLACE FUNCTION prevent_multi_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Condition 1: block if any user already exists
  IF (SELECT count(*) FROM auth.users) >= 1 THEN
    RAISE EXCEPTION 'Registration is closed. Only one admin account is allowed.';
  END IF;

  -- Condition 2: block emails not in the allowlist
  IF NOT EXISTS (SELECT 1 FROM allowed_admin_emails WHERE email = NEW.email) THEN
    RAISE EXCEPTION 'This email is not authorized to register.';
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger: fires before any INSERT on auth.users
DROP TRIGGER IF EXISTS check_user_limit ON auth.users;
CREATE TRIGGER check_user_limit
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_multi_signup();