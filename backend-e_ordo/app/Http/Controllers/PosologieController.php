<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Posologie;
use Illuminate\Support\Facades\Log;

class PosologieController extends Controller
{
    public function index()
    {
        return response()->json(Posologie::all());
    }
    
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'frequence' => 'required|string|max:100',
                'moment_prise' => 'required|string|max:100',
            ]);
            
            $posologie = Posologie::create([
                'frequence' => $validated['frequence'],
                'moment_prise' => $validated['moment_prise'],
            ]);
            
            return response()->json($posologie, 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'ajout de la posologie : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de l\'ajout de la posologie.'], 500);
        }
    }
}
