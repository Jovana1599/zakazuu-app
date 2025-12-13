<?php


namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with(['institution:id,name,email']);

        // Filter po kategoriji
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter po gradu (preko lokacija)
        if ($request->has('city')) {
            $query->whereHas('timeSlots.location', function ($q) use ($request) {
                $q->where('city', 'like', '%' . $request->city . '%');
            });
        }

        // Filter po godinama
        if ($request->has('age')) {
            $age = (int) $request->age;
            $query->where('age_from', '<=', $age)
                ->where('age_to', '>=', $age);
        }

        // Filter po maximalnoj ceni
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

        $activities = $query->get();

        // Dodaj prosečnu ocenu za svaku aktivnost (na osnovu recenzija institucije)
        $institutionIds = $activities->pluck('institution_user_id')->unique();

        $ratings = Review::select('institution_user_id', DB::raw('AVG(rating) as avg_rating'), DB::raw('COUNT(*) as review_count'))
            ->whereIn('institution_user_id', $institutionIds)
            ->where('approved', true)
            ->groupBy('institution_user_id')
            ->get()
            ->keyBy('institution_user_id');

        $activities = $activities->map(function ($activity) use ($ratings) {
            $rating = $ratings->get($activity->institution_user_id);
            $activity->rating = $rating ? round($rating->avg_rating, 1) : null;
            $activity->review_count = $rating ? $rating->review_count : 0;
            return $activity;
        });

        // Randomizuj redosled aktivnosti
        $activities = $activities->shuffle();

        return response()->json([
            'activities' => $activities->values()
        ]);
    }
    public function show($id)
    {
        $activity = Activity::with([
            'institution:id,name,email,phone,description,website', // Podaci ustanove
            'timeSlots' => function ($query) {
                // Samo buduće termine koji su dostupni
                $query->where('date', '>=', now()->format('Y-m-d'))
                    ->where('available', true)
                    ->whereRaw('booked < capacity')
                    ->orderBy('date', 'asc')
                    ->orderBy('time_from', 'asc');
            },
            'timeSlots.location:id,address,city' // Lokacije termina
        ])->findOrFail($id);

        // Dodaj prosečnu ocenu institucije
        $rating = Review::where('institution_user_id', $activity->institution_user_id)
            ->where('approved', true)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->first();

        $activity->rating = $rating->avg_rating ? round($rating->avg_rating, 1) : null;
        $activity->review_count = $rating->review_count ?? 0;

        return response()->json([
            'activity' => $activity
        ]);
    }
}
