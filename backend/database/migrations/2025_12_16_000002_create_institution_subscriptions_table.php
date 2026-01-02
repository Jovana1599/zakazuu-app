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
        Schema::create('institution_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('institution_user_id');
            $table->unsignedBigInteger('membership_id');
            $table->enum('status', ['active', 'inactive', 'expired', 'cancelled'])->default('inactive');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->string('payment_reference')->nullable();
            $table->boolean('auto_renew')->default(false);
            $table->timestamps();

            $table->foreign('institution_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('membership_id')->references('id')->on('memberships')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institution_subscriptions');
    }
};
