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

## [2026-04-08] - Perbaikan Fitur Manajemen User
- **Fix (UserManagement):** Mengaktifkan tombol hapus user (*Trash button*) yang sebelumnya tidak berfungsi. Menambahkan fungsi `handleDelete` dengan konfirmasi keamanan sebelum data dihapus dari database Supabase.
- **Feat (UserManagement):** Menambahkan tombol **Resend Aktivasi** (ikon email biru) pada baris user yang berstatus *Pending*. Fitur ini memungkinkan admin mengirim ulang email notifikasi pendaftaran tanpa harus mendaftarkan ulang data user.
- **Feat (Edge Function):** Memperbaharui *Supabase Edge Function* untuk mendukung mode pengiriman email saja (*resend only*) agar tidak terjadi error data duplikat saat admin menekan tombol kirim ulang.
- **Fix (UserManagement):** Memperbaiki posisi tombol email biru agar berada tepat di samping nama user dan memastikan tidak terjadi *redirect* atau pembukaan tab baru yang tidak diinginkan saat tombol diklik.
- **Feat (UserManagement):** Menambahkan fitur **Enable/Disable Status** pada tabel user, memungkinkan admin untuk menonaktifkan akun yang sudah aktif atau mengaktifkan kembali akun yang sebelumnya ditolak.
