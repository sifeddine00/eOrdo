<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ordonnance;
use App\Models\DetailOrdonnance;

class OrdonnanceController extends Controller
{
    //

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'medicaments' => 'required|array',
        ]);
    
        $ordonnance = new Ordonnance();
        $ordonnance->patient_id = $request->patient_id;
        $ordonnance->user_id = $request->user()->id; // Associe au médecin connecté
        $ordonnance->save();
    
        foreach ($request->medicaments as $medicament) {
            $ordonnance->medicaments()->attach($medicament['id'], [
                'quantite' => $medicament['quantite'],
                'posologie' => $medicament['posologie']
            ]);
        }
    
        return response()->json(['message' => 'Ordonnance enregistrée'], 201);
    }
    


}
