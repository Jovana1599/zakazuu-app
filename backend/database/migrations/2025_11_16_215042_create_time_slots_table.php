<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
     public function up(): void
      {
          Schema::create('time_slots', function (Blueprint $table) {
              $table->id();
              $table->unsignedBigInteger('activity_id');
              $table->unsignedBigInteger('institution_user_id');
              $table->unsignedBigInteger('location_id');
              $table->date('date');
              $table->string('time_from');
              $table->string('time_to');
              $table->boolean('available')->default(true);
              $table->integer('capacity')->default(1);
              $table->integer('booked')->default(0);
              $table->timestamps();
          });
      }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_slots');
    }
};
