<?php

use App\Models\Affectation;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Poste;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

describe('Affectation Model', function () {

    beforeEach(function () {
        // Créer les données nécessaires pour chaque test
        $this->user = User::create([
            'email' => 'test@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'nom' => 'User',
            'prenom' => 'Test',
            'date_embauche' => '2025-01-01'
        ]);

        $this->restaurant = Restaurant::create([
            'nom' => 'McWacdo Test',
            'adresse' => '123 Test Street',
            'code_postal' => '75001',
            'ville' => 'Paris'
        ]);

        $this->poste = Poste::create([
            'nom' => 'Manager',
            'description' => 'Responsable du restaurant'
        ]);
    });

    it('peut créer une affectation', function () {
        $affectation = Affectation::create([
            'user_id' => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'poste_id' => $this->poste->id,
            'date_debut' => '2025-01-15',
            'date_fin' => null
        ]);

        expect($affectation)->toBeInstanceOf(Affectation::class)
            ->and($affectation->user_id)->toBe($this->user->id)
            ->and($affectation->restaurant_id)->toBe($this->restaurant->id)
            ->and($affectation->poste_id)->toBe($this->poste->id)
            ->and($affectation->date_debut->format('Y-m-d'))->toBe('2025-01-15')
            ->and($affectation->date_fin)->toBeNull()
            ->and($affectation->exists)->toBeTrue();
    });

    it('peut récupérer une affectation depuis la base de données', function () {
        $affectation = Affectation::create([
            'user_id' => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'poste_id' => $this->poste->id,
            'date_debut' => '2025-02-01',
            'date_fin' => '2025-06-30'
        ]);

        $found = Affectation::find($affectation->id);

        expect($found)->not->toBeNull()
            ->and($found->id)->toBe($affectation->id)
            ->and($found->date_fin->format('Y-m-d'))->toBe('2025-06-30');
    });

    it('peut mettre à jour une affectation', function () {
        $affectation = Affectation::create([
            'user_id' => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'poste_id' => $this->poste->id,
            'date_debut' => '2025-03-01',
            'date_fin' => null
        ]);

        $affectation->update([
            'date_fin' => '2025-12-31'
        ]);

        $updated = Affectation::find($affectation->id);

        expect($updated->date_fin->format('Y-m-d'))->toBe('2025-12-31');
    });

    it('peut supprimer une affectation', function () {
        $affectation = Affectation::create([
            'user_id' => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'poste_id' => $this->poste->id,
            'date_debut' => '2025-04-01',
            'date_fin' => null
        ]);

        $id = $affectation->id;
        $affectation->delete();

        $deleted = Affectation::find($id);

        expect($deleted)->toBeNull();
    });

    it('possède les champs fillable requis', function () {
        $fillable = (new Affectation())->getFillable();

        expect($fillable)->toContain('user_id')
            ->and($fillable)->toContain('restaurant_id')
            ->and($fillable)->toContain('poste_id')
            ->and($fillable)->toContain('date_debut')
            ->and($fillable)->toContain('date_fin');
    });

    it('a une relation belongsTo avec user', function () {
        $affectation = Affectation::create([
            'user_id' => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'poste_id' => $this->poste->id,
            'date_debut' => '2025-05-01',
            'date_fin' => null
        ]);

        expect($affectation->user)->toBeInstanceOf(User::class)
            ->and($affectation->user->id)->toBe($this->user->id)
            ->and($affectation->user->email)->toBe('test@example.com');
    });

    it('a une relation belongsTo avec restaurant', function () {
        $affectation = Affectation::create([
            'user_id' => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'poste_id' => $this->poste->id,
            'date_debut' => '2025-06-01',
            'date_fin' => null
        ]);

        expect($affectation->restaurant)->toBeInstanceOf(Restaurant::class)
            ->and($affectation->restaurant->id)->toBe($this->restaurant->id)
            ->and($affectation->restaurant->nom)->toBe('McWacdo Test');
    });

    it('a une relation belongsTo avec poste', function () {
        $affectation = Affectation::create([
            'user_id' => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'poste_id' => $this->poste->id,
            'date_debut' => '2025-07-01',
            'date_fin' => null
        ]);

        expect($affectation->poste)->toBeInstanceOf(Poste::class)
            ->and($affectation->poste->id)->toBe($this->poste->id)
            ->and($affectation->poste->nom)->toBe('Manager');
    });

    it('peut créer plusieurs affectations pour le même utilisateur', function () {
        $poste2 = Poste::create([
            'nom' => 'Équipier',
            'description' => 'Service en cuisine'
        ]);

        $affectation1 = Affectation::create([
            'user_id' => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'poste_id' => $this->poste->id,
            'date_debut' => '2025-01-01',
            'date_fin' => '2025-06-30'
        ]);

        $affectation2 = Affectation::create([
            'user_id' => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'poste_id' => $poste2->id,
            'date_debut' => '2025-07-01',
            'date_fin' => null
        ]);

        $userAffectations = $this->user->affectations;

        expect($userAffectations)->toHaveCount(2)
            ->and($userAffectations->first()->poste->nom)->toBe('Manager')
            ->and($userAffectations->last()->poste->nom)->toBe('Équipier');
    });

    it('peut créer une affectation en cours sans date_fin', function () {
        $affectation = Affectation::create([
            'user_id' => $this->user->id,
            'restaurant_id' => $this->restaurant->id,
            'poste_id' => $this->poste->id,
            'date_debut' => '2025-08-01',
            'date_fin' => null
        ]);

        expect($affectation->date_fin)->toBeNull()
            ->and($affectation->exists)->toBeTrue();
    });

});
