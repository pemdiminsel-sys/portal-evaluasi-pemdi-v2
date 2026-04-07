<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SupabaseService;

class SupabaseSeedCommand extends Command
{
    protected $signature = 'supabase:seed';
    protected $description = 'Seed SPBE Aspek and Indikator to Supabase via HTTP Proxy';

    public function handle(SupabaseService $supabase)
    {
        $this->info('🚀 Memulai Seeding Aspek & Indikator ke Supabase Cloud (Port 443 Bypass)...');

        $aspeks = [
            ['id' => 1, 'nama' => 'TATA KELOLA DAN MANAJEMEN', 'bobot' => 10, 'urutan' => 1],
            ['id' => 2, 'nama' => 'PENYELENGGARA', 'bobot' => 10, 'urutan' => 2],
            ['id' => 3, 'nama' => 'DATA', 'bobot' => 15, 'urutan' => 3],
            ['id' => 4, 'nama' => 'KEAMANAN PEMERINTAH DIGITAL', 'bobot' => 15, 'urutan' => 4],
            ['id' => 5, 'nama' => 'TEKNOLOGI PEMERINTAH DIGITAL', 'bobot' => 10, 'urutan' => 5],
            ['id' => 6, 'nama' => 'KETERPADUAN LAYANAN DIGITAL', 'bobot' => 15, 'urutan' => 6],
            ['id' => 7, 'nama' => 'KEPUASAN PENGGUNA', 'bobot' => 25, 'urutan' => 7],
        ];

        $indikators = [
            ['id' => 1, 'kode' => 'IK-01', 'nama' => 'Tingkat Kematangan Tata Kelola Pemerintah Digital', 'bobot' => 5, 'aspek_id' => 1, 'urutan' => 1],
            ['id' => 2, 'kode' => 'IK-02', 'nama' => 'Tingkat Kematangan Manajemen Layanan Digital Pemerintah', 'bobot' => 5, 'aspek_id' => 1, 'urutan' => 2],
            
            ['id' => 3, 'kode' => 'IK-03', 'nama' => 'Tingkat Kematangan Sumber Daya Manusia Pemerintah Digital', 'bobot' => 5, 'aspek_id' => 2, 'urutan' => 3],
            ['id' => 4, 'kode' => 'IK-04', 'nama' => 'Tingkat Kematangan Kolaborasi Pemerintah Digital', 'bobot' => 5, 'aspek_id' => 2, 'urutan' => 4],
            
            ['id' => 5, 'kode' => 'IK-05', 'nama' => 'Tingkat Kematangan Tata Kelola Data', 'bobot' => 5, 'aspek_id' => 3, 'urutan' => 5],
            ['id' => 6, 'kode' => 'IK-06', 'nama' => 'Tingkat Kematangan Penyelenggaraan Informasi Geospasial', 'bobot' => 3, 'aspek_id' => 3, 'urutan' => 6],
            ['id' => 7, 'kode' => 'IK-07', 'nama' => 'Tingkat Kematangan Pembangunan Statistik', 'bobot' => 3, 'aspek_id' => 3, 'urutan' => 7],
            
            ['id' => 8, 'kode' => 'IK-08', 'nama' => 'Tingkat Kematangan Pelindungan Data Pribadi', 'bobot' => 4, 'aspek_id' => 4, 'urutan' => 8],
            ['id' => 9, 'kode' => 'IK-09', 'nama' => 'Tingkat Kematangan Pelaksanaan Audit Keamanan dan Teknologi', 'bobot' => 4, 'aspek_id' => 4, 'urutan' => 9],
            ['id' => 10, 'kode' => 'IK-10', 'nama' => 'Tingkat Kematangan Keamanan Pemerintah Digital', 'bobot' => 4, 'aspek_id' => 4, 'urutan' => 10],
            
            ['id' => 11, 'kode' => 'IK-11', 'nama' => 'Tingkat Kematangan Penerapan Kriptografi untuk Keamanan Data', 'bobot' => 3, 'aspek_id' => 5, 'urutan' => 11],
            ['id' => 12, 'kode' => 'IK-12', 'nama' => 'Tingkat Kematangan Kapabilitas Penanganan Insiden', 'bobot' => 4, 'aspek_id' => 5, 'urutan' => 12],
            ['id' => 13, 'kode' => 'IK-13', 'nama' => 'Tingkat Kematangan Aplikasi Pemerintah Digital', 'bobot' => 4, 'aspek_id' => 5, 'urutan' => 13],
            ['id' => 14, 'kode' => 'IK-14', 'nama' => 'Tingkat Kematangan Infrastruktur Pemerintah Digital', 'bobot' => 5, 'aspek_id' => 5, 'urutan' => 14],
            
            ['id' => 15, 'kode' => 'IK-15', 'nama' => 'Keterpaduan Proses Bisnis Pemerintah Digital Lintas Unit', 'bobot' => 4, 'aspek_id' => 6, 'urutan' => 15],
            ['id' => 16, 'kode' => 'IK-16', 'nama' => 'Integrasi Aplikasi', 'bobot' => 4, 'aspek_id' => 6, 'urutan' => 16],
            ['id' => 17, 'kode' => 'IK-17', 'nama' => 'Portal Layanan Digital Pemerintah', 'bobot' => 4, 'aspek_id' => 6, 'urutan' => 17],
            ['id' => 18, 'kode' => 'IK-18', 'nama' => 'Interoperabilitas Data', 'bobot' => 3, 'aspek_id' => 6, 'urutan' => 18],
            
            ['id' => 19, 'kode' => 'IK-19', 'nama' => 'Fasilitas Dukungan Pengguna Layanan Digital Pemerintah', 'bobot' => 10, 'aspek_id' => 7, 'urutan' => 19],
            ['id' => 20, 'kode' => 'IK-20', 'nama' => 'Tingkat Kepuasan Pengguna Layanan Digital Pemerintah', 'bobot' => 15, 'aspek_id' => 7, 'urutan' => 20],
        ];

        // 1. Insert Aspeks (Upsert / Ignore duplicates using upsert)
        $this->info('Menyuntikkan 7 Aspek ke Supabase...');
        $resAspeks = $supabase->from('aspeks')->upsert($aspeks);
        
        // 2. Insert Indikators
        $this->info('Menyuntikkan 20 Indikator Kinerja ke Supabase...');
        $resIndikators = $supabase->from('indikators')->upsert($indikators);

        $this->info('✅ Seluruh Tabel Ringkasan berhasil dipublikasikan di Database Cloud!');
    }
}
