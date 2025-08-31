<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Envoi d'un email de réinitialisation de mot de passe
     */
    public function sendResetLink(Request $request)
    {
        // Validation de l'email
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Envoi du lien de réinitialisation
        $status = Password::sendResetLink($request->only('email'));

        // Message en fonction du statut de l'envoi
        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Un email de réinitialisation a été envoyé !'], 200)
            : response()->json(['message' => 'Erreur lors de l\'envoi du lien de réinitialisation.'], 422);
    }

    /**
     * Réinitialisation du mot de passe
     */
    public function resetPassword(Request $request)
    {
        // Validation des champs
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed|regex:/[A-Za-z]/|regex:/[0-9]/',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Erreur de validation', 'errors' => $validator->errors()], 422);
        }

        // Tenter de réinitialiser le mot de passe
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Mot de passe réinitialisé avec succès !'], 200)
            : response()->json(['message' => 'Le token est invalide ou expiré.'], 422);
    }
}
