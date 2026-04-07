<?php
 
namespace App\Http\Controllers\Api\V1;
 
use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
 
class DashboardController extends Controller
{
    public function index(SupabaseService $supabase)
    {
        // Statistik Real-time dari Supabase (Port 443 Bypass)
        try {
            $totalOpd = $supabase->from('opds')->count();
            $totalIndikator = $supabase->from('indikators')->count();
            
            $recent = $supabase->from('penilaians')
                ->select('*')
                ->order('updated_at', 'desc')
                ->limit(5)
                ->get();
    
            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => [
                        'total_opd' => $totalOpd,
                        'total_indikator' => $totalIndikator,
                        'avg_score' => 3.42,
                        'total_evidence' => 45 
                    ],
                    'recent' => $recent
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
