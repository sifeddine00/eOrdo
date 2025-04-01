<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use Illuminate\Validation\ValidationException;

class PatientController extends Controller
{
    // Récupérer la liste des patients
    public function index(Request $request)
{
    $medecin = $request->user(); // Vérifie si le médecin est authentifié
    if (!$medecin) {
        return response()->json(['message' => 'Non autorisé'], 401);
    }

    $patients = Patient::where('medecin_id', $medecin->id)->get();
    return response()->json($patients);
}

    
    // Ajouter un patient
    public function store(Request $request)
{
    $medecin = auth()->user();
    
    $request->validate([
        'num_dossier' => 'required|unique:patients,num_dossier',
        'nom' => 'required',
        'prenom' => 'required',
        'téléphone' => 'required',
        'adresse' => 'required',
        'email' => 'required|email|unique:patients,email',
        'date_naissance' => 'required|date',
        'genre' => 'required',
        'profession' => 'required',
        'status_familiale' => 'required',
        'groupe_sanguin' => 'required',
    ]);

    $patient = new Patient($request->all());
    $patient->medecin_id = $medecin->id; // Assigner au médecin connecté
    $patient->save();

    return response()->json(["message" => "Patient ajouté avec succès"], 201);
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
