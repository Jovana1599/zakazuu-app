<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\TimeSlot;
use App\Models\Activity;
use App\Models\Location;
use Illuminate\Http\Request;

class TimeSlotController extends Controller
{
    /**
     * Prikaz svih termina ustanove
     * GET /api/institution/time-slots
     */
    public function index()
    {
        $timeSlots = TimeSlot::where('institution_user_id', auth()->id())
            ->with(['activity:id,name', 'location:id,address,city'])
            ->orderBy('date', 'desc')
            ->orderBy('time_from', 'asc')
            ->get();

        return response()->json([
            'time_slots' => $timeSlots
        ]);
    }

    /**
     * Kreiranje novog termina
     * POST /api/institution/time-slots
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'activity_id' => 'required|integer|exists:activities,id',
            'location_id' => 'required|integer|exists:locations,id',
            'date' => 'required|date|after_or_equal:today',
            'time_from' => 'required|string',
            'time_to' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'available' => 'sometimes|boolean'
        ]);

        $activity = Activity::where('id', $validated['activity_id'])
            ->where('institution_user_id', auth()->id())
            ->firstOrFail();

        $location = Location::where('id', $validated['location_id'])
            ->where('institution_user_id', auth()->id())
            ->firstOrFail();

        $timeSlot = TimeSlot::create([
            'activity_id' => $validated['activity_id'],
            'institution_user_id' => auth()->id(),
            'location_id' => $validated['location_id'],
            'date' => $validated['date'],
            'time_from' => $validated['time_from'],
            'time_to' => $validated['time_to'],
            'capacity' => $validated['capacity'],
            'available' => $validated['available'] ?? true,
            'booked' => 0
        ]);

        $timeSlot->load(['activity:id,name', 'location:id,address,city']);

        return response()->json([
            'message' => 'Termin uspešno kreiran',
            'time_slot' => $timeSlot
        ], 201);
    }

    /**
     * Prikaz jednog termina
     * GET /api/institution/time-slots/{id}
     */
    public function show($id)
    {
        $timeSlot = TimeSlot::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->with(['activity:id,name', 'location:id,address,city', 'reservations'])
            ->firstOrFail();

        return response()->json([
            'time_slot' => $timeSlot
        ]);
    }

    /**
     * Izmena termina
     * PUT /api/institution/time-slots/{id}
     */
    public function update(Request $request, $id)
    {
        $timeSlot = TimeSlot::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->firstOrFail();

        $validated = $request->validate([
            'activity_id' => 'sometimes|integer|exists:activities,id',
            'location_id' => 'sometimes|integer|exists:locations,id',
            'date' => 'sometimes|date|after_or_equal:today',
            'time_from' => 'sometimes|string',
            'time_to' => 'sometimes|string',
            'capacity' => 'sometimes|integer|min:1',
            'available' => 'sometimes|boolean'
        ]);

        if (isset($validated['activity_id'])) {
            Activity::where('id', $validated['activity_id'])
                ->where('institution_user_id', auth()->id())
                ->firstOrFail();
        }

        if (isset($validated['location_id'])) {
            Location::where('id', $validated['location_id'])
                ->where('institution_user_id', auth()->id())
                ->firstOrFail();
        }

        $timeSlot->update($validated);
        $timeSlot->load(['activity:id,name', 'location:id,address,city']);

        return response()->json([
            'message' => 'Termin uspešno ažuriran',
            'time_slot' => $timeSlot
        ]);
    }

    /**
     * Brisanje termina
     * DELETE /api/institution/time-slots/{id}
     */
    public function destroy($id)
    {
        $timeSlot = TimeSlot::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->firstOrFail();

        $timeSlot->delete();

        return response()->json([
            'message' => 'Termin uspešno obrisan'
        ]);
    }
}
