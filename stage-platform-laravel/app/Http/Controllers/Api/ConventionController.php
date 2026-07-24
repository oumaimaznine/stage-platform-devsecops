<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Convention;
use Illuminate\Http\Request;

class ConventionController extends Controller
{
   public function index(Request $request)
{
    $user = $request->user();

    $query = Convention::with('application.student.user', 'application.offer.company');

    if ($user->role === 'etudiant') {
        $query->whereHas('application.student', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        });
    } elseif ($user->role === 'entreprise') {
        $query->whereHas('application.offer.company', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        });
    }

    return response()->json($query->get());
}
    public function store(Request $request)
    {
        $data = $request->validate([
            'application_id' => 'required|exists:applications,id',
            'fichier' => 'required|file|mimes:pdf|max:5120',
        ]);

        $path = $request->file('fichier')->store('conventions', 'public');

        $convention = Convention::create([
            'application_id' => $data['application_id'],
            'fichier_path' => $path,
            'statut' => 'en_preparation',
        ]);

        return response()->json($convention, 201);
    }

    // Validation par l'administration
    public function validateConvention(Request $request, Convention $convention)
    {
        $data = $request->validate([
            'statut' => 'required|in:validee_admin,rejetee',
            'commentaire_admin' => 'nullable|string',
        ]);

        $convention->update($data);
        return response()->json($convention);
    }

    // Liste des conventions signées en attente de validation admin
    public function pending()
    {
        return response()->json(
            Convention::with('application.student.user', 'application.offer.company')
                ->where('statut', 'signee')
                ->latest()->get()
        );
    }
}
