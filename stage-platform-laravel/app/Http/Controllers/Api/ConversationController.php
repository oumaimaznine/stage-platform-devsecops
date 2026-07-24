<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    // Liste des conversations de l'utilisateur connecté (étudiant ou entreprise)
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Conversation::with(['student.user', 'company', 'offer', 'lastMessage']);

        if ($user->role === 'etudiant') {
            $query->where('student_id', $user->student->id);
        } elseif ($user->role === 'entreprise') {
            $query->where('company_id', $user->company->id);
        } else {
            return response()->json(['message' => 'Accès réservé aux étudiants et entreprises'], 403);
        }

        $conversations = $query->orderByDesc(
            \App\Models\Message::select('created_at')
                ->whereColumn('conversation_id', 'conversations.id')
                ->latest()->take(1)
        )->get();

        return response()->json($conversations);
    }

    // Démarrer ou récupérer une conversation existante
    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'company_id' => 'required_if:role,etudiant|exists:companies,id',
            'student_id' => 'required_if:role,entreprise|exists:students,id',
            'internship_offer_id' => 'nullable|exists:internship_offers,id',
        ]);

        if ($user->role === 'etudiant') {
            $studentId = $user->student->id;
            $companyId = $data['company_id'];
        } elseif ($user->role === 'entreprise') {
            $companyId = $user->company->id;
            $studentId = $data['student_id'];
        } else {
            return response()->json(['message' => 'Accès réservé aux étudiants et entreprises'], 403);
        }

        $conversation = Conversation::firstOrCreate([
            'student_id' => $studentId,
            'company_id' => $companyId,
            'internship_offer_id' => $data['internship_offer_id'] ?? null,
        ]);

        return response()->json($conversation->load(['student.user', 'company', 'offer']), 201);
    }

    public function show(Request $request, Conversation $conversation)
    {
        $this->authorizeAccess($request, $conversation);

        return response()->json(
            $conversation->load(['student.user', 'company', 'offer', 'messages.sender'])
        );
    }

    private function authorizeAccess(Request $request, Conversation $conversation): void
    {
        $user = $request->user();
        $allowed =
            ($user->role === 'etudiant' && $user->student->id === $conversation->student_id) ||
            ($user->role === 'entreprise' && $user->company->id === $conversation->company_id) ||
            $user->role === 'admin';

        abort_unless($allowed, 403, 'Accès refusé à cette conversation');
    }
}