<?php
 
 use Illuminate\Database\Migrations\Migration;
 use Illuminate\Database\Schema\Blueprint;
 use Illuminate\Support\Facades\Schema;
 
 return new class extends Migration
 {
     public function up(): void
     {
         Schema::create('berita_acaras', function (Blueprint $table) {
             $table->id();
             $table->foreignId('opd_id')->constrained();
             $table->foreignId('periode_id')->constrained();
             $table->string('nomor_ba')->nullable();
             $table->date('tanggal_ba')->nullable();
             $table->text('kesimpulan')->nullable();
             $table->string('file_ba')->nullable();
             $table->timestamps();
         });
 
         Schema::create('rekomendasis', function (Blueprint $table) {
             $table->id();
             $table->foreignId('opd_id')->constrained();
             $table->foreignId('periode_id')->constrained();
             $table->foreignId('indikator_id')->constrained();
             $table->enum('prioritas', ['tinggi', 'sedang', 'rendah'])->default('sedang');
             $table->text('saran_perbaikan');
             $table->enum('status', ['open', 'closed'])->default('open');
             $table->timestamps();
         });
 
         Schema::create('notifikasis', function (Blueprint $table) {
             $table->id();
             $table->foreignId('user_id')->constrained();
             $table->string('judul');
             $table->text('pesan');
             $table->boolean('is_read')->default(false);
             $table->string('link')->nullable();
             $table->timestamps();
         });
 
         Schema::create('log_aktivitass', function (Blueprint $table) {
             $table->id();
             $table->foreignId('user_id')->constrained();
             $table->string('aktivitas');
             $table->string('keterangan')->nullable();
             $table->string('ip_address')->nullable();
             $table->timestamps();
         });
     }
 
     public function down(): void
     {
         Schema::dropIfExists('log_aktivitass');
         Schema::dropIfExists('notifikasis');
         Schema::dropIfExists('rekomendasis');
         Schema::dropIfExists('berita_acaras');
     }
 };
