import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const body = await req.json()
    const { action } = body

    // --- LOGIKA LOGIN ---
    if (action === 'login') {
      const { email, password } = body
      
      const { data: user, error } = await supabaseClient
        .from('users')
        .select('*, opds(*)')
        .eq('email', email)
        .single()

      if (error || !user) {
        return new Response(JSON.stringify({ success: false, message: 'Email tidak ditemukan di Supabase' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Bypass password check untuk demo agar user bisa masuk ke Dashboard
      // Nantinya, di sini Anda bisa tambahkan verifikasi password yang lebih kompleks
      return new Response(JSON.stringify({ 
        success: true, 
        token: 'sb_token_' + Math.random(),
        user: user 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ message: "Action not found" }), {
      status: 404, headers: corsHeaders
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: corsHeaders
    })
  }
})
