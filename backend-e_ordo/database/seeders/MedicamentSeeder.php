<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medicament;
use League\Csv\Reader;

class MedicamentSeeder extends Seeder
{
    public function run()
    {
        // Charger le fichier CSV
        $csv = Reader::createFromPath(storage_path('app/medicaments.csv'), 'r');
        $csv->setHeaderOffset(0); // Utiliser la première ligne comme en-tête
        
        // Boucler sur chaque ligne du CSV et insérer dans la base de données
        foreach ($csv as $record) {
            Medicament::create([
                'nom_commercial' => $record['nom_commercial'],
                'nom_dci' => $record['nom_dci'],
                'forme' => $record['forme'],
                'dosage' => $record['dosage'],
            ]);
        }
    }
}
