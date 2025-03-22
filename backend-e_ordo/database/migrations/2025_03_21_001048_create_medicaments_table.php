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
    Schema::create('medicaments', function (Blueprint $table) {
        $table->id();
        $table->string('nom');
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('medicaments');
    }
};
