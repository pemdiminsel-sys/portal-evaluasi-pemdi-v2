import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rgmxobrceqtnnxvmkhji.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbXhvYnJjZXF0bm54dm1raGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDUyNzAsImV4cCI6MjA5MTA4MTI3MH0.g7BvuCYNsdCslnlmfadh4gKUKp-XpkKULno1rhSLM4w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
