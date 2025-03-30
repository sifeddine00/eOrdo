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
    $ordonnance = Ordonnance::create([
        'date_visite' => $request->date_visite,
        'medecin_id' => $request->medecin_id,
        'patient_id' => $request->patient_id
    ]);

    foreach ($request->details as $detail) {
        DetailOrdonnance::create([
            'ordonnance_id' => $ordonnance->id,
            'medicament_id' => $detail['medicament_id'],
            'quantite_id' => $detail['quantite_id'],
            'posologie_id' => $detail['posologie_id']
        ]);
    }

    return response()->json(['message' => 'Ordonnance enregistrée avec succès !'], 201);
}


}
