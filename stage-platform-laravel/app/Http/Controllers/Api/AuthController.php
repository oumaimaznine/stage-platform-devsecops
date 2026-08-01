<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Laravel\Socialite\Facades\Socialite;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'role' => ['required', Rule::in(['etudiant', 'entreprise'])],
        ]);
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);
        if ($data['role'] === 'etudiant') {
            Student::create([
                'user_id' => $user->id,
                'matricule' => 'ETU-' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
                'filiere' => $request->input('filiere', ''),
                'niveau' => $request->input('niveau', ''),
            ]);
        } elseif ($data['role'] === 'entreprise') {
            Company::create([
                'user_id' => $user->id,
                'nom' => $request->input('nom_entreprise', $data['name']),
            ]);
        }
        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token], 201);
    }
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }
        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Deconnecte']);
    }
    public function me(Request $request)
    {
        return response()->json($request->user()->load(['student', 'company']));
    }
    public function redirectToKeycloak()
    {
        return Socialite::driver('keycloak')->redirect();
    }
    public function handleKeycloakCallback(Request $request)
    {
        $keycloakUser = Socialite::driver('keycloak')->user();

        $user = User::where('email', $keycloakUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'name' => $keycloakUser->getName() ?? $keycloakUser->getNickname() ?? $keycloakUser->getEmail(),
                'email' => $keycloakUser->getEmail(),
                'password' => Hash::make(Str::random(32)),
                'role' => 'etudiant',
            ]);
            Student::create([
                'user_id' => $user->id,
                'matricule' => 'ETU-' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
                'filiere' => '',
                'niveau' => '',
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        $frontendUrl = 'http://stage-platform.local:5173/auth/callback';
        return redirect()->away($frontendUrl . '?token=' . $token);
    }
}