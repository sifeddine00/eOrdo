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
}

