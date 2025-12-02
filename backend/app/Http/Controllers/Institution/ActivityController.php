<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ActivityController extends Controller
{
    /**
     * Prikaz svih aktivnosti ustanove
     * GET /api/institution/activities
     */
    public function index()
    {
        $activities = Activity::where('institution_user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'activities' => $activities
        ]);
    }

    /**
     * Kreiranje nove aktivnosti
     * POST /api/institution/activities
     */
    public function store(Request $request)
    {
        // Validacija
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'age_from' => 'required|integer|min:0',
            'age_to' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        // Upload slike ako postoji
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('activities', 'public');
            $imagePath = '/storage/' . $imagePath;
        }

        // Kreiraj aktivnost
        $activity = Activity::create([
            'institution_user_id' => auth()->id(),
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'age_from' => $validated['age_from'],
            'age_to' => $validated['age_to'],
            'price' => $validated['price'],
            'image_url' => $imagePath
        ]);

        return response()->json([
            'message' => 'Aktivnost uspešno kreirana',
            'activity' => $activity
        ], 201);
    }

    /**
     * Prikaz jedne aktivnosti ustanove
     * GET /api/institution/activities/{id}
     */
    public function show($id)
    {
        $activity = Activity::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->with('timeSlots')
            ->firstOrFail();

        return response()->json([
            'activity' => $activity
        ]);
    }

    /**
     * Izmena aktivnosti
     * PUT /api/institution/activities/{id}
     */
    public function update(Request $request, $id)
    {
        // Pronađi aktivnost koja pripada ovoj ustanovi
        $activity = Activity::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->firstOrFail();

        // Validacija
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string|max:255',
            'age_from' => 'sometimes|integer|min:0',
            'age_to' => 'sometimes|integer|min:0',
            'price' => 'sometimes|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        // Upload nove slike ako postoji
        if ($request->hasFile('image')) {
            // Obriši staru sliku ako postoji
            if ($activity->image_url) {
                $oldPath = str_replace('/storage/', '', $activity->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $imagePath = $request->file('image')->store('activities', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        // Ukloni 'image' iz validated jer se čuva kao 'image_url'
        unset($validated['image']);

        // Ažuriraj aktivnost
        $activity->update($validated);

        return response()->json([
            'message' => 'Aktivnost uspešno ažurirana',
            'activity' => $activity
        ]);
    }

    /**
     * Brisanje aktivnosti
     * DELETE /api/institution/activities/{id}
     */
    public function destroy($id)
    {
        // Pronađi aktivnost koja pripada ovoj ustanovi
        $activity = Activity::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->firstOrFail();

        // Obriši sliku ako postoji
        if ($activity->image_url) {
            $imagePath = str_replace('/storage/', '', $activity->image_url);
            Storage::disk('public')->delete($imagePath);
        }

        $activityName = $activity->name;
        $activity->delete();

        return response()->json([
            'message' => "Aktivnost '{$activityName}' uspešno obrisana"
        ]);
    }
}
