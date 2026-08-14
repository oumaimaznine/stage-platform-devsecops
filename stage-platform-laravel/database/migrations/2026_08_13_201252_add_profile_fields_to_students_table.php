<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Présentation
            $table->string('photo_path')->nullable()->after('telephone');
            $table->text('bio')->nullable()->after('photo_path');

            // Formation
            $table->string('specialite')->nullable()->after('filiere');

            // CV & compétences
            $table->string('cv_path')->nullable()->after('bio');
            $table->text('competences')->nullable()->after('cv_path');
            $table->json('cv_extracted')->nullable()->after('competences');
            $table->json('langues')->nullable()->after('cv_extracted');

            // Préférences (utiles pour le matching)
            $table->string('secteur_prefere')->nullable()->after('langues');
            $table->string('localisation_preferee')->nullable()->after('secteur_prefere');
            $table->enum('type_stage_prefere', ['stage_ete', 'pfe', 'stage_observation'])
                  ->nullable()->after('localisation_preferee');
            $table->date('disponibilite_date')->nullable()->after('type_stage_prefere');

            // Liens externes
            $table->string('linkedin_url')->nullable()->after('disponibilite_date');
            $table->string('github_url')->nullable()->after('linkedin_url');
            $table->string('portfolio_url')->nullable()->after('github_url');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'photo_path', 'bio', 'specialite', 'cv_path', 'competences',
                'cv_extracted', 'langues', 'secteur_prefere', 'localisation_preferee',
                'type_stage_prefere', 'disponibilite_date', 'linkedin_url',
                'github_url', 'portfolio_url',
            ]);
        });
    }
};