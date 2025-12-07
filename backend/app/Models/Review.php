<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'institution_user_id',
        'rating',
        'comment',
        'institution_response',
        'responded_at',
        'date',
        'approved'
    ];

    protected $casts = [
        'date' => 'datetime',
        'responded_at' => 'datetime',
        'approved' => 'boolean',
    ];

    // Relacija: Recenzija pripada roditelju
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relacija: Recenzija za ustanovu
    public function institution()
    {
        return $this->belongsTo(User::class, 'institution_user_id');
    }

    // Helper: Da li ima odgovor institucije
    public function hasResponse(): bool
    {
        return !is_null($this->institution_response);
    }
}
