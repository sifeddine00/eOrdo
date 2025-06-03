<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ordonnance;
use App\Models\DetailOrdonnance;
use App\Models\Patient;
use Illuminate\Support\Facades\Log;

class OrdonnanceController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,num_dossier',
                'date_visite' => 'required|date',
                'diagnostic' => 'nullable|string',
                'medecin_id' => 'required|exists:medecins,id',
                'medicaments' => 'required|array',
                'medicaments.*.medicament_id' => 'required|exists:medicaments,id',
                'medicaments.*.quantite_id' => 'required|exists:quantites,id',
                'medicaments.*.posologie_id' => 'required|exists:posologies,id',
            ]);

            // Créer une nouvelle ordonnance
            $ordonnance = Ordonnance::create([
                'medecin_id' => $validated['medecin_id'],
                'patient_id' => $validated['patient_id'],
                'date_visite' => $validated['date_visite'],
                'diagnostic' => $validated['diagnostic'] ?? null,
            ]);

            // Ajouter les détails de l'ordonnance
            foreach ($validated['medicaments'] as $medicament) {
                DetailOrdonnance::create([
                    'ordonnance_id' => $ordonnance->id,
                    'medicament_id' => $medicament['medicament_id'],
                    'quantite_id' => $medicament['quantite_id'],
                    'posologie_id' => $medicament['posologie_id'],
                ]);
            }

            return response()->json(['message' => 'Ordonnance enregistrée avec succès.'], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'enregistrement de l\'ordonnance : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de l\'enregistrement de l\'ordonnance.'], 500);
        }
    }

    public function getHistoriqueOrdonnances($num_dossier)
    {
        $patient = Patient::where('num_dossier', $num_dossier)->firstOrFail();
        $ordonnances = $patient->ordonnances()->with('medecin', 'details.medicament', 'details.quantite', 'details.posologie')->get();

        return response()->json($ordonnances);
    }
    public function update(Request $request, $id)
{
    try {
        $validated = $request->validate([
            'date_visite' => 'required|date',
            'diagnostic' => 'nullable|string',
            'medecin_id' => 'required|exists:medecins,id',
            'medicaments' => 'required|array',
            'medicaments.*.medicament_id' => 'required|exists:medicaments,id',
            'medicaments.*.quantite_id' => 'required|exists:quantites,id',
            'medicaments.*.posologie_id' => 'required|exists:posologies,id',
        ]);

        $ordonnance = Ordonnance::findOrFail($id);
        $ordonnance->update([
            'date_visite' => $validated['date_visite'],
            'diagnostic' => $validated['diagnostic'] ?? $ordonnance->diagnostic,
            'medecin_id' => $validated['medecin_id'],
        ]);

        // Supprimer les anciens détails
        $ordonnance->details()->delete();

        // Ajouter les nouveaux détails
        foreach ($validated['medicaments'] as $medicament) {
            DetailOrdonnance::create([
                'ordonnance_id' => $ordonnance->id,
                'medicament_id' => $medicament['medicament_id'],
                'quantite_id' => $medicament['quantite_id'],
                'posologie_id' => $medicament['posologie_id'],
            ]);
        }

        return response()->json(['message' => 'Ordonnance mise à jour avec succès.']);
    } catch (\Exception $e) {
        Log::error('Erreur lors de la mise à jour de l\'ordonnance : ' . $e->getMessage());
        return response()->json(['message' => 'Erreur lors de la mise à jour de l\'ordonnance.'], 500);
    }
}
public function destroy($id)
{
    try {
        $ordonnance = Ordonnance::findOrFail($id);

        // Supprimer les détails associés
        $ordonnance->details()->delete();

        // Supprimer l'ordonnance
        $ordonnance->delete();

        return response()->json(['message' => 'Ordonnance supprimée avec succès.']);
    } catch (\Exception $e) {
        Log::error('Erreur lors de la suppression de l\'ordonnance : ' . $e->getMessage());
        return response()->json(['message' => 'Erreur lors de la suppression de l\'ordonnance.'], 500);
    }
}

public function show($id)
{
    try {
        // Récupérer l'ordonnance avec ses relations
        $ordonnance = Ordonnance::with(['medecin', 'patient', 'details.medicament', 'details.quantite', 'details.posologie'])
            ->findOrFail($id);

        // Reformater les données pour correspondre à la structure attendue par le frontend
        $medicaments = [];
        foreach ($ordonnance->details as $detail) {
            $medicaments[] = [
                'medicament_id' => $detail->medicament_id,
                'quantite_id' => $detail->quantite_id,
                'posologie_id' => $detail->posologie_id,
                // Inclure les objets complets pour faciliter l'affichage côté frontend
                'medicament' => $detail->medicament,
                'quantite' => $detail->quantite,
                'posologie' => $detail->posologie
            ];
        }

        // Préparer la réponse
        $response = [
            'id' => $ordonnance->id,
            'patient_id' => $ordonnance->patient_id,
            'medecin_id' => $ordonnance->medecin_id,
            'date_visite' => $ordonnance->date_visite,
            'diagnostic' => $ordonnance->diagnostic,
            'created_at' => $ordonnance->created_at,
            'updated_at' => $ordonnance->updated_at,
            'patient' => $ordonnance->patient,
            'medecin' => $ordonnance->medecin,
            'medicaments' => $medicaments
        ];

        return response()->json($response);
    } catch (\Exception $e) {
        Log::error('Erreur lors de la récupération de l\'ordonnance : ' . $e->getMessage());
        return response()->json(['message' => 'Erreur lors de la récupération de l\'ordonnance.'], 500);
    }
}

}


