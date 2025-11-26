<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use Illuminate\Http\Request;

class ChildController extends Controller
{



    //Lista sve dece trenutno ulogovanog korisnika

    public function index()
    {


        $children = Child::where('parent_user_id', auth()->id())->get();

        return response()->json([
            'children' => $children
        ]);
    }

    //dodajem novo dete
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
            'medical_restrictions' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:500',
        ]);

        //dodaj prant_user id automatski od ulogovanog korisnika 
        $child = Child::create([
            'parent_user_id' => auth()->id(),
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'age' => $validated['age'],
            'medical_restrictions' => $validated['medical_restrictions'] ?? null,
            'note' => $validated['note'] ?? null,
        ]);

        return response()->json([
            'message' => 'Dete uspešno dodato',
            'child' => $child
        ], 201);
    }

    //Prikazi jedno dete
    public function show($id)
    {
        $child = Child::where('id', $id)
            ->where('parent_user_id', auth()->id()) // Provera da dete pripada roditelju
            ->firstOrFail();

        return response()->json([
            'child' => $child
        ]);
    }

    /**
     * Izmeni dete
     */
    public function update(Request $request, $id)
    {
        $child = Child::where('id', $id)
            ->where('parent_user_id', auth()->id())
            ->firstOrFail();

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'age' => 'sometimes|integer|min:1|max:18',
            'medical_restrictions' => 'nullable|string|max:500',
            'note' => 'nullable|string|max:1000',
        ]);

        $child->update($validated);

        return response()->json([
            'message' => 'Podaci o detetu uspešno ažurirani',
            'child' => $child
        ]);
    }
    //Obrisi dete

    public function destroy($id)
    {
        $child = Child::where('id', $id)->where('parent_user_id', auth()->id())->firstOrFail();

        $childName = $child->first_name . ' ' . $child->last_name;

        return response()->json([
            'message' => "Dete '{$childName}' je obrisano"
        ]);
    }
}
