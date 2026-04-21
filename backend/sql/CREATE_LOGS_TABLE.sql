-- TABEL LOG AKTIVITAS (AUDIT TRAIL)
-- Jalankan ini di SQL Editor Supabase

CREATE TABLE IF NOT EXISTS public.logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id BIGINT,
    user_name TEXT,
    user_email TEXT,
    user_role INTEGER,
    action TEXT NOT NULL,
    module TEXT,
    type TEXT DEFAULT 'info', -- info, create, update, delete
    payload JSONB, -- menyimpan data lama/baru jika diperlukan
    ip_address TEXT
);

-- Atur Policy
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Karena aplikasi menggunakan integer ID di public.users, bukan auth.users UUID,
-- policy disederhanakan agar frontend (dengan key public) dapat merekam dan menampilkan logs.
-- Authentikasi dibatasi secara aman di level aplikasi (Edge Functions/Laravel).

CREATE POLICY "Enable read access for all users" ON public.logs
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.logs
    FOR INSERT WITH CHECK (true);

-- Indexing untuk performa filter
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_type ON public.logs (type);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs (user_id);

