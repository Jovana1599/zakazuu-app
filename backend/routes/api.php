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
use App\Http\Controllers\Institution\LocationController;
use App\Http\Controllers\Institution\TimeSlotController;
use App\Http\Controllers\Parent\ReviewController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Javne rute (bez autentifikacije)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Zaštićene rute (potrebna autentifikacija)
Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/me', [AuthController::class, 'me']);
});
// Admin rute (samo admini)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
  // Upravljanje korisnicima
  Route::get('/users', [UserManagementController::class, 'index']);
  Route::get('/users/{id}', [UserManagementController::class, 'show']);
  Route::put('/users/{id}', [UserManagementController::class, 'update']);
  Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);

  // Moderacija recenzija
  Route::get('/reviews', [UserManagementController::class, 'getAllReviews']);
  Route::delete('/reviews/{id}', [UserManagementController::class, 'deleteReview']);
});

// Parent rute (samo za roditelje)
Route::middleware('auth:sanctum')->prefix('parent')->group(function () {
  // Upravljanje decom
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

//Javne rute- Akticvnosti (dostupne su svima bez autentifikacije)
Route::get('/activities', [ActivityController::class, 'index']);
Route::get('/activities/{id}', [ActivityController::class, 'show']);
Route::get('/institutions/{institutionId}/reviews', [ReviewController::class, 'getInstitutionReviews']);


// Institution rute (samo za ustanove)
Route::middleware('auth:sanctum')->prefix('institution')->group(function () {
  // Upravljanje aktivnostima
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



  // Upravljanje rezervacijama
  Route::get('/reservations', [InstitutionReservationController::class, 'index']);
  Route::get('/reservations/{id}', [InstitutionReservationController::class, 'show']);
  Route::post('/reservations/{id}/approve', [InstitutionReservationController::class, 'approve']);
  Route::post('/reservations/{id}/reject', [InstitutionReservationController::class, 'reject']);
});
