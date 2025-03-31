<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medecin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // ✅ Inscription d'un médecin
    public function register(Request $request)
    {
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:medecins',
            'specialite' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:medecins',
            'password' => 'required|string|min:6|confirmed',
            'telephone' => 'required|string|max:20',
            'adresse' => 'required|string|max:255',
        ]);

        $medecin = Medecin::create([
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'username' => $request->username,
            'specialite' => $request->specialite,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telephone' => $request->telephone,
            'adresse' => $request->adresse,
        ]);

        return response()->json(['message' => 'Inscription réussie', 'medecin' => $medecin], 201);
    }

    // ✅ Connexion d'un médecin
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    $medecin = Medecin::where('email', $request->email)->first();

    if (!$medecin || !Hash::check($request->password, $medecin->password)) {
        return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
    }

    // Supprimer les anciens tokens pour éviter les conflits
    $medecin->tokens()->delete();

    // Générer un nouveau token avec Sanctum
    $token = $medecin->createToken('authToken')->plainTextToken;

    return response()->json([
        'message' => 'Connexion réussie',
        'medecin' => $medecin,
        'token' => $token,
    ]);
}


    // ✅ Déconnexion d'un médecin
    public function logout(Request $request)
{
    $request->user()->tokens()->delete();
    return response()->json(['message' => 'Déconnexion réussie !']);
}

}
