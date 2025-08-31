<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('medicaments', function (Blueprint $table) {
            $table->id();
            $table->string('nom_commercial');
            $table->string('nom_dci');
            $table->string('forme');
            $table->string('dosage');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('medicaments');
    }
};
