<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index()
    {
        return response()->json(Company::with('user')->latest()->get());
    }

    public function show(Company $company)
    {
        return response()->json($company->load('user', 'offers'));
    }

    public function update(Request $request, Company $company)
    {
        $data = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'secteur' => 'nullable|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:30',
            'site_web' => 'nullable|url|max:255',
        ]);

        $company->update($data);
        return response()->json($company);
    }

    // Validation admin d'une entreprise
    public function validateCompany(Request $request, Company $company)
    {
        $data = $request->validate(['valide' => 'required|boolean']);
        $company->update($data);
        return response()->json($company);
    }
}
