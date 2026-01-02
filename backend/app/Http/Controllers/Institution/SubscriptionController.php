<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\InstitutionSubscription;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    /**
     * Prikaz trenutne članarine ustanove
     * GET /api/institution/subscription
     */
    public function current()
    {
        $subscription = InstitutionSubscription::with('membership')
            ->where('institution_user_id', auth()->id())
            ->where('status', 'active')
            ->first();

        return response()->json([
            'subscription' => $subscription,
            'has_active_subscription' => $subscription && $subscription->isActive()
        ]);
    }

    /**
     * Prikaz svih dostupnih paketa članarina
     * GET /api/institution/memberships
     */
    public function memberships()
    {
        $memberships = Membership::active()
            ->orderBy('price', 'asc')
            ->get();

        return response()->json([
            'memberships' => $memberships
        ]);
    }

    /**
     * Pretplata na paket članarine
     * POST /api/institution/subscription/subscribe
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'membership_id' => 'required|exists:memberships,id',
            'payment_reference' => 'nullable|string|max:255'
        ]);

        $membership = Membership::findOrFail($validated['membership_id']);

        // Proveri da li vec ima aktivnu pretplatu
        $existingSubscription = InstitutionSubscription::where('institution_user_id', auth()->id())
            ->where('status', 'active')
            ->first();

        if ($existingSubscription) {
            return response()->json([
                'message' => 'Već imate aktivnu članarinu. Sačekajte da istekne ili je otkažite.'
            ], 400);
        }

        // Kreiraj novu pretplatu
        $subscription = InstitutionSubscription::create([
            'institution_user_id' => auth()->id(),
            'membership_id' => $membership->id,
            'status' => 'active',
            'started_at' => Carbon::now(),
            'ends_at' => Carbon::now()->addDays($membership->duration_days),
            'payment_reference' => $validated['payment_reference'] ?? null,
            'auto_renew' => false
        ]);

        $subscription->load('membership');

        return response()->json([
            'message' => 'Uspešno ste se pretplatili na paket ' . $membership->name,
            'subscription' => $subscription
        ], 201);
    }

    /**
     * Otkazivanje članarine
     * POST /api/institution/subscription/cancel
     */
    public function cancel()
    {
        $subscription = InstitutionSubscription::where('institution_user_id', auth()->id())
            ->where('status', 'active')
            ->first();

        if (!$subscription) {
            return response()->json([
                'message' => 'Nemate aktivnu članarinu'
            ], 404);
        }

        $subscription->update([
            'status' => 'cancelled',
            'auto_renew' => false
        ]);

        return response()->json([
            'message' => 'Članarina je uspešno otkazana. Možete koristiti usluge do ' . $subscription->ends_at->format('d.m.Y')
        ]);
    }

    /**
     * Prikaz statistike korišćenja
     * GET /api/institution/subscription/usage
     */
    public function usage()
    {
        $user = auth()->user();
        $subscription = $user->subscription;

        if (!$subscription) {
            return response()->json([
                'message' => 'Nemate aktivnu članarinu',
                'usage' => null
            ]);
        }

        $subscription->load('membership');

        $activityCount = $user->activities()->count();
        $maxActivities = $subscription->membership->max_activities;

        return response()->json([
            'usage' => [
                'activities_used' => $activityCount,
                'activities_limit' => $maxActivities,
                'activities_remaining' => max(0, $maxActivities - $activityCount),
                'percentage_used' => $maxActivities > 0 ? round(($activityCount / $maxActivities) * 100, 1) : 0,
                'days_remaining' => $subscription->daysRemaining(),
                'expires_at' => $subscription->ends_at
            ]
        ]);
    }

    /**
     * Istorija članarina
     * GET /api/institution/subscription/history
     */
    public function history()
    {
        $subscriptions = InstitutionSubscription::with('membership')
            ->where('institution_user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'subscriptions' => $subscriptions
        ]);
    }
}
