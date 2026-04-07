# Panduan Deployment Vercel (Gratis & Tanpa Kartu Kredit)

Dokumen ini berisi langkah-langkah detail untuk memindahkan aplikasi **Portal Evaluasi Pemdi V2** dari localhost ke **Vercel**.

---

## 0. Membuat Akun Vercel (Dari Awal)
Jika Anda belum memiliki akun, ikuti langkah ini:
1. Buka [Vercel.com](https://vercel.com/signup).
2. Pilih **"Continue with GitHub"** (Sangat direkomendasikan karena akan mempermudah sinkronasi kode).
3. Masukkan username dan password GitHub Anda (jika diminta).
4. Klik **"Authorize Vercel"** untuk memberikan izin akses ke repository GitHub Anda.
5. Pada pertanyaan "What will you use Vercel for?", pilih **"Hobby"** (Ini adalah opsi gratis selamanya).
6. Masukkan nama Anda, lalu klik **"Continue"**.
7. Jika diminta verifikasi nomor HP, masukkan nomor HP aktif Anda (ini hanya verifikasi keamanan satu kali, bukan untuk pembayaran).

---

## 1. Persiapan Akhir (Git Push)
Pastikan semua file konfigurasi terbaru sudah terkirim ke GitHub:
1. Buka terminal di folder `v2-modern`.
2. Jalankan:
   ```powershell
   git add .
   git commit -m "Final Vercel configuration"
   git push origin main
   ```

---

## 2. Deploy Backend (Laravel Serverless)
Kita harus mendeploy Backend terlebih dahulu untuk mendapatkan URL API-nya.

1. Login ke [Vercel.com](https://vercel.com) menggunakan akun **GitHub**.
2. Klik **"Add New"** > **"Project"**.
3. Pilih repository: `portal-evaluasi-pemdi-v2`.
4. Isi Konfigurasi:
   - **Project Name:** `evaluasi-backend-v2`
   - **Framework Preset:** `Other` (Penting!)
   - **Root Directory:** `backend`
5. Atur **Environment Variables**:
   Masuk ke menu **Settings > Environment Variables**, tambahkan:
   - `APP_KEY`: (Ambil dari .env lokal Anda)
   - `APP_URL`: (Tinggalkan kosong dulu, nanti diisi URL Vercel setelah deploy)
   - `DB_CONNECTION`: `pgsql`
   - `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: (Ambil dari Supabase Dashboard)
6. Klik **Deploy**.
7. Setelah selesai (Live), catat alamat URL-nya (contoh: `https://evaluasi-backend-v2.vercel.app`).

---

## 3. Deploy Frontend (React/Vite)
1. Klik **"Add New"** > **"Project"** lagi.
2. Pilih repository: `portal-evaluasi-pemdi-v2`.
3. Isi Konfigurasi:
   - **Project Name:** `evaluasi-frontend-v2`
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
4. Atur **Environment Variables**:
   Tambahkan variabel berikut:
   - `VITE_API_BASE_URL`: (Masukkan URL Backend tadi)
     *Contoh:* `https://evaluasi-backend-v2.vercel.app`
5. Klik **Deploy**.
6. Website Anda kini sudah online di URL yang diberikan Vercel!

---

## 4. Menghubungkan Subdomain Sendiri
Jika Anda ingin menggunakan subdomain seperti `evaluasi.minselkab.go.id`:

1. Di Dashboard Vercel, pilih proyek **Frontend**.
2. Pergi ke **Settings** > **Domains**.
3. Masukkan subdomain Anda, klik **Add**.
4. Vercel akan memberikan nilai **CNAME**. Masukkan ke DNS Management Anda:
   - **Type:** `CNAME`
   - **Name:** `evaluasi`
   - **Value:** `cname.vercel-dns.com`
5. Tunggu 5-10 menit, SSL akan terbit otomatis.

---

## 5. Troubleshooting (Masalah Umum)
- **Error 404 saat Refresh:** Pastikan file `frontend/vercel.json` sudah ada (file ini mengatur agar semua route mengarah ke index.html).
- **Gagal Simpan Data:** Pastikan URL di `VITE_API_BASE_URL` sudah benar dan tidak ada typo. Jangan lupa lakukan **Redeploy** jika mengubah Environment Variable.

---

**Selamat! Sistem Anda kini sudah online dan siap digunakan.**
