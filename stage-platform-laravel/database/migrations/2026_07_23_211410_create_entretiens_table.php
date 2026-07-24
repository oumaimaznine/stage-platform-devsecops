<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entretiens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->cascadeOnDelete();
            $table->date('date');
            $table->time('heure');
            $table->enum('mode', ['presentiel', 'visio']);
            $table->string('lieu')->nullable();
            $table->string('lien_visio')->nullable();
            $table->enum('statut', ['en_attente', 'planifie', 'reporte', 'termine', 'annule'])
                  ->default('en_attente');
            $table->enum('decision', ['retenu', 'refuse', 'en_attente'])->default('en_attente');
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entretiens');
    }
};