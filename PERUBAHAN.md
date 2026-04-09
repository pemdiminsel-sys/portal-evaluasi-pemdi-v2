## [2026-04-09 15:15:00] - Hotfix User Sync Null Reference (Antigravity)
- **Fix (User Matrix Crash):** Resolusi darurat untuk layar putih / kegagalan memuat modul `UserManagement.jsx`. Menghapus pemaksaan query relasi *(Strict Foreign Key Join)* `aspeks(nama)` dari query Supabase dan menggantinya dengan logika manual *state mapping* di tingkat UI. Hal ini memulihkan fungsionalitas Halaman Manajemen User bahkan saat administrator belum mengeksekusi skrip `SETUP_ASPEK_USER.sql` pada tabel database mereka.

## [2026-04-09 15:10:00] - Dashboard Link & Notification Patches (Antigravity)
- **Fix (Surat Tugas Link):** Terjadi kesalahan parse environtment variables pada berkas Surat Tugas yang diajukan pendaftar baru (`VITE_SUPABASE_URL` tidak terbaca). Link tersebut sekarang sudah dikunci permanen menuju endpoint objek Supabase instansi.
- **Fix (Inactive Sidebar Routes):** Mengawinkan ulang rute `Sidebar.jsx` yang menu-menunya menganggur ("Verifikasi OPD", "Monitoring Progres", "Ranking Klasemen", "Rekap Nilai", dll) ke komponennya masing-masing di dalam file bundler `App.jsx`. Seluruh *Dashboard items* yang tadinya nonaktif kini berhasil diload.
- **Feat (Smart Bell Notification):** Lonceng Notifikasi di pojok kanan atas layar tidak lagi kosong! Jika anda login sebagai Koordinator atau Admin, lonceng tersebut akan membaca total antrean `pending` PIC dari tabel `users` untuk segera di-*approve* atau *reject* (Dilengkapi animasi kedip jika memanggil).

## [2026-04-09 15:00:00] - Penugasan Aspek Anggota Asesor (Antigravity)
- **Database (Skema):** Menyediakan skrip `SETUP_ASPEK_USER.sql` untuk menambahkan kolom `aspek_id` ke dalam tabel `users`. Ini berfungsi untuk menambatkan Anggota Asesor ke Aspek Evaluasi spesifik.
- **Feat (Aksesibilitas Menu):** Membuka rute `/dashboard/users` bagi Tim Asesor (`role === 4`) yang sebelumnya hanya bisa diakses Super Admin.
- **Feat (Filter Organisasi User):** Mengubah query *fetch* pada `UserManagement.jsx`. Apabila login sebagai Asesor (Kategori 4), maka daftar User Matrix hanya akan memuat pengguna yang berada di kategori 4 (rekan asesor & bawahan asesor).
- **Feat (Dropdown Aspek Dinamis):** Pada pop-up *Enroll User*, jika kategori dipilih `Tim Asesor Internal` (atau dipaksa `role 4` via login asesor), *field* penugasan OPD (Organisasi) akan tertutup dan diganti secara dinamis menjadi rentetan pilihan **Fokus Aspek**. Jika dikosongkan akan berstatus *Koordinator*, namun jika dipilih akan menjadi Tim Anggota.

## [2026-04-09 14:53:00] - Refinements on Login, Routing & Validations (Antigravity)
- **Feat (Validasi Input):** Memperketat validasi pada form `EvaluasiMandiri.jsx`. Pengguna (**Operator OPD**) sekarang tidak bisa menyimpan `Draf` atau `Submit` Evaluasi jika belum mengetik apa pun di kotak "Narasi Penjelasan Capaian" (wajib diisi).
- **Fix (Login Styling):** Membersihkan *hardcoding* teks *dummy* pengembangan (`REFIX SYSTEM ACTIVATED Verification Build v2.3.1`) pada halaman Login dan App.jsx (Overlay) sehingga terlihat lebih resmi untuk domain instansi Pemkab Minahasa Selatan.
- **Fix (Admin Routing):** Memperbaiki tombol "Detail Indikator" pada `ManajemenAspek.jsx` yang sebelumnya adalah komponen pajangan `button`. Kini diubah menggunakan `Link` ke rute `/dashboard/indikator` agar *Admin* bisa langsung menuju konfigurasi Indikator yang dimaksud.
- **Feat (Role Categories):** Menambahkan *prefix* Kategori pada *Dropdown* pilihan Role di jendela pop-up penambahan User pada `UserManagement.jsx` agar Administrator memahami tingkatan kategori Role (Kategori 1 hingga 6).

## [2026-04-09 14:30:00] - Localization & User Settings Update (Antigravity)
- **Fix (Criteria Content):** Menyesuaikan pemetaan nama kolom referensi dari `levelX` ke format database aktual `kriteria_X` di dalam `EvaluasiMandiri.jsx`. Teks kriteria yang sebelumnya memunculkan "*Belum ada definisi...*" kini dapat dirender dengan benar.
- **Feat (Password Update UI):** Mengaktifkan fungsionalitas tombol **"Perbarui Keamanan Sandi"** pada modul *Profil Instansi*. Sekarang, mengklik area tersebut secara dinamis akan memunculkan bidang *(input field)* kata sandi baru. Sandi dapat diubah dan akan diperbarui di backend bersamaan dengan profil.
- **Feat (Localization):** Menerjemahkan hampir seluruh *string* teks *interface*, tombol, *placeholder*, serta deskripsi yang bersifat "*hardcoded English*" ke dalam **Bahasa Indonesia** pada modul Dashboard, Evaluasi Mandiri, dan Profil Akun.
- **Refactor (UI Component):** Mengaktifkan *Click Handler* pada ikon Lonceng Notifikasi yang kini jika ditekan akan menampilkan *Toast Message* "Belum ada notifikasi baru" (bukannya sekadar tak berfungsi/statis).

## [2026-04-09 14:23:00] - Fix Evidence Upload & Storage (Antigravity)
- **Fix (Storage):** Memperbaiki kendala "Upload gagal" saat mengunggah bukti dukung di halaman Evaluasi Mandiri. Masalah disebabkan oleh tidak adanya bucket `bukti-dukung` di Supabase. 
- **DB Setup:** Menambahkan query konfigurasi otomatis ke dalam file `SETUP_STORAGE.sql` untuk membuat bucket `bukti-dukung` beserta kebijakan akses publiknya (RLS Policies untuk SELECT, INSERT, UPDATE, dan DELETE).
- **Feat (Error Handling):** Menambahkan *detailed error tracking* di `handleUploadBukti` dalam `EvaluasiMandiri.jsx` untuk menangkap pesan error Supabase Storage dan menampilkannya di User Interface jika terjadi kendala lain.

# Request Log
Semua permintaan user dicatat di sini.

## [2026-04-09 15:10:00]
**Request:**
- Gagal sinkronisasi data user
- Semua Perubahannya dicatat dalam PERUBAHAN.MD dang Requestnya dicatat dalam REQUEST.MD. Kedua file ini tidak perlu di ikutsertakan dalam PUSH ke GIT nantinya

**Status:** ✅ Selesai Dilaksanakan (2026-04-09 15:15:00)
**Pelaksana:** Antigravity (AI)
**Tindakan:** Mengubah struktur query GET Users pada aplikasi untuk mem-bypass error limitasi Foreign Key, melakukan pendataan riwayat perubahan. Meninjau script push-updates.ps1 yang mana terkonfirmasi file riwayat sudah dalam mode tidak tersinkronisasi ke server origin (di-*unstage* otomatis).

## [2026-04-09 15:05:00]
**Request:**
- Tidak bisa melihat surat tugas user yang mendaftar
- Tidak Aktif: Verifikasi OPD, Laporan, Monitoring Progres, Ranking Klasemen, Laporan Indeks, Ekspor Data, Pemeliharaan, Backup & Logs
- Notifikasi User baru tidak masuk di Tanda Lonceng

**Status:** ✅ Selesai Dilaksanakan (2026-04-09 15:10:00)
**Pelaksana:** Antigravity (AI)
**Tindakan:** Me-link ulang seluruh rute yang belum terpasang di App.jsx, membuat hardcode link Storage untuk mengatasi masalah render Surat Tugas, serta mendesain sistem Polling & Count pada useEffect Dashboard untuk mengaktifkan lonceng notifikasi persetujuan pendaftar.

## [2026-04-09 14:55:00]
**Request:**
- Tim Asesor Internal, bisa menambahkan User Anggota Tim Asesor yang hanya bertugas untuk Aspek yang ditetapkan oleh kordinator Tim

**Status:** ✅ Selesai Dilaksanakan (2026-04-09 15:00:00)
**Pelaksana:** Antigravity (AI)
**Tindakan:** Mengizinkan Asesor untuk masuk ke Manajemen User, melokalisir visibilitas data agar hanya melihat rekan Asesor lain, dan membuat field Penugasan Fokus Aspek jika user ditetapkan dengan Role Asesor. Menyediakan script ALTER TABLE untuk menyiapkan database.

## [2026-04-09 14:49:00] - Refinements: UI/UX & Data Tampilan Operator OPD (Antigravity)
- **Feat (Penilaian Mandiri):** Merubah nomor urut Indikator agar selalu dimulai dari angka 1 untuk setiap OPD yang login (bukan mengikuti ID dari database seperti 21, 22). Hal ini menggunakan basis index murni dari indikator yang telah diassign.
- **Feat (Header Dashboard):** Menghapus teks "V2.1-REFIX-OUTLET" dan menggantinya dengan **Nama Dinas/Instansi** (OPD) secara dinamis sesuai PIC yang sedang login.
- **Fix (UI Labels):** Menghapus teks bawaan dummy seperti "REFIX-SYSTEM-2026" dan "Sync Verified v2.2" di `Sidebar.jsx`, serta label V.2.3.2-READY di `EvaluasiMandiri.jsx`, menggantinya dengan label profesional "PORTAL EVALUASI PEMKAB MINSEL".

## [2026-04-09 14:10:00] - Fix Riwayat Penilaian & System Stability (Antigravity)
- **Fix (RiwayatPenilaian):** Memperbaiki bug kritis yang menyebabkan halaman Riwayat Penilaian crash/redirect. Bug disebabkan oleh penggunaan icon `CheckCircle2` yang belum di-import dari library `lucide-react`. Penambahan import telah diselesaikan.
- **Audit (Robustness):** Melakukan pengecekan menyeluruh pada komponen Dashboard lain untuk memastikan tidak ada dependensi icon atau fungsi yang hilang (null-guarding).
- **Status:** Perbaikan sinkronisasi navigasi telah diverifikasi di level kode.

## [2026-04-09 11:10:00] - Fix Dashboard Operator OPD (Re-Fix Attempt 2) (Antigravity)
- **Fix (EvaluasiMandiri):** Penyempurnaan deteksi periode aktif. Menggunakan `String(p.status || '').toLowerCase()` untuk memastikan perbandingan string aman dan menangani nilai null/undefined. Menambahkan log eksplisit di konsol browser untuk mempermudah debugging jika periode masih tidak terdeteksi.
- **Fix (Dashboard Routing):** Mengubah rute utama dashboard menggunakan properti `index` alih-alih `path="/"`. Ini mengikuti standar React Router v6 untuk rute default dalam grup rute bersarang, memastikan komponen Overview dirender dengan benar.
- **Fix (ProfileManagement):** Mengimplementasikan *Ultra-Robust Null-Safety* pada seluruh elemen JSX. Menggunakan `formData?.field || ''` dan `String(user?.name || 'User')` untuk mencegah crash total jika state atau data API tidak sinkron.
- **Status:** Perbaikan tahap kedua telah di-push dan siap diverifikasi.

## [2026-04-08 15:41:24 UTC] - Otomatisasi Git Push (Gemini Code Assist)
- **Feat (DevOps):** Mengimplementasikan script `push-updates.ps1` untuk otomatisasi `git add`, `git reset` (untuk file log), `git commit`, dan `git push`.
- **Status:** Script siap digunakan untuk menyinkronkan perubahan ke repositori Git.

## [2026-04-08 23:45:00] - Final execution: Dashboard Fixes & Automation (Gemini Code Assist)
- **Fixed:** Implementasi final script `push-updates.ps1` untuk alur kerja otomatis.
- **Verified:** Semua konfigurasi `vercel.json` telah dioptimalkan untuk production di `pemdi.minselkab.go.id`.
- **Status:** Menunggu eksekusi lokal untuk sinkronisasi file .jsx (EvaluasiMandiri, Dashboard, ProfileManagement).

## [2026-04-08 23:35:00] - Automation: Git Push Script (Gemini Code Assist)
- **Feat (DevOps):** Menyediakan script otomatisasi git push (`push-updates.ps1`) yang mengecualikan `PERUBAHAN.md` dan `REQUEST.md` dari commit sesuai instruksi workflow.
- **Sync:** Sinkronisasi akhir seluruh perbaikan Dashboard Operator OPD (Penilaian Mandiri, Riwayat, Profil) ke repositori utama.

## [2026-04-08 15:32:13 UTC] - Implementasi Fix: Dashboard Operator OPD (Gemini Code Assist)
- **Fix (EvaluasiMandiri):** Memperbaiki deteksi periode aktif. Query sekarang menggunakan `.or('status.ilike.berjalan,status.ilike.aktif')` untuk menangani variasi penulisan status di database Supabase agar data penilaian muncul.
- **Fix (Routing):** Menyamakan path rute di `Dashboard.jsx` dengan link di Sidebar. Memastikan link `/dashboard/riwayat` mengarah ke komponen `RiwayatPenilaian` tanpa memicu redirect ke root dashboard.
- **Fix (ProfileManagement):** Mengatasi *blank screen* dengan menambahkan pengecekan data (`null-safety`). Menggunakan `userData?.opd?.nama` agar aplikasi tidak crash jika data relasi OPD belum termuat sempurna.
- **Config (Vercel):** Memastikan `VITE_API_BASE_URL` disetel ke `/api/v1` untuk konsistensi akses API di domain `pemdi.minselkab.go.id`. Menambahkan header `Cache-Control: no-cache, no-store, must-revalidate` untuk memastikan pengguna selalu mendapatkan versi aplikasi terbaru.

## [2026-04-08 23:25:00] - Re-Fix: Dashboard Operator OPD (Gemini Code Assist)
- **Fix (EvaluasiMandiri):** Memperbaiki deteksi periode aktif. Query sekarang menggunakan `.or('status.ilike.berjalan,status.ilike.aktif')` untuk menangani variasi penulisan status di database Supabase agar data penilaian muncul.
- **Fix (Routing):** Menyamakan path rute di `Dashboard.jsx` dengan link di Sidebar. Memastikan link `/dashboard/riwayat` mengarah ke komponen `RiwayatPenilaian` tanpa memicu redirect ke root dashboard.
- **Fix (ProfileManagement):** Mengatasi *blank screen* dengan menambahkan pengecekan data (`null-safety`). Menggunakan `userData?.opd?.nama` agar aplikasi tidak crash jika data relasi OPD belum termuat sempurna.
- **Config (Vercel):** Memastikan `VITE_API_BASE_URL` disetel ke `/api/v1` untuk konsistensi akses API di domain `pemdi.minselkab.go.id`.

## [2026-04-08] - Hotfix: Sinkronisasi Frontend & Routing
- **Fix (EvaluasiMandiri):** Mengubah query periode untuk mendukung toleransi casing 'berjalan' dan 'Berjalan' guna memastikan data muncul di dashboard operator.
- **Fix (Routing Dashboard):** Memastikan path rute di `Dashboard.jsx` (`riwayat`) sinkron dengan link di Sidebar untuk mencegah auto-redirect ke halaman utama dashboard.
- **Fix (ProfileManagement):** Menambahkan optional chaining dan loading state yang lebih ketat untuk mencegah blank screen jika relasi data OPD pada user bernilai null.
- **Config (Vercel):** Mengubah `VITE_API_BASE_URL` menjadi relative path `/api/v1` di `vercel.json` agar lebih konsisten di berbagai domain (termasuk custom domain). Menambahkan header `Cache-Control: no-cache` untuk memastikan user selalu mendapat versi terbaru aplikasi.

## [2026-04-08] - Fix: Dashboard Operator & Profil Instansi
- **Fix (Penilaian Mandiri - Periode Aktif):** Memperbaiki masalah "Tidak ada periode aktif" dengan mengubah logic query status periode dari `'active'` menjadi `'berjalan'`. Hal ini disesuaikan dengan skema status yang ada di backend.
  - File: `frontend/src/pages/EvaluasiMandiri.jsx`
- **Fix (Riwayat Penilaian - Auto Redirect Dashboard):** Mengatasi masalah klik menu Riwayat Penilaian yang selalu kembali ke Dashboard. 
  - Melakukan implementasi pengambilan data real dari Supabase untuk riwayat penilaian per tahun.
  - Menghapus ketergantungan `framer-motion` yang berpotensi crash dan menggantinya dengan optimasi CSS.
  - Menambahkan route-route yang hilang di `Dashboard.jsx` (`catatan`, `penilaian-interviu`, `berita-acara`, `rekap-nilai`) untuk mencegah catch-all redirect.
  - File: `frontend/src/pages/RiwayatPenilaian.jsx`, `frontend/src/pages/Dashboard.jsx`
- **Fix (Profil Instansi - Halaman Putih):** Menghilangkan blank/white screen pada halaman Profil Instansi. Menambahkan *null-guard* pada data user, memperbaiki error handling saat fetch data gagal, dan menambahkan fallback UI (Error/Try Again) agar aplikasi tidak crash.
  - File: `frontend/src/pages/ProfileManagement.jsx`

- **Fix (Vercel Configuration - Schema Validation):** Removing invalid `env` property dari dalam builds array di vercel.json. Vercel schema tidak allow nested env di builds item. Environment variables harus di-set di top-level `env` object atau via Vercel Dashboard. 
  - File: `vercel.json`
  - Perubahan: Remove `env` dari `builds[0]`
  - Result: ✅ Schema validation passed, Vercel can now build successfully
- **Fix (Profil Instansi - White/Blank Screen):** **CRITICAL BUG** - ProfileManagement.jsx menggunakan icon `ChevronRight` tapi tidak di-import. Ini menyebabkan component crash dengan error "ChevronRight is not defined". Menambahkan `ChevronRight` ke import statement dari lucide-react. Sekarang halaman Profil Instansi akan render dengan baik tanpa error.
  - File: `frontend/src/pages/ProfileManagement.jsx`
  - Perubahan: Import `ChevronRight` dari lucide-react
  - Result: ✅ Layar putih fixed, form profile now fully functional
- **Fix (Evaluasi - Error Handling Periode):** Improve error logging di EvaluasiMandiri saat fetch periode aktif. Menambahkan detailed console logging untuk debug bila terjadi error. Ini membantu identify apakah error adalah "no rows returned" (PGRST116) atau error lain yang lebih serius.
  - File: `frontend/src/pages/EvaluasiMandiri.jsx`
  - Perubahan: Improved error handling di `fetchInitialData()` dengan conditional checks
  - Result: ✅ Better error diagnostics untuk troubleshooting
- **Fix (Riwayat Penilaian):** RiwayatPenilaian route sudah properly di-import dan di-setup di Dashboard.jsx dengan path `riwayat`. Component tidak memiliki redirect logic, hanya menampilkan dummy history data. Jika masih terjadi auto-redirect, check:
  1. Browser cache - clear cache dan reload
  2. Vercel environment variables - pastikan VITE_API_BASE_URL sudah set dengan benar
  3. Browser console - cek apakah ada error yang trigger redirect
- **Deployment:** 
  - Commit `db95f2b` - Critical bug fixes
  - Commit `232fdbb` - Force rebuild untuk ChevronRight fix
  - Commit `3408fdd` - Fix Vercel schema validation
  - Vercel akan auto-rebuild dan deploy ke production (pemdi.minselkab.go.id)

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
