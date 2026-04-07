<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;

class PenilaianController extends Controller
{
    public function index(Request $request, SupabaseService $supabase)
    {
        $opdId = $request->opd_id;
        $periodeId = $request->periode_id ?: 1; // Default ke periode 1 jika tidak ada

        try {
            if ($opdId) {
                // Fetch penilaian specific OPD dari Supabase Cloud
                $penilaian = $supabase->from('penilaians')
                    ->select('*, buktis(*)')
                    ->where('opd_id', $opdId)
                    ->where('periode_id', $periodeId)
                    ->get();
                
                // Hitung Nilai Akhir (Weighted) secara dinamis
                $totalNilai = 0;
                if (is_array($penilaian)) {
                    foreach ($penilaian as $p) {
                         // Catatan: Karena kita lewat API REST, relasi bobot indikator harus ditarik terpisah atau via join string
                         $totalNilai += ($p['nilai'] * 0.05); // Sample weighted
                    }
                }

                return response()->json([
                    'success' => true,
                    'data' => [
                        'penilaian' => $penilaian,
                        'nilai_akhir' => round($totalNilai, 2),
                    ]
                ]);
            }

            // Rekapitulasi Global untuk Operator
            $rekap = $supabase->from('opds')->select('*, penilaians(*)')->get();

            return response()->json([
                'success' => true,
                'data' => $rekap
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request, SupabaseService $supabase)
    {
        $validated = $request->validate([
            'indikator_id' => 'required',
            'opd_id' => 'required',
            'jenis' => 'required|integer',
            'nilai' => 'required|numeric',
            'penjelasan' => 'nullable|string',
        ]);

        try {
            // Melatih Supabase melakukan "Upsert" (Update jika ada, Insert jika belum)
            $res = $supabase->from('penilaians')->upsert([
                'opd_id' => $validated['opd_id'],
                'indikator_id' => $validated['indikator_id'],
                'periode_id' => 1, // Default periode 2026
                'jenis' => $validated['jenis'],
                'nilai' => $validated['nilai'],
                'penjelasan' => $validated['penjelasan'],
                'status' => 1,
                'updated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Penilaian berhasil disimpan ke Cloud Supabase!',
                'data' => $res
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
