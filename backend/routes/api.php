<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Parent\ChildController;
use App\Http\Controllers\Parent\ReservationController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Institution\ActivityController as InstitutionActivityController;
use App\Http\Controllers\Institution\ReservationController as InstitutionReservationController;
use App\Http\Controllers\Institution\ReviewController as InstitutionReviewController;
use App\Http\Controllers\Institution\LocationController;
use App\Http\Controllers\Institution\TimeSlotController;
use App\Http\Controllers\Parent\ReviewController;
use App\Http\Controllers\Institution\SubscriptionController;
use App\Http\Controllers\Admin\MembershipController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/me', [AuthController::class, 'me']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
  Route::get('/users', [UserManagementController::class, 'index']);
  Route::get('/users/{id}', [UserManagementController::class, 'show']);
  Route::put('/users/{id}', [UserManagementController::class, 'update']);
  Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);

  Route::get('/reviews', [UserManagementController::class, 'getAllReviews']);
  Route::delete('/reviews/{id}', [UserManagementController::class, 'deleteReview']);

  Route::get('/memberships', [MembershipController::class, 'index']);
  Route::post('/memberships', [MembershipController::class, 'store']);
  Route::get('/memberships/{id}', [MembershipController::class, 'show']);
  Route::put('/memberships/{id}', [MembershipController::class, 'update']);
  Route::delete('/memberships/{id}', [MembershipController::class, 'destroy']);
  Route::get('/subscriptions', [MembershipController::class, 'subscriptions']);
});

Route::middleware('auth:sanctum')->prefix('parent')->group(function () {
  Route::get('/children', [ChildController::class, 'index']);
  Route::post('/children', [ChildController::class, 'store']);
  Route::get('/children/{id}', [ChildController::class, 'show']);
  Route::put('/children/{id}', [ChildController::class, 'update']);
  Route::delete('/children/{id}', [ChildController::class, 'destroy']);

  Route::post('/reservations', [ReservationController::class, 'store']);
  Route::get('/reservations', [ReservationController::class, 'index']);
  Route::get('/reservations/{id}', [ReservationController::class, 'show']);
  Route::get('/reservations/{id}', [ReservationController::class, 'cancel']);

  Route::get('/reviews', [ReviewController::class, 'index']);
  Route::post('/reviews', [ReviewController::class, 'store']);
  Route::put('/reviews/{id}', [ReviewController::class, 'update']);
  Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
});

Route::get('/activities', [ActivityController::class, 'index']);
Route::get('/activities/{id}', [ActivityController::class, 'show']);
Route::get('/institutions/{institutionId}/reviews', [ReviewController::class, 'getInstitutionReviews']);

Route::middleware(['auth:sanctum', 'institution'])->prefix('institution')->group(function () {
  Route::get('/activities', [InstitutionActivityController::class, 'index']);
  Route::post('/activities', [InstitutionActivityController::class, 'store']);
  Route::get('/activities/{id}', [InstitutionActivityController::class, 'show']);
  Route::put('/activities/{id}', [InstitutionActivityController::class, 'update']);
  Route::delete('/activities/{id}', [InstitutionActivityController::class, 'destroy']);

  Route::get('/locations', [LocationController::class, 'index']);
  Route::post('/locations', [LocationController::class, 'store']);
  Route::get('/locations/{id}', [LocationController::class, 'show']);
  Route::put('/locations/{id}', [LocationController::class, 'update']);
  Route::delete('/locations/{id}', [LocationController::class, 'destroy']);

  Route::get('/time-slots', [TimeSlotController::class, 'index']);
  Route::post('/time-slots', [TimeSlotController::class, 'store']);
  Route::get('/time-slots/{id}', [TimeSlotController::class, 'show']);
  Route::put('/time-slots/{id}', [TimeSlotController::class, 'update']);
  Route::delete('/time-slots/{id}', [TimeSlotController::class, 'destroy']);

  Route::get('/reservations', [InstitutionReservationController::class, 'index']);
  Route::get('/reservations/{id}', [InstitutionReservationController::class, 'show']);
  Route::post('/reservations/{id}/approve', [InstitutionReservationController::class, 'approve']);
  Route::post('/reservations/{id}/reject', [InstitutionReservationController::class, 'reject']);

  Route::get('/reviews', [InstitutionReviewController::class, 'index']);
  Route::get('/reviews/{id}', [InstitutionReviewController::class, 'show']);
  Route::post('/reviews/{id}/respond', [InstitutionReviewController::class, 'respond']);
  Route::put('/reviews/{id}/respond', [InstitutionReviewController::class, 'updateResponse']);
  Route::delete('/reviews/{id}/respond', [InstitutionReviewController::class, 'deleteResponse']);

  Route::get('/subscription', [SubscriptionController::class, 'current']);
  Route::get('/memberships', [SubscriptionController::class, 'memberships']);
  Route::post('/subscription/subscribe', [SubscriptionController::class, 'subscribe']);
  Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel']);
  Route::get('/subscription/usage', [SubscriptionController::class, 'usage']);
  Route::get('/subscription/history', [SubscriptionController::class, 'history']);
});
