<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Prikaz svih rezervacija ustanove
     * GET /api/institution/reservations
     */
    public function index(Request $request)
    {
        $query = Reservation::where('institution_user_id', auth()->id())
            ->with([
                'child:id,first_name,last_name,age',
                'activity:id,name',
                'timeSlot',
                'parent:id,name,email'
            ]);

        // Filter po statusu ako je prosleđen
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reservations = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'reservations' => $reservations
        ]);
    }

    /**
     * Prikaz jedne rezervacije
     * GET /api/institution/reservations/{id}
     */
    public function show($id)
    {
        $reservation = Reservation::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->with(['child', 'activity', 'timeSlot', 'parent:id,name,email'])
            ->firstOrFail();

        return response()->json([
            'reservation' => $reservation
        ]);
    }

    /**
     * Odobravanje rezervacije
     * POST /api/institution/reservations/{id}/approve
     */
    public function approve($id)
    {
        $reservation = Reservation::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->where('status', 'pending')
            ->firstOrFail();

        $reservation->update(['status' => 'confirmed']);

        $reservation->load([
            'child:id,first_name,last_name',
            'activity:id,name',
            'timeSlot'
        ]);

        return response()->json([
            'message' => 'Rezervacija uspešno odobrena',
            'reservation' => $reservation
        ]);
    }

    /**
     * Odbijanje rezervacije
     * POST /api/institution/reservations/{id}/reject
     */
    public function reject($id)
    {
        $reservation = Reservation::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->where('status', 'pending')
            ->firstOrFail();

        $reservation->update(['status' => 'rejected']);

        // Oslobodi mesto u time slotu
        if ($reservation->timeSlot) {
            $reservation->timeSlot->decrement('booked');
        }

        $reservation->load([
            'child:id,first_name,last_name',
            'activity:id,name',
            'timeSlot'
        ]);

        return response()->json([
            'message' => 'Rezervacija odbijena',
            'reservation' => $reservation
        ]);
    }
}
