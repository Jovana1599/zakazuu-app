<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\InstitutionSubscription;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    /**
     * Prikaz svih paketa članarina
     * GET /api/admin/memberships
     */
    public function index()
    {
        $memberships = Membership::withCount('subscriptions')
            ->orderBy('price', 'asc')
            ->get();

        return response()->json([
            'memberships' => $memberships
        ]);
    }

    /**
     * Kreiranje novog paketa
     * POST /api/admin/memberships
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'max_activities' => 'required|integer|min:1',
            'max_time_slots_per_activity' => 'required|integer|min:1',
            'is_featured' => 'boolean',
            'is_active' => 'boolean'
        ]);

        $membership = Membership::create($validated);

        return response()->json([
            'message' => 'Paket članarine uspešno kreiran',
            'membership' => $membership
        ], 201);
    }

    /**
     * Prikaz jednog paketa
     * GET /api/admin/memberships/{id}
     */
    public function show($id)
    {
        $membership = Membership::withCount('subscriptions')->findOrFail($id);

        return response()->json([
            'membership' => $membership
        ]);
    }

    /**
     * Izmena paketa
     * PUT /api/admin/memberships/{id}
     */
    public function update(Request $request, $id)
    {
        $membership = Membership::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'duration_days' => 'sometimes|integer|min:1',
            'max_activities' => 'sometimes|integer|min:1',
            'max_time_slots_per_activity' => 'sometimes|integer|min:1',
            'is_featured' => 'boolean',
            'is_active' => 'boolean'
        ]);

        $membership->update($validated);

        return response()->json([
            'message' => 'Paket članarine uspešno ažuriran',
            'membership' => $membership
        ]);
    }

    /**
     * Brisanje paketa
     * DELETE /api/admin/memberships/{id}
     */
    public function destroy($id)
    {
        $membership = Membership::findOrFail($id);

        // Proveri da li ima aktivnih pretplata
        $activeSubscriptions = InstitutionSubscription::where('membership_id', $id)
            ->where('status', 'active')
            ->count();

        if ($activeSubscriptions > 0) {
            return response()->json([
                'message' => 'Ne možete obrisati paket koji ima aktivne pretplate'
            ], 400);
        }

        $membership->delete();

        return response()->json([
            'message' => 'Paket članarine uspešno obrisan'
        ]);
    }

    /**
     * Prikaz svih pretplata (za admin)
     * GET /api/admin/subscriptions
     */
    public function subscriptions(Request $request)
    {
        $query = InstitutionSubscription::with(['institution', 'membership']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $subscriptions = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'subscriptions' => $subscriptions
        ]);
    }
}
