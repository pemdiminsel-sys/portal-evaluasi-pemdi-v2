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
        Schema::create('opd_indikators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('opd_id')->constrained('opds')->onDelete('cascade');
            $table->foreignId('indikator_id')->constrained('indikators')->onDelete('cascade');
            $table->boolean('is_responsibility')->default(true);
            $table->timestamps();
            
            // Unique constraint untuk mencegah duplikat
            $table->unique(['opd_id', 'indikator_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opd_indikators');
    }
};
