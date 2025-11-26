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
          'date',
          'approved'
      ];
      // Relacija: Aktivnost pripada ustanovi
      public function user()
      {
          return $this->belongsTo(User::class, 'user_id');
      }

      // Relacija: Recenzija za ustanovu
      public function institution()
      {
          return $this->belongsTo(User::class, 'institution_user_id');
      }
  }


  