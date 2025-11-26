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
                'parent:id,name,email',
                'child:id,first_name,last_name,age',
                'activity:id,name',
                'timeSlot:id,date,time_from,time_to'
            ])
            ->orderBy('created_at', 'desc');

        // Filter po statusu ako je poslat
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reservations = $query->get();

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
            ->with([
                'parent:id,name,email',
                'child:id,first_name,last_name,age,medical_restrictions',
                'activity:id,name,description,price',
                'timeSlot:id,date,time_from,time_to,capacity,booked',
                'timeSlot.location:id,name,address,city'
            ])
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
            ->firstOrFail();

        // Može se odobriti samo pending rezervacija
        if ($reservation->status !== 'pending') {
            return response()->json([
                'message' => 'Samo pending rezervacije mogu biti odobrene'
            ], 422);
        }

        // Odobri rezervaciju
        $reservation->update(['status' => 'confirmed']);

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
            ->with('timeSlot')
            ->firstOrFail();

        // Može se odbiti samo pending rezervacija
        if ($reservation->status !== 'pending') {
            return response()->json([
                'message' => 'Samo pending rezervacije mogu biti odbijene'
            ], 422);
        }

        // Odbij rezervaciju
        $reservation->update(['status' => 'rejected']);

        // Smanji booked broj u time slot
        $reservation->timeSlot->decrement('booked');

        return response()->json([
            'message' => 'Rezervacija odbijena',
            'reservation' => $reservation
        ]);
    }
}
