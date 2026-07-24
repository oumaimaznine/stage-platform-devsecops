<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = ['user_id', 'nom', 'secteur', 'adresse', 'telephone', 'site_web', 'valide'];

    public function user() { return $this->belongsTo(User::class); }
    public function offers() { return $this->hasMany(InternshipOffer::class); }
}
