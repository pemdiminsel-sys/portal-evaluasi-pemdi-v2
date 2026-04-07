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
        Schema::create('penilaians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indikator_id')->constrained('indikators');
            $table->foreignId('opd_id')->constrained('opds');
            $table->foreignId('periode_id')->constrained('periodes');
            $table->tinyInteger('jenis')->comment('1=Mandiri,2=Dokumen,3=Interviu,4=Visitasi,5=Akhir');
            $table->decimal('nilai', 3, 2)->nullable();
            $table->text('penjelasan')->nullable();
            $table->tinyInteger('status')->default(0)->comment('0=Draft,1=Submitted,2=Verified,3=Revision,4=Approved');
            $table->foreignId('dinilai_oleh')->nullable()->constrained('users');
            $table->timestamps();
            
            $table->index(['indikator_id', 'opd_id', 'periode_id'], 'idx_penilaian_full');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penilaians');
    }
};
