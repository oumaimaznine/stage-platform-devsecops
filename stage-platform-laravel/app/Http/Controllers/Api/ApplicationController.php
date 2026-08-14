<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Notification;
use App\Models\InternshipOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    /* =========================================================
       LISTE DES CANDIDATURES
    ========================================================= */

    public function index(Request $request)
    {
        $user = $request->user();

        /*
         * =====================================================
         * ÉTUDIANT
         * =====================================================
         */

        if ($user->role === 'etudiant') {

            $student = $user->student;

            if (!$student) {
                return response()->json([
                    'message' => 'Profil étudiant introuvable.'
                ], 404);
            }

            $applications = Application::with([
                'offer.company'
            ])
                ->where('student_id', $student->id)
                ->latest()
                ->get();

            return response()->json($applications);
        }

        /*
         * =====================================================
         * ENTREPRISE
         * =====================================================
         */

        if ($user->role === 'entreprise') {

            $company = $user->company;

            if (!$company) {
                return response()->json([
                    'message' => 'Profil entreprise introuvable.'
                ], 404);
            }

            $applications = Application::with([
                'student.user',
                'offer'
            ])
                ->whereHas('offer', function ($query) use ($company) {
                    $query->where('company_id', $company->id);
                })
                ->latest()
                ->get();

            return response()->json($applications);
        }

        /*
         * =====================================================
         * ADMIN / AUTRE ROLE
         * =====================================================
         */

        $applications = Application::with([
            'student.user',
            'offer.company'
        ])
            ->latest()
            ->get();

        return response()->json($applications);
    }


    /* =========================================================
       CREER UNE CANDIDATURE
    ========================================================= */

    public function store(Request $request)
    {
        /*
         * =====================================================
         * UTILISATEUR
         * =====================================================
         */

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non authentifié.'
            ], 401);
        }

        /*
         * =====================================================
         * VÉRIFIER LE ROLE
         * =====================================================
         */

        if ($user->role !== 'etudiant') {
            return response()->json([
                'message' => 'Seuls les étudiants peuvent postuler.'
            ], 403);
        }

        /*
         * =====================================================
         * PROFIL ÉTUDIANT
         * =====================================================
         */

        $student = $user->student;

        if (!$student) {
            return response()->json([
                'message' => 'Profil étudiant introuvable.'
            ], 404);
        }

        /*
         * =====================================================
         * VALIDATION
         *
         * Le CV est nullable ici car on peut utiliser
         * automatiquement celui du profil étudiant.
         * =====================================================
         */

        $data = $request->validate([

            'internship_offer_id' => [
                'required',
                'integer',
                'exists:internship_offers,id'
            ],

            'cv' => [
                'nullable',
                'file',
                'mimes:pdf',
                'max:5120'
            ],

            'lettre_motivation' => [
                'nullable',
                'file',
                'mimes:pdf',
                'max:5120'
            ],

            'message' => [
                'nullable',
                'string',
                'max:5000'
            ],
        ]);

        /*
         * =====================================================
         * RÉCUPÉRER L'OFFRE
         * =====================================================
         */

        $offer = InternshipOffer::with('company')
            ->find($data['internship_offer_id']);

        if (!$offer) {
            return response()->json([
                'message' => 'Offre de stage introuvable.'
            ], 404);
        }

        /*
         * =====================================================
         * VÉRIFIER QUE L'OFFRE EST OUVERTE
         * =====================================================
         */

        if ($offer->statut !== 'ouverte') {
            return response()->json([
                'message' => 'Cette offre n’est plus ouverte aux candidatures.'
            ], 422);
        }

        /*
         * =====================================================
         * VÉRIFIER LES DOUBLONS
         * =====================================================
         */

        $existingApplication = Application::where(
            'student_id',
            $student->id
        )
            ->where(
                'internship_offer_id',
                $data['internship_offer_id']
            )
            ->first();

        if ($existingApplication) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà postulé à cette offre.',
                'application' => $existingApplication
            ], 409);
        }

        /*
         * =====================================================
         * CV
         *
         * PRIORITÉ 1 :
         * Si l'utilisateur envoie un nouveau CV,
         * on utilise ce CV.
         *
         * PRIORITÉ 2 :
         * Sinon, on utilise automatiquement le CV
         * enregistré dans le profil étudiant.
         * =====================================================
         */

        $cvPath = null;

        /*
         * Nouveau CV envoyé
         */

        if ($request->hasFile('cv')) {

            $cvPath = $request
                ->file('cv')
                ->store('cvs', 'public');
        }

        /*
         * Aucun CV envoyé :
         * utiliser celui du profil étudiant
         */

        else {

            $cvPath = $student->cv_path ?? null;

            /*
             * Aucun CV dans le profil
             */

            if (!$cvPath) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous devez ajouter un CV à votre profil avant de postuler.'
                ], 422);
            }

            /*
             * Vérifier que le fichier existe réellement
             */

            if (!Storage::disk('public')->exists($cvPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le CV enregistré dans votre profil est introuvable sur le serveur.'
                ], 422);
            }
        }

        /*
         * =====================================================
         * LETTRE DE MOTIVATION
         * =====================================================
         */

        $lettrePath = null;

        if ($request->hasFile('lettre_motivation')) {

            $lettrePath = $request
                ->file('lettre_motivation')
                ->store('lettres', 'public');
        }

        /*
         * =====================================================
         * CRÉER LA CANDIDATURE
         * =====================================================
         */

        $application = Application::create([

            'student_id' => $student->id,

            'internship_offer_id' =>
                $data['internship_offer_id'],

            'cv_path' => $cvPath,

            'lettre_motivation_path' =>
                $lettrePath,

            'message' =>
                $data['message'] ?? null,

            'statut' => 'en_attente',
        ]);

        /*
         * =====================================================
         * CHARGER LES RELATIONS
         * =====================================================
         */

        $application->load([
            'offer.company.user',
            'student.user'
        ]);

        /*
         * =====================================================
         * NOTIFICATION ENTREPRISE
         * =====================================================
         */

        $company = $application->offer->company ?? null;

        if ($company && $company->user_id) {

            Notification::create([

                'user_id' =>
                    $company->user_id,

                'title' =>
                    'Nouvelle candidature',

                'message' =>
                    "{$application->student->user->name} a postulé à \"{$application->offer->titre}\".",

                'link' =>
                    '/applications',
            ]);
        }

        /*
         * =====================================================
         * RÉPONSE
         * =====================================================
         */

        return response()->json([

            'success' => true,

            'message' =>
                'Candidature envoyée avec succès.',

            'application' =>
                $application,

        ], 201);
    }


    /* =========================================================
       MODIFIER LE STATUT
    ========================================================= */

    public function updateStatus(
        Request $request,
        Application $application
    ) {
        /*
         * Validation
         */

        $data = $request->validate([

            'statut' => [
                'required',
                'in:en_attente,acceptee,refusee'
            ],

        ]);

        /*
         * Mise à jour
         */

        $application->update([

            'statut' =>
                $data['statut']

        ]);

        /*
         * Charger les relations
         */

        $application->load([

            'offer.company',
            'student.user'

        ]);

        /*
         * Utilisateur étudiant
         */

        $studentUserId =
            $application->student->user_id ?? null;

        if ($studentUserId) {

            $statutLabel = match (
                $data['statut']
            ) {

                'acceptee' =>
                    'acceptée',

                'refusee' =>
                    'refusée',

                default =>
                    'mise à jour',
            };

            Notification::create([

                'user_id' =>
                    $studentUserId,

                'title' =>
                    'Candidature ' . $statutLabel,

                'message' =>
                    "Ta candidature pour \"{$application->offer->titre}\" chez {$application->offer->company->nom} a été {$statutLabel}.",

                'link' =>
                    '/applications',

            ]);
        }

        /*
         * Réponse
         */

        return response()->json([

            'success' => true,

            'message' =>
                'Statut de la candidature mis à jour.',

            'application' =>
                $application,

        ]);
    }


    /* =========================================================
       TÉLÉCHARGER LE CV
    ========================================================= */

    public function downloadCv(
        Application $application
    ) {
        if (!$application->cv_path) {

            return response()->json([
                'message' => 'CV introuvable.'
            ], 404);
        }

        if (
            !Storage::disk('public')
                ->exists($application->cv_path)
        ) {

            return response()->json([
                'message' =>
                    'Fichier CV introuvable sur le serveur.'
            ], 404);
        }

        return Storage::disk('public')->download(
            $application->cv_path
        );
    }


    /* =========================================================
       TÉLÉCHARGER LA LETTRE
    ========================================================= */

    public function downloadLettre(
        Application $application
    ) {
        if (!$application->lettre_motivation_path) {

            return response()->json([
                'message' =>
                    'Lettre de motivation introuvable.'
            ], 404);
        }

        if (
            !Storage::disk('public')
                ->exists($application->lettre_motivation_path)
        ) {

            return response()->json([
                'message' =>
                    'Fichier introuvable sur le serveur.'
            ], 404);
        }

        return Storage::disk('public')->download(
            $application->lettre_motivation_path
        );
    }
}