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
        Schema::create('indikators', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 10)->unique();
            $table->string('nama', 200);
            $table->text('penjelasan')->nullable();
            $table->foreignId('aspek_id')->constrained('aspeks');
            $table->integer('bobot')->default(0);
            $table->integer('urutan');
            $table->text('kriteria_1')->nullable();
            $table->text('kriteria_2')->nullable();
            $table->text('kriteria_3')->nullable();
            $table->text('kriteria_4')->nullable();
            $table->text('kriteria_5')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indikators');
    }
};
