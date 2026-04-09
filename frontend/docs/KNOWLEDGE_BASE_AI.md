# BASIS PENGETAHUAN (KNOWLEDGE BASE) - PORTAL EVALUASI PEMDI V2

Dokumen ini berisi informasi struktur dan operasional sistem untuk digunakan sebagai referensi utama (Ground Truth) bagi Chatbot AI.

## 1. PENGENALAN DASAR
Portal Evaluasi Pemerintah Digital (Pemdi) adalah platform berbasis web untuk penilaian Mandiri dan Audit Sistem Pemerintahan Berbasis Elektronik (SPBE) di lingkungan Pemerintah Kabupaten Minahasa Selatan.

*   **URL Akses**: pemdi.minselkab.go.id
*   **Tujuan**: Mengukur tingkat kematangan penerapan digital di seluruh Perangkat Daerah Kabupaten Minahasa Selatan, transparansi, akuntabilitas, dan percepatan indeks SPBE Nasional.

## 2. JENIS PENGGUNA (ROLE)
1.  **Kategori 1: Super Admin (Administrator Utama)**: Akses penuh, kelola teknis (SMTP, Backup, Logs).
2.  **Kategori 2: Admin SPBE Pemkab**: Kelola Master Data (OPD, Indikator), monitoring progres.
3.  **Kategori 3: Operator / PIC OPD**: Perwakilan dinas penanggung jawab pengisian indikator dan bukti dukung.
4.  **Kategori 4: Tim Asesor Internal**: Verifikasi dokumen, audit, dan interviu.
5.  **Kategori 5: Pimpinan Instansi**: Lihat Dashboard eksekutif, Ranking, dan Laporan Indeks.
6.  **Kategori 6: Viewer**: Akses baca-saja.

## 3. INDIKATOR - DEFINISI & TANGGUNG JAWAB
Indikator adalah parameter pengukuran tingkat kematangan Pemerintah Digital. Total ada **20 indikator (IK-01 sampai IK-20)**. Indikator berasal dari Peraturan Menteri PANRB dan RPJMN 2025-2029.

*   **Diskominfo**: Bertanggung jawab untuk 18 indikator.
*   **Bappelitbangda**: Bertanggung jawab untuk 7 indikator.
*   **OPD Layanan Publik (Dinas Kesehatan, Pendidikan, Sosial)**: Bertanggung jawab untuk 9 indikator (IK-05, IK-07, IK-13, IK-15, IK-16, IK-17, IK-18, IK-19, IK-20).

## 4. RINCIAN INDIKATOR (IK-01 SAMPAI IK-20)

### IK-01: Tata Kelola Pemerintah Digital
*   **Definisi**: Mengukur tingkat kematangan perencanaan, pelaksanaan, dan pengendalian Pemdi terpadu.
*   **Penanggung Jawab**: Diskominfo, Bappelitbangda, Bagian Organisasi Setda.
*   **Dokumen Wajib**: Rencana Aksi (SK Bupati/Perbup), Arsitektur Pemdi, Laporan Pelaksanaan, Bukti Reviu berkala.
*   **Level**: 1 (Kurang/Rencana aksi tahap pemilihan), 3 (Baik/Langkah nyata dilaksanakan), 5 (Memuaskan/Tindak lanjut reviu menyeluruh).

### IK-02: Manajemen Layanan Digital
*   **Definisi**: Menilai manajemen risiko, perubahan, pengetahuan, keberlangsungan, dan relasi pengguna.
*   **Dokumen Wajib**: SOP Manajemen Layanan, Bukti Manajemen Risiko, Log Perubahan, Portal Knowledge Management, Dokumen BCP/DRP.

### IK-03: SDM Pemerintah Digital
*   **Definisi**: Menilai kompetensi digital ASN.
*   **Penanggung Jawab**: BKPSDM, Diskominfo, Bagian Organisasi Setda.
*   **Dokumen Wajib**: Peta Kompetensi Digital, Data Pelatihan, Sertifikat, Data ASN IT, Bukti pemanfaatan AI/Analisis Data.

### IK-04: Kolaborasi Pemerintah Digital
*   **Definisi**: Menilai forum koordinasi Pemdi dan kolaborasi lintas sektor.
*   **Dokumen Wajib**: SK Forum Koordinasi, Notulensi Rapat, Daftar Peserta Kolaborasi, Bukti kontribusi ke Dasbor Presiden.

### IK-05: Tata Kelola Data
*   **Definisi**: Implementasi Satu Data Indonesia (SDI).
*   **Dokumen Wajib**: SK Walidata/Produsen Data, Metadata, Standar Data, Portal Data (API), Nilai SDI.

### IK-06: Informasi Geospasial
*   **Definisi**: Berbagi pakai data geospasial.
*   **Dokumen Wajib**: SK Kelembagaan IG, URL Geoportal, Metadata Geospasial, Nilai SJIG, Foto Perangkat Produksi (GPS/Drone).

### IK-07: Pembangunan Statistik
*   **Definisi**: Pemanfaatan data statistik sektoral.
*   **Dokumen Wajib**: SK Statistik Sektoral, Rencana Kerja Statistik, Data Statistik yang dihasilkan, Nilai EPSS.

### IK-08: Pelindungan Data Pribadi
*   **Definisi**: Penerapan UU PDP.
*   **Dokumen Wajib**: Kebijakan PDP (Perbup), Bukti Enkripsi/Enkripsi, SOP Hak Subjek Data, Register Pemrosesan Data.

### IK-09: Audit Keamanan dan Teknologi
*   **Definisi**: Pelaksanaan audit berkala BSSN.
*   **Dokumen Wajib**: SK Tim Audit, Perencanaan Audit, Laporan Audit Internal/Eksternal, Rencana Tindak Lanjut (RTL).

### IK-10: Keamanan Pemerintah Digital
*   **Definisi**: Tata kelola keamanan informasi (ISO 27001).
*   **Dokumen Wajib**: Dokumen Keamanan Informasi, Nilai IKASANDI, Bukti Reviu berkala.

### IK-11: Kriptografi
*   **Definisi**: Proteksi data melalui enkripsi.
*   **Dokumen Wajib**: Bukti SSL/TLS, Standar Algoritma Enkripsi yang digunakan.

### IK-12: Penanganan Insiden
*   **Definisi**: Kapabilitas CSIRT/TTIS dalam menangani insiden siber.
*   **Dokumen Wajib**: SK CSIRT, Laporan Penanganan Insiden, Bukti Simulasi Penanganan.

### IK-13: Aplikasi Pemerintah Digital
*   **Definisi**: Pembangunan aplikasi sesuai siklus SDLC.
*   **Dokumen Wajib**: Dokumen Perencanaan (Project Charter), Bukti SDLC, Daftar Aplikasi, Bukti Integrasi API.

### IK-14: Infrastruktur Pemerintah Digital
*   **Definisi**: Pemanfaatan Teknologi Awan / Cloud (PDN).
*   **Dokumen Wajib**: Rencana Infrastruktur, Data Pemanfaatan PDN/Cloud, Integrasi JIP (Jaringan Intra Pemerintah).

### IK-15: Keterpaduuan Proses Bisnis
*   **Definisi**: Proses bisnis lintas unit berorientasi pengguna.
*   **Dokumen Wajib**: Peta Proses Bisnis, Bukti Penyederhanaan Proses, Penggunaan Arsip Digital (SRikandi).

### IK-16: Integrasi Aplikasi
*   **Definisi**: Menghubungkan aplikasi untuk berbagi data holistik.
*   **Dokumen Wajib**: Arsitektur Teknologi, Bukti Integrasi API, Koneksi ke Dasbor Presiden.

### IK-17: Portal Layanan Digital
*   **Definisi**: Konsolidasi layanan di portal minselkab.go.id.
*   **Dokumen Wajib**: URL Portal Layanan, Daftar Layanan, Bukti integrasi portal nasional.

### IK-18: Interoperabilitas Data
*   **Definisi**: Pertukaran data antar sistem berbeda.
*   **Dokumen Wajib**: Standar Interoperabilitas, Bukti Pertukaran Data Real-time, Kontribusi ke SDI.

### IK-19: Fasilitas Dukungan Pengguna
*   **Definisi**: Helpdesk/Service Level Agreement (SLA).
*   **Dokumen Wajib**: SOP SLA, Bukti Helpdesk/Call Center, Dashboard Monitoring SLA.

### IK-20: Kepuasan Pengguna (Bobot Terbesar: 15%)
*   **Definisi**: Mengukur kepuasan masyarakat terhadap layanan digital.
*   **Dokumen Wajib**: Laporan Survei Kepuasan, Analisis Sentimen AI, Bukti Mystery Guest, Kanal Umpan Balik, Keterlibatan Kelompok Rentan.

## 5. PROSEDUR PENGISIAN & ALUR
1.  **Cara Login**: Buka pemdi.minselkab.go.id, masukkan email/password. Pendaftaran butuh surat tugas.
2.  **Langkah Isi Indikator**: 
    - Pilih Level (1-5).
    - Tulis Penjelasan/Deskripsi.
    - Unggah Dokumen Bukti (Sesuai rincian di atas).
    - Klik Simpan. 
3.  **Jadwal (Timeframe)**:
    - Penilaian Mandiri: 1 April - 10 Mei (Batas Akhir).
    - Penilaian Dokumen: 16 Mei - 30 Juni.
    - Interviu: 1 Juli - 15 Agustus.
    - Visitasi: 16 Agustus - 15 September.

## 6. PEDOMAN NILAI (LEVEL)
*   **Level 1 (Kurang)**: Merintis / Ad-hoc.
*   **Level 2 (Cukup)**: Membangun / Terencana sebagian.
*   **Level 3 (Baik)**: Berkembang / Terintegrasi sistematis.
*   **Level 4 (Sangat Baik)**: Melembaga / Reviu reguler.
*   **Level 5 (Memuaskan)**: Unggul / Inovatif & Berdampak Luas.

---
*Versi Dokumen: 3.0 (Update Full Indicators 2026)*