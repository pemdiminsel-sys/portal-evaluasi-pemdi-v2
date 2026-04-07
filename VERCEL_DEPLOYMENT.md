# 🚀 Panduan Deployment SPBE V2 (Lengkap & Tanpa Biaya)

Dokumen ini adalah panduan terbaru untuk membuat aplikasi **Portal Evaluasi Pemdi** online menggunakan kombinasi **Vercel** (untuk tampilan) dan **Supabase** (untuk data & API).

---

## 🟢 Langkah 1: Buat Akun & Persiapan Git
1. **Daftar Vercel**: Buka [vercel.com/signup](https://vercel.com/signup) dan pilih **"Continue with GitHub"**. (Sangat mudah & gratis).
2. **Push Kode Terbaru**: Pastikan semua perubahan sudah saya simpan ke GitHub Anda dengan perintah:
   ```powershell
   git add .
   git commit -m "Optimize for Supabase & Vercel deployment"
   git push origin main
   ```

---

## 🔵 Langkah 2: Deploy Frontend di Vercel
Ini adalah langkah untuk mempublikasikan tampilan website Anda.

1. Buka **Vercel Dashboard** > Klik **"Add New"** > **"Project"**.
2. Pilih repository: `portal-evaluasi-pemdi-v2`.
3. Atur **"Project Settings"**:
   - **Framework Preset**: Pilih `Vite`.
   - **Root Directory**: Klik `Edit` dan pilih folder **`frontend`**.
4. Atur **"Environment Variables"**:
   - Klik menu **Environment Variables**, tambahkan:
     - `VITE_API_BASE_URL` = `/api`
     *(Trik ini agar Vercel otomatis mengarahkan panggilan data ke API kita).*
5. Klik **"Deploy"**.
6. **Selesai!** Website Anda kini sudah memiliki URL (misal: `evaluasi.vercel.app`).

---

## 🟡 Langkah 3: Menghubungkan Subdomain Pemerintah
Agar website bisa diakses melalui `evaluasi.minselkab.go.id`:

1. Di Dashboard proyek Vercel tadi, buka **Settings** > **Domains**.
2. Ketik subdomain Anda (contoh: `evaluasi.minselkab.go.id`), lalu klik **Add**.
3. Vercel akan memberikan info **DNS (CNAME)**. 
4. Hubungi Admin IT/Kominfo untuk menambahkan CNAME tersebut ke DNS:
   - **Type**: `CNAME`
   - **Name**: `evaluasi`
   - **Target**: `cname.vercel-dns.com`
5. Vercel akan otomatis menerbitkan sertifikat **SSL (HTTPS)** dalam hitungan menit.

---

## 🟠 Langkah 4: Hubungkan ke Supabase (Tanpa Laravel)
Karena server kantor tidak ingin digunakan, kita akan mengarahkan semua data langsung ke **Supabase Edge Functions**. 

1. Semua data periode, OPD, dan indikator kini tersimpan di database **Supabase**.
2. Anda bisa memantau data tersebut secara langsung melalui dashboard [Supabase.com](https://supabase.com).

---

### Kenapa Pakai Cara Ini?
- ✅ **Gratis Selamanya**: Tidak butuh kartu kredit.
- ✅ **Tanpa Server Kantor**: Aplikasi jalan 100% di cloud.
- ✅ **Profesional**: Menggunakan domain instansi pemerintah secara resmi.
- ✅ **Ringan**: Tidak ada masalah limit 250MB seperti di Laravel.

**Ayo segera buka Vercel dan mulai deploy!**
