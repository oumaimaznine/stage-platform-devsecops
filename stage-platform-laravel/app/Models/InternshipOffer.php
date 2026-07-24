<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InternshipOffer extends Model
{
    protected $fillable = ['company_id', 'titre', 'description', 'competences_requises', 'date_debut', 'date_fin', 'type', 'statut'];

    public function company() { return $this->belongsTo(Company::class); }
    public function applications() { return $this->hasMany(Application::class); }
}
