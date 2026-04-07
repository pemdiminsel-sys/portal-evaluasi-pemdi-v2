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
        Schema::create('opds', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 200)->index();
            $table->string('singkatan', 50)->nullable();
            $table->text('alamat')->nullable();
            $table->string('kepala_opd', 100)->nullable();
            $table->string('pic', 100)->nullable();
            $table->string('kontak', 50)->nullable();
            $table->enum('status_penilaian', ['not_started', 'in_progress', 'completed'])->default('not_started')->index();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opds');
    }
};
