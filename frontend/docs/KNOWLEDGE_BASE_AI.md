# PANDUAN PENGETAHUAN MASTER (GROUND TRUTH) - PORTAL PEMDI V2
*Versi Dokumen: 6.0 (Ultimate Integration - April 2026)*

Dokumen ini adalah referensi tunggal (Single Source of Truth) untuk seluruh operasional, kebijakan, dan kriteria penilaian Sistem Pemerintahan Berbasis Elektronik (SPBE) / Pemerintah Digital di Kabupaten Minahasa Selatan.

## 1. LANDASAN HUKUM FORMAL (PERBUP 15/2025)
Berdasarkan **Peraturan Bupati Minahasa Selatan Nomor 15 Tahun 2025**:
- **Mandat Utama**: Penyelenggaraan SPBE yang terpadu untuk pelayanan publik yang berkualitas.
- **Hierarki**: Sekretaris Daerah sebagai Koordinator, Diskominfo sebagai Instansi Teknis.
- **PD Mandiri TIK**: Status khusus bagi OPD yang mampu mengelola infrastruktur/aplikasi sendiri secara mandiri (Pasal 41).
- **Service Desk**: 
  - **Tier 1 (OPD)**: Wajib ada minimal 1 staf IT sebagai penangan pertama keluhan.
  - **Tier 2 (Diskominfo)**: Pusdalops/Helpdesk pusat untuk eskalasi teknis berat.
- **Infrastruktur Wajib**: Penggunaan Jaringan Intra (Fiber Optic Diskominfo) dan Email CSRT `@minselkab.go.id`.

## 2. JADWAL & TAHAPAN EVALUASI 2026
Proses penilaian tidak hanya berdasarkan dokumen, melainkan gabungan dari 3 metode:

| Tahap | Nama Kegiatan | Periode | Bobot Nilai |
|---|---|---|---|
| 1 | **Penilaian Mandiri (OPD)** | 1 April - 15 Mei | - |
| 2 | **Evaluasi Dokumen (Asesor)** | 16 Mei - 30 Juni | **40%** |
| 3 | **Interviu / Wawancara** | Juli - Agustus | **40%** |
| 4 | **Visitasi Lapangan** | Agustus - September | **20%** |

---

## 3. RINCIAN 20 INDIKATOR PEMDI (IK-01 Sampai IK-20)

| Kode | Indikator | Dokumen Kritis / Bukti Wajib | Tanggung Jawab |
|---|---|---|---|
| **IK-01** | Tata Kelola | SK Rencana Aksi, Dokumen Arsitektur Pemdi. | Bappelitbangda/Kominfo |
| **IK-02** | Manajemen Layanan | SOP Manajemen, Risiko TIK, & BCP/DRP. | Diskominfo |
| **IK-03** | SDM | Sertifikat Diklat ASN, **Bukti Pakai AI**. | BKPSDM/Kominfo |
| **IK-04** | Kolaborasi | SK Forum Koordinasi, PKS lintas unit. | Sekretariat Daerah |
| **IK-05** | Tata Kelola Data | Metadata SDI, Walidata, Portal API. | Diskominfo/BPS |
| **IK-06** | Geospasial | URL Geoportal, Nilai SJIG, Foto Drone. | Bappelitbangda/PUPR |
| **IK-07** | Statistik | SK Statistik Sektoral, Nilai EPSS. | BPS/Kominfo |
| **IK-08** | Kebijakan PDP | Perbup Pelindungan Data Pribadi (PDP). | Bagian Hukum/Kominfo |
| **IK-09** | Audit TIK | Laporan Audit Aplikasi & Infrastruktur. | Inspektorat/Kominfo |
| **IK-10** | Keamanan | ISO 27001, Nilai IKASANDI. | Diskominfo/BSSN |
| **IK-11** | Kriptografi | Sertifikat SSL/TLS, Enkripsi Database. | Diskominfo |
| **IK-12** | Insiden Siber | SK CSIRT, Laporan Penanganan Insiden. | Diskominfo |
| **IK-13** | Aplikasi (SDLC) | Dokumentasi UAT, Manual Book, SDLC. | Semua OPD |
| **IK-14** | Infrastruktur | Bukti Hosting Pusat Data Nasional (PDN). | Diskominfo |
| **IK-15** | Proses Bisnis | **Peta Probis**, **Arsip Digital SRIKANDI**. | Semua OPD |
| **IK-16** | Integrasi | API Interkoneksi, Dasbor Presiden. | Diskominfo |
| **IK-17** | Portal Layanan | URL minselkab.go.id, Katalog Layanan. | Semua OPD |
| **IK-18** | Interoperabilitas | Sharing Data Real-time SDI. | Diskominfo |
| **IK-19** | Layanan (SLA) | SOP SLA, Dashboard Response Time. | Semua OPD |
| **IK-20** | Kepuasan | **Survei SKM**, **Analisis Sentimen AI**. | Semua OPD |

---

## 4. FORMULA PERHITUNGAN
Indeks Pemdi dihitung dengan menjumlahkan hasil perkalian Bobot Aspek dengan Nilai Aspek. 
Aspek 7 (Kepuasan Pengguna) memiliki bobot **25%**, tertinggi di antara aspek lainnya, menunjukkan orientasi pada masyarakat.

## 5. GLOSARIUM & DEFINISI
- **Peta Probis**: Visualisasi alur kerja organisasi untuk menghindari tumpang tindih fungsi.
- **SRIkandi**: Aplikasi nasional terpadu untuk persuratan dan kearsipan elektronik.
- **PDN (Pusat Data Nasional)**: Infrastruktur cloud aman milik pemerintah untuk hosting aplikasi daerah.

---
*Referensi: Konsolidasi Material Dokumen Folder PEMDI (Perbup, Bimtek, Rincian Indikator).*