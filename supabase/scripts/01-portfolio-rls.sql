-- =============================================
-- Script 1: Portfolio Data & RLS
-- =============================================

-- Enable RLS on portfolio_data
ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;

-- Public can read portfolio data
DROP POLICY IF EXISTS "Public read" ON portfolio_data;
CREATE POLICY "Public read" ON portfolio_data
  FOR SELECT USING (true);

-- Only authenticated users can modify portfolio data
DROP POLICY IF EXISTS "Auth write" ON portfolio_data;
CREATE POLICY "Auth write" ON portfolio_data
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth update" ON portfolio_data;
CREATE POLICY "Auth update" ON portfolio_data
  FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth delete" ON portfolio_data;
CREATE POLICY "Auth delete" ON portfolio_data
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Storage Policies for portfolio-images bucket
DROP POLICY IF EXISTS "Public read" ON storage.objects;
CREATE POLICY "Public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Auth upload" ON storage.objects;
CREATE POLICY "Auth upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-images'
    AND auth.uid() IS NOT NULL
    AND storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')
  );

DROP POLICY IF EXISTS "Auth update" ON storage.objects;
CREATE POLICY "Auth update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio-images'
    AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Auth delete" ON storage.objects;
CREATE POLICY "Auth delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio-images'
    AND auth.uid() IS NOT NULL
  );
