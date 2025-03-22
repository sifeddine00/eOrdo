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
    Schema::create('detail_ordonnances', function (Blueprint $table) {
        $table->id();
        $table->foreignId('ordonnance_id')->constrained('ordonnances')->onDelete('cascade');
        $table->foreignId('medicament_id')->constrained('medicaments')->onDelete('cascade');
        $table->foreignId('quantite_id')->constrained('quantites')->onDelete('cascade');
        $table->foreignId('posologie_id')->constrained('posologies')->onDelete('cascade');
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('detail_ordonnances');
    }
};
