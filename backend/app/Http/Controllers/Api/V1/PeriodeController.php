<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Periode;
use Illuminate\Http\Request;

class PeriodeController extends Controller
{
    public function index()
    {
        return response()->json(Periode::orderBy('tahun', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'tahun' => 'required|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'status' => 'required|string|in:draft,berjalan,selesai',
            'keterangan' => 'nullable|string',
        ]);

        $periode = Periode::create($validated);
        return response()->json($periode, 201);
    }

    public function update(Request $request, Periode $periode)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'tahun' => 'required|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'status' => 'required|string|in:draft,berjalan,selesai',
            'keterangan' => 'nullable|string',
        ]);

        $periode->update($validated);
        return response()->json($periode);
    }

    public function destroy(Periode $periode)
    {
        $periode->delete();
        return response()->json(null, 204);
    }
}
