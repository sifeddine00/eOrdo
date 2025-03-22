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
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
