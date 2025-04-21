<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ordonnances', function (Blueprint $table) {
            // 1) Supprime d'abord la contrainte étrangère
            $table->dropForeign(['patient_id']);
            // 2) Supprime la colonne bigInteger
            $table->dropColumn('patient_id');
            // 3) Crée-la en string, pour matcher `patients.num_dossier`
            $table->string('patient_id');
            // 4) Ré-ajoute la clé étrangère sur la colonne string
            $table->foreign('patient_id')
                  ->references('num_dossier')
                  ->on('patients')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('ordonnances', function (Blueprint $table) {
            $table->dropForeign(['patient_id']);
            $table->dropColumn('patient_id');
            $table->foreignId('patient_id')
                  ->constrained('patients', 'num_dossier')
                  ->onDelete('cascade');
        });
    }
};
