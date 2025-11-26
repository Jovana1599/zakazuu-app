<?php

namespace App\Http\Controllers;
 use App\Models\User; 
use Illuminate\Http\Request;
  use Illuminate\Support\Facades\Hash; 
  use Illuminate\Validation\ValidationException;

  class AuthController extends Controller
  {
      /**
       * Registracija novog korisnika
       */
      public function register(Request $request)
      {
          $validated = $request->validate([
              'name' => 'required|string|max:255',
              'email' => 'required|string|email|max:255|unique:users',
              'password' => 'required|string|min:6|confirmed',
              'role_as' => 'required|integer|in:0,1,2', // 0=Parent, 1=Admin, 2=Institution
          ]);

          $user = User::create([
              'name' => $validated['name'],
              'email' => $validated['email'],
              'password' => bcrypt($validated['password']),
              'role_as' => $validated['role_as'],
          ]);

          $token = $user->createToken('auth_token')->plainTextToken;

          return response()->json([
              'message' => 'User registered successfully',
              'user' => $user,
              'access_token' => $token,
              'token_type' => 'Bearer',
          ], 201);
      }

      /**
       * Login korisnika
       */
      public function login(Request $request)
      {
          $request->validate([
              'email' => 'required|email',
              'password' => 'required',
          ]);

          $user = User::where('email', $request->email)->first();

          if (!$user || !Hash::check($request->password, $user->password)) {
              throw ValidationException::withMessages([
                  'email' => ['The provided credentials are incorrect.'],
              ]);
          }

          // Obriši stare tokene (opciono)
          $user->tokens()->delete();

          // Kreiraj novi token
          $token = $user->createToken('auth_token')->plainTextToken;

          return response()->json([
              'message' => 'Login successful',
              'user' => [
                  'id' => $user->id,
                  'name' => $user->name,
                  'email' => $user->email,
                  'role_as' => $user->role_as,
                  'role_name' => $this->getRoleName($user),
              ],
              'access_token' => $token,
              'token_type' => 'Bearer',
          ]);
      }

      /**
       * Logout korisnika
       */
      public function logout(Request $request)
      {
          $request->user()->tokens()->delete();

          return response()->json([
              'message' => 'Logged out successfully'
          ]);
      }

      /**
       * Vraća podatke trenutno ulogovanog korisnika
       */
      public function me(Request $request)
      {
          $user = $request->user();

          return response()->json([
              'user' => [
                  'id' => $user->id,
                  'name' => $user->name,
                  'email' => $user->email,
                  'role_as' => $user->role_as,
                  'role_name' => $this->getRoleName($user),
                  'is_admin' => $user->isAdmin(),
                  'is_parent' => $user->isParent(),
                  'is_institution' => $user->isInstitution(),
              ]
          ]);
      }

      /**
       * Helper metoda za ime role
       */
      private function getRoleName($user)
      {
          if ($user->isAdmin()) return 'Administrator';
          if ($user->isParent()) return 'Roditelj';
          if ($user->isInstitution()) return 'Radnik ustanove';
          return 'Unknown';
      }
  }

