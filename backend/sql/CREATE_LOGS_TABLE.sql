-- TABEL LOG AKTIVITAS (AUDIT TRAIL)
-- Jalankan ini di SQL Editor Supabase

CREATE TABLE IF NOT EXISTS public.logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    user_name TEXT,
    user_email TEXT,
    user_role INTEGER,
    action TEXT NOT NULL,
    module TEXT,
    type TEXT DEFAULT 'info', -- info, create, update, delete
    payload JSONB, -- menyimpan data lama/baru jika diperlukan
    ip_address TEXT
);

-- Atur Policy agar hanya Admin yang bisa baca (Optional, sesuaikan kebutuhan)
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all logs" ON public.logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN (1, 2)
        )
    );

CREATE POLICY "Anyone can insert logs" ON public.logs
    FOR INSERT WITH CHECK (true);

-- Indexing untuk performa filter
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_type ON public.logs (type);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs (user_id);
