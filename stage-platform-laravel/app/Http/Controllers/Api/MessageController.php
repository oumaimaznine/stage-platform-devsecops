<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // Récupère les messages d'une conversation (utilisé aussi pour le polling)
    public function index(Request $request, Conversation $conversation)
    {
        $this->checkAccess($request, $conversation);

        // marquer comme lus les messages reçus (pas envoyés par l'utilisateur courant)
        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $request->user()->id)
            ->whereNull('lu_at')
            ->update(['lu_at' => now()]);

        return response()->json(
            $conversation->messages()->with('sender:id,name,role')->get()
        );
    }

    public function store(Request $request, Conversation $conversation)
    {
        $this->checkAccess($request, $conversation);

        $data = $request->validate([
            'contenu' => 'required|string|max:2000',
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $request->user()->id,
            'contenu' => $data['contenu'],
        ]);

        $conversation->touch(); // remonte la conversation en tête de liste

        return response()->json($message->load('sender:id,name,role'), 201);
    }

    // Nombre de messages non lus, toutes conversations confondues (pour badge de notif)
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        $conversationIds = Conversation::query()
            ->when($user->role === 'etudiant', fn ($q) => $q->where('student_id', $user->student->id))
            ->when($user->role === 'entreprise', fn ($q) => $q->where('company_id', $user->company->id))
            ->pluck('id');

        $count = Message::whereIn('conversation_id', $conversationIds)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('lu_at')
            ->count();

        return response()->json(['unread' => $count]);
    }

    private function checkAccess(Request $request, Conversation $conversation): void
    {
        $user = $request->user();
        $allowed =
            ($user->role === 'etudiant' && $user->student->id === $conversation->student_id) ||
            ($user->role === 'entreprise' && $user->company->id === $conversation->company_id) ||
            $user->role === 'admin';

        abort_unless($allowed, 403, 'Accès refusé à cette conversation');
    }
}