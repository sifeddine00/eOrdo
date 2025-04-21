<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ordonnance;
use App\Models\DetailOrdonnance;        
use Illuminate\Support\Facades\Log;
class OrdonnanceController extends Controller
{
    //

   

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,num_dossier',
                'date_visite' => 'required|date',
                'medicaments' => 'required|array',
                'medicaments.*.id' => 'required|exists:medicaments,id',
                'medicaments.*.quantite_id' => 'required|exists:quantites,id',
                'medicaments.*.posologie_id' => 'required|exists:posologies,id',
            ]);
    
            $ordonnance = Ordonnance::create([
                'medecin_id' => $request->user()->id,
                'patient_id' => $validated['patient_id'],
                'date_visite' => $validated['date_visite'],
            ]);
    
            foreach ($validated['medicaments'] as $medicament) {
                DetailOrdonnance::create([
                    'ordonnance_id' => $ordonnance->id,
                    'medicament_id' => $medicament['id'],
                    'quantite_id' => $medicament['quantite_id'],
                    'posologie_id' => $medicament['posologie_id'],
                ]);
            }
    
            return response()->json(['message' => 'Ordonnance enregistrée avec succès.'], 201);
    
        } catch (\Exception $e) {
            Log::error('Erreur ordonnance : '.$e->getMessage());
            return response()->json(['message' => 'Erreur lors de l\'enregistrement de l\'ordonnance.'], 500);
        }
    }
    



}
