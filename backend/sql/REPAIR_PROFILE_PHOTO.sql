-- REPAIR_PROFILE_PHOTO.sql
-- Run this if photo upload fails

-- 1. Ensure table column exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 2. Setup Bucket (Alternative version if previous script failed)
-- Make sure you have 'photos' bucket created in Supabase Dashboard -> Storage
-- with 'Public' toggle ON.

-- 3. Reset Policies for 'photos' (Full Access for Auth Users)
DROP POLICY IF EXISTS "Public Access Photos" ON storage.objects;
CREATE POLICY "Public Access Photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "Auth Upload Photos" ON storage.objects;
CREATE POLICY "Auth Upload Photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');

DROP POLICY IF EXISTS "Owner Management" ON storage.objects;
CREATE POLICY "Owner Management" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "Allow All Auth in Photos" ON storage.objects;
CREATE POLICY "Allow All Auth in Photos" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'photos') WITH CHECK (bucket_id = 'photos');
