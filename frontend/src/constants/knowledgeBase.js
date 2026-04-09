export const KNOWLEDGE_BASE = `
# BASIS PENGETAHUAN (GROUND TRUTH) - PORTAL PEMDI V2
*Versi Dokumen: 5.4 (Full Integration & Strict Grounding)*

## 1. DAFTAR LENGKAP 20 INDIKATOR (IK-01 - IK-20)
| Kode | Nama Indikator | Dokumen Wajib / Bukti Pendukung |
|---|---|---|
| **IK-01** | Tata Kelola Pemdi | SK Rencana Aksi Pemdi, Arsitektur Pemdi, Laporan Realisasi. |
| **IK-02** | Manajemen Layanan | SOP Manajemen Layanan, Register Risiko, BCP/DRP. |
| **IK-03** | SDM Pemdi | Peta Kompetensi, Pelatihan ASN (>90%), **Pemanfaatan AI**. |
| **IK-04** | Kolaborasi | SK Forum Koordinasi, MoU Kerjasama lintas sektor. |
| **IK-05** | Tata Kelola Data | SK Walidata, Metadata SDI, Portal API Berbagi Pakai. |
| **IK-06** | Info Geospasial | URL Geoportal, Metadata IG, Nilai SJIG, Foto Drone/GPS. |
| **IK-07** | Pembangunan Statistik | SK Statistik Sektoral, Rencana Kerja Statistik, Nilai EPSS. |
| **IK-08** | Pelindungan Data Pribadi | Perbup Kebijakan PDP, Dokumentasi Enkripsi Database. |
| **IK-09** | Audit Keamanan & Tekno | SK Tim Audit, Laporan Audit Internal/Eksternal, RTL. |
| **IK-10** | Keamanan Pemdi | Dokumen ISO 27001, Daftar IIV, Nilai IKASANDI. |
| **IK-11** | Kriptografi | Sertifikat SSL/TLS, Bukti Enkripsi Database. |
| **IK-12** | Penanganan Insiden | SK CSIRT/TTIS, Laporan Penanganan Insiden Siber. |
| **IK-13** | Aplikasi Pemdi | Dokumentasi SDLC (UAT/Desain), Dokumentasi API. |
| **IK-14** | Infrastruktur Pemdi | Bukti Hosting Pusat Data Nasional (PDN), JIP. |
| **IK-15** | Proses Bisnis Lintas Unit | **Peta Probis**, **Layanan Arsip Digital SRIKANDI**. |
| **IK-16** | Integrasi Aplikasi | Arsitektur Integrasi, Sinkronisasi Dasbor Presiden. |
| **IK-17** | Portal Layanan Digital | URL minselkab.go.id, Katalog Layanan Terpadu. |
| **IK-18** | Interoperabilitas Data | Standar API, Pertukaran Data Real-time SDI. |
| **IK-19** | Dukungan Pengguna | SOP SLA, Chatbot/Helpdesk, Dashboard Monitoring SLA. |
| **IK-20** | Tingkat Kepuasan | Laporan Survei SKM, **Analisis Sentimen AI**. |

## 2. GLOSARIUM & DEFINISI KRITIS
- **Peta Probis (Proses Bisnis)**: Diagram alur kerja terstruktur yang menggambarkan hubungan kerja antar unit organisasi untuk menghasilkan layanan yang efektif. Peta ini wajib disusun untuk memastikan tidak ada duplikasi fungsi (silo) antar OPD.
- **SRIkandi**: Aplikasi Umum Nasional (Sistem Informasi Kearsipan Dinamis Terintegrasi) yang wajib digunakan oleh seluruh instansi pemerintah untuk pengelolaan arsip secara digital, efisien, dan terpusat. (Krusial untuk IK-15).
- **PDN (Pusat Data Nasional)**: Fasilitas penyimpanan data terpusat yang dikelola Kemkominfo Pusat. Seluruh aplikasi OPD wajib di-host di sini.
- **SDLC**: Siklus pengembangan aplikasi (Rancang Bangun, UAT, Implementasi).
- **SDI (Satu Data Indonesia)**: Kebijakan tata kelola data untuk menghasilkan data akurat, mutakhir, dan dapat dibagipakaikan.

## 3. PEMBAGIAN TANGGUNG JAWAB (TUGAS OPD)
- **Diskominfo**: Bertanggung jawab utama untuk 18 indikator teknis & infrastruktur.
- **Bappelitbangda**: Bertanggung jawab untuk 7 indikator terkait perencanaan (IK-01, IK-05).
- **OPD Layanan Publik (Dinas Kesehatan, Pendidikan, Sosial, dll)**: Wajib mengisi 9 indikator (IK-05, IK-07, IK-13, IK-15, IK-16, IK-17, IK-18, IK-19, IK-20).

## 4. STRUKTUR PENILAIAN & RUMUS
- **Nilai Akhir**: Gabungan Dokumen (40%), Wawancara (40%), dan Visitasi (20%).
- **Rumus Indeks**: Indeks Pemdi = Σ (Bobot Aspek × Nilai Aspek).
- **Aspek Terbesar**: Kepuasan Pengguna (25%) dengan IK-20 sebagai motor utama (15%).

## 5. JADWAL EVALUASI 2026
- **Penilaian Mandiri**: 1 April - 15 Mei 2026 (Batas Submit 15 Mei).
- **Verifikasi Asesor**: 16 Mei - 30 Juni 2026.
- **Wawancara**: Juli - Agustus 2026.

## 6. ASPEK TEKNIS (PERBUP 15/2025)
- **Email Dinas**: Wajib @minselkab.go.id.
- **Service Desk**: Tier-1 di tingkat OPD, Tier-2 di tingkat Diskominfo.
`;
