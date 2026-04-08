# Catatan Perubahan (Changelog)
(tiap perubahan dicatat dalam PERUBAHAN.MD dan auto push ke git)

Semua riwayat pembaruan dan perbaikan aplikasi akan dicatat di sini.

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

## [2026-04-08] - Perbaikan Fitur Manajemen User
- **Fix (UserManagement):** Mengaktifkan tombol hapus user (*Trash button*) yang sebelumnya tidak berfungsi. Menambahkan fungsi `handleDelete` dengan konfirmasi keamanan sebelum data dihapus dari database Supabase.
- **Feat (UserManagement):** Menambahkan tombol **Resend Aktivasi** (ikon email biru) pada baris user yang berstatus *Pending*. Fitur ini memungkinkan admin mengirim ulang email notifikasi pendaftaran tanpa harus mendaftarkan ulang data user.
- **Feat (Edge Function):** Memperbaharui *Supabase Edge Function* untuk mendukung mode pengiriman email saja (*resend only*) agar tidak terjadi error data duplikat saat admin menekan tombol kirim ulang.
- **Fix (UserManagement):** Memperbaiki posisi tombol email biru agar berada tepat di samping nama user dan memastikan tidak terjadi *redirect* atau pembukaan tab baru yang tidak diinginkan saat tombol diklik.
- **Feat (UserManagement):** Menambahkan fitur **Enable/Disable Status** pada tabel user, memungkinkan admin untuk menonaktifkan akun yang sudah aktif atau mengaktifkan kembali akun yang sebelumnya ditolak.
- **Fix (UserManagement):** Menyelesaikan masalah di mana Admin tidak dapat menambahkan user baru lewat tombol "Force Enroll". Menambahkan logika `INSERT` ke database dengan *password default* `Minsel123!`.
- **Fix (Storage Path):** Memperbaiki tautan (link) "Lihat Surat Tugas" yang sebelumnya sering menghasilkan error *Not Found* atau *Broken Link* dengan menambahkan pengecekan otomatis awalan folder `/requests/` pada path file di Supabase Storage.
