<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'email' => 'admin@wacdo.com',
            'mot_de_passe' => Hash::make('Admin123!'),
            'nom' => 'Admin',
            'prenom' => 'Super',
            'date_embauche' => now(),
            'is_admin' => true,
        ]);

        $this->command->info('Utilisateur admin créé avec succès !');
        $this->command->info('Email: admin@wacdo.com');
        $this->command->info('Mot de passe: Admin123!');
    }
}
