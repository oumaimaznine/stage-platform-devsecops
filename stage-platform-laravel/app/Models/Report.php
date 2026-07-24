<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['convention_id', 'titre', 'fichier_path', 'statut', 'commentaire'];

    public function convention() { return $this->belongsTo(Convention::class); }
}
