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

        $user = $request->user();
        $systemContext = "Tu es l'assistant IA de la plateforme 'Gestion des stages'. "
            . "Tu aides UNIQUEMENT sur les sujets liés à la plateforme : candidatures, offres de stage, "
            . "conventions, rapports, entretiens, et utilisation de l'application. "
            . "Si on te pose une question hors de ce cadre (culture générale, actualité, autres sujets), "
            . "réponds poliment que tu es limité à l'assistance sur la plateforme de gestion des stages "
            . "et propose de reformuler la question dans ce contexte. "
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
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={$apiKey}",
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