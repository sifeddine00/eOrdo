<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PosologiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posologies = [
            ['frequence' => '1 GEL X 2/J', 'moment_prise' => ''],
            ['frequence' => '1 GEL', 'moment_prise' => 'LE MATIN'],
            ['frequence' => '1 GEL', 'moment_prise' => 'LE SOIR'],
            ['frequence' => '1 GEL', 'moment_prise' => 'APRES'],
            ['frequence' => '1 GEL', 'moment_prise' => '/SEMAINE'],
            ['frequence' => '1 SC /J', 'moment_prise' => ''],
            ['frequence' => '1 SC X2/J', 'moment_prise' => ''],
            ['frequence' => '1 SC X3/J', 'moment_prise' => ''],
            ['frequence' => '1 SC', 'moment_prise' => 'LE MATIN'],
            ['frequence' => '1 SC', 'moment_prise' => 'LE SOIR'],
        ];

        DB::table('posologies')->insert($posologies);
    }
}
