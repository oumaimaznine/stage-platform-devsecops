<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::with('user')->latest()->get());
    }

    public function show(Student $student)
    {
        return response()->json($student->load('user', 'applications.offer'));
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'filiere' => 'sometimes|string|max:255',
            'niveau' => 'sometimes|string|max:255',
            'telephone' => 'nullable|string|max:30',
            'specialite' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:2000',
            'competences' => 'nullable|string',
            'langues' => 'nullable|array',
            'secteur_prefere' => 'nullable|string|max:255',
            'localisation_preferee' => 'nullable|string|max:255',
            'type_stage_prefere' => 'nullable|in:stage_ete,pfe,stage_observation',
            'disponibilite_date' => 'nullable|date',
            'linkedin_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
        ]);

        $student->update($data);
        return response()->json($student);
    }

    public function uploadCv(Request $request, Student $student)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf|max:5120',
        ]);

        if ($student->cv_path) {
            Storage::disk('public')->delete($student->cv_path);
        }

        $path = $request->file('cv')->store('cv', 'public');
        $student->update(['cv_path' => $path]);

        return response()->json(['cv_path' => $path]);
    }

    public function uploadPhoto(Request $request, Student $student)
    {
        $request->validate([
            'photo' => 'required|image|max:2048',
        ]);

        if ($student->photo_path) {
            Storage::disk('public')->delete($student->photo_path);
        }

        $path = $request->file('photo')->store('photos', 'public');
        $student->update(['photo_path' => $path]);

        return response()->json(['photo_path' => $path]);
    }

    public function extractCv(Student $student)
    {
        if (!$student->cv_path) {
            return response()->json(['message' => "Aucun CV n'est associé à ce profil."], 422);
        }

        $apiKey = config('services.gemini.key');
        $filePath = Storage::disk('public')->path($student->cv_path);

        if (!file_exists($filePath)) {
            return response()->json(['message' => "Fichier CV introuvable sur le serveur."], 404);
        }

        $base64Pdf = base64_encode(file_get_contents($filePath));

        $prompt = "Extrais les informations du CV suivant et retourne UNIQUEMENT un objet JSON strict, "
            . "sans texte avant ni après, sans balises markdown, au format exact suivant :\n"
            . '{"competences": ["..."], "diplomes": [{"intitule":"", "etablissement":"", "annee":""}], '
            . '"experiences": [{"poste":"", "entreprise":"", "duree":"", "description":""}], "langues": ["..."]}';

        $response = Http::post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={$apiKey}",
            [
                'contents' => [[
                    'role' => 'user',
                    'parts' => [
                        ['text' => $prompt],
                        [
                            'inline_data' => [
                                'mime_type' => 'application/pdf',
                                'data' => $base64Pdf,
                            ],
                        ],
                    ],
                ]],
            ]
        );

        if ($response->failed()) {
            Log::error('Gemini CV extraction error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return response()->json(['message' => "Échec de l'analyse du CV."], 500);
        }

        $rawText = $response->json('candidates.0.content.parts.0.text') ?? '';
        $cleaned = preg_replace('/^```json\s*|\s*```$/m', '', trim($rawText));
        $extracted = json_decode($cleaned, true);

        if (!$extracted) {
            Log::error('Gemini CV extraction: invalid JSON', ['raw' => $rawText]);
            return response()->json(['message' => "Le format de réponse de l'IA était invalide."], 500);
        }

        $student->update(['cv_extracted' => $extracted]);

        return response()->json(['cv_extracted' => $extracted]);
    }
}