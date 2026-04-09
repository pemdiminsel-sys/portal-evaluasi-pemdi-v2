-- SETUP_STORAGE.sql
-- Digunakan untuk membuat bucket storage "surat-tugas" dan mengonfigurasi akses publik (RLS)

-- 1. Membuat Bucket "surat-tugas" (Public = True)
INSERT INTO storage.buckets (id, name, public)
VALUES ('surat-tugas', 'surat-tugas', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Mengizinkan publik untuk melihat file di dalam bucket (Akses Read)
CREATE POLICY "Public Access Surat Tugas" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'surat-tugas' );

-- 3. Mengizinkan publik/anonymous untuk mengupload (Akses Insert saat registrasi)
CREATE POLICY "Anon Upload Surat Tugas" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'surat-tugas' );

-- 4. Membuat Bucket "bukti-dukung" (Public = True)
INSERT INTO storage.buckets (id, name, public)
VALUES ('bukti-dukung', 'bukti-dukung', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Mengizinkan publik untuk melihat file di dalam bucket (Akses Read)
CREATE POLICY "Public Access Bukti Dukung" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'bukti-dukung' );

-- 6. Mengizinkan upload bukti dukung
CREATE POLICY "Upload Bukti Dukung" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'bukti-dukung' );

-- 7. Mengizinkan update/delete bukti dukung
CREATE POLICY "Update Delete Bukti Dukung" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'bukti-dukung' );

CREATE POLICY "Delete Bukti Dukung" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'bukti-dukung' );
