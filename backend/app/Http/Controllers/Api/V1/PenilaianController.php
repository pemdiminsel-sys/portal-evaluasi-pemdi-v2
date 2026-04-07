<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penilaian;
use App\Models\Indikator;
use App\Models\Periode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class PenilaianController extends Controller
{
    public function index(Request $request)
    {
        $opdId = $request->opd_id;
        $periodeId = $request->periode_id ?: Periode::where('status', 'active')->value('id');

        if ($opdId) {
            $penilaian = Penilaian::where('opd_id', $opdId)->where('periode_id', $periodeId)->get();
            $nilaiAkhir = $this->hitungNilaiAkhir($opdId, $periodeId);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'penilaian' => $penilaian,
                    'nilai_akhir' => $nilaiAkhir,
                ]
            ]);
        }

        // Rekapitulasi (Using Redis Cache if needed)
        $cacheKey = "rekap_periode_{$periodeId}";
        $rekapitulasi = Cache::remember($cacheKey, 3600, function() use ($periodeId) {
            return DB::table('opds')
                ->leftJoin('penilaians', function($join) use ($periodeId) {
                    $join->on('opds.id', '=', 'penilaians.opd_id')
                         ->where('penilaians.periode_id', '=', $periodeId)
                         ->where('penilaians.jenis', '=', 5); // Jenis 5 = Akhir
                })
                ->select('opds.id', 'opds.nama', 'opds.singkatan', DB::raw('AVG(penilaians.nilai) as nilai_akhir'))
                ->groupBy('opds.id', 'opds.nama', 'opds.singkatan')
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $rekapitulasi
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'indikator_id' => 'required|exists:indikators,id',
            'opd_id' => 'required|exists:opds,id',
            'jenis' => 'required|integer',
            'nilai' => 'required|numeric|min:0|max:5',
            'penjelasan' => 'nullable|string',
        ]);

        $periodeId = Periode::where('status', 'active')->value('id');
        if (!$periodeId) return response()->json(['error' => 'No active period'], 400);

        $penilaian = Penilaian::updateOrCreate(
            [
                'indikator_id' => $validated['indikator_id'],
                'opd_id' => $validated['opd_id'],
                'periode_id' => $periodeId,
                'jenis' => $validated['jenis']
            ],
            [
                'nilai' => $validated['nilai'],
                'penjelasan' => $validated['penjelasan'],
                'status' => 1, // Submitted
            ]
        );

        // Invalidate cache
        Cache::forget("rekap_periode_{$periodeId}");

        return response()->json([
            'success' => true,
            'message' => 'Penilaian saved'
        ]);
    }

    private function hitungNilaiAkhir($opdId, $periodeId)
    {
        return Penilaian::where('opd_id', $opdId)
            ->where('periode_id', $periodeId)
            ->where('jenis', 5)
            ->avg('nilai') ?: 0;
    }
}
