<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BuktiController extends Controller
{
    public function store(Request $request, SupabaseService $supabase)
    {
        $request->validate([
            'file' => 'required|file|max:5120', // Max 5MB
            'indikator_id' => 'required',
            'opd_id' => 'required',
        ]);

        try {
            $file = $request->file('file');
            $fileName = time() . '_' . Str::slug($file->getClientOriginalName()) . '.' . $file->getClientOriginalExtension();
            
            // 1. Upload ke Supabase Storage (Port 443 Bypass)
            $path = "bukti/{$fileName}";
            $upload = $supabase->uploadFile('bukti', $path, $file);

            if (isset($upload['error'])) {
                return response()->json(['error' => 'Gagal upload ke Storage: ' . $upload['message']], 400);                
            }

            // 2. Simpan Metadata ke Tabel Buktis di Supabase Cloud
            $publicUrl = env('SUPABASE_URL') . "/storage/v1/object/public/bukti/{$path}";

            $res = $supabase->from('buktis')->insert([
                'penilaian_id' => $request->penilaian_id ?: 1, // Pastikan ada penilaian_id
                'nama_file' => $file->getClientOriginalName(),
                'path' => $publicUrl,
                'deskripsi' => 'Bukti Dukung SPBE 2026',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bukti Dokumen berhasil meluncur ke Cloud!',
                'url' => $publicUrl,
                'data' => $res
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Error: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id, SupabaseService $supabase)
    {
        try {
            // Kita hapus metasatanya saja di Database Cloud (Bypass 443)
            $supabase->from('buktis')->where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Bukti telah dihapus dari Cloud!'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
