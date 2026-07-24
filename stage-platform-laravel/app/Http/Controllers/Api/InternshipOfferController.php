<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InternshipOffer;
use Illuminate\Http\Request;

class InternshipOfferController extends Controller
{
    public function index(Request $request)
    {
        $query = InternshipOffer::with('company')->where('statut', 'ouverte');

        if ($request->user()->role === 'entreprise') {
            $query = InternshipOffer::with('company')
                ->where('company_id', $request->user()->company->id);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'competences_requises' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'type' => 'required|in:stage_ete,pfe,stage_observation',
        ]);

        $data['company_id'] = $request->user()->company->id;
        $data['statut'] = 'en_attente_validation';

        $offer = InternshipOffer::create($data);

        return response()->json($offer, 201);
    }

    public function show(InternshipOffer $internshipOffer)
    {
        return response()->json($internshipOffer->load('company', 'applications'));
    }

    public function update(Request $request, InternshipOffer $internshipOffer)
    {
        $internshipOffer->update($request->all());
        return response()->json($internshipOffer);
    }

    public function destroy(InternshipOffer $internshipOffer)
    {
        $internshipOffer->delete();
        return response()->json(null, 204);
    }

    // Validation admin
    public function validateOffer(Request $request, InternshipOffer $internshipOffer)
    {
        $data = $request->validate(['statut' => 'required|in:ouverte,fermee']);
        $internshipOffer->update($data);
        return response()->json($internshipOffer);
    }

    // Liste des offres en attente de validation (admin)
    public function pending()
    {
        return response()->json(
            InternshipOffer::with('company')->where('statut', 'en_attente_validation')->latest()->get()
        );
    }
}
