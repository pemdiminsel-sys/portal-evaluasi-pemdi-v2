# Portal Evaluasi Pemdi V2 (Modern)

Proyek ini adalah versi modern dari Portal Evaluasi Pemdi, menggunakan **Laravel 11** untuk Backend dan **React/Vite** untuk Frontend.

## Struktur Proyek
- `/backend`: Laravel API
- `/frontend`: React + Vite + TailwindCSS

## Panduan Deployment & Konfigurasi

> [!NOTE]
> Panduan **Step-by-Step** lengkap untuk Git, Supabase, dan Cloudflare dapat dilihat di file **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

### 1. Database: Supabase (PostgreSQL)
Proyek ini dikonfigurasi untuk menggunakan Supabase sebagai database cloud.
- Update file `backend/.env` dengan kredensial dari dashboard Supabase Anda.
- Pastikan ekstensi `pdo_pgsql` sudah aktif di PHP Anda.
- Jalankan perintah berikut di folder `backend`:
  ```bash
  php artisan migrate --seed
  ```

### 2. Frontend: Cloudflare Pages
Frontend dirancang untuk di-deploy ke Cloudflare Pages.
- **Build Settings**:
  - Build Command: `npm run build`
  - Build Output Directory: `dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: URL API Backend Anda (misal: `https://api.domain.com/api/v1`)
- **SPA Routing**:
  - File `public/_redirects` sudah disertakan untuk menangani routing SPA di Cloudflare.

### 3. Git Management
Untuk mendaftarkan repositori ke Git (misal: GitHub):
1. Buat repositori baru di GitHub.
2. Jalankan perintah berikut di folder integrasi ini:
   ```bash
   git remote add origin https://github.com/USER/REPO-NAME.git
   git branch -M main
   git push -u origin main
   ```

## Pengembangan Lokal
1. **Backend**:
   - `cd backend`
   - `composer install`
   - `php artisan serve`
2. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
