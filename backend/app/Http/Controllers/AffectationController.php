<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use Illuminate\Http\Request;

class AffectationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $affectations = Affectation::with(['user', 'restaurant', 'poste'])->get();
        return response()->json($affectations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        \Log::info('Données reçues pour affectation:', $request->all());

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'restaurant_id' => 'required|exists:restaurants,id',
            'poste_id' => 'required|exists:postes,id',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
        ]);

        \Log::info('Données validées:', $validated);

        $affectation = Affectation::create($validated);

        \Log::info('Affectation créée:', $affectation->toArray());

        return response()->json($affectation->load(['user', 'restaurant', 'poste']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $affectation = Affectation::with(['user', 'restaurant', 'poste'])->findOrFail($id);
        return response()->json($affectation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $affectation = Affectation::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'restaurant_id' => 'sometimes|exists:restaurants,id',
            'poste_id' => 'sometimes|exists:postes,id',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
        ]);

        $affectation->update($validated);
        return response()->json($affectation->load(['user', 'restaurant', 'poste']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $affectation = Affectation::findOrFail($id);
        $affectation->delete();
        return response()->json(null, 204);
    }
}
