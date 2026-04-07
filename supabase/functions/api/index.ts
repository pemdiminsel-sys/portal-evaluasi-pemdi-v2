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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const adminKey = Deno.env.get('ADMIN_SERVICE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    console.log("DB URL Check:", !!supabaseUrl)
    console.log("Admin Key Check:", !!adminKey)

    const supabaseClient = createClient(supabaseUrl, adminKey)

    const body = await req.json()
    const { action } = body

    // --- LOGIKA LOGIN ---
    if (action === 'login') {
      const { email, password } = body
      const { data: user, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        return new Response(JSON.stringify({ success: false, message: 'Email tidak ditemukan' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      return new Response(JSON.stringify({ success: true, user: user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // --- LOGIKA REGISTER (BARU) ---
    if (action === 'register') {
      const { name, email, password, whatsapp, jabatan, opd_id, surat_tugas_url } = body
      
      const { data, error } = await supabaseClient.from('users').insert([{
         name, email, password, whatsapp, jabatan, opd_id, surat_tugas_url,
         role: 3, status_approval: 0 // Default: Operator OPD, Status: Pending
      }]).select().single()

      if (error) throw error

      return new Response(JSON.stringify({ success: true, user: data }), {
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
