<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/keycloak/redirect', [AuthController::class, 'redirectToKeycloak']);
Route::get('/auth/keycloak/callback', [AuthController::class, 'handleKeycloakCallback']);