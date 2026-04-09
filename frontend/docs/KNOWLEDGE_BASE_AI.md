BASIS PENGETAHUAN (KNOWLEDGE BASE) - PORTAL EVALUASI PEMDI
Kabupaten Minahasa Selatan
Versi 2.0 | Untuk Chatbot AI
DAFTAR ISI
No	Bagian	Halaman
1	Pengenalan Sistem	3
2	Jenis Pengguna (Role)	4
3	Cara Login & Akses	6
4	Struktur Menu dan Navigasi	7
5	Indikator Penilaian (20 Indikator)	9
6	Alur Proses Evaluasi	14
7	Perangkat Daerah Target Evaluasi	15
8	Dokumen yang Dibutuhkan per Indikator	16
9	FAQ dan Panduan Singkat	18
10	Kontak Dukungan Teknis	20
BAB 1: PENGENALAN SISTEM
1.1 Apa itu Portal Evaluasi Pemdi?
Portal Evaluasi Pemerintah Digital (Pemdi) adalah platform berbasis web untuk penilaian mandiri (self-assessment) dan audit Sistem Pemerintahan Berbasis Elektronik (SPBE) di lingkungan Pemerintah Kabupaten Minahasa Selatan.

1.2 Informasi Dasar
Item	Keterangan
Nama Sistem	Portal Evaluasi Kinerja Pemerintah Digital (Pemdi)
URL Akses	https://pemdi.minselkab.go.id
Tujuan	Transparansi, akuntabilitas, dan percepatan indeks SPBE Nasional
Tahun Evaluasi	2026
Jumlah Indikator	20 Indikator (IK-01 s.d. IK-20)
Jumlah Aspek	7 Aspek
Jumlah OPD Target	45 Perangkat Daerah
1.3 Tujuan Sistem
Mengukur tingkat kematangan penerapan Pemerintah Digital di Kabupaten Minahasa Selatan

Meningkatkan kualitas layanan digital pemerintah daerah

Mengukur dampak kebijakan Pemdi terhadap kemudahan layanan masyarakat

Menyediakan data capaian kinerja Pemdi untuk pelaporan ke pusat dan publik

Memberikan rekomendasi perbaikan untuk peningkatan kualitas layanan digital

BAB 2: JENIS PENGGUNA (ROLE) DALAM SISTEM
Terdapat 6 (enam) kategori pengguna dengan tingkat akses yang berbeda:

2.1 Kategori 1: Super Admin (Administrator Utama)
Atribut	Keterangan
Akses	Penuh ke seluruh sistem
Tugas Utama	Mengelola infrastruktur teknik (SMTP, Database Backup, Logs)
Kewenangan	Dapat mengelola semua kategori user
Contoh User	Admin utama Dinas Kominfo
Menu yang dapat diakses:

Dashboard Admin

Manajemen User (tambah, edit, hapus, reset password)

Manajemen OPD

Manajemen Indikator

Manajemen Aspek

Manajemen Periode

Backup Database

Log Aktivitas

Pengaturan SMTP

2.2 Kategori 2: Admin SPBE Pemkab
Atribut	Keterangan
Akses	Manajemen data dan monitoring
Tugas Utama	Mengelola Master Data (OPD, Indikator, Aspek)
Kewenangan	Melakukan monitoring progres seluruh instansi
Batasan	Tidak memiliki akses ke fitur teknis seperti SMTP atau Backup
Menu yang dapat diakses:

Dashboard Admin SPBE

Manajemen OPD

Manajemen Indikator

Manajemen Aspek

Manajemen Periode

Monitoring Progres

Rekapitulasi Nilai

2.3 Kategori 3: Operator / PIC OPD
Atribut	Keterangan
Akses	Terbatas pada OPD sendiri
Tugas Utama	Mengisi Penilaian Mandiri, mengunggah bukti dukung
Kewenangan	Mengelola profil instansi
Contoh User	PIC Dinas Kesehatan, PIC Dinas Pendidikan
Menu yang dapat diakses:

Dashboard OPD

Penilaian Mandiri (isi nilai, upload bukti)

Riwayat Penilaian

Rekomendasi Perbaikan

Profil OPD

2.4 Kategori 4: Tim Asesor Internal
Atribut	Keterangan
Akses	Verifikasi dokumen dan penilaian
Tugas Utama	Memberikan skor validasi, catatan perbaikan
Kewenangan	Melakukan wawancara/interviu
Contoh User	Inspektorat, BKPSDM, Bappelitbangda
Menu yang dapat diakses:

Dashboard Asesor Internal

Verifikasi Dokumen OPD

Catatan Perbaikan

Rekapitulasi Verifikasi

2.5 Kategori 5: Tim Asesor Eksternal
Atribut	Keterangan
Akses	Penilaian dokumen, interviu, visitasi
Tugas Utama	Melakukan penilaian dokumen, wawancara, dan kunjungan lapangan
Kewenangan	Membuat berita acara penilaian
Contoh User	Akademisi, Tenaga Ahli, KemenPANRB
Menu yang dapat diakses:

Dashboard Asesor Eksternal

Penilaian Dokumen

Penilaian Interviu

Penilaian Visitasi

Berita Acara

Rekapitulasi Nilai Akhir

2.6 Kategori 6: Pimpinan Instansi
Atribut	Keterangan
Akses	Hanya baca (read-only) untuk dashboard dan laporan
Tugas Utama	Melihat hasil evaluasi secara keseluruhan
Kewenangan	Mengunduh laporan eksekutif
Contoh User	Bupati, Sekretaris Daerah, Kepala OPD
Menu yang dapat diakses:

Dashboard Pimpinan

Ranking Klasemen OPD

Laporan Indeks Pemdi

Rekomendasi Strategis

Arsip Tahun Sebelumnya

2.7 Kategori 7: Viewer / Pengamat
Atribut	Keterangan
Akses	Hanya baca (read-only)
Tugas Utama	Keperluan demo atau pengamatan umum
Kewenangan	Melihat laporan publik
Batasan	Tidak dapat mengedit atau mengisi data
Menu yang dapat diakses:

Dashboard Publik

Laporan Indeks (Read-Only)

Ranking Klasemen (Read-Only)

BAB 3: CARA LOGIN & AKSES
3.1 Langkah-langkah Login
Untuk masuk ke dalam sistem, ikuti langkah berikut:

Step	Tindakan	Keterangan
1	Buka browser dan akses pemdi.minselkab.go.id	Gunakan Chrome, Firefox, atau Edge versi terbaru
2	Masukkan Email Instansi dan Password	Email harus sesuai dengan yang terdaftar
3	Klik tombol "Masuk ke Dashboard"	Tunggu redirect ke dashboard sesuai role
4	Jika login pertama, akan diminta ganti password	Password minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan simbol
3.2 Cara Reset Password
Step	Tindakan
1	Klik link "Lupa Password?" di halaman login
2	Masukkan email yang terdaftar
3	Cek email untuk link reset password
4	Klik link dan masukkan password baru
5	Login kembali dengan password baru
3.3 Cara Registrasi Akun Baru
Jika belum memiliki akun:

Step	Tindakan	Keterangan
1	Klik "Daftar Sekarang" di halaman login	-
2	Pilih Jabatan dan Instansi	Pilih OPD sesuai penempatan
3	Upload Surat Tugas (Wajib)	Format PDF, maksimal 2 MB
4	Isi data diri lengkap	Nama, NIP, Nomor WA, Email
5	Klik "Daftar"	-
6	Tunggu verifikasi oleh Super Admin melalui email	Proses verifikasi maksimal 2x24 jam
BAB 4: STRUKTUR MENU DAN NAVIGASI
Navigasi di sisi kiri (Sidebar) disusun berdasarkan fungsi operasional.

4.1 Grup Utama
Menu	Fungsi	Akses
Dashboard	Beranda yang menampilkan statistik penilaian, berita acara terbaru, dan status periode berjalan	Semua Role
Profil Akun	Pengaturan identitas pribadi (Nama, Jabatan, WA) dan foto profil	Semua Role
4.2 Grup Master Data
Menu	Fungsi	Akses
Manajemen User	Kelola hak akses dan verifikasi pendaftar baru	Super Admin, Admin SPBE
Manajemen OPD	Pengelolaan daftar dinas/instansi	Super Admin, Admin SPBE
Manajemen Indikator	Daftar kriteria penilaian SPBE (Indikator 1-20)	Super Admin, Admin SPBE
Manajemen Aspek	Pengelompokan indikator ke dalam aspek terkait	Super Admin, Admin SPBE
Manajemen Periode	Pengaturan tahun penilaian (Aktif/Berjalan)	Super Admin, Admin SPBE
4.3 Grup Evaluasi SPBE
Menu	Fungsi	Akses
Penilaian Mandiri	Input nilai dan dokumen bukti oleh Operator OPD	OPD
Verifikasi OPD	Peninjauan dokumen oleh Tim Asesor	Asesor Internal
Catatan Perbaikan	Lokasi interaksi antara Asesor dan OPD untuk revisi dokumen	OPD, Asesor Internal
Penilaian Interviu	Manajemen jadwal dan hasil wawancara	Asesor Eksternal
Berita Acara	Dokumen final hasil audit yang siap dicetak	Asesor Eksternal
4.4 Grup Laporan & Pemeliharaan
Menu	Fungsi	Akses
Monitoring Progres	Pantauan real-time OPD yang aktif mengisi data	Admin SPBE, Operator
Ranking Klasemen	Peringkat antar instansi berdasarkan nilai SPBE sementara	Pimpinan, Viewer
Laporan Indeks	Rekapitulasi nilai indeks per domain dan aspek	Pimpinan, Viewer
Log Aktivitas	Rekam jejak seluruh tindakan user di sistem	Super Admin
Pengaturan SMTP	Konfigurasi email notifikasi	Super Admin

## 5. PROSEDUR PENGISIAN INDIKATOR (PENILAIAN MANDIRI)
Setiap indikator (Indikator 1 - 47) wajib diisi dengan langkah berikut agar valid:
1.  **Pilih Tingkat Kematangan (Level 1-5)**: Pilih level yang paling sesuai dengan kondisi riil di instansi Anda.
2.  **Isi Penjelasan/Deskripsi**: Berikan uraian singkat mengapa instansi Anda layak mendapatkan level tersebut.
3.  **Unggah Bukti Dukung**: Wajib mengunggah file (PDF/Gambar) yang membuktikan klaim Anda (Misal: SK Bupati, Foto Layanan, atau Dokumen SOP).
4.  **Klik Simpan**: Pastikan data tersimpan di setiap nomor indikator.
5.  **Final Submit**: Setelah semua indikator (1-47) diisi, klik tombol "Submit" untuk mengirim seluruh data ke Tim Asesor Pemkab.

---
*Versi Dokumen: 2.6 (Update Prosedur Indikator 2026)*

BAB 5: INDIKATOR PENILAIAN (20 INDIKATOR)
5.1 Ringkasan 7 Aspek dan 20 Indikator
No	Kode	Indikator	Bobot	Aspek
ASPEK 1: TATA KELOLA DAN MANAJEMEN (Bobot: 10%)				
1	IK-01	Tingkat Kematangan Tata Kelola Pemerintah Digital	5%	1
2	IK-02	Tingkat Kematangan Manajemen Layanan Digital Pemerintah	5%	1
ASPEK 2: PENYELENGGARA (Bobot: 10%)				
3	IK-03	Tingkat Kematangan Sumber Daya Manusia Pemerintah Digital	5%	2
4	IK-04	Tingkat Kematangan Kolaborasi Pemerintah Digital	5%	2
ASPEK 3: DATA (Bobot: 15%)				
5	IK-05	Tingkat Kematangan Tata Kelola Data	5%	3
6	IK-06	Tingkat Kematangan Penyelenggaraan Informasi Geospasial	3%	3
7	IK-07	Tingkat Kematangan Pembangunan Statistik	3%	3
ASPEK 4: KEAMANAN PEMERINTAH DIGITAL (Bobot: 15%)				
8	IK-08	Tingkat Kematangan Pelindungan Data Pribadi	4%	4
9	IK-09	Tingkat Kematangan Pelaksanaan Audit Keamanan dan Teknologi	4%	4
10	IK-10	Tingkat Kematangan Keamanan Pemerintah Digital	4%	4
ASPEK 5: TEKNOLOGI PEMERINTAH DIGITAL (Bobot: 10%)				
11	IK-11	Tingkat Kematangan Penerapan Kriptografi untuk Keamanan Data	3%	5
12	IK-12	Tingkat Kematangan Kapabilitas Penanganan Insiden	4%	5
13	IK-13	Tingkat Kematangan Aplikasi Pemerintah Digital	4%	5
14	IK-14	Tingkat Kematangan Infrastruktur Pemerintah Digital	5%	5
ASPEK 6: KETERPADUAN LAYANAN DIGITAL (Bobot: 15%)				
15	IK-15	Keterpaduan Proses Bisnis Pemerintah Digital Lintas Unit	4%	6
16	IK-16	Integrasi Aplikasi	4%	6
17	IK-17	Portal Layanan Digital Pemerintah	4%	6
18	IK-18	Interoperabilitas Data	3%	6
ASPEK 7: KEPUASAN PENGGUNA (Bobot: 25%)				
19	IK-19	Fasilitas Dukungan Pengguna Layanan Digital Pemerintah	10%	7
20	IK-20	Tingkat Kepuasan Pengguna Layanan Digital Pemerintah	15%	7
5.2 Tingkat Kematangan (Predikat)
Rentang Nilai	Predikat	Kode	Warna
1,00 - 1,50	Kurang / Merintis	Initiate	Merah
1,51 - 2,50	Cukup / Membangun	Emerging	Oranye
2,51 - 3,50	Baik / Berkembang	Developing	Biru
3,51 - 4,00	Sangat Baik / Melembaga	Embedded	Hijau
4,01 - 5,00	Memuaskan / Unggul	Leading	Ungu
BAB 6: ALUR PROSES EVALUASI
6.1 Tahapan Evaluasi
Tahap	Kegiatan	Periode	Pelaksana
Tahap 1	Penilaian Mandiri (Self-Assessment)	1 April - 15 Mei 2026	OPD
Tahap 2	Penilaian Dokumen	16 Mei - 30 Juni 2026	Asesor Eksternal
Tahap 3	Penilaian Interviu (Wawancara)	1 Juli - 15 Agustus 2026	Asesor Eksternal
Tahap 4	Penilaian Visitasi (Lapangan)	16 Agustus - 15 September 2026	Asesor Eksternal
Tahap 5	Harmonisasi dan Rekonsiliasi	16 September - 15 Oktober 2026	Operator
Tahap 6	Penetapan dan Pelaporan	16 Oktober - 31 Desember 2026	Bupati
6.2 Batas Waktu Penting
Kegiatan	Batas Waktu	Keterangan
Submit Penilaian Mandiri	10 Mei 2026	Setelah lewat, sistem ditutup
Penilaian Dokumen	30 Juni 2026	-
Penilaian Interviu	15 Agustus 2026	-
Penilaian Visitasi	15 September 2026	-
BAB 7: PERANGKAT DAERAH TARGET EVALUASI
7.1 Kategori Perangkat Daerah
Kategori	Jumlah	Contoh OPD
OPD Pendukung Sistem (Inti)	12	Dinas Kominfo, Bappelitbangda, BKPSDM, Inspektorat, Bagian Setda
OPD Pengelola Data Strategis	5	BPS, Dinas PUPR, Dinas Perpustakaan, Disdukcapil, Dinsos
OPD Layanan Publik	25	Dinkes, RSUD, Puskesmas, Disdikbud, DPM-PTSP, dll
Kecamatan	2	Kecamatan Amurang, Kecamatan Amurang Timur
Sekretariat	1	Sekretariat DPRD
7.2 OPD dengan Indikator Terbanyak
OPD	Jumlah Indikator	Indikator
Dinas Kominfo	18 indikator	IK-01 s.d. IK-20 (kecuali IK-07, IK-15)
OPD Layanan Publik	9 indikator	IK-05, IK-07, IK-13, IK-15, IK-16, IK-17, IK-18, IK-19, IK-20
Bappelitbangda	7 indikator	IK-01, IK-02, IK-05, IK-06, IK-07, IK-15, IK-18
BAB 8: DOKUMEN YANG DIBUTUHKAN PER INDIKATOR
8.1 Ringkasan Dokumen per Indikator
Indikator	Dokumen yang Dibutuhkan
IK-01	SK/Perbup Rencana Aksi Pemdi, Dokumen Arsitektur Pemdi, Laporan Pelaksanaan, Notulensi Rapat Evaluasi
IK-02	SOP Manajemen Layanan Digital, Dokumen Profil Risiko, Log Perubahan Aplikasi, Dokumentasi BCP/DRP
IK-03	Peta Kompetensi Digital ASN, Data Pelatihan/Sertifikasi, Bukti Pemanfaatan AI/Analisis Data
IK-04	SK Forum Koordinasi Pemdi, Notulensi Rapat, MoU Kerjasama, Bukti Kontribusi ke Dasbor Presiden
IK-05	SK Pembina/Wali/Produsen Data, Portal Metadata, Nilai SDI, Bukti Pemanfaatan Data
IK-06	SK Tim Kerja IG, URL Geoportal, Nilai SJIG, Daftar Perangkat Produksi Data Geospasial
IK-07	SK Kelembagaan Statistik Sektoral, Data Statistik yang Dihasilkan, Nilai EPSS
IK-08	Dokumen Kebijakan PDP, Dokumentasi Sistem Pengendalian Teknis, Register Aktivitas Pemrosesan Data
IK-09	SK Tim Audit, Laporan Audit Internal/Eksternal, Rencana Tindak Lanjut (RTL)
IK-10	Dokumen Keamanan Informasi, Konfigurasi Firewall, Nilai IKASANDI
IK-11	Bukti Penerapan Enkripsi (SSL/TLS, Enkripsi Database), Dokumen Standar Kriptografi
IK-12	SK TTIS/CSIRT, Laporan Penanganan Insiden, Bukti Simulasi/Participasi TTIS Nasional
IK-13	Dokumentasi SDLC, Daftar Aplikasi, Dokumentasi API Integrasi
IK-14	Dokumen Perencanaan Infrastruktur, Bukti Pemanfaatan PDN/Cloud, Dokumentasi Koneksi JIP
IK-15	Peta Proses Bisnis, Dokumen Layanan Terpadu, Bukti Penerapan Arsip Digital (SRIkandi)
IK-16	Dokumentasi API, Matriks Integrasi, Bukti Integrasi dengan Dasbor Presiden
IK-17	URL Portal Layanan, Daftar Layanan, Bukti Integrasi dengan Portal Nasional
IK-18	Dokumen Standar Interoperabilitas, Bukti Pertukaran Data Real-time, Kontribusi ke Portal SDI
IK-19	SOP Layanan, Bukti Helpdesk/Call Center, Dashboard Monitoring SLA
IK-20	Hasil Survei Kepuasan, Bukti Kanal Umpan Balik, Laporan Mystery Guest, Analisis Sentimen AI
BAB 9: FAQ DAN PANDUAN SINGKAT
9.1 Pertanyaan Umum
Pertanyaan	Jawaban
Apa itu Portal Evaluasi Pemdi?	Platform untuk penilaian mandiri dan audit SPBE di Kabupaten Minahasa Selatan
Siapa saja yang wajib mengisi penilaian?	Seluruh 45 Perangkat Daerah (OPD) target evaluasi
Kapan batas akhir pengisian penilaian mandiri?	10 Mei 2026
Berapa jumlah indikator penilaian?	20 indikator (IK-01 s.d. IK-20)
Aspek apa yang memiliki bobot tertinggi?	Kepuasan Pengguna (25%)
Apa yang harus dilakukan jika lupa password?	Klik "Lupa Password" di halaman login, ikuti instruksi reset via email
Bagaimana cara upload bukti dokumen?	Masuk ke menu Penilaian Mandiri, pilih indikator, upload file (PDF/JPG/PNG, maks 10 MB)
Apakah file bukti bisa dihapus setelah upload?	Ya, selama belum submit final
Apa yang terjadi setelah submit final?	Data tidak dapat diubah lagi dan akan diverifikasi oleh Asesor Internal
Bagaimana cara melihat nilai sementara?	Buka Dashboard OPD, nilai sementara ditampilkan di kartu statistik
9.2 Troubleshooting
Masalah	Solusi
Tidak bisa login	Periksa email dan password, pastikan Caps Lock tidak aktif
Lupa password	Klik "Lupa Password", ikuti instruksi reset via email
Akun terkunci	Terlalu banyak percobaan gagal. Tunggu 15 menit atau hubungi admin
Upload file gagal	Periksa format file (PDF/JPG/PNG) dan ukuran (maks 10 MB)
Submit final tidak bisa	Pastikan semua indikator sudah terisi lengkap
Tampilan tidak rapi	Clear cache browser, refresh halaman
Grafik tidak muncul	Pastikan JavaScript enabled, refresh halaman
BAB 10: KONTAK DUKUNGAN TEKNIS
10.1 Kontak Resmi
Kontak	Keterangan
Helpdesk Teknis	085256510571 (WA)
Email	spbe@diskominfo.minselkab.go.id
Jam Layanan	Senin - Jumat, 08:00 - 16:00 WITA
Lokasi	Dinas Komunikasi dan Informatika Kab. Minahasa Selatan
10.2 Eskalasi Masalah
Level	Kontak	Waktu Respon
Level 1 (Teknis)	Helpdesk Dinas Kominfo	1x24 jam
Level 2 (Fungsional)	Koordinator Pemdi	2x24 jam
Level 3 (Kebijakan)	Sekretaris Daerah	3x24 jam
Dokumen ini adalah Ground Truth untuk Chatbot AI Portal Evaluasi Pemdi Kabupaten Minahasa Selatan.