-- SETUP_STORAGE.sql
-- Digunakan untuk membuat bucket storage dan mengonfigurasi akses publik (RLS)

-- ==========================================
-- 1. SETUP BUCKET "surat-tugas"
-- ==========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('surat-tugas', 'surat-tugas', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access Surat Tugas" ON storage.objects;
CREATE POLICY "Public Access Surat Tugas" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'surat-tugas' );

DROP POLICY IF EXISTS "Anon Upload Surat Tugas" ON storage.objects;
CREATE POLICY "Anon Upload Surat Tugas" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'surat-tugas' );

-- ==========================================
-- 2. SETUP BUCKET "bukti-dukung"
-- ==========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('bukti-dukung', 'bukti-dukung', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access Bukti Dukung" ON storage.objects;
CREATE POLICY "Public Access Bukti Dukung" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'bukti-dukung' );

DROP POLICY IF EXISTS "Upload Bukti Dukung" ON storage.objects;
CREATE POLICY "Upload Bukti Dukung" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'bukti-dukung' );

DROP POLICY IF EXISTS "Update Delete Bukti Dukung" ON storage.objects;
CREATE POLICY "Update Delete Bukti Dukung" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'bukti-dukung' );

DROP POLICY IF EXISTS "Delete Bukti Dukung" ON storage.objects;
CREATE POLICY "Delete Bukti Dukung" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'bukti-dukung' );
