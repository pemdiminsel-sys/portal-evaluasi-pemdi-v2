import { createClient } from '@supabase/supabase-js';

// Kunci ini aman ditaruh di frontend (Public Anon Key)
const SUPABASE_URL = 'https://rgmxobrceqtnnxvmkhji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbXhvYnJjZXF0bm54dm1raGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDUyNzAsImV4cCI6MjA5MTA4MTI3MH0.g7BvuCYNsdCslnlmfadh4gKUKp-XpkKULno1rhSLM4w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
