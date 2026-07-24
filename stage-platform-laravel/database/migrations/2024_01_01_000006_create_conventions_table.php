<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('conventions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->onDelete('cascade');
            $table->string('fichier_path')->nullable();
            $table->date('date_signature')->nullable();
            $table->enum('statut', ['en_preparation', 'signee', 'validee_admin', 'rejetee'])->default('en_preparation');
            $table->text('commentaire_admin')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('conventions'); }
};
