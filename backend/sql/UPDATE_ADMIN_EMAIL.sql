-- SCRIPT UNTUK MENGUBAH EMAIL SUPER ADMIN
-- Jalankan ini di SQL Editor Supabase

-- 1. Update di tabel otentikasi utama
UPDATE auth.users 
SET 
  email = 'spbe@diskominfo.minselkab.go.id',
  email_confirmed_at = NOW(), -- Pastikan tetap terverifikasi
  updated_at = NOW()
WHERE email = 'admin@gmail.com';

-- 2. Update di tabel profil publik (Matrix User)
UPDATE public.users 
SET 
  email = 'spbe@diskominfo.minselkab.go.id',
  updated_at = NOW()
WHERE email = 'admin@gmail.com';

-- Verifikasi hasil
SELECT id, email, role FROM public.users WHERE email = 'spbe@diskominfo.minselkab.go.id';
