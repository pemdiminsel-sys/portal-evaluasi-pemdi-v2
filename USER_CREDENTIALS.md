# 🔐 Daftar Akun Simulasi - Portal Evaluasi Pemdi V2

Berikut adalah daftar akun yang siap digunakan untuk pengujian sistem berdasarkan role akses yang telah dirancang.

| Role | Nama Akun | Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Administrator** | `admin@gmail.com` | `admin123` | Full Access, Manajemen User, Setting Indikator |
| **2** | **OPD (Dinas Kominfo)** | `kominfo@gmail.com` | `admin123` | Penilaian Mandiri & Upload Bukti Dokumen |
| **3** | **Asesor** | `internal@gmail.com` | `admin123` | Verifikasi, Interviu, Visitasi & Penilaian Akhir |
| **5** | **Operator SPBE** | `operator@gmail.com` | `admin123` | Monitoring Progres, Rekapitulasi & Laporan |
| **6** | **Pimpinan (Bupati)** | `pimpinan@gmail.com` | `admin123` | Dashboard Eksekutif, Grafik Radar & Tren |

---

### ⚠️ Catatan Keamanan:
- Seluruh password di atas bersifat **default** untuk kepentingan pengembangan (simulasi).
- Pada sistem produksi, setiap user disarankan mengubah password melalui menu **Settings** pada aplikasi.
- Data role ini tersinkronisasi otomatis baik di **SQLite Lokal** maupun di **Supabase Cloud**.

> Dokumen ini dibuat otomatis sesuai dengan arsitektur sistem pada `SISTEM_BEKERJA.MD`.
