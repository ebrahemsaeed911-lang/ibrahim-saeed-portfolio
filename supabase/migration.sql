-- 1. Update image paths from .png to .webp
UPDATE portfolio_data
SET data = replace(data::text, '.png', '.webp')::jsonb
WHERE id = 1;

-- 2. Create RPC function for admin auth (signup vs login detection)
CREATE OR REPLACE FUNCTION get_auth_user_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT count(*)::integer FROM auth.users;
$$;
