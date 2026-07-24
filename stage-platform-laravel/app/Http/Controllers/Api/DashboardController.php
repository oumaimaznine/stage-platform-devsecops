<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Student, Company, InternshipOffer, Application, Convention, Report};
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return response()->json([
                'total_etudiants' => Student::count(),
                'total_entreprises' => Company::count(),
                'offres_en_attente' => InternshipOffer::where('statut', 'en_attente_validation')->count(),
                'offres_ouvertes' => InternshipOffer::where('statut', 'ouverte')->count(),
                'candidatures' => Application::count(),
                'conventions_a_valider' => Convention::where('statut', 'signee')->count(),
                'rapports_deposes' => Report::where('statut', 'depose')->count(),
            ]);
        }

        if ($user->role === 'entreprise') {
            $companyId = $user->company->id;
            return response()->json([
                'mes_offres' => InternshipOffer::where('company_id', $companyId)->count(),
                'candidatures_recues' => Application::whereHas('offer', fn ($q) => $q->where('company_id', $companyId))->count(),
            ]);
        }

        // étudiant
        $studentId = $user->student->id;
        return response()->json([
            'mes_candidatures' => Application::where('student_id', $studentId)->count(),
            'candidatures_acceptees' => Application::where('student_id', $studentId)->where('statut', 'acceptee')->count(),
        ]);
    }

    public function charts(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $offersByStatus = InternshipOffer::selectRaw('statut, count(*) as total')
                ->groupBy('statut')->get();

            $applicationsByMonth = Application::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as mois, count(*) as total")
                ->groupBy('mois')->orderBy('mois')->get();

            $applicationsByStatus = Application::selectRaw('statut, count(*) as total')
                ->groupBy('statut')->get();

            return response()->json([
                'offres_par_statut' => $offersByStatus,
                'candidatures_par_mois' => $applicationsByMonth,
                'candidatures_par_statut' => $applicationsByStatus,
            ]);
        }

        if ($user->role === 'entreprise') {
            $companyId = $user->company->id;
            $applicationsByStatus = Application::whereHas('offer', fn ($q) => $q->where('company_id', $companyId))
                ->selectRaw('statut, count(*) as total')->groupBy('statut')->get();

            return response()->json(['candidatures_par_statut' => $applicationsByStatus]);
        }

        // étudiant
        $studentId = $user->student->id;
        $applicationsByStatus = Application::where('student_id', $studentId)
            ->selectRaw('statut, count(*) as total')->groupBy('statut')->get();

        return response()->json(['candidatures_par_statut' => $applicationsByStatus]);
    }
}
