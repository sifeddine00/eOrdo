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
        Schema::create('ordonnances', function (Blueprint $table) {
            $table->id();
            $table->date('date_visite');
            $table->foreignId('medecin_id')->constrained('medecins')->onDelete('cascade');
            $table->string('patient_id');
            $table->foreign('patient_id')->references('num_dossier')->on('patients')->onDelete('cascade');
            $table->timestamps();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('ordonnances');
    }
};
