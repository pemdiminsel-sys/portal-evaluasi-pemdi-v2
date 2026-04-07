import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.replace('/api/', '')

    // --- ROUTING API ---

    // A. Endpoint: Cek Periode (GET)
    if (path === 'periode' && req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('periodes')
        .select('*')
        .order('tahun', { ascending: false })
      
      return new Response(JSON.stringify(data || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // B. Endpoint: Login (POST)
    if (path === 'login' && req.method === 'POST') {
      const { email, password } = await req.json()
      
      // Catatan: Ini contoh login simpel ke tabel users Anda
      const { data: user, error } = await supabaseClient
        .from('users')
        .select('*, opds(*)')
        .eq('email', email)
        .single()

      if (error || !user) {
        return new Response(JSON.stringify({ success: false, message: 'Email tidak ditemukan' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Untuk sementara, kita pakai token dummy agar user bisa masuk ke Dashboard
      return new Response(JSON.stringify({ 
        success: true, 
        token: 'supabase_token_' + Math.random(),
        user: user 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ message: "Endpoint not found" }), {
      status: 404, headers: corsHeaders
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: corsHeaders
    })
  }
})
