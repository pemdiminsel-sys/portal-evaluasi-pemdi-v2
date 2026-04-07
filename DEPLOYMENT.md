# Step-by-Step Deployment Guide (Modern V2)

Dokumen ini berisi langkah-langkah detail untuk menyiapkan repositori Git, database di Supabase, dan deployment frontend ke Cloudflare Pages.

---

## 1. Persiapan Repositori Git (GitHub/GitLab)

Langkah awal untuk menyimpan kode Anda di cloud dan sebagai syarat deployment Cloudflare.

1.  **Buat Repositori Baru** di GitHub/GitLab:
    *   Beri nama: `portal-evaluasi-pemdi-v2`.
    *   Pilih **Public** atau **Private**.
    *   **JANGAN** centang "Initialize this repository with a README".
2.  **Hubungkan Folder Lokal ke Git Remote**:
    Buka terminal di folder root (`v2-modern`):
    ```powershell
    cd c:\xampp\htdocs\portal-evaluasi-pemdi\v2-modern
    git init
    git branch -M main
    git remote add origin https://github.com/USERNAME/portal-evaluasi-pemdi-v2.git
    git add .
    git commit -m "Fresh configuration for Supabase and Cloudflare"
    git push -u origin main
    ```

---

## 2. Pengaturan Database Supabase (PostgreSQL)

Supabase bertugas sebagai database pusat yang dapat diakses secara online.

1.  **Buat Proyek Baru** di [Supabase Dashboard](https://supabase.com/dashboard):
    *   Isi **Name**, **Database Password**, dan pilih **Region** terdekat (Singapore).
2.  **Dapatkan Kredensial Database**:
    *   Pergi ke **Project Settings** > **Database**.
    *   Cari bagian **Connection String** > **URI**.
    *   Kredensial yang dibutuhkan untuk `.env`:
        *   **Host**: `aws-0-ap-southeast-1.pooler.supabase.com`
        *   **Port**: `6543` (untuk pgbouncer/pooling)
        *   **User**: `postgres.[YOUR_PROJECT_ID]`
        *   **Password**: [Password yang Anda buat saat setup]
3.  **Update `.env` Backend**:
    Buka `backend/.env` dan sesuaikan nilainya:
    ```env
    DB_CONNECTION=pgsql
    DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
    DB_PORT=6543
    DB_DATABASE=postgres
    DB_USERNAME=postgres.abcdefghijklmnop
    DB_PASSWORD=your_password
    ```
4.  **Migrasi Database**:
    Jalankan perintah ini di lokal agar struktur tabel terbuat di Supabase:
    ```powershell
    cd backend
    php artisan migrate
    ```

---

## 3. Deployment Frontend ke Cloudflare Pages

Cloudflare Pages akan menarik kode dari GitHub secara otomatis setiap kali Anda melakukan `git push`.

1.  **Login ke Cloudflare Dashboard**:
    *   Pilih **Workers & Pages** > **Pages** > **Connect to Git**.
2.  **Pilih Repositori**:
    *   Pilih repositori `portal-evaluasi-pemdi-v2` yang baru dibuat.
3.  **Konfigurasi Build**:
    *   **Project Name**: `evaluasi-pemdi-v2`
    *   **Framework Preset**: `Vite` (atau kustom)
    *   **Build Command**: `npm run build`
    *   **Build Output Directory**: `dist`
    *   **Root Directory**: `/frontend` (Penting: Karena frontend ada di subfolder)
4.  **Atur Environment Variables**:
    *   Klik **Environment Variables** > **Add variable**:
        *   `VITE_API_BASE_URL` = `https://api-evaluasi.domain.com/api/v1` (URL API backend Anda)
5.  **Klik 'Save and Deploy'**.

---

## 4. Troubleshooting & Tips

*   **Penting**: Karena backend Laravel ini berjalan di XAMPP (lokal), Cloudflare tidak bisa mengaksesnya secara langsung (Backend harus di-deploy ke VPS atau hosting Laravel seperti Heroku/Render).
*   **Routing SPA**: File `public/_redirects` sudah saya siapkan di dalam `frontend/public/` agar halaman tidak 404 saat di-refresh di Cloudflare.
*   **Database Pooling**: Gunakan port **6543** (PgBouncer) di Supabase Dashboard untuk performa koneksi Laravel yang lebih stabil.

---

**Selamat Mencoba!** Jika ada langkah yang membingungkan atau error saat menjalankan perintah, kabari saya kembali.
