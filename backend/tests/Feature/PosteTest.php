<?php

use App\Models\Poste;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Poste Model', function () {

    it('peut créer un poste', function () {
        $poste = Poste::create([
            'nom' => 'Manager',
            'description' => 'Responsable de la gestion du restaurant'
        ]);

        expect($poste)->toBeInstanceOf(Poste::class)
            ->and($poste->nom)->toBe('Manager')
            ->and($poste->exists)->toBeTrue();
    });

    it('peut récupérer un poste depuis la base de données', function () {
        $poste = Poste::create([
            'nom' => 'Équipier',
            'description' => 'Préparation des commandes'
        ]);

        $found = Poste::find($poste->id);

        expect($found)->not->toBeNull()
            ->and($found->id)->toBe($poste->id)
            ->and($found->nom)->toBe('Équipier');
    });

    it('peut mettre à jour un poste', function () {
        $poste = Poste::create([
            'nom' => 'Caissier',
            'description' => 'Gestion de la caisse'
        ]);

        $poste->update([
            'nom' => 'Caissier Principal',
            'description' => 'Gestion de la caisse et supervision'
        ]);

        $updated = Poste::find($poste->id);

        expect($updated->nom)->toBe('Caissier Principal');
    });

    it('peut supprimer un poste', function () {
        $poste = Poste::create([
            'nom' => 'Hôte',
            'description' => 'Accueil des clients'
        ]);

        $id = $poste->id;
        $poste->delete();

        $deleted = Poste::find($id);

        expect($deleted)->toBeNull();
    });

    it('possède les champs fillable requis', function () {
        $fillable = (new Poste())->getFillable();

        expect($fillable)->toContain('nom');
    });

    it('a une relation avec les affectations', function () {
        $poste = Poste::create([
            'nom' => 'Cuisinier',
            'description' => 'Préparation des burgers'
        ]);

        expect($poste->affectations)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);
    });

    it('peut créer un poste sans description', function () {
        $poste = Poste::create([
            'nom' => 'Stagiaire',
            'description' => null
        ]);

        expect($poste)->toBeInstanceOf(Poste::class)
            ->and($poste->nom)->toBe('Stagiaire')
            ->and($poste->description)->toBeNull()
            ->and($poste->exists)->toBeTrue();
    });

});
