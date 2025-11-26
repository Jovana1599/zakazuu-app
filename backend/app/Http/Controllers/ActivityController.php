<?php


namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with(['institution:id,name,email']);
        //filter po godinama 
        if ($request->has('age')) {
            $age = (int) $request->age;
            $query->where('min_age', '<=', $age)
                ->where('max_age', '>=', $age);
        }
        //filter po maximalnoj ceni
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter po minimalnoj ceni
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        // Pretraga po imenu aktivnosti
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $activities = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'activities' => $activities
        ]);
    }

    public function show($id)
    { {
            $activity = Activity::with([
                'institution:id,name,email', // Podaci ustanove
                'timeSlots' => function ($query) {
                    // Samo buduće termine koji su dostupni
                    $query->where('date', '>=', now()->format('Y-m-d'))
                        ->where('available', true)
                        ->whereRaw('booked < capacity')
                        ->orderBy('date', 'asc')
                        ->orderBy('time_from', 'asc');
                },
                'timeSlots.location:id,name,address,city' // Lokacije termina
            ])->findOrFail($id);

            return response()->json([
                'activity' => $activity
            ]);
        }
    }
}
