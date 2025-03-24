<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use Illuminate\Validation\ValidationException;

class PatientController extends Controller
{
    // Récupérer la liste des patients
    public function index()
    {
        return response()->json(Patient::all());
    }

    // Ajouter un patient
    public function store(Request $request) // Pas besoin de 'use' en double ici
    {
        try {
            // Validation des données
            $validatedData = $request->validate([
                'num_dossier' => 'required|unique:patients,num_dossier',
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'téléphone' => 'required|string|max:20',
                'adresse' => 'required|string|max:255',
                'genre' => 'required|in:Homme,Femme',
                'profession' => 'required|string|max:255',
                'status_familiale' => 'required|string|max:255',
                'allergies' => 'nullable|string|max:255',
                'note' => 'nullable|string',
                'groupe_sanguin' => 'required|string|max:3',
                'email' => 'required|email|unique:patients,email',
                'date_naissance' => 'required|date',
            ]);
    
            // Création du patient
            $patient = Patient::create($request->all());
    
            return response()->json([
                'message' => 'Patient ajouté avec succès !',
                'patient' => $patient
            ], 201);
    
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur serveur, veuillez réessayer.'], 500);
        }
    }

    // Afficher un patient spécifique
    public function show($num_dossier)
    {
        $patient = Patient::where('num_dossier', $num_dossier)->first();
        if (!$patient) {
            return response()->json(['message' => 'Patient non trouvé'], 404);
        }
        return response()->json($patient);
    }

    // Mettre à jour un patient
    public function update(Request $request, $num_dossier)
    {
        $patient = Patient::where('num_dossier', $num_dossier)->first();
        if (!$patient) {
            return response()->json(['message' => 'Patient non trouvé'], 404);
        }

        $validated = $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'téléphone' => 'required',
            'adresse' => 'required',
            'genre' => 'required',
            'profession' => 'required',
            'status_familiale' => 'required',
            'groupe_sanguin' => 'required',
            'allergies' => 'nullable',
            'note' => 'nullable',
            'date_naissance' => 'required|date',
        ]);

        $patient->update($validated);
        return response()->json(['message' => 'Patient mis à jour avec succès !']);
    }

    // Supprimer un patient
    public function destroy($num_dossier)
    {
        $patient = Patient::where('num_dossier', $num_dossier)->first();
        if (!$patient) {
            return response()->json(['message' => 'Patient non trouvé'], 404);
        }

        $patient->delete();
        return response()->json(['message' => 'Patient supprimé avec succès !']);
    }
}
