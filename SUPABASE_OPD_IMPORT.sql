-- DAFTAR 45 OPD MINAHASA SELATAN
-- TAMBAH KOLOM PENDUKUNG
ALTER TABLE opds ADD COLUMN IF NOT EXISTS tugas TEXT NULL;
ALTER TABLE opds ADD COLUMN IF NOT EXISTS kelompok TEXT NULL;

-- KOSONGKAN DATA LAMA
TRUNCATE TABLE opds CASCADE;

-- INSERT 45 OPD
INSERT INTO opds (nama, singkatan, tugas, kelompok, created_at, updated_at) VALUES
('Dinas Komunikasi dan Informatika', 'DISKOMINFO', 'Koordinator Transformasi Digital', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah', 'BAPPELITBANGDA', 'Perencanaan dan Evaluasi', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Badan Kepegawaian dan Pengembangan Sumber Daya Manusia', 'BKPSDM', 'Pengembangan SDM Digital', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Inspektorat Daerah', 'INSPEKTORAT', 'Pengawasan dan Audit', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Sekretariat Daerah - Bagian Organisasi', 'BAGIAN ORGANISASI', 'Tata Kelola dan Kelembagaan', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Sekretariat Daerah - Bagian Umum', 'BAGIAN UMUM', 'Pengelolaan Aset dan Infrastruktur', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Sekretariat Daerah - Bagian Hukum', 'BAGIAN HUKUM', 'Regulasi dan Pelindungan Data', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Sekretariat Daerah - Bagian Kerja Sama', 'BAGIAN KERJA SAMA', 'Kolaborasi dan Kemitraan', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Sekretariat Daerah - Bagian Humas', 'BAGIAN HUMAS', 'Komunikasi Publik', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Sekretariat Daerah - Bagian Tata Pemerintahan', 'BAGIAN TATA PEMERINTAHAN', 'Proses Bisnis Pemerintahan', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Sekretariat Daerah - Bagian Perencanaan dan Keuangan', 'BAGIAN PERENCANAAN KEUANGAN', 'Perencanaan Anggaran TIK', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Sekretariat Daerah - Bagian Pengadaan Barang/Jasa', 'BAGIAN PENGADAAN', 'E-Procurement', 'A. PENDUKUNG SISTEM', NOW(), NOW()),
('Badan Pusat Statistik Kabupaten Minahasa Selatan', 'BPS', 'Statistik Sektoral', 'B. PENGELOLA DATA STRATEGIS', NOW(), NOW()),
('Dinas Pekerjaan Umum dan Tata Ruang', 'DISPUPR', 'Informasi Geospasial', 'B. PENGELOLA DATA STRATEGIS', NOW(), NOW()),
('Dinas Perpustakaan dan Kearsipan', 'DISPUSIP', 'Arsip Digital', 'B. PENGELOLA DATA STRATEGIS', NOW(), NOW()),
('Dinas Kependudukan dan Pencatatan Sipil', 'DISDUKCAPIL', 'Data Kependudukan', 'B. PENGELOLA DATA STRATEGIS', NOW(), NOW()),
('Dinas Sosial', 'DINSOS', 'Data Kesejahteraan Sosial', 'B. PENGELOLA DATA STRATEGIS', NOW(), NOW()),
('Dinas Kesehatan', 'DINKES', 'Layanan Kesehatan', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Rumah Sakit Umum Daerah', 'RSUD', 'Layanan Rumah Sakit', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Puskesmas Tumpaan', 'PUSKESMAS TUMPAAN', 'Layanan Kesehatan Primer', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Puskesmas Amurang Timur', 'PUSKESMAS AMURANG TIMUR', 'Layanan Kesehatan Primer', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Pendidikan dan Kebudayaan', 'DISDIKBUD', 'Layanan Pendidikan', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu', 'DPM-PTSP', 'Layanan Perizinan', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Pemberdayaan Masyarakat dan Desa', 'DINAS PMD', 'Layanan Pemberdayaan Desa', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Pertanian', 'DINAS TAN', 'Layanan Pertanian', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Perikanan', 'DINAS KAN', 'Layanan Perikanan', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Perhubungan', 'DISHUB', 'Layanan Perhubungan', 'C. LAYANAN PUBLIK', NOW Gow(), NOW()),
('Dinas Lingkungan Hidup', 'DLH', 'Layanan Lingkungan Hidup', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Koperasi, Usaha Kecil dan Menengah', 'DISKOPUKM', 'Layanan Koperasi dan UKM', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Pariwisata', 'DISPAR', 'Layanan Pariwisata', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Tenaga Kerja dan Transmigrasi', 'DISNAKERTRANS', 'Layanan Ketenagakerjaan', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Pengendalian Penduduk dan Keluarga Berencana', 'DINAS PPKB', 'Layanan KB dan Kependudukan', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Pemberdayaan Perempuan dan Perlindungan Anak', 'DP3A', 'Layanan PPA', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Pemuda dan Olahraga', 'DISPORA', 'Layanan Kepemudaan dan Olahraga', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Satuan Polisi Pamong Praja', 'SATPOL PP', 'Layanan Ketentraman dan Ketertiban', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Pemadam Kebakaran dan Penyelamatan', 'DAMKAR', 'Layanan Penanggulangan Kebakaran', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Perdagangan', 'DISDAG', 'Layanan Perdagangan', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Dinas Ketahanan Pangan', 'DISHAN PANGAN', 'Layanan Ketahanan Pangan', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Badan Keuangan dan Aset Daerah', 'BKAD', 'Pengelolaan Aset TIK', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Badan Pendapatan Daerah', 'BAPENDA', 'Layanan Perpajakan Daerah', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Badan Kesatuan Bangsa, Politik dan Perlindungan Masyarakat', 'KESBANGPOL', 'Layanan Kesbangpol', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Badan Penanggulangan Bencana Daerah', 'BPBD', 'Layanan Penanggulangan Bencana', 'C. LAYANAN PUBLIK', NOW(), NOW()),
('Kecamatan Amurang', 'CAMAT AMURANG', 'Layanan Kewilayahan', 'D. KECAMATAN', NOW(), NOW()),
('Kecamatan Amurang Timur', 'CAMAT AMURANG TIMUR', 'Layanan Kewilayahan', 'D. KECAMATAN', NOW(), NOW()),
('Sekretariat Dewan Perwakilan Rakyat Daerah', 'SEKRETARIAT DPRD', 'Layanan Administrasi DPRD', 'E. SEKRETARIAT', NOW(), NOW());
