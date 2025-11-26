<?php

  namespace App\Models;

  // use Illuminate\Contracts\Auth\MustVerifyEmail;
  use Illuminate\Database\Eloquent\Factories\HasFactory;
  use Illuminate\Foundation\Auth\User as Authenticatable;
  use Illuminate\Notifications\Notifiable;
  use Laravel\Sanctum\HasApiTokens;

  class User extends Authenticatable
  {
      use HasApiTokens, HasFactory, Notifiable;

      protected $fillable = [
          'name',
          'email',
          'password',
          'role_as', 
      ];

      protected $hidden = [
          'password',
          'remember_token',
      ];

      protected $casts = [
          'email_verified_at' => 'datetime',
          'password' => 'hashed',
      ];

      public function isAdmin()
      {
          return $this->role_as === 1;
      }

      public function isParent()
      {
          return $this->role_as === 0;
      }

      public function isInstitution()
      {
          return $this->role_as === 2;
      }

      // Relacije
      public function children()
      {
          return $this->hasMany(Child::class, 'parent_user_id');
      }

      public function activities()
      {
          return $this->hasMany(Activity::class, 'institution_user_id');
      }

      public function reservations()
      {
          return $this->hasMany(Reservation::class, 'parent_user_id');
      }

      public function reviews()
      {
          return $this->hasMany(Review::class, 'user_id');
      }

      public function receivedReviews()
      {
          return $this->hasMany(Review::class, 'institution_user_id');
      }
  
}
