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
        Schema::create('buktis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indikator_id')->constrained('indikators');
            $table->foreignId('opd_id')->constrained('opds');
            $table->foreignId('periode_id')->constrained('periodes');
            $table->string('nama_file');
            $table->integer('ukuran');
            $table->string('tipe', 50);
            $table->string('file_id')->comment('Google Drive file ID');
            $table->string('link', 500);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['indikator_id', 'opd_id', 'periode_id'], 'idx_bukti_full');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buktis');
    }
};
