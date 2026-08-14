<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    protected $fillable = [
        'student_id',
        'internship_offer_id',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function internshipOffer(): BelongsTo
    {
        return $this->belongsTo(
            InternshipOffer::class,
            'internship_offer_id'
        );
    }
}