<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\InternshipOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecommendationController extends Controller
{
    public function recommend(Request $request, Student $student)
    {
        $apiKey = config('services.gemini.key');

        /*
        |--------------------------------------------------------------------------
        | 1. Vérifier la clé Gemini
        |--------------------------------------------------------------------------
        */
        if (!$apiKey) {
            return response()->json([
                'message' => 'Clé API Gemini non configurée.'
            ], 500);
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Charger le profil étudiant
        |--------------------------------------------------------------------------
        */
        $student->load('user');

        /*
        |--------------------------------------------------------------------------
        | 3. Récupérer les offres ouvertes
        |--------------------------------------------------------------------------
        */
        $offers = InternshipOffer::with('company')
            ->where('statut', 'ouverte')
            ->get();

        if ($offers->isEmpty()) {
            return response()->json([
                'recommendations' => [],
                'message' => 'Aucune offre de stage disponible.'
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Données du CV
        |--------------------------------------------------------------------------
        */
        $cvExtracted = $student->cv_extracted ?? [];

        /*
        |--------------------------------------------------------------------------
        | 5. Données de l'étudiant envoyées à Gemini
        |--------------------------------------------------------------------------
        */
        $studentData = [
            'filiere' => $student->filiere,
            'niveau' => $student->niveau,
            'specialite' => $student->specialite,
            'competences' => $student->competences,
            'langues' => $student->langues,
            'secteur_prefere' => $student->secteur_prefere,
            'localisation_preferee' => $student->localisation_preferee,
            'type_stage_prefere' => $student->type_stage_prefere,
            'disponibilite_date' => $student->disponibilite_date,
            'cv_extracted' => $cvExtracted,
        ];

        /*
        |--------------------------------------------------------------------------
        | 6. Préparer les offres pour Gemini
        |--------------------------------------------------------------------------
        */
        $offersData = $offers->map(function ($offer) {
            return [
                'id' => $offer->id,
                'company_id' => $offer->company_id,
                'titre' => $offer->titre,
                'description' => $offer->description,
                'competences_requises' => $offer->competences_requises,
                'date_debut' => $offer->date_debut,
                'date_fin' => $offer->date_fin,
                'type' => $offer->type,
                'entreprise' => $offer->company?->nom,
            ];
        })->values()->toArray();

        /*
        |--------------------------------------------------------------------------
        | 7. Prompt Gemini
        |--------------------------------------------------------------------------
        */
        $prompt = "
Tu es un système intelligent de recommandation de stages.

Analyse le profil de l'étudiant et les offres de stage disponibles.

Ton objectif est de calculer un score de compatibilité entre 0 et 100
pour chaque offre.

Prends principalement en compte :

1. Les compétences techniques.
2. La filière et la spécialité.
3. Le niveau d'étude.
4. Les compétences extraites du CV.
5. Les expériences du CV.
6. Les langues.
7. Le secteur préféré.
8. Le type de stage préféré.
9. La localisation préférée.

Pour chaque offre, retourne uniquement son identifiant `offer_id`,
un score et une courte raison.

IMPORTANT :
- Ne modifie jamais `offer_id`.
- Utilise exactement l'identifiant fourni dans les offres.
- Ne crée aucune offre inexistante.
- Le score doit être compris entre 0 et 100.

Retourne UNIQUEMENT un JSON valide.
Aucun markdown.
Aucun texte supplémentaire.

Format EXACT :

{
    \"recommendations\": [
        {
            \"offer_id\": 1,
            \"score\": 95,
            \"raison\": \"Explication courte de la compatibilité.\"
        }
    ]
}

Étudiant :

" . json_encode(
            $studentData,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        ) . "

Offres disponibles :

" . json_encode(
            $offersData,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );

        /*
        |--------------------------------------------------------------------------
        | 8. Appel Gemini
        |--------------------------------------------------------------------------
        */
        try {

            $response = Http::timeout(60)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={$apiKey}",
                [
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [
                                [
                                    'text' => $prompt
                                ]
                            ]
                        ]
                    ]
                ]
            );

            /*
            |--------------------------------------------------------------------------
            | 9. Vérifier la réponse Gemini
            |--------------------------------------------------------------------------
            */
            if ($response->failed()) {

                Log::error('Gemini recommendation error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'message' => 'Échec de la génération des recommandations.'
                ], 500);
            }

            /*
            |--------------------------------------------------------------------------
            | 10. Récupérer le texte Gemini
            |--------------------------------------------------------------------------
            */
            $rawText = $response->json(
                'candidates.0.content.parts.0.text'
            ) ?? '';

            if (!$rawText) {

                Log::error('Gemini returned empty response');

                return response()->json([
                    'message' => 'L\'IA n\'a retourné aucune recommandation.'
                ], 500);
            }

            /*
            |--------------------------------------------------------------------------
            | 11. Nettoyer le JSON
            |--------------------------------------------------------------------------
            */
            $cleaned = trim($rawText);

            // Supprimer ```json ... ```
            $cleaned = preg_replace(
                '/^```(?:json)?\s*/i',
                '',
                $cleaned
            );

            $cleaned = preg_replace(
                '/\s*```$/',
                '',
                $cleaned
            );

            $cleaned = trim($cleaned);

            /*
            |--------------------------------------------------------------------------
            | 12. Décoder le JSON
            |--------------------------------------------------------------------------
            */
            $result = json_decode($cleaned, true);

            if (
                !is_array($result) ||
                !isset($result['recommendations']) ||
                !is_array($result['recommendations'])
            ) {

                Log::error(
                    'Invalid Gemini recommendation JSON',
                    [
                        'raw' => $rawText,
                        'cleaned' => $cleaned,
                    ]
                );

                return response()->json([
                    'message' => 'Le format de réponse de l\'IA est invalide.'
                ], 500);
            }

            /*
            |--------------------------------------------------------------------------
            | 13. Construire les recommandations finales
            |--------------------------------------------------------------------------
            |
            | IMPORTANT :
            | On récupère company_id directement depuis la base de données.
            | On ne fait PAS confiance à Gemini pour company_id.
            |
            */
            $recommendations = collect(
                $result['recommendations']
            )
                ->map(function ($recommendation) use ($offers) {

                    /*
                    |--------------------------------------------------------------------------
                    | Vérifier offer_id
                    |--------------------------------------------------------------------------
                    */
                    $offerId = $recommendation['offer_id'] ?? null;

                    if (!$offerId) {
                        return null;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Retrouver l'offre dans la base
                    |--------------------------------------------------------------------------
                    */
                    $offer = $offers->firstWhere(
                        'id',
                        $offerId
                    );

                    if (!$offer) {
                        return null;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Score
                    |--------------------------------------------------------------------------
                    */
                    $score = (int) (
                        $recommendation['score'] ?? 0
                    );

                    // Limiter entre 0 et 100
                    $score = max(
                        0,
                        min(100, $score)
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Retourner toutes les informations nécessaires
                    |--------------------------------------------------------------------------
                    */
                    return [
                        // ID de l'offre
                        'offer_id' => $offer->id,

                        // ID de l'entreprise
                        // C'EST LA CORRECTION PRINCIPALE
                        'company_id' => $offer->company_id,

                        // Informations de l'offre
                        'titre' => $offer->titre,
                        'description' => $offer->description,
                        'competences_requises' => $offer->competences_requises,
                        'date_debut' => $offer->date_debut,
                        'date_fin' => $offer->date_fin,
                        'type' => $offer->type,
                        'statut' => $offer->statut,

                        // Entreprise
                        'entreprise' => $offer->company?->nom,

                        // IA
                        'score' => $score,
                        'raison' => $recommendation['raison'] ?? '',
                    ];
                })
                ->filter()
                ->sortByDesc('score')
                ->values();

            /*
            |--------------------------------------------------------------------------
            | 14. Retourner les recommandations
            |--------------------------------------------------------------------------
            */
            return response()->json([
                'recommendations' => $recommendations
            ]);

        } catch (\Throwable $e) {

            /*
            |--------------------------------------------------------------------------
            | 15. Gestion des erreurs
            |--------------------------------------------------------------------------
            */
            Log::error(
                'Recommendation system error',
                [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ]
            );

            return response()->json([
                'message' => 'Une erreur est survenue lors de la génération des recommandations.'
            ], 500);
        }
    }
}