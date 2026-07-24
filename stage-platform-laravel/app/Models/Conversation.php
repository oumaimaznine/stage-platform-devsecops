<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = ['student_id', 'company_id', 'internship_offer_id'];

    public function student() { return $this->belongsTo(Student::class); }
    public function company() { return $this->belongsTo(Company::class); }
    public function offer() { return $this->belongsTo(InternshipOffer::class, 'internship_offer_id'); }
    public function messages() { return $this->hasMany(Message::class)->orderBy('created_at'); }
    public function lastMessage() { return $this->hasOne(Message::class)->latestOfMany(); }
}