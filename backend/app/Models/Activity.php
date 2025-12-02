<?php

namespace App\Models;

use App\Models\User;
use App\Models\TimeSlot;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'institution_user_id',
        'name',
        'description',
        'category',
        'age_from',
        'age_to',
        'price',
        'image_url'
    ];

    // Relacija ka ustanovi (User model)
    public function institution()
    {
        return $this->belongsTo(User::class, 'institution_user_id');
    }

    // Relacija ka terminima
    public function timeSlots()
    {
        return $this->hasMany(TimeSlot::class, 'activity_id');
    }

    // Relacija ka rezervacijama
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'activity_id');
    }
}
