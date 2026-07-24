<?php

use App\Http\Controllers\Api\{
    AuthController, InternshipOfferController, ApplicationController,
    ConventionController, ReportController, DashboardController,
    CompanyController, StudentController, ConversationController, MessageController,
    AssistantController, NotificationController
};

use App\Http\Controllers\EntretienController;
use Illuminate\Support\Facades\Route;

// --- Routes publiques ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Routes protégées (utilisateur connecté) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Offres de stages
    Route::apiResource('offers', InternshipOfferController::class);

    // Candidatures
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::patch('/applications/{application}/statut', [ApplicationController::class, 'updateStatus']);

    // Conventions
    Route::get('/conventions', [ConventionController::class, 'index']);
    Route::post('/conventions', [ConventionController::class, 'store']);

    // Rapports
    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);

    // Entretiens
    Route::get('/entretiens', [EntretienController::class, 'index']);
    Route::post('/entretiens', [EntretienController::class, 'store']);
    Route::put('/entretiens/{entretien}', [EntretienController::class, 'update']);
    Route::put('/entretiens/{entretien}/confirm', [EntretienController::class, 'confirm']);
    Route::put('/entretiens/{entretien}/refuse', [EntretienController::class, 'refuse']);

    // Entreprises / Étudiants (listing + fiche)
    Route::get('/companies', [CompanyController::class, 'index']);
    Route::get('/companies/{company}', [CompanyController::class, 'show']);
    Route::put('/companies/{company}', [CompanyController::class, 'update']);

    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/students/{student}', [StudentController::class, 'show']);
    Route::put('/students/{student}', [StudentController::class, 'update']);

    // Tableaux de bord
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/charts', [DashboardController::class, 'charts']);

    // Messagerie (chat étudiant <-> entreprise)
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);

    Route::get('/conversations/{conversation}/messages', [MessageController::class, 'index']);
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store']);
    Route::get('/messages/unread-count', [MessageController::class, 'unreadCount']);

    // Assistant IA
    Route::post('/assistant/chat', [AssistantController::class, 'chat']);
    Route::get('/notifications', [NotificationController::class, 'index']);
Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    // --- Routes réservées à l'administration ---
    Route::middleware('role:admin')->group(function () {
        Route::get('/offers/pending/list', [InternshipOfferController::class, 'pending']);
        Route::patch('/offers/{internshipOffer}/valider', [InternshipOfferController::class, 'validateOffer']);

        Route::get('/conventions/pending/list', [ConventionController::class, 'pending']);
        Route::patch('/conventions/{convention}/valider', [ConventionController::class, 'validateConvention']);

        Route::get('/reports/pending/list', [ReportController::class, 'pending']);
        Route::patch('/reports/{report}/statut', [ReportController::class, 'updateStatus']);

        Route::patch('/companies/{company}/valider', [CompanyController::class, 'validateCompany']);
    });
});