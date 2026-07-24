<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = ['user_id', 'matricule', 'filiere', 'niveau', 'telephone'];

    public function user() { return $this->belongsTo(User::class); }
    public function applications() { return $this->hasMany(Application::class); }
}
