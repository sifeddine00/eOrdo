<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;

class PatientController extends Controller
{
    // Récupérer la liste des patients
    public function index()
    {
        return response()->json(Patient::all());
    }

    // Ajouter un patient
    public function store(Request $request)
{
    $validated = $request->validate([
        'num_dossier' => 'required|unique:patients',
        'nom' => 'required',
        'prenom' => 'required',
        'téléphone' => 'required',
        'adresse' => 'required',
        'genre' => 'required',
        'profession' => 'required',
        'status_familiale' => 'required',
        'groupe_sanguin' => 'required',
        'email' => 'required|email|unique:patients', // Validation de l'email
        'date_naissance' => 'required|date', // Validation de la date de naissance
        'allergies' => 'nullable',
        'note' => 'nullable',
    ]);

    Patient::create($validated);
    return response()->json(['message' => 'Patient enregistré avec succès !']);
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
