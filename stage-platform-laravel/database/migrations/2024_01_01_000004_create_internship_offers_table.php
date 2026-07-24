<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('internship_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->string('competences_requises')->nullable();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->enum('type', ['stage_ete', 'pfe', 'stage_observation'])->default('pfe');
            $table->enum('statut', ['ouverte', 'fermee', 'en_attente_validation'])->default('en_attente_validation');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('internship_offers'); }
};
