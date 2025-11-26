<?php 
 
 namespace App\Models;

  use Illuminate\Database\Eloquent\Factories\HasFactory;
  use Illuminate\Database\Eloquent\Model;

 class Reservation extends Model
  {
      use HasFactory;

      protected $fillable = [
          'parent_user_id',
          'child_id',
          'time_slot_id',
          'activity_id',
          'institution_user_id',
          'status',
          'note'
      ];

      // Relacija: Rezervacija pripada roditelju
      public function parent()
      {
          return $this->belongsTo(User::class, 'parent_user_id');
      }

      // Relacija: Rezervacija je za dete
      public function child()
      {
          return $this->belongsTo(Child::class, 'child_id');
      }

      // Relacija: Rezervacija je za aktivnost
      public function activity()
      {
          return $this->belongsTo(Activity::class, 'activity_id');
      }

      // Relacija: Rezervacija je za ustanovu
      public function institution()
      {
          return $this->belongsTo(User::class, 'institution_user_id');
      }

      // Relacija: Rezervacija ima time slot
      public function timeSlot()
      {
          return $this->belongsTo(TimeSlot::class, 'time_slot_id');
      }
  }