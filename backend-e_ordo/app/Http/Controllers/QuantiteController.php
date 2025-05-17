<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quantite;
use Illuminate\Support\Facades\Log;

class QuantiteController extends Controller
{
    public function index()
    {
        return response()->json(Quantite::all());
    }
    
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'valeur' => 'required|string|max:50',
                'unite' => 'required|string|max:50',
            ]);
            
            $quantite = Quantite::create([
                'valeur' => $validated['valeur'],
                'unite' => $validated['unite'],
            ]);
            
            return response()->json($quantite, 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'ajout de la quantité : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de l\'ajout de la quantité.'], 500);
        }
    }
}
