<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $table = 'applications';
   protected $fillable = ['student_id', 'internship_offer_id', 'cv_path', 'lettre_motivation_path', 'message', 'statut'];
    public function student() { return $this->belongsTo(Student::class); }
    public function offer() { return $this->belongsTo(InternshipOffer::class, 'internship_offer_id'); }
    public function convention() { return $this->hasOne(Convention::class); }
}
