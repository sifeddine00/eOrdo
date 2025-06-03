<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('medecins', function (Blueprint $table) {
            $table->string('nom_ar')->nullable();
            $table->string('prenom_ar')->nullable();
            $table->string('specialite_ar')->nullable();
            $table->text('adresse_ar')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medecins', function (Blueprint $table) {
            $table->dropColumn(['nom_ar', 'prenom_ar', 'specialite_ar', 'adresse_ar']);
        });
    }
};
