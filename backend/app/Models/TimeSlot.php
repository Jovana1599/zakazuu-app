<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class TimeSlot extends Model
{
    use HasFactory;

   protected $fillable = [
          'activity_id',
          'institution_user_id',
          'location_id',
          'date',
          'time_from',
          'time_to',
          'available',
          'capacity',
          'booked'
      ];
     protected $casts = [
          'date' => 'date',
          'available' => 'boolean',
      ];

      // Relacija: Time slot pripada aktivnosti
      public function activity()
      {
          return $this->belongsTo(Activity::class, 'activity_id');
      }

      // Relacija: Time slot pripada ustanovi
      public function institution()
      {
          return $this->belongsTo(User::class, 'institution_user_id');
      }

      // Relacija: Time slot je na lokaciji
      public function location()
      {
          return $this->belongsTo(Location::class, 'location_id');
      }

      // Relacija: Time slot ima rezervacije
      public function reservations()
      {
          return $this->hasMany(Reservation::class, 'time_slot_id');
      }

      // Helper metoda: Provera da li je slot dostupan
      public function isAvailable()
      {
          return $this->available && $this->booked < $this->capacity;
      }
  }
