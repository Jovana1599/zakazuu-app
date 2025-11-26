<?php 
 
 namespace App\Models;

  use Illuminate\Database\Eloquent\Factories\HasFactory;
  use Illuminate\Database\Eloquent\Model;

  class Child extends Model
  {
      use HasFactory;

      protected $table = 'children';

      protected $fillable = [
          'parent_user_id',
          'first_name',
          'last_name',
          'age',
          'medical_restrictions',
          'note'
      ];

      // Relacija: Dete pripada roditelju
      public function parent()
      {
          return $this->belongsTo(User::class, 'parent_user_id');
      }

      // Relacija: Dete ima više rezervacija
      public function reservations()
      {
          return $this->hasMany(Reservation::class, 'child_id');
      }
  }