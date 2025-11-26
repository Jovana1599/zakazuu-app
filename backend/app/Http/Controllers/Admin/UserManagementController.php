<?php

namespace App\Http\Controllers\Admin;

  use App\Http\Controllers\Controller;
  use App\Models\User;
  use App\Models\Review;
  use Illuminate\Http\Request;

 class UserManagementController extends Controller
  {
      /**
       * Lista svih korisnika
       */
      public function index(Request $request)
      {
          // Možeš filtrirati po ulozi
          $query = User::query();

          if ($request->has('role')) {
              $query->where('role_as', $request->role);
          }

          $users = $query->orderBy('created_at', 'desc')->get();

          return response()->json([
              'users' => $users
          ]);
      }

      /**
       * Detalji jednog korisnika
       */
      public function show($id)
      {
          $user = User::findOrFail($id);

          $data = [
              'id' => $user->id,
              'name' => $user->name,
              'email' => $user->email,
              'role_as' => $user->role_as,
              'created_at' => $user->created_at,
          ];

          // Ako je roditelj, dodaj decu
          if ($user->isParent()) {
              $data['children'] = $user->children;
              $data['reservations_count'] = $user->reservations()->count();
          }

          // Ako je ustanova, dodaj aktivnosti
          if ($user->isInstitution()) {
              $data['activities'] = $user->activities;
              $data['received_reviews_count'] = $user->receivedReviews()->count();
          }

          return response()->json($data);
      }

      /**
       * Ažuriranje korisnika
       */
      public function update(Request $request, $id)
      {
          $user = User::findOrFail($id);

          $validated = $request->validate([
              'name' => 'sometimes|string|max:255',
              'email' => 'sometimes|email|unique:users,email,' . $id,
              'role_as' => 'sometimes|integer|in:0,1,2',
          ]);

          $user->update($validated);

          return response()->json([
              'message' => 'User updated successfully',
              'user' => $user
          ]);
      }

      /**
       * Brisanje korisnika
       */
      public function destroy($id)
      {
          $user = User::findOrFail($id);

          // Spreči admina da obriše samog sebe
          if ($user->id === auth()->id()) {
              return response()->json([
                  'message' => 'You cannot delete yourself'
              ], 403);
          }

          // Opciono: Proveri da li je poslednji admin
          if ($user->isAdmin()) {
              $adminCount = User::where('role_as', 1)->count();
              if ($adminCount <= 1) {
                  return response()->json([
                      'message' => 'Cannot delete the last admin'
                  ], 403);
              }
          }

          $userName = $user->name;
          $user->delete();

          return response()->json([
              'message' => "User '{$userName}' deleted successfully"
          ]);
      }

      /**
       * Brisanje recenzije
       */
      public function deleteReview($id)
      {
          $review = Review::findOrFail($id);

          $review->delete();

          return response()->json([
              'message' => 'Review deleted successfully'
          ]);
      }

      /**
       * Lista svih recenzija (za moderaciju)
       */
      public function getAllReviews()
      {
          $reviews = Review::with(['user', 'institution'])
              ->orderBy('created_at', 'desc')
              ->get();

          return response()->json([
              'reviews' => $reviews
          ]);
      }
  }
