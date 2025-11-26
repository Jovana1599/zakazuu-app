<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;


class ReviewController extends Controller
{
    /**
     * Prikaz svih recenzija za ustanovu
     * GET /api/institutions/{institutionId}/reviews
     */
    public function getInstitutionReviews($institutionId)
    {
        // Proveri da li ustanova postoji
        $institution = User::where('id', $institutionId)
            ->where('role_as', 2)
            ->firstOrFail();

        // Učitaj sve recenzije za tu ustanovu
        $reviews = Review::where('institution_user_id', $institutionId)
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'institution' => [
                'id' => $institution->id,
                'name' => $institution->name
            ],
            'reviews' => $reviews
        ]);
    }

    /**
     * Prikaz svih recenzija trenutno ulogovanog roditelja
     * GET /api/parent/reviews
     */
    public function index()
    {
        $reviews = Review::where('user_id', auth()->id())
            ->with('institution:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'reviews' => $reviews
        ]);
    }

    /**
     * Kreiranje nove recenzije od strane roditelja
     * POST /api/parent/reviews
     */
    public function store(Request $request)
    {
        try {
            // Validacija ulaznih podataka
            $validated = $request->validate([
                'institution_user_id' => 'required|integer|exists:users,id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string|max:1000'
            ]);

            // Proveri da li je institution_user_id zaista ustanova
            $institution = User::where('id', $validated['institution_user_id'])
                ->where('role_as', 2)
                ->firstOrFail();

            // Kreiraj recenziju
            $review = Review::create([
                'user_id' => auth()->id(),
                'institution_user_id' => $validated['institution_user_id'],
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
                'date' => now(),
                'approved' => true
            ]);

            // Učitaj relacije za odgovor
            $review->load('user:id,name');

            return response()->json([
                'message' => 'Recenzija uspešno dodata',
                'review' => $review
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Greška pri kreiranju recenzije',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Izmena recenzije roditelja
     * PUT /api/parent/reviews/{id}
     */
    public function update(Request $request, $id)
    {
        // Pronađi recenziju koja pripada ovom roditelju
        $review = Review::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Validacija
        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'sometimes|string|max:1000'
        ]);

        // Ažuriraj recenziju
        $review->update($validated);

        return response()->json([
            'message' => 'Recenzija uspešno ažurirana',
            'review' => $review
        ]);
    }

    /**
     * Brisanje recenzije roditelja
     * DELETE /api/parent/reviews/{id}
     */
    public function destroy($id)
    {
        // Pronađi recenziju koja pripada ovom roditelju
        $review = Review::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $review->delete();

        return response()->json([
            'message' => 'Recenzija uspešno obrisana'
        ]);
    }
}
