<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Prikaz svih lokacija ustanove
     * GET /api/institution/locations
     */
    public function index()
    {
        $locations = Location::where('institution_user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'locations' => $locations
        ]);
    }


    /**
     * Kreiranje nove lokacije
     * POST /api/institution/locations
     */
    public function store(Request $request)
    {
        // Validacija
        $validated = $request->validate([
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255'
        ]);

        // Kreiraj lokaciju
        $location = Location::create([
            'institution_user_id' => auth()->id(),
            'address' => $validated['address'],
            'city' => $validated['city']
        ]);

        return response()->json([
            'message' => 'Lokacija uspešno kreirana',
            'location' => $location
        ], 201);
    }
    /**
     * Prikaz jedne lokacije
     * GET /api/institution/locations/{id}
     */
    public function show($id)
    {
        $location = Location::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->firstOrFail();

        return response()->json([
            'location' => $location
        ]);
    }

    /**
     * Izmena lokacije
     * PUT /api/institution/locations/{id}
     */
    public function update(Request $request, $id)
    {
        // Pronađi lokaciju koja pripada ovoj ustanovi
        $location = Location::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->firstOrFail();

        // Validacija
        $validated = $request->validate([
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255'
        ]);

        // Ažuriraj lokaciju
        $location->update($validated);

        return response()->json([
            'message' => 'Lokacija uspešno ažurirana',
            'location' => $location
        ]);
    }

    /**
     * Brisanje lokacije
     * DELETE /api/institution/locations/{id}
     */
    public function destroy($id)
    {
        // Pronađi lokaciju koja pripada ovoj ustanovi
        $location = Location::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->firstOrFail();

        $location->delete();

        return response()->json([
            'message' => "Lokacija uspešno obrisana"
        ]);
    }
}
