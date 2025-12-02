<?php

use App\Models\Restaurant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Restaurant Model', function () {// ça sert à grouper les tests

    it('peut créer un restaurant', function () {
        $restaurant = Restaurant::create([
            'nom' => 'McWacdo Paris',
            'adresse' => '123 Avenue des Champs-Élysées',
            'code_postal' => '75008',
            'ville' => 'Paris'
        ]);

        expect($restaurant)->toBeInstanceOf(Restaurant::class)
            ->and($restaurant->nom)->toBe('McWacdo Paris')
            ->and($restaurant->adresse)->toBe('123 Avenue des Champs-Élysées')
            ->and($restaurant->code_postal)->toBe('75008')
            ->and($restaurant->ville)->toBe('Paris')
            ->and($restaurant->exists)->toBeTrue();
    });

    // pour les test il faut chaque foix créer le restaurant
    it('peut récupérer un restaurant depuis la base de données', function () {
        $restaurant = Restaurant::create([
            'nom' => 'McWacdo Lyon',
            'adresse' => '10 Rue de la République',
            'code_postal' => '69001',
            'ville' => 'Lyon'
        ]);

        $found = Restaurant::find($restaurant->id);

        expect($found)->not->toBeNull()
            ->and($found->id)->toBe($restaurant->id)
            ->and($found->nom)->toBe('McWacdo Lyon');
    });

    it('peut mettre à jour un restaurant', function () {
        $restaurant = Restaurant::create([
            'nom' => 'McWacdo Marseille',
            'adresse' => '50 La Canebière',
            'code_postal' => '13001',
            'ville' => 'Marseille'
        ]);

        $restaurant->update([
            'nom' => 'McWacdo Marseille Centre',
            'adresse' => '51 La Canebière'
        ]);

        $updated = Restaurant::find($restaurant->id);

        expect($updated->nom)->toBe('McWacdo Marseille Centre')
            ->and($updated->adresse)->toBe('51 La Canebière')
            ->and($updated->code_postal)->toBe('13001')
            ->and($updated->ville)->toBe('Marseille');
    });

    it('peut supprimer un restaurant', function () {
        $restaurant = Restaurant::create([
            'nom' => 'McWacdo Toulouse',
            'adresse' => '25 Place du Capitole',
            'code_postal' => '31000',
            'ville' => 'Toulouse'
        ]);

        $id = $restaurant->id;
        $restaurant->delete();

        $deleted = Restaurant::find($id);

        expect($deleted)->toBeNull();
    });

    it('possède les champs fillable requis', function () {
        $fillable = (new Restaurant())->getFillable();

        expect($fillable)->toContain('nom')
            ->and($fillable)->toContain('adresse')
            ->and($fillable)->toContain('code_postal')
            ->and($fillable)->toContain('ville');
    });

    it('a une relation avec les affectations', function () {
        $restaurant = Restaurant::create([
            'nom' => 'McWacdo Bordeaux',
            'adresse' => '15 Cours de l\'Intendance',
            'code_postal' => '33000',
            'ville' => 'Bordeaux'
        ]);

        expect($restaurant->affectations)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);
    });

});
