<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuantitesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quantites = [
            ['valeur' => 1, 'unite' => 'BTE'],
            ['valeur' => 2, 'unite' => 'BTES'],
            ['valeur' => 3, 'unite' => 'BTES'],
            ['valeur' => 4, 'unite' => 'BTES'],
            ['valeur' => 5, 'unite' => 'BTES'],
            ['valeur' => 1, 'unite' => 'FLS'],
            ['valeur' => 2, 'unite' => 'FLC'],
            ['valeur' => 3, 'unite' => 'FLC'],
            ['valeur' => 4, 'unite' => 'FLC'],
            ['valeur' => 5, 'unite' => 'FLC'],
            ['valeur' => 1, 'unite' => 'TUBE'],
            ['valeur' => 2, 'unite' => 'TUBE'],
            ['valeur' => 3, 'unite' => 'TUBE'],
            ['valeur' => 4, 'unite' => 'TUBE'],
            ['valeur' => 5, 'unite' => 'TUBE'],
            ['valeur' => 3, 'unite' => 'QSP J'],
            ['valeur' => 5, 'unite' => 'QSP J'],
            ['valeur' => 7, 'unite' => 'QSP J'],
        ];

        DB::table('quantites')->insert($quantites);
    }
}
