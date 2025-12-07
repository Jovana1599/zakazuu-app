<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'institution_user_id',
        'address',
        'city',
    ];

    // Relacija: Lokacija pripada ustanovi
    public function institution()
    {
        return $this->belongsTo(User::class, 'institution_user_id');
    }

    // Relacija: Lokacija ima time slotove
    public function timeSlots()
    {
        return $this->hasMany(TimeSlot::class, 'location_id');
    }
}
