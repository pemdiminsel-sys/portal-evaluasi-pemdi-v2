<?php
 
 namespace App\Http\Controllers\Api\V1;
 
 use App\Http\Controllers\Controller;
 use App\Models\Bukti;
 use App\Models\Penilaian;
 use Illuminate\Http\Request;
 use Illuminate\Support\Facades\Storage;
 
 class BuktiController extends Controller
 {
     public function store(Request $request)
     {
         $request->validate([
             'penilaian_id' => 'required|exists:penilaians,id',
             'file' => 'required|file|mimes:pdf,jpg,png|max:5120', // Max 5MB
             'deskripsi' => 'nullable|string'
         ]);
 
         $path = $request->file('file')->store('bukti', 'public');
 
         $bukti = Bukti::create([
             'penilaian_id' => $request->penilaian_id,
             'nama_file' => $request->file('file')->getClientOriginalName(),
             'path' => $path,
             'deskripsi' => $request->deskripsi
         ]);
 
         return response()->json([
             'success' => true,
             'data' => $bukti
         ]);
     }
 
     public function destroy($id)
     {
         $bukti = Bukti::findOrFail($id);
         Storage::disk('public')->delete($bukti->path);
         $bukti->delete();
 
         return response()->json(['success' => true]);
     }
 }
