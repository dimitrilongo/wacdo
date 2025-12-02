<?php

namespace Database\Seeders;

use App\Models\Poste;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PosteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $postes = [
            ['nom' => 'Directeur de restaurant'],
            ['nom' => 'Manager'],
            ['nom' => 'Assistant Manager'],
            ['nom' => 'Équipier polyvalent'],
            ['nom' => 'Hôte / Hôtesse'],
            ['nom' => 'Cuisinier'],
            ['nom' => 'Préparateur'],
            ['nom' => 'Plongeur'],
            ['nom' => 'Responsable RH'],
            ['nom' => 'Comptable'],
        ];

        foreach ($postes as $poste) {
            Poste::create($poste);
        }
    }
}
