<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\TimeSlot;
use App\Models\Child;
use App\Models\Activity;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;



class ReservationController extends Controller
{

    public function index()
    {


        $reservations = Reservation::where('parent_user_id', auth()->id())->with([
            'child:id,first_name,last_name,age',
            'activity:id,name,category,price',
            'timeSlot:id,activity_id,date,time_from,time_to',
            'timeSlot.location:id,name,address,city',
            'institution:id,name'
        ])->orderBy('created_at', 'desc')->get();
        return response()->json($reservations);
    }

    public function show($id)
    {
        $reservation = Reservation::with([
            'child:id,first_name,last_name,age,medical_restrictions',
            'activity:id,name,description,category,price',
            'timeSlot:id,activity_id,date,time_from,time_to',
            'timeSlot.location:id,name,address,city',
            'institution:id,name,email,phone'
        ])
            ->where('id', $id)
            ->where('parent_user_id', auth()->id())
            ->firstOrFail();

        return response()->json($reservation);
    }

    public function cancel($id)
    {
        DB::beginTransaction();

        try {
            $reservation = Reservation::with('timeSlot')
                ->where('id', $id)
                ->where('parent_user_id', auth()->id())
                ->lockForUpdate()
                ->firstOrFail();

            // Može se otkazati samo pending ili confirmed
            if (!in_array($reservation->status, ['pending', 'confirmed'])) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Ne možete otkazati ovu rezervaciju.'
                ], 422);
            }

            // Otkaži rezervaciju
            $reservation->update(['status' => 'cancelled']);

            // Smanji booked
            $reservation->timeSlot->decrement('booked');

            DB::commit();

            return response()->json([
                'message' => 'Rezervacija uspešno otkazana.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Greška pri otkazivanju.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Kreira novu rezervaciju za dete roditelja
     *
     * POST /parent/reservations
     */
    public function store(Request $request)
    {
        // Validacija ulaznih podataka
        $validated = $request->validate([
            'child_id' => 'required|integer|exists:children,id',
            'activity_id' => 'required|integer|exists:activities,id',
            'time_slot_id' => 'required|integer|exists:time_slots,id',
            'note' => 'nullable|string|max:1000',
        ]);

        // Provera da li dete pripada roditelju
        $child = Child::where('id', $validated['child_id'])
            ->where('parent_user_id', auth()->id())
            ->firstOrFail();

        // Učitaj aktivnost i time slot
        $activity = Activity::findOrFail($validated['activity_id']);

        DB::beginTransaction();

        try {
            // Zakljucaj time slot (race condition zaštita)
            $timeSlot = TimeSlot::where('id', $validated['time_slot_id'])
                ->lockForUpdate()
                ->firstOrFail();

            // Provera da li ima mesta
            if ($timeSlot->booked >= $timeSlot->capacity) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Ovaj termin je popunjen.'
                ], 422);
            }

            // Kreiranje rezervacije
            $reservation = Reservation::create([
                'parent_user_id' => auth()->id(),
                'child_id' => $validated['child_id'],
                'activity_id' => $validated['activity_id'],
                'time_slot_id' => $validated['time_slot_id'],
                'institution_user_id' => $activity->institution_user_id,
                'status' => 'pending',
                'note' => $validated['note'] ?? null,
            ]);

            // Povećaj broj rezervacija
            $timeSlot->increment('booked');

            DB::commit();

            // Učitaj relacije za odgovor
            $reservation->load([
                'child:id,first_name,last_name,age',
                'activity:id,name,category,price',
                'timeSlot:id,date,time_from,time_to,capacity,booked',
                'timeSlot.location:id,name,address,city',
                'institution:id,name,email'
            ]);

            return response()->json([
                'message' => 'Rezervacija uspešno kreirana!',
                'reservation' => $reservation
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Greška pri kreiranju rezervacije.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
