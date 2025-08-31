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
        Schema::table('ordonnances', function (Blueprint $table) {
            $table->text('diagnostic')->nullable()->after('date_visite');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ordonnances', function (Blueprint $table) {
            $table->dropColumn('diagnostic');
        });
    }
};
