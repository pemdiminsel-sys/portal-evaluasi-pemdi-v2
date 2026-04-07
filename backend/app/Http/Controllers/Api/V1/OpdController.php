<?php
 
 namespace App\Http\Controllers\Api\V1;
 
 use App\Http\Controllers\Controller;
 use App\Models\Opd;
 use Illuminate\Http\Request;
 
 class OpdController extends Controller
 {
     public function index()
     {
         return response()->json([
             'success' => true,
             'data' => Opd::all()
         ]);
     }
 
     public function store(Request $request)
     {
         $validated = $request->validate([
             'nama' => 'required|string|max:200',
             'singkatan' => 'nullable|string|max:50',
             'alamat' => 'nullable|string',
         ]);
 
         $opd = Opd::create($validated);
 
         return response()->json([
             'success' => true,
             'data' => $opd
         ]);
     }
 
     public function update(Request $request, $id)
     {
         $opd = Opd::findOrFail($id);
         $validated = $request->validate([
             'nama' => 'sometimes|required|string|max:200',
             'singkatan' => 'nullable|string|max:50',
             'alamat' => 'nullable|string',
         ]);
 
         $opd->update($validated);
 
         return response()->json([
             'success' => true,
             'data' => $opd
         ]);
     }
 
     public function destroy($id)
     {
         $opd = Opd::findOrFail($id);
         $opd->delete();
 
         return response()->json(['success' => true]);
     }
 }
