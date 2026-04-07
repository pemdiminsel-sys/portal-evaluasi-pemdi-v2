<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(SupabaseService $supabase)
    {
        try {
            // Kita tarik daftar User + Nama OPD-nya (Bypass 443)
            $users = $supabase->from('users')->select('*, opds(nama)')->get();

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request, SupabaseService $supabase)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'role' => 'required|integer',
            'opd_id' => 'nullable'
        ]);

        try {
            // Simpan User ke Supabase Cloud (Bypass 443)
            $res = $supabase->from('users')->insert([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'opd_id' => $validated['opd_id'] ?: null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User baru berhasil didaftarkan ke Cloud!',
                'data' => $res
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update($id, Request $request, SupabaseService $supabase)
    {
        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email',
            'password' => 'nullable|string|min:6',
            'role'     => 'sometimes|integer',
            'opd_id'   => 'nullable',
        ]);

        try {
            $payload = [
                'name'       => $validated['name'] ?? null,
                'email'      => $validated['email'] ?? null,
                'role'       => $validated['role'] ?? null,
                'opd_id'     => $validated['opd_id'] ?? null,
                'updated_at' => now(),
            ];

            // Hanya update password jika diisi
            if (!empty($validated['password'])) {
                $payload['password'] = Hash::make($validated['password']);
            }

            // Hapus kolom null agar tidak menimpa data yang tidak dikirim
            $payload = array_filter($payload, fn($v) => !is_null($v));

            $supabase->from('users')->where('id', $id)->update($payload);

            return response()->json([
                'success' => true,
                'message' => 'User berhasil diperbarui!'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id, SupabaseService $supabase)
    {
        try {
            $supabase->from('users')->where('id', $id)->delete();
            return response()->json([
                'success' => true,
                'message' => 'User telah dihapus dari Cloud!'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
