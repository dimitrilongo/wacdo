<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $restaurants = [
            [
                'nom' => 'McDo Paris Champs-Élysées',
                'adresse' => '140 Avenue des Champs-Élysées',
                'code_postal' => '75008',
                'ville' => 'Paris',
            ],
            [
                'nom' => 'WacDo Lyon Part-Dieu',
                'adresse' => '17 Rue du Docteur Bouchut',
                'code_postal' => '69003',
                'ville' => 'Lyon',
            ],
            [
                'nom' => 'WacDo Marseille Vieux-Port',
                'adresse' => '1 Quai du Port',
                'code_postal' => '13002',
                'ville' => 'Marseille',
            ],
            [
                'nom' => 'WacDo Toulouse Capitole',
                'adresse' => '5 Place du Capitole',
                'code_postal' => '31000',
                'ville' => 'Toulouse',
            ],
            [
                'nom' => 'WacDo Nice Promenade',
                'adresse' => '12 Promenade des Anglais',
                'code_postal' => '06000',
                'ville' => 'Nice',
            ],
            [
                'nom' => 'WacDo Bordeaux Centre',
                'adresse' => '45 Cours de l\'Intendance',
                'code_postal' => '33000',
                'ville' => 'Bordeaux',
            ],
            [
                'nom' => 'WacDo Lille Grand Place',
                'adresse' => '8 Place du Général de Gaulle',
                'code_postal' => '59000',
                'ville' => 'Lille',
            ],
            [
                'nom' => 'WacDo Nantes Commerce',
                'adresse' => '15 Rue de la Marne',
                'code_postal' => '44000',
                'ville' => 'Nantes',
            ],
        ];

        foreach ($restaurants as $restaurant) {
            Restaurant::create($restaurant);
        }
    }
}
