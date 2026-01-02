<?php

namespace App\Http\Controllers\Institution;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Prikaz svih recenzija za ustanovu
     * GET /api/institution/reviews
     */
    public function index()
    {
        $reviews = Review::where('institution_user_id', auth()->id())
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'reviews' => $reviews
        ]);
    }

    /**
     * Prikaz jedne recenzije
     * GET /api/institution/reviews/{id}
     */
    public function show($id)
    {
        $review = Review::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->with('user:id,name')
            ->firstOrFail();

        return response()->json([
            'review' => $review
        ]);
    }

    /**
     * Odgovor institucije na recenziju
     * POST /api/institution/reviews/{id}/respond
     */
    public function respond(Request $request, $id)
    {
        $review = Review::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->firstOrFail();

        $validated = $request->validate([
            'institution_response' => 'required|string|max:1000'
        ]);

        $review->update([
            'institution_response' => $validated['institution_response'],
            'responded_at' => now()
        ]);

        $review->load('user:id,name');

        return response()->json([
            'message' => 'Odgovor uspešno dodat',
            'review' => $review
        ]);
    }

    /**
     * Izmena odgovora institucije
     * PUT /api/institution/reviews/{id}/respond
     */
    public function updateResponse(Request $request, $id)
    {
        $review = Review::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->whereNotNull('institution_response')
            ->firstOrFail();

        $validated = $request->validate([
            'institution_response' => 'required|string|max:1000'
        ]);

        $review->update([
            'institution_response' => $validated['institution_response'],
            'responded_at' => now()
        ]);

        return response()->json([
            'message' => 'Odgovor uspešno ažuriran',
            'review' => $review
        ]);
    }

    /**
     * Brisanje odgovora institucije
     * DELETE /api/institution/reviews/{id}/respond
     */
    public function deleteResponse($id)
    {
        $review = Review::where('id', $id)
            ->where('institution_user_id', auth()->id())
            ->whereNotNull('institution_response')
            ->firstOrFail();

        $review->update([
            'institution_response' => null,
            'responded_at' => null
        ]);

        return response()->json([
            'message' => 'Odgovor uspešno obrisan'
        ]);
    }
}
