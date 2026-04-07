<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;

class IndikatorController extends Controller
{
    public function index(SupabaseService $supabase)
    {
        // Mengambil 20 indikator dari Supabase (Port 443 Bypass)
        try {
            $indikators = $supabase->from('indikators')
                ->select('*')
                ->order('urutan', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $indikators
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
