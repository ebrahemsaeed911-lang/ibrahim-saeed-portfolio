-- =============================================
-- Script 2: User Count Function (signup detection)
-- =============================================

-- SECURITY DEFINER: runs with owner's permissions so anonymous users can read auth.users count
CREATE OR REPLACE FUNCTION get_auth_user_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT count(*)::integer FROM auth.users;
$$;
