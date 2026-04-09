import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rgmxobrceqtnnxvmkhji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbXhvYnJjZXF0bm54dm1raGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDUyNzAsImV4cCI6MjA5MTA4MTI3MH0.g7BvuCYNsdCslnlmfadh4gKUKp-XpkKULno1rhSLM4w';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
    console.log('--- Checking Periodes ---');
    const { data: periodes, error: pError } = await supabase.from('periodes').select('*');
    if (pError) console.error('Error periodes:', pError);
    else console.log('Periodes Data:', JSON.stringify(periodes, null, 2));

    console.log('\n--- Checking Current Session ---');
    // We can't easily check actual session here, but let's see table structure
}

check();
