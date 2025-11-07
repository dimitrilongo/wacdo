<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un administrateur
        User::create([
            'nom' => 'Admin',
            'prenom' => 'Système',
            'email' => 'admin@wacdo.com',
            'mot_de_passe' => Hash::make('admin123'),
            'date_embauche' => Carbon::now()->subYears(2),
            'is_admin' => true,
        ]);

        // Créer un employé normal
        User::create([
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'email' => 'jean.dupont@wacdo.com',
            'mot_de_passe' => Hash::make('password123'),
            'date_embauche' => Carbon::now()->subMonths(6),
            'is_admin' => false,
        ]);

        // Créer une employée normale
        User::create([
            'nom' => 'Martin',
            'prenom' => 'Sophie',
            'email' => 'sophie.martin@wacdo.com',
            'mot_de_passe' => Hash::make('password123'),
            'date_embauche' => Carbon::now()->subMonths(3),
            'is_admin' => false,
        ]);
    }
}
