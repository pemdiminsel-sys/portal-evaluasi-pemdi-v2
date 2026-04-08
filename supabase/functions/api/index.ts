import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import nodemailer from "npm:nodemailer@6.9.9"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper: kirim email via Gmail SMTP
async function sendEmailViaGmail(to: string, subject: string, html: string) {
  const gmailUser = Deno.env.get('GMAIL_USER')
  const gmailPass = Deno.env.get('GMAIL_APP_PASSWORD')

  if (!gmailUser || !gmailPass) {
    throw new Error('Konfigurasi Gmail tidak ditemukan di Supabase Secrets.')
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  })

  const info = await transporter.sendMail({
    from: `"Portal Evaluasi Pemdi" <${gmailUser}>`,
    to,
    subject,
    html,
  })

  console.log('Email berhasil dikirim, Message ID:', info.messageId)
  return info
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

      let userData = null

      if (!resend_only) {
        const { data, error } = await supabaseClient.from('users').insert([{
          name, email, password, whatsapp, jabatan, opd_id, surat_tugas_url, role: 3, status_approval: 0
        }]).select().single()

        if (error) {
          return new Response(JSON.stringify({ success: false, message: `Daftar Gagal: ${error.message}` }), {
            status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        userData = data
      }

      // --- KIRIM EMAIL NOTIFIKASI VIA GMAIL SMTP ---
      try {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
            <div style="background: #0f172a; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
              <h1 style="color: white; margin: 0; font-size: 20px;">🏛️ Portal Evaluasi PEMDI</h1>
              <p style="color: #94a3b8; margin: 4px 0 0; font-size: 12px;">Kabupaten Minahasa Selatan</p>
            </div>
            <h2 style="color: #1e293b;">Halo, ${name}!</h2>
            <p style="color: #475569;">Pendaftaran Anda di <strong>Portal Evaluasi Pemerintahan Digital (PEMDI)</strong> telah berhasil diterima.</p>
            <div style="background: #fef9c3; border-left: 4px solid #eab308; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">⏳ Status Akun: Menunggu Verifikasi</p>
              <p style="margin: 8px 0 0; color: #78350f; font-size: 14px;">Tim Admin Kominfo akan memverifikasi data Anda. Anda akan mendapat notifikasi setelah akun diaktifkan.</p>
            </div>
            <p style="color: #475569;"><strong>Data Pendaftaran:</strong></p>
            <ul style="color: #475569;">
              <li>Email: <strong>${email}</strong></li>
              <li>Jabatan: <strong>${jabatan || '-'}</strong></li>
            </ul>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">Dinas Komunikasi dan Informatika — Kab. Minahasa Selatan</p>
          </div>
        `
        await sendEmailViaGmail(
          email,
          'Pendaftaran Berhasil - Portal Evaluasi PEMDI',
          emailHtml
        )
      } catch (emailErr: unknown) {
        const errorMessage = emailErr instanceof Error ? emailErr.message : String(emailErr)
        console.error('Email gagal dikirim:', errorMessage)
        // Jika ini mode resend_only, kembalikan error agar user tahu
        if (resend_only) {
          return new Response(JSON.stringify({ success: false, message: `Gagal kirim email: ${errorMessage}` }), {
            status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }

      return new Response(JSON.stringify({
        success: true,
        user: userData,
        message: resend_only ? 'Email Aktivasi Berhasil Dikirim Ulang' : 'Pendaftaran Berhasil'
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: false, message: 'Action not found' }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ success: false, message: `System Error: ${errorMessage}` }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
