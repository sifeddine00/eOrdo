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
            'prenom' => 'required|string',
            'nom' => 'required|string',
            'username' => 'required|string|unique:medecins',
            'specialite' => 'required|string',
            'email' => 'required|string|email|unique:medecins',
            'password' => 'required|string|min:6',
            'telephone' => 'required|string',
            'adresse' => 'required|string',
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

        return response()->json(['message' => 'Inscription réussie !'], 201);
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
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

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
