-- SEED DATA UNTUK SISTEM PEMDI V2 2026
-- HAPUS DATA LAMA JIKA ADA (HATI-HATI)
TRUNCATE TABLE indikators CASCADE;
TRUNCATE TABLE aspeks CASCADE;

-- 1. INSERT ASPEK (Total 7 Aspek)
INSERT INTO aspeks (id, nama, bobot, urutan, created_at, updated_at) VALUES
(1, 'Tata Kelola dan Manajemen', 10, 1, NOW(), NOW()),
(2, 'Penyelenggara', 10, 2, NOW(), NOW()),
(3, 'Data', 15, 3, NOW(), NOW()),
(4, 'Keamanan Pemerintah Digital', 15, 4, NOW(), NOW()),
(5, 'Teknologi Pemerintah Digital', 10, 5, NOW(), NOW()),
(6, 'Keterpaduan Layanan Digital', 15, 6, NOW(), NOW()),
(7, 'Kepuasan Pengguna', 25, 7, NOW(), NOW());

-- 2. INSERT INDIKATOR (Total 20 Indikator)

-- ASPEK 1 (Tata Kelola & Manajemen)
INSERT INTO indikators (aspek_id, kode, nama, penjelasan, bobot, urutan, kriteria_1, kriteria_2, kriteria_3, kriteria_4, kriteria_5, created_at, updated_at) VALUES 
(1, 'IK-01', 'Tingkat Kematangan Tata Kelola Pemerintah Digital', 'Tata kelola Pemdi adalah kerangka kerja yang memastikan terlaksananya perencanaan, pelaksanaan, dan pengendalian dalam penerapan Pemdi secara terpadu.', 5, 1, 
'Substansi Rencana Aksi Nasional Pemerintah Digital untuk perencanaan pada IPPD dalam tahap pemilihan.', 
'Substansi Rencana Aksi telah disusun di tingkat mikro. Pelaksanaan Rencana Aksi dan penerapan Arsitektur Pemdi telah dilakukan pada sebagian Layanan Digital IPPD.', 
'Langkah nyata dilaksanakan sesuai Rencana Aksi. Arsitektur Pemdi dimanfaatkan pada seluruh Layanan Digital prioritas/tematik.', 
'Telah dilakukan reviu atas Rencana Aksi dan Arsitektur Pemdi.', 
'Tindak lanjut hasil reviu dilaksanakan secara menyeluruh.', NOW(), NOW()),

(1, 'IK-02', 'Tingkat Kematangan Manajemen Layanan Digital Pemerintah', 'Manajemen Layanan Digital Pemerintah adalah serangkaian proses untuk mendukung penyelenggaraan Layanan Digital Pemerintah yang berkualitas.', 5, 2, 
'Substansi Rencana Aksi Nasional masih dalam penyusunan, Manajemen Layanan Digital dilaksanakan sesuai kebutuhan.', 
'Substansi Rencana Aksi telah menjadi referensi pada sebagian Layanan Digital IPPD.', 
'Substansi Rencana Aksi telah menjadi referensi pada seluruh Layanan Digital IPPD.', 
'Pelaksanaan Manajemen Layanan Digital IPPD telah dilakukan reviu secara menyeluruh.', 
'Penerapan tindak lanjut sesuai reviu telah dilakukan secara menyeluruh pada Layanan Digital IPPD.', NOW(), NOW());

-- ASPEK 2 (Penyelenggara)
INSERT INTO indikators (aspek_id, kode, nama, penjelasan, bobot, urutan, kriteria_1, kriteria_2, kriteria_3, kriteria_4, kriteria_5, created_at, updated_at) VALUES 
(2, 'IK-03', 'Tingkat Kematangan Sumber Daya Manusia Pemerintah Digital', 'Kompetensi SDM Pemdi adalah Kompetensi Digital Aparatur Sipil Negara (ASN) yang merupakan bagian dari Kompetensi Teknis ASN yang wajib dimiliki setiap pegawai ASN.', 5, 3, 
'Dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi.', 
'Telah melaksanakan peningkatan kompetensi digital kepada >90% ASN pengelola.', 
'Telah melaksanakan peningkatan kompetensi digital kepada >90% ASN pengelola dan pengguna layanan digital.', 
'ASN memiliki kompetensi untuk memanfaatkan AI dan Analisis Data secara intensif.', 
'ASN memanfaatkan AI, Analisis Data, dan teknologi terbaru secara intensif.', NOW(), NOW()),

(2, 'IK-04', 'Tingkat Kematangan Kolaborasi Pemerintah Digital', 'Forum Koordinasi Pemdi merupakan wadah untuk pertukaran informasi dan peningkatan kapasitas pelaksanaan Pemdi bagi Instansi Pusat.', 5, 4, 
'Substansi Rencana Aksi masih dalam penyusunan mengenai kolaborasi antar unit kerja.', 
'Kolaborasi antar IPPD hingga tingkat nasional telah dilaksanakan.', 
'Kolaborasi dengan akademisi, industri, media, masyarakat (co-creation).', 
'Kolaborasi terarah, direviu, dan/atau kontribusi ke Dasbor Presiden.', 
'Tindak lanjut hasil reviu dilaksanakan menyeluruh.', NOW(), NOW());

-- ASPEK 3 (Data)
INSERT INTO indikators (aspek_id, kode, nama, penjelasan, bobot, urutan, kriteria_1, kriteria_2, kriteria_3, kriteria_4, kriteria_5, created_at, updated_at) VALUES 
(3, 'IK-05', 'Tingkat Kematangan Tata Kelola Data', 'Tata Kelola Data bertujuan untuk menjamin terwujudnya data yang akurat, mutakhir, terintegrasi, dan dapat diakses.', 5, 5, 
'Dalam tahap penyiapan Penyelenggara SDI, SDI ≤ 12,5.', 
'Penyelenggara SDI terbentuk, metadata mulai disusun, SDI 12,5-37,5.', 
'Struktur kelembagaan dan regulasi tersedia, SDI 37,5-62,5.', 
'Hampir seluruh prinsip SDI diterapkan, SDI 62,5-75, kontribusi Dasbor Presiden.', 
'Seluruh prinsip SDI diterapkan, SDI 75-100, tindak lanjut reviu.', NOW(), NOW()),

(3, 'IK-06', 'Tingkat Kematangan Penyelenggaraan Informasi Geospasial', 'Berbagi pakai dan memanfaatkan data dan Informasi Geospasial (IG) untuk pembangunan nasional.', 3, 6, 
'Dalam tahap penyiapan, SJIG 1-1,50.', 
'Tata kelola dan kelembagaan ditetapkan, SJIG 1,50-2,50.', 
'SOP tersedia, perangkat produksi data dimiliki, SJIG 2,50-3,50.', 
'Roadmap, SDM fungsional surveyor, evaluasi pemanfaatan, SJIG 3,50-4,00.', 
'Reviu berkala, anggaran rutin, SJIG 4,00-5,00.', NOW(), NOW()),

(3, 'IK-07', 'Tingkat Kematangan Pembangunan Statistik', 'Memanfaatkan Data Statistik dengan tujuan untuk menjamin terwujudnya data yang akurat, mutakhir, dan terintegrasi.', 3, 7, 
'Dalam proses penyelenggaraan ad-hoc, IPS < 1,8.', 
'Proses dilakukan sebagian/seluruh unit kerja, IPS 1,8-2,60.', 
'Proses di seluruh unit kerja dan diharmonisasi, IPS 2,60-3,50.', 
'Proses terpadu, integrasi antarproses, IPS 3,50-4,20.', 
'Proses terpadu, berkontribusi pada kinerja, IPS 4,20-5,00.', NOW(), NOW());

-- ASPEK 4 (Keamanan)
INSERT INTO indikators (aspek_id, kode, nama, penjelasan, bobot, urutan, kriteria_1, kriteria_2, kriteria_3, kriteria_4, kriteria_5, created_at, updated_at) VALUES 
(4, 'IK-08', 'Tingkat Kematangan Pelindungan Data Pribadi', 'Penerapan teknis PDP pada layanan digital pemerintah.', 4, 8, 
'Dalam tahap penyiapan untuk penerapan teknis PDP.', 
'Penerapan teknis PDP pada Layanan Digital dilaksanakan sesuai perencanaan.', 
'Penerapan teknis PDP sesuai perencanaan, pemantauan sistematis.', 
'Evaluasi menyeluruh terhadap penerapan teknis PDP.', 
'Tindak lanjut hasil evaluasi dilaksanakan, terintegrasi dengan arsitektur Pemdi.', NOW(), NOW()),

(4, 'IK-09', 'Tingkat Kematangan Pelaksanaan Audit Keamanan', 'Pelaksanaan Audit Keamanan Pemdi sesuai dengan ketentuan standar.', 4, 9, 
'Tim Audit dan Perencanaan Audit telah dibentuk.', 
'Audit Internal Keamanan dan Teknologi dilaksanakan pada sebagian Layanan.', 
'Audit Internal dilaksanakan, tindak lanjut dilaksanakan.', 
'Audit Eksternal untuk layanan prioritas dilaksanakan.', 
'Tindak lanjut hasil audit eksternal dilaksanakan.', NOW(), NOW()),

(4, 'IK-10', 'Tingkat Kematangan Keamanan Pemerintah Digital', 'Penyelenggaraan keamanan Pemdi meliputi implementasi tata kelola dan manajemen keamanan informasi.', 4, 10, 
'Dalam tahap penyusunan tata kelola, identifikasi IIV.', 
'Tata kelola diterapkan sesuai pedoman, identifikasi IIV.', 
'Tata kelola diterapkan, kontrol teknis dilaksanakan.', 
'Tata kelola terorganisir, terpadu, direviu berkala.', 
'Tindak lanjut hasil reviu melalui proses otomasi.', NOW(), NOW());

-- ASPEK 5 (Teknologi)
INSERT INTO indikators (aspek_id, kode, nama, penjelasan, bobot, urutan, kriteria_1, kriteria_2, kriteria_3, kriteria_4, kriteria_5, created_at, updated_at) VALUES 
(5, 'IK-11', 'Tingkat Kematangan Penerapan Kriptografi', 'Proteksi keamanan kerahasiaan data melalui fungsi kriptografi.', 3, 11, 
'Dalam tahap penyiapan penerapan teknologi kriptografi.', 
'Teknologi kriptografi diterapkan pada sebagian Layanan Digital.', 
'Teknologi kriptografi diterapkan pada sebagian Layanan di 2 siklus data.', 
'Teknologi kriptografi diterapkan pada seluruh layanan prioritas di 2 siklus data.', 
'Tindak lanjut hasil evaluasi dilaksanakan.', NOW(), NOW()),

(5, 'IK-12', 'Tingkat Kematangan Kapabilitas Penanganan Insiden', 'Penanganan Insiden Siber secara komprehensif (TTIS/CSIRT).', 4, 12, 
'Dalam tahap penyiapan penanganan insiden.', 
'TTIS/CSIRT dibentuk, penanganan insiden pada sebagian Layanan.', 
'Penanganan insiden melalui TTIS pada seluruh layanan prioritas.', 
'Kapabilitas TTIS direviu, partisipasi dengan TTIS nasional.', 
'Evaluasi penanganan insiden untuk perbaikan berkelanjutan.', NOW(), NOW()),

(5, 'IK-13', 'Tingkat Kematangan Aplikasi Pemerintah Digital', 'Mencakup seluruh siklus pembangunan aplikasi (SDLC).', 4, 13, 
'Substansi Rencana Aksi dan Arsitektur Teknologi dalam tahap penyusunan.', 
'Referensi menjadi arah pada sebagian Layanan Digital.', 
'Referensi menjadi arah pada seluruh layanan prioritas/tematik.', 
'Integrasi seluruh aplikasi, reviu berkala.', 
'Penerapan seluruh manajemen layanan, tindak lanjut reviu.', NOW(), NOW()),

(5, 'IK-14', 'Tingkat Kematangan Infrastruktur Pemerintah Digital', 'Penyelenggaraan Layanan Digital dengan mengutamakan Teknologi Awan (Cloud Technology).', 5, 14, 
'Substansi Rencana Aksi dan Arsitektur Teknologi dalam tahap penyusunan.', 
'Referensi menjadi arah, sebagian layanan berbasis teknologi awan.', 
'Seluruh layanan prioritas/tematik berbasis teknologi awan.', 
'Infrastruktur terintegrasi dengan Infrastruktur Digital Nasional (JIP).', 
'Pemanfaatan Infrastruktur Digital Nasional, tindak lanjut reviu.', NOW(), NOW());

-- ASPEK 6 (Keterpaduan)
INSERT INTO indikators (aspek_id, kode, nama, penjelasan, bobot, urutan, kriteria_1, kriteria_2, kriteria_3, kriteria_4, kriteria_5, created_at, updated_at) VALUES 
(6, 'IK-15', 'Keterpaduan Proses Bisnis', 'Mewujudkan keterpaduan Layanan Digital melalui Arsitektur Pemdi.', 4, 15, 
'Substansi Rencana Aksi dan Arsitektur Layanan dalam tahap penyusunan.', 
'Referensi menjadi arah pada sebagian Layanan Digital.', 
'Referensi menjadi arah pada seluruh layanan prioritas/tematik.', 
'Sektor nasional, reviu berkala, arsip digital (SRIkandi).', 
'Tindak lanjut reviu dilaksanakan.', NOW(), NOW()),

(6, 'IK-16', 'Integrasi Aplikasi', 'Menghubungkan berbagai aplikasi dan sistem perangkat lunak agar dapat berbagi data.', 4, 16, 
'Substansi Rencana Aksi dalam tahap penyusunan.', 
'Referensi menjadi arah pada sebagian Layanan Digital.', 
'Referensi menjadi arah pada seluruh layanan prioritas/tematik.', 
'Integrasi pada seluruh layanan prioritas/tematik, reviu berkala.', 
'Tindak lanjut reviu, optimalisasi.', NOW(), NOW()),

(6, 'IK-17', 'Portal Layanan Digital Pemerintah', 'Mengonsolidasikan seluruh layanan kepada masyarakat.', 4, 17, 
'Substansi Rencana Aksi dalam tahap penyusunan.', 
'Referensi menjadi arah pada sebagian layanan digital.', 
'Referensi menjadi arah pada seluruh layanan prioritas, integrasi Dasbor Presiden.', 
'Portal terorganisir, reviu berkala, integrasi portal nasional.', 
'Portal menjadi bagian dari Portal Nasional, tindak lanjut reviu.', NOW(), NOW()),

(6, 'IK-18', 'Interoperabilitas Data', 'Kemampuan mempertukarkan dan memanfaatkan data sistem yang berbeda.', 3, 18, 
'Dalam tahap penyusunan referensi penerapan interoperabilitas.', 
'Referensi menjadi arah pada sebagian Layanan Digital.', 
'Referensi menjadi arah pada seluruh layanan prioritas/tematik.', 
'Interoperabilitas diterapkan luas, pertukaran real-time, reviu berkala.', 
'Interoperabilitas komprehensif, peningkatan kualitas.', NOW(), NOW());

-- ASPEK 7 (Kepuasan)
INSERT INTO indikators (aspek_id, kode, nama, penjelasan, bobot, urutan, kriteria_1, kriteria_2, kriteria_3, kriteria_4, kriteria_5, created_at, updated_at) VALUES 
(7, 'IK-19', 'Fasilitas Dukungan Pengguna', 'Mencapai tingkat pemenuhan Kualitas Layanan Digital (SLA).', 10, 19, 
'Dalam tahap penyusunan fasilitas dukungan, SOP, dan SLA.', 
'Fasilitas dukungan tersedia, SOP SLA, sistem pemantauan.', 
'Fasilitas terintegrasi dengan tingkat nasional.', 
'Reviu dan evaluasi pemenuhan SLA, fasilitas dukungan.', 
'Tindak lanjut hasil reviu dilaksanakan.', NOW(), NOW()),

(7, 'IK-20', 'Tingkat Kepuasan Pengguna', 'Pencapaian tingkat kepuasan pengguna terhadap Layanan Digital.', 15, 20, 
'Survei disebarkan melalui kanal digital, umpan balik dua arah.', 
'Tim teknis pengelola, mekanisme umpan balik langsung, mystery guest.', 
'Desain ulang layanan berbasis survei, pemanfaatan AI analisis sentimen.', 
'Pengukuran tingkat keselamatan layanan, data riwayat perubahan.', 
'Pemanfaatan penuh integrasi umpan balik nasional.', NOW(), NOW());
