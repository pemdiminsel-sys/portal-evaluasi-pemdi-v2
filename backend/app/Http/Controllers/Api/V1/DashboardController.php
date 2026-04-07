<?php
 
 namespace App\Http\Controllers\Api\V1;
 
 use App\Http\Controllers\Controller;
 use App\Models\Opd;
 use App\Models\Penilaian;
 use App\Models\Periode;
 use Illuminate\Support\Facades\DB;
 
 class DashboardController extends Controller
 {
     public function index()
     {
         $periode = Periode::where('is_active', true)->first();
         if (!$periode) return response()->json(['error' => 'No active period'], 400);
 
         $stats = [
             'total_opd' => Opd::count(),
             'completed_opd' => Opd::where('status_penilaian', 'completed')->count(),
             'avg_score' => Penilaian::where('periode_id', $periode->id)->avg('nilai') ?: 0,
             'total_evidence' => DB::table('buktis')->count(),
         ];
 
         $recent_evaluations = DB::table('penilaians')
             ->join('opds', 'penilaians.opd_id', '=', 'opds.id')
             ->select('opds.nama as opd_nama', 'penilaians.nilai', 'penilaians.updated_at')
             ->orderBy('penilaians.updated_at', 'desc')
             ->limit(5)
             ->get();
 
         return response()->json([
             'success' => true,
             'data' => [
                 'stats' => $stats,
                 'recent' => $recent_evaluations
             ]
         ]);
     }
 }
