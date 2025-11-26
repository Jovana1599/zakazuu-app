<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeader extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
          'name' => 'Admin',
          'email' => 'admin@test.com',
          'password' => bcrypt('password123'),
          'role_as' => 1, // Admin role
      ]);

      \App\Models\User::create([
          'name' => 'Roditelj Test',
          'email' => 'roditelj@test.com',
          'password' => bcrypt('password123'),
          'role_as' => 0, // Parent role
      ]);

      \App\Models\User::create([
          'name' => 'Ustanova Test',
          'email' => 'ustanova@test.com',
          'password' => bcrypt('password123'),
          'role_as' => 2, // Institution role
      ]);
    }
}
