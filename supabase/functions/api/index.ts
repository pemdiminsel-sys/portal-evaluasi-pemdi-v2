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
    
    const supabaseClient = createClient(supabaseUrl, adminKey)

    const body = await req.json()
    const { action } = body

    // --- PING ---
    if (action === 'ping') {
      const { data, error } = await supabaseClient.from('users').select('count', { count: 'exact', head: true })
      return new Response(JSON.stringify({ success: !error, count: data, error: error?.message, env: { url: !!supabaseUrl, key: !!adminKey } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // --- LOGIN ---
    if (action === 'login') {
      const { email, password } = body
      const { data: user, error } = await supabaseClient.from('users').select('*, opds(*)').eq('email', email).single()

      if (error || !user) {
        return new Response(JSON.stringify({ success: false, message: 'Login Gagal: Email tidak terdaftar di sistem.' }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      return new Response(JSON.stringify({ success: true, user: user }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // --- REGISTER / RESEND ---
    if (action === 'register') {
      const { name, email, password, whatsapp, jabatan, opd_id, surat_tugas_url, resend_only } = body
      
      let userData = null;

      if (!resend_only) {
        const { data, error } = await supabaseClient.from('users').insert([{
           name, email, password, whatsapp, jabatan, opd_id, surat_tugas_url, role: 3, status_approval: 0
        }]).select().single()

        if (error) {
          return new Response(JSON.stringify({ success: false, message: `Daftar Gagal: ${error.message}` }), {
            status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        userData = data;
      }

      // --- MENGIRIM EMAIL NOTIFIKASI ---
      try {
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        if (resendApiKey) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
            body: JSON.stringify({
              from: 'Portal SPBE <onboarding@resend.dev>',
              to: email,
              subject: 'Pendaftaran Berhasil - Portal SPBE',
              html: `<h3>Halo ${name},</h3><p>Pendaftaran Anda (Email: ${email}) di Portal Evaluasi SPBE telah diterima dan sedang menunggu proses verifikasi oleh Admin.</p>`
            })
          });
        }
      } catch (emailErr) {
        console.error("Email gagal dikirim:", emailErr);
      }

      return new Response(JSON.stringify({ success: true, user: userData, message: resend_only ? 'Email Berhasil Dikirim Ulang' : 'Pendaftaran Berhasil' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: false, message: "Action not found" }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: `System Error: ${error.message}` }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
