<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        \App\Models\User::create([
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin123'),
            'role' => 1, // Admin
            'is_first_login' => false,
        ]);

        // 2. Create Aspeks
        $aspeks = [
            ['nama' => 'Tata Kelola dan Manajemen', 'bobot' => 10, 'urutan' => 1],
            ['nama' => 'Penyelenggara', 'bobot' => 10, 'urutan' => 2],
            ['nama' => 'Data', 'bobot' => 15, 'urutan' => 3],
            ['nama' => 'Keamanan', 'bobot' => 15, 'urutan' => 4],
            ['nama' => 'Teknologi', 'bobot' => 10, 'urutan' => 5],
            ['nama' => 'Keterpaduan Layanan', 'bobot' => 15, 'urutan' => 6],
            ['nama' => 'Kepuasan Pengguna', 'bobot' => 25, 'urutan' => 7],
        ];

        foreach ($aspeks as $aspekData) {
            $aspek = \App\Models\Aspek::create($aspekData);

            // 3. Create Sample Indikators for each Aspek
            // This is just a sample, real indicators should be more detailed
            if ($aspek->urutan == 1) {
                \App\Models\Indikator::create([
                    'aspek_id' => $aspek->id,
                    'kode' => 'IK-01',
                    'nama' => 'Kebijakan Internal Arsitektur SPBE',
                    'penjelasan' => 'Tingkat kematangan kebijakan internal Arsitektur SPBE Instansi Pusat/Pemerintah Daerah.',
                    'bobot' => 5,
                    'urutan' => 1,
                ]);
                \App\Models\Indikator::create([
                    'aspek_id' => $aspek->id,
                    'kode' => 'IK-02',
                    'nama' => 'Kebijakan Internal Peta Rencana SPBE',
                    'penjelasan' => 'Tingkat kematangan kebijakan internal Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah.',
                    'bobot' => 5,
                    'urutan' => 2,
                ]);
            }
        }

        // 4. Create Periode
        \App\Models\Periode::create([
            'tahun' => 2026,
            'nama' => 'Evaluasi SPBE 2026',
            'is_active' => true,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
        ]);

        // 5. Create Sample OPD
        \App\Models\Opd::create([
            'nama' => 'Dinas Komunikasi dan Informatika',
            'singkatan' => 'DISHUB',
            'alamat' => 'Jl. Trans Sulawesi',
            'status_penilaian' => 'not_started',
        ]);
    }
}
