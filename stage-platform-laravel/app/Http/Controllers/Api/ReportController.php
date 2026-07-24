<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Report::with('convention.application.student.user', 'convention.application.offer.company');

        if ($user->role === 'etudiant') {
            // L'étudiant ne voit que ses propres rapports
            $query->whereHas('convention.application.student', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        } elseif ($user->role === 'entreprise') {
            // L'entreprise ne voit que les rapports liés à ses offres
            $query->whereHas('convention.application.offer.company', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        // Admin : pas de filtre, il voit tout

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'convention_id' => 'required|exists:conventions,id',
            'titre' => 'required|string|max:255',
            'fichier' => 'required|file|mimes:pdf|max:10240',
        ]);

        $path = $request->file('fichier')->store('rapports', 'public');

        $report = Report::create([
            'convention_id' => $data['convention_id'],
            'titre' => $data['titre'],
            'fichier_path' => $path,
        ]);

        return response()->json($report, 201);
    }

    public function updateStatus(Request $request, Report $report)
    {
        $data = $request->validate([
            'statut' => 'required|in:valide,rejete',
            'commentaire' => 'nullable|string',
        ]);
        $report->update($data);
        return response()->json($report);
    }

    // Liste des rapports déposés en attente de validation admin
    public function pending()
    {
        return response()->json(
            Report::with('convention.application.student.user')
                ->where('statut', 'depose')
                ->latest()->get()
        );
    }
}
