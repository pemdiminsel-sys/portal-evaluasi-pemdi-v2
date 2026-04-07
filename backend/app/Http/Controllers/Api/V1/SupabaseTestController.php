<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;

class SupabaseTestController extends Controller
{
    public function test(SupabaseService $supabase)
    {
        try {
            // Kita coba tarik data OPD (Port 443 Bypass)
            $opds = $supabase->from('opds')->select('*')->get();

            if (isset($opds['error'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Supabase Error: ' . ($opds['message'] ?? 'Unknown Error'),
                    'details' => $opds
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'BERHASIL! Laravel berhasil menembus blokir jaringan via Port 443.',
                'total_opd' => count($opds),
                'sample_data' => $opds
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Internal Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
