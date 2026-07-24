<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AssistantController extends Controller
{
    public function chat(Request $request)
    {
        $data = $request->validate([
            'message' => 'required|string|max:2000',
            'history' => 'nullable|array',
        ]);

        $apiKey = config('services.gemini.key');

        $contents = [];

        // Contexte système pour que l'assistant connaisse le rôle de l'utilisateur
        $user = $request->user();
        $systemContext = "Tu es l'assistant IA de la plateforme 'Gestion des stages'. "
            . "Tu aides les étudiants, entreprises et administrateurs à utiliser la plateforme "
            . "(candidatures, offres de stage, conventions, rapports). "
            . "L'utilisateur actuel est {$user->name}, avec le rôle : {$user->role}. "
            . "Réponds toujours en français, de façon concise et utile.";

        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $systemContext]],
        ];
        $contents[] = [
            'role' => 'model',
            'parts' => [['text' => "Compris, je suis prêt à aider {$user->name}."]],
        ];

        // Historique de conversation envoyé par le frontend
        foreach ($data['history'] ?? [] as $msg) {
            $contents[] = [
                'role' => $msg['role'] === 'assistant' ? 'model' : 'user',
                'parts' => [['text' => $msg['content']]],
            ];
        }

        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $data['message']]],
        ];

        $response = Http::post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}",
            ['contents' => $contents]
        );

        if ($response->failed()) {
            \Log::error('Gemini API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return response()->json([
                'message' => "Désolé, je n'ai pas pu répondre pour le moment.",
            ], 500);
        }

        $reply = $response->json('candidates.0.content.parts.0.text') ?? "Désolé, je n'ai pas compris.";

        return response()->json(['message' => $reply]);
    }
}