<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('internship_offer_id')->constrained()->onDelete('cascade');
            $table->string('cv_path')->nullable();
            $table->string('lettre_motivation_path')->nullable();
            $table->enum('statut', ['en_attente', 'acceptee', 'refusee'])->default('en_attente');
            $table->timestamps();
            $table->unique(['student_id', 'internship_offer_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('applications'); }
};
