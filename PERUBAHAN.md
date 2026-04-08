# Catatan Perubahan (Changelog)
(tiap perubahan dicatat dalam PERUBAHAN.MD dan auto push ke git)

Semua riwayat pembaruan dan perbaikan aplikasi akan dicatat di sini.

## [2026-04-08] - Fix: API Endpoint Configuration untuk Production
- **Fix (API Endpoint):** Update `VITE_API_BASE_URL` environment variable di Vercel ke endpoint yang correct:
  - **Production**: `https://portal-evaluasi-pemdi-v2-cfyb.vercel.app/api/v1`
  - **Development**: `http://localhost/portal-evaluasi-pemdi/v2-modern/backend/public/api/v1`
- **Files Updated:**
  - `vercel.json` - Set env variable dengan HTTP endpoint (bukan `/api` relative path)
  - `frontend/.env.example` - Update documentation dengan correct endpoint
- **Result:** API calls di production sekarang akan correctly route ke Vercel backend API, mencegah blank halaman dan error "tidak ada periode aktif"
- **Action Required di Vercel Dashboard:**
  1. Buka Project Settings > Environment Variables
  2. Update atau create variable: `VITE_API_BASE_URL` = `https://portal-evaluasi-pemdi-v2-cfyb.vercel.app/api/v1`
  3. Apply ke scope: Production, Preview, Development
  4. Trigger **"Redeploy"** dari Vercel

## [2026-04-08] - Fix: Vercel Build Configuration untuk Vite
- **Fix (Deployment - Vercel Build Not Triggering):** Memperbaiki konfigurasi `vercel.json` yang menggunakan `@vercel/static-build` yang tidak compatible dengan Vite build system. Frontend tidak bisa di-build di Vercel karena builder yang salah.
- **Solution:** Mengubah konfigurasi untuk menggunakan `@vercel/node` builder dengan explicit `buildCommand: "cd frontend && npm install && npm run build"` dan `outputDirectory: "frontend/dist"`. Ini memastikan Vercel properly:
  1. Install dependencies frontend
  2. Jalankan `npm run build` untuk generate bundle Vite
  3. Serve file statis dari `frontend/dist`
- **Cleaning:** Menghapus `frontend/vercel.json` yang conflicting dengan routing root-level `vercel.json`. Konfigurasi terpusat di root `vercel.json` saja untuk menghindari conflict.
- **Routes Updated:** Routing sudah proper configured untuk:
  - `/api/*` → backend API (`backend/api/index.php`)
  - `/assets/*` → frontend static assets (`frontend/dist/assets`)
  - `*` → SPA routing ke `frontend/dist/index.html`
- **Environment Variables:** Pastikan di Vercel Project Settings sudah di-set:
  - `VITE_API_BASE_URL` = `/api` (atau sesuai Supabase endpoint)
- **Result:** ✅ Commit `af850a5` pushed. Vercel sekarang akan otomatis build & deploy saat ada push ke GitHub.

## [2026-04-08] - Fix: 3 Bug UI/UX - Profil Instansi, Riwayat Penilaian, Error Handling
- **Fix (ProfileManagement - Profil Instansi Blank Screen):** Memperbaiki kemungkinan blank page pada halaman Profil Instansi dengan meningkatkan error handling di fungsi `fetchProfile()` dan `handleUpdate()`. Menambahkan validasi `authUser.id`, detailed error messages, dan console.error untuk debugging. Status loading sekarang proper handled.
- **Fix (RiwayatPenilaian - Riwayat Penilaian Redirect):** Memperbaiki bug di mana Riwayat Penilaian tidak bisa diakses dari Sidebar. File `RiwayatPenilaian.jsx` sudah ada tapi TIDAK di-import dan TIDAK di-route di `Dashboard.jsx`. Sekarang sudah ditambahkan:
  - Import: `import RiwayatPenilaian from './RiwayatPenilaian';`
  - Route: `<Route path="riwayat" element={<RiwayatPenilaian />} />`
- **Fix (Evaluasi - Tidak Ada Periode Aktif Error):** Memperbaiki blank page atau generic error saat tidak ada periode evaluasi aktif. Sekarang menampilkan user-friendly error page dengan:
  - Icon dan heading yang jelas: "Periode Evaluasi Belum Aktif"
  - Pesan deskriptif kepada user untuk hubungi Admin
  - Info checklist untuk Admin tentang langkah-langkah setup periode
  - Graceful error handling dengan `.single()` error detection
- **Feat (Error Handling):** Menambahkan detailed console.error logging di ProfileManagement, EvaluasiMandiri, dan improved error messages untuk semua operasi async. Memudahkan debugging dan troubleshooting.

## [2026-04-08] - Fitur Password & Manajemen OPD dengan Indikator
- **Feat (Register):** Menambahkan input field **Password** pada form registrasi user. User kini dapat membuat password sendiri saat mendaftar, dengan placeholder "Minimal 8 karakter". Field password menampilkan icon kunci (Lock) dan validasi required.
- **Feat (OpdManagement):** Mengimplementasikan pengambilan **PIC OPD secara otomatis** dari user yang mendaftar di OPD tersebut. Sistem akan menampilkan nama PIC yang paling baru / terakhir mendaftar di OPD bersangkutan. Jika belum ada user yang mendaftar, akan menampilkan "Belum ditunjuk".
- **Feat (OpdManagement):** Menambahkan modal edit OPD yang diperluas dengan section **Indikator Tanggung Jawab OPD**. Admin dapat memilih indikator mana saja yang menjadi tanggung jawab OPD menggunakan checkbox. Indikator ditampilkan dalam grid 2 kolom dengan informasi kode, nama, dan aspek.
- **Database (Migration - Laravel):** Membuat migration baru `2026_04_08_000001_create_opd_indikators_table.php` untuk tabel pivot `opd_indikators` yang menghubungkan OPD dengan Indikator. Tabel ini menyimpan relasi many-to-many dengan unique constraint untuk mencegah duplikasi data.
- **Database (Setup - Supabase):** Membuat file SQL script `SETUP_OPD_INDIKATORS.sql` untuk setup tabel opd_indikators di Supabase dengan RLS policies. **PENTING:** Script ini perlu dijalankan di Supabase SQL Editor agar fitur Indikator berfungsi.
- **Database (Migration):** Membuat migration `2026_04_08_000002_add_status_approval_to_users_table.php` untuk menambahkan field `status_approval` (0=Pending, 1=Approved, 2=Rejected) ke tabel users di Laravel.
- **Backend (Models):** Menambahkan Model `OpdIndikator` untuk mewakili relasi antara OPD dan Indikator. Update Model `Opd` dan `Indikator` dengan relationship `belongsToMany()` menggunakan tabel pivot `opd_indikators`.
- **Frontend (OpdManagement):** Update fungsi `fetchOpds()` untuk mengambil PIC dari setiap OPD dengan fungsi `fetchPicByOpdId()` yang melakukan query ke tabel `users` berdasarkan `opd_id`. PIC diambil dari user yang paling baru mendaftar (order by `created_at` DESC).
- **Frontend (OpdManagement):** Menambahkan state `indikators` dan `selectedIndicators` untuk mengelola data indikator. Fungsi `fetchIndikators()` mengambil semua indikator dengan relasi aspek, dan `fetchSelectedIndicators()` mengambil indikator yang sudah dipilih untuk OPD tertentu.
- **Frontend (OpdManagement):** Update `handleSaveEdit()` untuk menyimpan relasi OPD-Indikator dengan improved error handling dan logging. Sistem akan menghapus semua relasi lama dan membuat relasi baru berdasarkan checkbox yang dipilih user.
- **Troubleshooting:** Jika mendapat error "Gagal menyimpan perubahan" saat edit OPD dengan Indikator, perlu jalankan `SETUP_OPD_INDIKATORS.sql` di Supabase SQL Editor terlebih dahulu untuk membuat tabel dan RLS policies.

## [2026-04-08] - Fix: Keamanan Login dengan Validasi Status Approval & Password
- **Fix (Security - CRITICAL):** Memperbaiki bug keamanan di mana user yang belum diaktifkan admin dapat login ke sistem. Menambahkan validasi `status_approval` di Edge Function API action `login` — hanya user dengan status_approval = 1 (Approved) yang dapat login.
- **Fix (Security - CRITICAL):** Menambahkan validasi password di Edge Function login. Sebelumnya sistem hanya validasi email tanpa cek password, memungkinkan siapa saja login hanya dengan mengetahui email user lain.Password harus cocok dengan yang tersimpan di database sebelum proses login dilanjutkan.
- **Feat (Error Handling):** Menambahkan pesan error yang deskriptif untuk kasus login gagal:
  - "Login Gagal: Email tidak terdaftar di sistem." — jika email tidak ada
  - "Login Gagal: Password salah." — jika password tidak sesuai
  - "Akun Anda masih menunggu verifikasi dari Admin..." — jika status_approval = 0
  - "Akun Anda telah ditolak oleh Admin..." — jika status_approval = 2 (Rejected)
- **Fix (Robustness):** Improve handling untuk NULL/undefined `status_approval` di browser lama maupun data user yang belum ter-update status_approval-nya (treat sebagai pending).
- **Deploy (COMPLETED):** ✅ Edge Function `api` telah berhasil di-deploy ke Supabase project `rgmxobrceqtnnxvmkhji` menggunakan Supabase CLI. Fix keamanan login sekarang aktif di production.
- **⚠️ PENTING - DEPLOYMENT:** Fix ini memerlukan **deploy Edge Function ke Supabase** agar bekerja. Jalankan:
  ```bash
  supabase functions deploy api
  ```
  Jika belum install Supabase CLI, install terlebih dahulu:
  ```bash
  npm install -g supabase
  ```
  Kemudian login ke Supabase:
  ```bash
  supabase login
  ```
  **TANPA deploy ini, fix keamanan tidak akan berlaku!**

## [2026-04-08] - Fitur Password & Manajemen OPD dengan Indikator (Utama)

## [2026-04-08] - Perbaikan Navigasi & Tampilan Mobile
- **Fix (UserManagement):** Memperbaiki isian input email admin yang sebelumnya terkunci karena tidak ada event handler `onChange`, kini admin dapat mendaftarkan email untuk user baru.
- **Feat (Menu):** Membuat file `daftar_menu.md` berisikan list navigasi beserta daftar akses per-*role*.
- **Fix (Sidebar):** Menambahkan `roles: [2]` untuk menu **Pemeliharaan** (Pengaturan SMTP & Backup Logs) agar dapat diakses oleh Admin Pemkab.
- **Feat (Mobile UX):** Menambahkan tombol *toggle* navigasi untuk *show* dan *hide* *sidebar* di antarmuka mobile (HP), sehingga sidebar tidak akan menutupi konten utama, dan sidebar otomatis menutup setelah link di klik.

## [2026-04-08] - Perbaikan Registrasi User (Bucket Error)
- **Fix (Storage):** Menyelesaikan kendala "Bucket not found" saat form registrasi mencoba meng-upload file Surat Tugas. Membuat file *script SQL* `SETUP_STORAGE.sql` untuk mengeksekusi otomatis pembuatan *Storage Bucket* bernama `surat-tugas` beserta kebijakan akses terbukanya (RLS Policy).
- **Feat (Email Notification):** Menambahkan integrasi pengiriman email masuk (*registration alert*) melalui layanan Resend API pada Edge Function saat ada user baru yang berhasil mem-bypass error sebelumnya dan mendaftar di sistem.

## [2026-04-08] - Migrasi Email: Resend → Gmail SMTP
- **Fix (Email):** Mengganti jalur pengiriman email dari Resend API ke **Gmail SMTP** menggunakan `nodemailer` agar lolos dari blokir Google (Error 550-5.7.26 SPF/DKIM).
- **Config:** Menyimpan kredensial `GMAIL_USER` dan `GMAIL_APP_PASSWORD` ke Supabase Secrets.
- **Feat (Email Template):** Email notifikasi pendaftaran kini memiliki tampilan HTML yang lebih profesional dan responsif dengan identitas Portal Evaluasi PEMDI.
- **Feat (Email):** Menambahkan **Informasi Password** user ke dalam email aktivasi menggunakan tabel HTML yang rapi, lengkap dengan tabel Email, Password, dan Jabatan. Ditambahkan pula tombol langsung menuju halaman login dan peringatan agar user menyimpan informasi akunnya.
- **Fix (Email Resend):** Memperbaiki email kirim ulang dari Admin — password user sekarang diambil dari database terlebih dahulu sebelum dikirim ke Edge Function, agar kolom password tidak tampil kosong dalam email aktivasi.
- **Feat (Email Approval):** Menambahkan pengiriman email otomatis saat Admin menyetujui user (klik tombol Approve). Email berisi password login lengkap dan template berwarna hijau "✅ Akun Telah Diaktifkan" yang berbeda dari email pendaftaran. Subject email juga disesuaikan secara dinamis.
- **Deploy:** Edge Function `api` di-deploy ulang dengan library `npm:nodemailer@6.9.9`.
- **Fix (Email Template):** Menyembunyikan password pengguna saat berada pada tahap "Menunggu Verifikasi" / pendaftaran awal, dan menggantinya dengan teks "Hubungi Admin (Admin TIK bisa melihat password)". Password asli hanya akan ditampilkan pada email ketika akun sudah diaktifkan.
- **Fix (Empty Password):** Memperbaiki bug di mana user yang mendaftar secara mandiri tidak memiliki nilai password di *database* sehingga email persetujuan menampilkan teks `(hubungi admin)` alih-alih password aslinya. Perbaikan pada *Edge Function* kini akan men-*generate* password acak (jika masih kosong) dan menyimpannya secara otomatis sebelum email dikirim.

## [2026-04-08] - Perbaikan Fitur Manajemen User
- **Fix (UserManagement):** Mengaktifkan tombol hapus user (*Trash button*) yang sebelumnya tidak berfungsi. Menambahkan fungsi `handleDelete` dengan konfirmasi keamanan sebelum data dihapus dari database Supabase.
- **Feat (UserManagement):** Menambahkan tombol **Resend Aktivasi** (ikon email biru) pada baris user yang berstatus *Pending*. Fitur ini memungkinkan admin mengirim ulang email notifikasi pendaftaran tanpa harus mendaftarkan ulang data user.
- **Feat (Edge Function):** Memperbaharui *Supabase Edge Function* untuk mendukung mode pengiriman email saja (*resend only*) agar tidak terjadi error data duplikat saat admin menekan tombol kirim ulang.
- **Fix (UserManagement):** Memperbaiki posisi tombol email biru agar berada tepat di samping nama user dan memastikan tidak terjadi *redirect* atau pembukaan tab baru yang tidak diinginkan saat tombol diklik.
- **Feat (UserManagement):** Menambahkan fitur **Enable/Disable Status** pada tabel user, memungkinkan admin untuk menonaktifkan akun yang sudah aktif atau mengaktifkan kembali akun yang sebelumnya ditolak.
- **Fix (UserManagement):** Menyelesaikan masalah di mana Admin tidak dapat menambahkan user baru lewat tombol "Force Enroll". Menambahkan logika `INSERT` ke database dengan *password default* `Minsel123!`.
- **Fix (Storage Path):** Memperbaiki tautan (link) "Lihat Surat Tugas" yang sebelumnya sering menghasilkan error *Not Found* atau *Broken Link* dengan menambahkan pengecekan otomatis awalan folder `/requests/` pada path file di Supabase Storage.
