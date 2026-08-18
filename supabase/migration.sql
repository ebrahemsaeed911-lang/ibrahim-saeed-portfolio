-- 1. Update image paths from .png to .webp
UPDATE portfolio_data
SET data = replace(data::text, '.png', '.webp')::jsonb
WHERE id = 1;

-- 2. Create RPC function for admin auth (signup vs login detection)
-- SECURITY INVOKER: runs with caller's permissions, not owner's
-- This prevents leaking user count to unauthenticated users via RLS
CREATE OR REPLACE FUNCTION get_auth_user_count()
RETURNS integer
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT count(*)::integer FROM auth.users;
$$;

-- 3. Enable RLS on portfolio_data (run once)
ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;

-- 4. Public can read portfolio data
DROP POLICY IF EXISTS "Public read" ON portfolio_data;
CREATE POLICY "Public read" ON portfolio_data
  FOR SELECT USING (true);

-- 5. Only authenticated users can modify portfolio data
DROP POLICY IF EXISTS "Auth write" ON portfolio_data;
CREATE POLICY "Auth write" ON portfolio_data
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth update" ON portfolio_data;
CREATE POLICY "Auth update" ON portfolio_data
  FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth delete" ON portfolio_data;
CREATE POLICY "Auth delete" ON portfolio_data
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================================
-- 6. Storage Policies for portfolio-images bucket
-- ============================================================

-- Public can view images (needed for portfolio display)
DROP POLICY IF EXISTS "Public read" ON storage.objects;
CREATE POLICY "Public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

-- Only authenticated users can upload images (restricted to safe image types)
DROP POLICY IF EXISTS "Auth upload" ON storage.objects;
CREATE POLICY "Auth upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-images'
    AND auth.uid() IS NOT NULL
    AND storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')
  );

-- Only authenticated users can update (replace) images
DROP POLICY IF EXISTS "Auth update" ON storage.objects;
CREATE POLICY "Auth update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio-images'
    AND auth.uid() IS NOT NULL
  );

-- Only authenticated users can delete images
DROP POLICY IF EXISTS "Auth delete" ON storage.objects;
CREATE POLICY "Auth delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio-images'
    AND auth.uid() IS NOT NULL
  );
