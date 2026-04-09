
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rgmxobrceqtnnxvmkhji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbXhvYnJjZXF0bm54dm1raGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDUyNzAsImV4cCI6MjA5MTA4MTI3MH0.g7BvuCYNsdCslnlmfadh4gKUKp-XpkKULno1rhSLM4w';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    console.log('\n--- Checking Session ---');
    const { data: { session }, error: sError } = await supabase.auth.getSession();
    console.log('Session present:', !!session);

    console.log('\n--- Checking Periodes Access ---');
    const { data: pCount, error: pcError } = await supabase.from('periodes').select('id');
    if (pcError) console.error('Error p count:', pcError);
    else console.log('Periodes count:', pCount?.length);

check();
