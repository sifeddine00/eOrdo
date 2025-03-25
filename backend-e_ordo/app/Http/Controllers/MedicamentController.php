<?php

namespace App\Http\Controllers;

use App\Models\Medicament;
use Illuminate\Http\Request;

class MedicamentController extends Controller
{
    // ✅ Récupérer tous les médicaments
    public function index() {
        $medicaments = Medicament::orderBy('nom_commercial', 'asc')->get();
        return response()->json($medicaments, 200);
    }

    // ✅ Ajouter un nouveau médicament
    public function store(Request $request) {
        $request->validate([
            'nom_commercial' => 'required|string|max:255',
            'nom_dci' => 'required|string|max:255',
            'forme' => 'required|string|max:255',
            'dosage' => 'required|string|max:255',
        ]);
        

        $medicament = Medicament::create([
            'nom_commercial' => $request->nom_commercial,
            'nom_dci' => $request->nom_dci,
            'forme' => $request->forme,
            'dosage' => $request->dosage,
        ]);

        return response()->json([
            'message' => 'Médicament ajouté avec succès',
            'data' => $medicament
        ], 201);
    }

    // ✅ Afficher un médicament par ID
    public function show($id) {
        $medicament = Medicament::find($id);
        if (!$medicament) {
            return response()->json(['message' => 'Médicament non trouvé'], 404);
        }
        return response()->json($medicament, 200);
    }

    // ✅ Mettre à jour un médicament
    public function update(Request $request, $id) {
        $medicament = Medicament::find($id);
        if (!$medicament) {
            return response()->json(['message' => 'Médicament non trouvé'], 404);
        }

        $request->validate([
            'nom_commercial' => 'string|max:255|unique:medicaments,nom_commercial,' . $id,
            'nom_dci' => 'string|max:255',
            'forme' => 'string|max:100',
            'dosage' => 'string|max:100',
        ]);

        $medicament->update($request->all());

        return response()->json([
            'message' => 'Médicament mis à jour avec succès',
            'data' => $medicament
        ], 200);
    }

    // ✅ Supprimer un médicament
    public function destroy($id) {
        $medicament = Medicament::find($id);
        if (!$medicament) {
            return response()->json(['message' => 'Médicament non trouvé'], 404);
        }

        $medicament->delete();

        return response()->json(['message' => 'Médicament supprimé avec succès'], 200);
    }
}
