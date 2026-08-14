<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'matricule',
        'filiere',
        'niveau',
        'telephone',
        'photo_path',
        'bio',
        'specialite',
        'cv_path',
        'competences',
        'cv_extracted',
        'langues',
        'secteur_prefere',
        'localisation_preferee',
        'type_stage_prefere',
        'disponibilite_date',
        'linkedin_url',
        'github_url',
        'portfolio_url',
    ];

    protected $casts = [
        'cv_extracted' => 'array',
        'langues' => 'array',
        'disponibilite_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}