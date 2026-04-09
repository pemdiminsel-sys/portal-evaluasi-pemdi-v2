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
            $key = env('VITE_GEMINI_KEY');
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$key}", [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => "DATA:\n{$optimizedKnowledge}\n\nUSER: " . $messages[count($messages)-1]['content']]
                        ]
                    ]
                ]
            ]);
            $data = $response->json();
            return response()->json(['content' => $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Gemini Error']);
        }

        if ($engine === 'deepseek') {
            $key = 'sk-a7e1876707284a99bf8518dc46877d88'; // Hardcoded as per user request
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$key}",
                'Content-Type' => 'application/json',
            ])->post("https://api.deepseek.com/chat/completions", [
                'model' => 'deepseek-chat',
                'messages' => [
                    ['role' => 'system', 'content' => "Pakar SPBE Pemdi. Data:\n{$optimizedKnowledge}"],
                    ['role' => 'user', 'content' => $messages[count($messages)-1]['content']]
                ],
                'stream' => false
            ]);
            $data = $response->json();
            return response()->json(['content' => $data['choices'][0]['message']['content'] ?? 'DeepSeek Error']);
        }

        return response()->json(['error' => 'Invalid Engine'], 400);
    }
}
