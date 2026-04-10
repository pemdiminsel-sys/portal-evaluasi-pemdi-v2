<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIProxyController extends Controller
{
    public function proxy(Request $request)
    {
        $engine = $request->input('engine');
        $messages = $request->input('messages');
        $optimizedKnowledge = $request->input('knowledge');

        if ($engine === 'gemini') {
            $key = getenv('VITE_GEMINI_KEY') ?: getenv('GEMINI_KEY');
            if (!$key || $key === 'YOUR_GEMINI_KEY_HERE') {
                return response()->json(['error' => 'API Key Admin 1 (Gemini) tidak ditemukan di Environment Variables Vercel.'], 500);
            }
            
            $response = Http::timeout(30)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$key}", [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => "Kamu adalah Pakar Evaluasi Pemdi Minahasa Selatan. Jawab HANYA berdasarkan data ini:\n\n{$optimizedKnowledge}\n\nPertanyaan: " . $messages[count($messages)-1]['content']]
                        ]
                    ]
                ]
            ]);
            
            if ($response->failed()) {
                return response()->json(['error' => 'Gemini API Error: ' . $response->body()], $response->status());
            }

            $data = $response->json();
            return response()->json(['content' => $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, Admin 1 tidak memberikan respon.']);
        }

        if ($engine === 'deepseek') {
            $key = getenv('VITE_DEEPSEEK_KEY') ?: getenv('DEEPSEEK_KEY');
            if (!$key) $key = 'sk-a7e1876707284a99bf8518dc46877d88'; // fallback
            
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$key}",
                'Content-Type' => 'application/json',
            ])->timeout(30)->post("https://api.deepseek.com/chat/completions", [
                'model' => 'deepseek-chat',
                'messages' => [
                    ['role' => 'system', 'content' => "Kamu adalah Pakar Evaluasi Pemdi Minahasa Selatan. Gunakan data berikut sebagai referensi:\n\n{$optimizedKnowledge}"],
                    ['role' => 'user', 'content' => $messages[count($messages)-1]['content']]
                ],
                'stream' => false
            ]);
            
            if ($response->failed()) {
                return response()->json(['error' => 'DeepSeek API Error: ' . $response->body()], $response->status());
            }

            $data = $response->json();
            return response()->json(['content' => $data['choices'][0]['message']['content'] ?? 'Maaf, Admin 3 tidak memberikan respon.']);
        }

        return response()->json(['error' => 'Mesin AI tidak valid'], 400);
    }
}
