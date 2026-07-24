<?php

namespace App\Http\Controllers;

use App\Models\Entretien;
use Illuminate\Http\Request;

class EntretienController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Entretien::with('application.student.user', 'application.offer.company');

        if ($user->role === 'etudiant') {
            $query->whereHas('application.student', fn($q) => $q->where('user_id', $user->id));
        } elseif ($user->role === 'entreprise') {
            $query->whereHas('application.offer.company', fn($q) => $q->where('user_id', $user->id));
        }

        return $query->orderByDesc('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'application_id' => 'required|exists:applications,id',
            'date' => 'required|date',
            'heure' => 'required',
            'mode' => 'required|in:presentiel,visio',
            'lieu' => 'nullable|string',
            'lien_visio' => 'nullable|string',
        ]);
        $data['statut'] = 'planifie';

        $entretien = Entretien::create($data);
        return response()->json($entretien->load('application.student.user', 'application.offer.company'), 201);
    }

    public function update(Request $request, Entretien $entretien)
    {
        $data = $request->validate([
            'date' => 'sometimes|date',
            'heure' => 'sometimes',
            'mode' => 'sometimes|in:presentiel,visio',
            'lieu' => 'nullable|string',
            'lien_visio' => 'nullable|string',
            'statut' => 'sometimes|in:en_attente,planifie,reporte,termine,annule',
            'decision' => 'sometimes|in:retenu,refuse,en_attente',
            'commentaire' => 'nullable|string',
        ]);

        $entretien->update($data);
        return $entretien->load('application.student.user', 'application.offer.company');
    }

    public function confirm(Entretien $entretien)
    {
        $entretien->update(['statut' => 'planifie']);
        return $entretien;
    }

    public function refuse(Entretien $entretien)
    {
        $entretien->update(['statut' => 'annule']);
        return $entretien;
    }
}