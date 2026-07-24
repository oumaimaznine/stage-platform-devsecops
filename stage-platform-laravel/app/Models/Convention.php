<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convention extends Model
{
    protected $fillable = ['application_id', 'fichier_path', 'date_signature', 'statut', 'commentaire_admin'];

    public function application() { return $this->belongsTo(Application::class); }
    public function reports() { return $this->hasMany(Report::class); }
}
