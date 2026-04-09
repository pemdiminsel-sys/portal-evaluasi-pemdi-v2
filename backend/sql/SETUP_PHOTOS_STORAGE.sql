-- SETUP_PHOTOS_STORAGE.sql
-- Digunakan untuk membuat bucket "photos" untuk pas foto profil user

-- 1. Buat bucket jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Kebijakan Akses: Publik bisa melihat (SELECT)
DROP POLICY IF EXISTS "Public Access Photos" ON storage.objects;
CREATE POLICY "Public Access Photos" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'photos' );

-- 3. Kebijakan Unggah: User yang login bisa mengunggah ke folder miliknya sendiri (berdasarkan UUID)
DROP POLICY IF EXISTS "Auth Upload Photos" ON storage.objects;
CREATE POLICY "Auth Upload Photos" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK ( bucket_id = 'photos' );

-- 4. Kebijakan Update/Delete: User hanya bisa mengubah fotonya sendiri
DROP POLICY IF EXISTS "Owner Update Photos" ON storage.objects;
CREATE POLICY "Owner Update Photos" 
ON storage.objects FOR UPDATE 
TO authenticated
USING ( bucket_id = 'photos' );

DROP POLICY IF EXISTS "Owner Delete Photos" ON storage.objects;
CREATE POLICY "Owner Delete Photos" 
ON storage.objects FOR DELETE 
TO authenticated
USING ( bucket_id = 'photos' );
