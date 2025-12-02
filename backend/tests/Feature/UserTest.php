<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

describe('User Model', function () {

    it('peut créer un utilisateur', function () {
        $user = User::create([
            'email' => 'dimitri.longo@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'nom' => 'Longo',
            'prenom' => 'Dimitri',
            'date_embauche' => '2025-01-15'
        ]);

        expect($user)->toBeInstanceOf(User::class)
            ->and($user->email)->toBe('dimitri.longo@example.com')
            ->and($user->nom)->toBe('Longo')
            ->and($user->prenom)->toBe('Dimitri')
            ->and($user->exists)->toBeTrue();
    });

    it('peut récupérer un utilisateur depuis la base de données', function () {
        $user = User::create([
            'email' => 'lino.longo@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'nom' => 'Longo',
            'prenom' => 'Lino',
            'date_embauche' => '2025-02-01'
        ]);

        $found = User::find($user->id);

        expect($found)->not->toBeNull()
            ->and($found->id)->toBe($user->id)
            ->and($found->email)->toBe('lino.longo@example.com');
    });

    it('peut mettre à jour un utilisateur', function () {
        $user = User::create([
            'email' => 'livia.longo@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'nom' => 'Longo',
            'prenom' => 'Livia',
            'date_embauche' => '2025-03-01'
        ]);

        $user->update([
            'email' => 'longo.livia@example.com',
            'nom' => 'Longo-Junior'
        ]);

        $updated = User::find($user->id);

        expect($updated->email)->toBe('longo.livia@example.com')
            ->and($updated->nom)->toBe('Longo-Junior');
    });

    it('peut supprimer un utilisateur', function () {
        $user = User::create([
            'email' => 'audrey.longo@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'nom' => 'Longo',
            'prenom' => 'Audrey',
            'date_embauche' => '2025-04-01'
        ]);

        $id = $user->id;
        $user->delete();

        $deleted = User::find($id);

        expect($deleted)->toBeNull();
    });

    it('possède les champs fillable requis', function () {
        $fillable = (new User())->getFillable();

        expect($fillable)->toContain('email')
            ->and($fillable)->toContain('mot_de_passe')
            ->and($fillable)->toContain('nom')
            ->and($fillable)->toContain('prenom')
            ->and($fillable)->toContain('date_embauche');
    });

    it('a une relation avec les affectations', function () {
        $user = User::create([
            'email' => 'luc.petit@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'nom' => 'Petit',
            'prenom' => 'Luc',
            'date_embauche' => '2025-05-01'
        ]);

        expect($user->affectations)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);
    });

    it('hash le mot de passe lors de la création', function () {
        $user = User::create([
            'email' => 'dimitri.longo@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'nom' => 'Longo',
            'prenom' => 'Dimitri',
            'date_embauche' => '2025-06-01'
        ]);

        expect($user->mot_de_passe)->not->toBe('password123')// je vérifi e que le mot de passe n'est pas stocké en clair
            ->and(Hash::check('password123', $user->mot_de_passe))->toBeTrue();// et là je vérifie que le hash correspond bien au mot de passe original
    });

    it('peut créer un utilisateur sans date_embauche', function () {
        $user = User::create([
            'email' => 'dimitri.longo@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'nom' => 'Longo',
            'prenom' => 'Dimitri',
            'date_embauche' => null
        ]);

        expect($user)->toBeInstanceOf(User::class)
            ->and($user->date_embauche)->toBeNull()
            ->and($user->exists)->toBeTrue();
    });

    it('a un email unique', function () {
        User::create([
            'email' => 'dimitri@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'nom' => 'Dimitri',
            'prenom' => 'User',
            'date_embauche' => '2025-07-01'
        ]);

        // Tenter de créer un utilisateur avec le même email devrait échouer
        expect(fn() => User::create([
            'email' => 'dimitri@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'nom' => 'Emmnanuel',
            'prenom' => 'User',
            'date_embauche' => '2025-07-02'
        ]))->toThrow(\Exception::class);
    });

});
