<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('patients', function (Blueprint $table) {
        $table->string('num_dossier')->primary();
        $table->string('nom');
        $table->string('prenom');
        $table->string('téléphone');
        $table->string('adresse');
        $table->string('genre');
        $table->string('profession');
        $table->string('status_familiale');
        $table->string('allergies')->nullable();
        $table->text('note')->nullable();
        $table->string('groupe_sanguin');
        $table->string('email')->unique(); // Ajouter le champ email avec la contrainte unique
        $table->date('date_naissance'); // Ajouter le champ date de naissance
        $table->timestamps();
        $table->foreignId('medecin_id')->constrained('medecins')->onDelete('cascade');

    });
}

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
