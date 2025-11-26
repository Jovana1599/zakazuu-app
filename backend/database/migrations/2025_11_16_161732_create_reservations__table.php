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
      Schema::create('reservations', function (Blueprint $table) {
          $table->id();
          $table->unsignedBigInteger('parent_user_id');
          $table->unsignedBigInteger('child_id');
          $table->unsignedBigInteger('time_slot_id');
          $table->unsignedBigInteger('activity_id');
          $table->unsignedBigInteger('institution_user_id');
          $table->string('status')->default('pending');
          $table->text('note')->nullable();
          $table->timestamps();
      });
      }



    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
