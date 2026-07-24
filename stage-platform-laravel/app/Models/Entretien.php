<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entretien extends Model
{
    protected $fillable = [
        'application_id',
        'date',
        'heure',
        'mode',
        'lieu',
        'lien_visio',
        'statut',
        'decision',
        'commentaire',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}