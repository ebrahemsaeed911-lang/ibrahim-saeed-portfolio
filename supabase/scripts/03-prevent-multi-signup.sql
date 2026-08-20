-- =============================================
-- Script 3: Prevent Multi-User Registration
-- =============================================

-- Function: blocks signup if 1+ users already exist
CREATE OR REPLACE FUNCTION prevent_multi_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (SELECT count(*) FROM auth.users) >= 1 THEN
    RAISE EXCEPTION 'Registration is closed. Only one admin account is allowed.';
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
