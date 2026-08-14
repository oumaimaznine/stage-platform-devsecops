<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Récupérer les favoris de l'étudiant connecté
     */
    public function index(Request $request)
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json([
                'message' => 'Profil étudiant introuvable.',
            ], 404);
        }

        $favorites = Favorite::where(
            'student_id',
            $student->id
        )
            ->with('internshipOffer')
            ->latest()
            ->get();

        return response()->json([
            'favorites' => $favorites,
        ]);
    }

    /**
     * Ajouter une offre aux favoris
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'internship_offer_id' => [
                'required',
                'integer',
                'exists:internship_offers,id',
            ],
        ]);

        $student = $request->user()->student;

        if (!$student) {
            return response()->json([
                'message' => 'Profil étudiant introuvable.',
            ], 404);
        }

        $favorite = Favorite::firstOrCreate([
            'student_id' => $student->id,
            'internship_offer_id' =>
                $validated['internship_offer_id'],
        ]);

        return response()->json([
            'message' => 'Offre ajoutée à vos favoris.',
            'favorite' => $favorite,
        ], 201);
    }

    /**
     * Supprimer une offre des favoris
     */
    public function destroy(
        Request $request,
        int $internshipOfferId
    ) {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json([
                'message' => 'Profil étudiant introuvable.',
            ], 404);
        }

        $favorite = Favorite::where(
            'student_id',
            $student->id
        )
            ->where(
                'internship_offer_id',
                $internshipOfferId
            )
            ->first();

        if (!$favorite) {
            return response()->json([
                'message' => 'Cette offre n’est pas dans vos favoris.',
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'message' => 'Offre retirée de vos favoris.',
        ]);
    }
}