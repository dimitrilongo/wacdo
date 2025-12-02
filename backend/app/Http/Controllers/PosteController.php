<?php

namespace App\Http\Controllers;

use App\Models\Poste;
use Illuminate\Http\Request;

class PosteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $postes = Poste::all();
        return response()->json($postes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $poste = Poste::create($validated);
        return response()->json($poste, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $poste = Poste::findOrFail($id);
        return response()->json($poste);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $poste = Poste::findOrFail($id);
        
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
        ]);

        $poste->update($validated);
        return response()->json($poste);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $poste = Poste::findOrFail($id);
        $poste->delete();
        return response()->json(null, 204);
    }
}
