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
         Schema::create('children', function (Blueprint $table) {
              $table->id();
              $table->unsignedBigInteger('parent_user_id');
              $table->string('first_name');
              $table->string('last_name');
              $table->integer('age');
              $table->text('medical_restrictions')->nullable();
              $table->text('note')->nullable();
              $table->timestamps();
          });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('children');
    }
};
