<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Retourne un message de test pour vérifier que l'API fonctionne
     */
    public function index()
    {
        return response()->json([
            'message' => 'API Laravel fonctionne correctement!',
            'status' => 'success',
            'timestamp' => now(),
            'data' => [
                'version' => '1.0.0',
                'environment' => config('app.env')
            ]
        ]);
    }

    /**
     * Retourne des données de test
     */
    public function getData()
    {
        return response()->json([
            'users' => [
                ['id' => 1, 'name' => 'John Doe', 'email' => 'john@example.com'],
                ['id' => 2, 'name' => 'Jane Smith', 'email' => 'jane@example.com'],
                ['id' => 3, 'name' => 'Bob Johnson', 'email' => 'bob@example.com']
            ],
            'total' => 3
        ]);
    }
}
