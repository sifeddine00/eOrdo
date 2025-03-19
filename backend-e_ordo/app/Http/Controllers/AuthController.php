<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\HasApiTokens;
use App\Models\createToken;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request) {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'specialite' => 'required|string'
        ]);
    
        // Création de l'utilisateur
        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'specialite' => $request->specialite
        ]);
    
        return response()->json([
            'message' => 'Utilisateur enregistré avec succès',
            'user' => $user
        ], 201);
    }
    

    // Méthode pour la connexion (login)
    public function login(Request $request) {
        $credentials = $request->only('email', 'password');

        // Validation des données
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation error', 'messages' => $validator->errors()], 422);
        }

        // Tentative de connexion avec les identifiants
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('YourAppName')->plainTextToken;

            return response()->json([
                'message' => 'Connexion réussie',
                'token' => $token
            ], 200);
        }

        return response()->json([
            'error' => 'Identifiants incorrects'
        ], 401);
    }

    
}

