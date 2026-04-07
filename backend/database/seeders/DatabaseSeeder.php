<?php
 
 namespace Database\Seeders;
 
 use App\Models\User;
 use App\Models\Aspek;
 use App\Models\Indikator;
 use App\Models\Opd;
 use App\Models\Periode;
 use Illuminate\Database\Seeder;
 use Illuminate\Support\Facades\Hash;
 
 class DatabaseSeeder extends Seeder
 {
     public function run(): void
     {
         // 1. Create Users for each Role
         $roles = [
             ['name' => 'Administrator', 'email' => 'admin@gmail.com', 'role' => 1],
             ['name' => 'Dinas Kominfo', 'email' => 'kominfo@gmail.com', 'role' => 2],
             ['name' => 'Asesor Internal', 'email' => 'internal@gmail.com', 'role' => 3],
             ['name' => 'Asesor Eksternal', 'email' => 'eksternal@gmail.com', 'role' => 4],
             ['name' => 'Operator SPBE', 'email' => 'operator@gmail.com', 'role' => 5],
             ['name' => 'Bupati Minsel', 'email' => 'pimpinan@gmail.com', 'role' => 6],
         ];
 
         foreach ($roles as $r) {
             User::create([
                 'name' => $r['name'],
                 'email' => $r['email'],
                 'password' => Hash::make('admin123'),
                 'role' => $r['role'],
                 'is_first_login' => false,
             ]);
         }
 
         // 2. Create Aspeks (7 Aspek)
         $aspeks = [
             ['nama' => 'Kebijakan Internal', 'bobot' => 10, 'urutan' => 1],
             ['nama' => 'Tata Kelola', 'bobot' => 10, 'urutan' => 2],
             ['nama' => 'Manajemen', 'bobot' => 15, 'urutan' => 3],
             ['nama' => 'Layanan Publik', 'bobot' => 15, 'urutan' => 4],
             ['nama' => 'Teknologi Informasi', 'bobot' => 10, 'urutan' => 5],
             ['nama' => 'Keterpaduan', 'bobot' => 15, 'urutan' => 6],
             ['nama' => 'Kepuasan Pengguna', 'bobot' => 25, 'urutan' => 7],
         ];
 
         $aspekIds = [];
         foreach ($aspeks as $a) {
             $aspek = Aspek::create($a);
             $aspekIds[] = $aspek->id;
         }
 
         // 3. Create 20 Indikators (distributed to aspeks)
         for ($i = 1; $i <= 20; $i++) {
             Indikator::create([
                 'aspek_id' => $aspekIds[($i-1) % 7], // Distributed
                 'kode' => 'IK-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                 'nama' => 'Indikator Kinerja SPBE ' . $i,
                 'penjelasan' => 'Penjelasan detail untuk indikator kinerja ' . $i,
                 'bobot' => 5, // Simplified: each 5% for sample
                 'urutan' => $i,
                 'kriteria_1' => 'Belum ada kebijakan/penerapan',
                 'kriteria_2' => 'Sudah ada tapi belum formal',
                 'kriteria_3' => 'Sudah formal dan diterapkan sebagian',
                 'kriteria_4' => 'Diterapkan menyeluruh dan dievaluasi',
                 'kriteria_5' => 'Dilakukan audit dan perbaikan berkelanjutan',
             ]);
         }
 
         // 4. Create Periode
         Periode::create([
             'tahun' => 2026,
             'nama' => 'Evaluasi SPBE 2026',
             'start_date' => '2026-01-01',
             'end_date' => '2026-12-31',
             'status' => 'active'
         ]);
 
         // 5. Create OPDs
         $opds = ['Dinas Kominfo', 'Dinas Kesehatan', 'Dinas Pendidikan', 'Bappelitbangda', 'BKPSDM'];
         foreach ($opds as $o) {
             Opd::create([
                 'nama' => $o,
                 'singkatan' => strtoupper(substr($o, 0, 4)),
                 'status_penilaian' => 'not_started'
             ]);
         }
     }
 }
