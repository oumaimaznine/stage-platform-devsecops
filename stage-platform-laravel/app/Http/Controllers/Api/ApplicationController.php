<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Notification;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'etudiant') {
            $apps = Application::with('offer.company')
                ->where('student_id', $user->student->id)
                ->get();
        } elseif ($user->role === 'entreprise') {
            $apps = Application::with('student.user', 'offer')
                ->whereHas('offer', function ($q) use ($user) {
                    $q->where('company_id', $user->company->id);
                })
                ->get();
        } else {
            $apps = Application::with('student.user', 'offer.company')->get();
        }
        return response()->json($apps);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'internship_offer_id' => 'required|exists:internship_offers,id',
            'cv' => 'required|file|mimes:pdf|max:5120',
            'lettre_motivation' => 'nullable|file|mimes:pdf|max:5120',
            'message' => 'nullable|string',
        ]);

        $studentId = $request->user()->student->id;

        $existingApplication = Application::where('student_id', $studentId)
            ->where('internship_offer_id', $data['internship_offer_id'])
            ->first();

        if ($existingApplication) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà postulé à cette offre.'
            ], 409);
        }

        $cvPath = $request->file('cv')->store('cvs', 'public');

        $lettrePath = null;
        if ($request->hasFile('lettre_motivation')) {
            $lettrePath = $request->file('lettre_motivation')->store('lettres', 'public');
        }

        $application = Application::create([
            'student_id' => $studentId,
            'internship_offer_id' => $data['internship_offer_id'],
            'cv_path' => $cvPath,
            'lettre_motivation_path' => $lettrePath,
            'message' => $data['message'] ?? null,
        ]);

        // Notifier l'entreprise qu'une nouvelle candidature est arrivée
        $application->load('offer.company.user', 'student.user');
        $companyUserId = $application->offer->company->user_id ?? null;

        if ($companyUserId) {
            Notification::create([
                'user_id' => $companyUserId,
                'title' => 'Nouvelle candidature',
                'message' => "{$application->student->user->name} a postulé à \"{$application->offer->titre}\".",
                'link' => '/applications',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Candidature envoyée avec succès.',
            'application' => $application
        ], 201);
    }

    public function updateStatus(Request $request, Application $application)
    {
        $data = $request->validate([
            'statut' => 'required|in:en_attente,acceptee,refusee',
        ]);
        $application->update($data);

        // Notifier l'étudiant du changement de statut
        $application->load('offer.company', 'student.user');
        $studentUserId = $application->student->user_id ?? null;

        if ($studentUserId) {
            $statutLabel = match ($data['statut']) {
                'acceptee' => 'acceptée',
                'refusee' => 'refusée',
                default => 'mise à jour',
            };

            Notification::create([
                'user_id' => $studentUserId,
                'title' => 'Candidature ' . $statutLabel,
                'message' => "Ta candidature pour \"{$application->offer->titre}\" chez {$application->offer->company->nom} a été {$statutLabel}.",
                'link' => '/applications',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut de la candidature mis à jour.',
            'application' => $application
        ]);
    }
}