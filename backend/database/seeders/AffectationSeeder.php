<?php

namespace Database\Seeders;

use App\Models\Affectation;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Poste;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AffectationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer tous les users, restaurants et postes
        $users = User::all();
        $restaurants = Restaurant::all();
        $postes = Poste::all();

        // Si on n'a pas de données, on ne peut pas créer d'affectations
        if ($users->isEmpty() || $restaurants->isEmpty() || $postes->isEmpty()) {
            $this->command->warn('Pas assez de données pour créer des affectations. Assurez-vous d\'avoir des users, restaurants et postes.');
            return;
        }

        // Créer des affectations aléatoires
        foreach ($users as $user) {
            // Chaque user a 1 à 3 affectations
            $nombreAffectations = rand(1, 3);

            for ($i = 0; $i < $nombreAffectations; $i++) {
                $dateDebut = Carbon::now()->subMonths(rand(1, 24));
                $dateFin = rand(0, 1) ? Carbon::now()->addMonths(rand(1, 12)) : null;

                Affectation::create([
                    'user_id' => $user->id,
                    'restaurant_id' => $restaurants->random()->id,
                    'poste_id' => $postes->random()->id,
                    'date_debut' => $dateDebut,
                    'date_fin' => $dateFin,
                ]);
            }
        }

        $this->command->info('Affectations créées avec succès !');
    }
}
