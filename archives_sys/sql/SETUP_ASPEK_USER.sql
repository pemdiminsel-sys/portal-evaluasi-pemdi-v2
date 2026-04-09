-- EXECUTE IN SUPABASE SQL EDITOR
-- Menambahkan relasi aspekt_id untuk Tim Asesor Internal

-- 1. Tambahkan kolom aspek_id
ALTER TABLE users ADD COLUMN IF NOT EXISTS aspek_id INT REFERENCES aspeks(id) ON DELETE SET NULL;
