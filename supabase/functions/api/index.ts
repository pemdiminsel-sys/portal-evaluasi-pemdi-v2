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

    // --- SEND NOTIFICATION (fetch password dari server menggunakan service_role) ---
    if (action === 'send_notification') {
      const { user_id, approval_email } = body

      // Fetch data user termasuk password menggunakan service_role (bypass RLS)
      const { data: user, error: fetchErr } = await supabaseClient
        .from('users')
        .select('name, email, password, jabatan, whatsapp, opd_id')
        .eq('id', user_id)
        .single()

      if (fetchErr || !user) {
        return new Response(JSON.stringify({ success: false, message: `User tidak ditemukan: ${fetchErr?.message}` }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Delegasikan ke logika register dengan data lengkap dari server
      const statusBanner = approval_email
        ? `<div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #14532d; font-weight: bold;">✅ Akun Anda Telah Diaktifkan!</p>
            <p style="margin: 8px 0 0; color: #166534; font-size: 14px;">Selamat! Admin Kominfo telah menyetujui pendaftaran Anda. Anda kini dapat login menggunakan informasi di bawah.</p>
           </div>`
        : `<div style="background: #fef9c3; border-left: 4px solid #eab308; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-weight: bold;">⏳ Status Akun: Menunggu Verifikasi</p>
            <p style="margin: 8px 0 0; color: #78350f; font-size: 14px;">Simpan informasi akun ini untuk login setelah akun diaktifkan oleh Admin.</p>
           </div>`

      const emailSubject = approval_email
        ? '✅ Akun Anda Telah Diaktifkan - Portal Evaluasi PEMDI'
        : '📋 Pendaftaran Diterima - Portal Evaluasi PEMDI'

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
          <div style="background: #0f172a; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 20px;">🏛️ Portal Evaluasi PEMDI</h1>
            <p style="color: #94a3b8; margin: 4px 0 0; font-size: 12px;">Kabupaten Minahasa Selatan</p>
          </div>
          <h2 style="color: #1e293b;">Halo, ${user.name}!</h2>
          <p style="color: #475569;">${approval_email ? 'Kabar gembira! Akun Anda di' : 'Pendaftaran Anda di'} <strong>Portal Evaluasi Pemerintahan Digital (PEMDI)</strong> ${approval_email ? 'telah disetujui.' : 'telah berhasil diterima.'}</p>
          ${statusBanner}
          <p style="color: #475569;"><strong>Informasi Akun Login:</strong></p>
          <div style="background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 16px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 12px; color: #64748b; font-size: 13px; width: 40%;">📧 Email / Username</td>
                <td style="padding: 8px 12px; font-weight: bold; color: #1e293b; font-size: 13px;">${user.email}</td>
              </tr>
              <tr style="background: #e8f4fd;">
                <td style="padding: 8px 12px; color: #64748b; font-size: 13px;">🔑 Password</td>
                <td style="padding: 8px 12px; font-weight: bold; color: #1e293b; font-size: 14px; letter-spacing: 1px; font-family: monospace;">${user.password || '(hubungi admin)'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #64748b; font-size: 13px;">👤 Jabatan</td>
                <td style="padding: 8px 12px; font-weight: bold; color: #1e293b; font-size: 13px;">${user.jabatan || '-'}</td>
              </tr>
            </table>
          </div>
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #991b1b; font-size: 13px;">⚠️ <strong>Harap simpan informasi ini.</strong> Jangan bagikan password Anda kepada siapapun.</p>
          </div>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://pemdi.minselkab.go.id/login" style="background: #0f172a; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px;">🔐 Pergi ke Halaman Login</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">Dinas Komunikasi dan Informatika — Kab. Minahasa Selatan</p>
        </div>
      `

      try {
        await sendEmailViaGmail(user.email, emailSubject, emailHtml)
        return new Response(JSON.stringify({ success: true, message: 'Email notifikasi berhasil dikirim' }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      } catch (emailErr: unknown) {
        const msg = emailErr instanceof Error ? emailErr.message : String(emailErr)
        return new Response(JSON.stringify({ success: false, message: `Gagal kirim email: ${msg}` }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // --- REGISTER / RESEND / APPROVAL ---
    if (action === 'register') {
      const { name, email, password, whatsapp, jabatan, opd_id, surat_tugas_url, resend_only, approval_email } = body

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
        // Template berbeda berdasarkan konteks: approval email vs pendaftaran baru
        const statusBanner = approval_email
          ? `<div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #14532d; font-weight: bold;">✅ Akun Anda Telah Diaktifkan!</p>
              <p style="margin: 8px 0 0; color: #166534; font-size: 14px;">Selamat! Admin Kominfo telah menyetujui pendaftaran Anda. Anda kini dapat login ke Portal Evaluasi PEMDI menggunakan informasi di bawah.</p>
             </div>`
          : `<div style="background: #fef9c3; border-left: 4px solid #eab308; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">⏳ Status Akun: Menunggu Verifikasi</p>
              <p style="margin: 8px 0 0; color: #78350f; font-size: 14px;">Tim Admin Kominfo akan memverifikasi data Anda. Simpan informasi akun ini untuk login setelah akun diaktifkan.</p>
             </div>`

        const emailSubject = approval_email
          ? '✅ Akun Anda Telah Diaktifkan - Portal Evaluasi PEMDI'
          : '📋 Pendaftaran Diterima - Portal Evaluasi PEMDI'

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
            <div style="background: #0f172a; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
              <h1 style="color: white; margin: 0; font-size: 20px;">🏛️ Portal Evaluasi PEMDI</h1>
              <p style="color: #94a3b8; margin: 4px 0 0; font-size: 12px;">Kabupaten Minahasa Selatan</p>
            </div>
            <h2 style="color: #1e293b;">Halo, ${name}!</h2>
            <p style="color: #475569;">${approval_email ? 'Kabar gembira! Pendaftaran Anda di' : 'Pendaftaran Anda di'} <strong>Portal Evaluasi Pemerintahan Digital (PEMDI)</strong> ${approval_email ? 'telah disetujui.' : 'telah berhasil diterima.'}</p>
            ${statusBanner}
            <p style="color: #475569;"><strong>Informasi Akun Login:</strong></p>
            <div style="background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 16px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 12px; color: #64748b; font-size: 13px; width: 40%;">📧 Email / Username</td>
                  <td style="padding: 8px 12px; font-weight: bold; color: #1e293b; font-size: 13px;">${email}</td>
                </tr>
                <tr style="background: #e8f4fd;">
                  <td style="padding: 8px 12px; color: #64748b; font-size: 13px;">🔑 Password</td>
                  <td style="padding: 8px 12px; font-weight: bold; color: #1e293b; font-size: 14px; letter-spacing: 1px; font-family: monospace;">${password || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; color: #64748b; font-size: 13px;">👤 Jabatan</td>
                  <td style="padding: 8px 12px; font-weight: bold; color: #1e293b; font-size: 13px;">${jabatan || '-'}</td>
                </tr>
              </table>
            </div>
            <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0; color: #991b1b; font-size: 13px;">⚠️ <strong>Harap simpan informasi ini.</strong> Jangan bagikan password Anda kepada siapapun.</p>
            </div>
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://pemdi.minselkab.go.id/login" style="background: #0f172a; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px;">🔐 Pergi ke Halaman Login</a>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">Dinas Komunikasi dan Informatika — Kab. Minahasa Selatan</p>
          </div>
        `
        await sendEmailViaGmail(
          email,
          emailSubject,
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
