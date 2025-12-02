# 🚀 Guide rapide - Projet Laravel + React

## 📦 Création du projet

### Backend Laravel
```bash
# Créer le projet Laravel (dernière version)
composer create-project laravel/laravel backend

# Se placer dans le dossier
cd backend

# Installer Laravel Sanctum pour l'authentification API
composer require laravel/sanctum

# Publier la configuration Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

**Laravel** : Framework PHP pour créer des API REST robustes avec ORM Eloquent.

---

### Frontend React
```bash
# Créer l'application React avec Vite
npm create vite@latest frontend -- --template react

# Se placer dans le dossier
cd frontend

# Installer les dépendances
npm install

# Installer React Router (navigation) et Axios (requêtes HTTP)
npm install react-router-dom axios
```

**Vite** : Build tool ultra-rapide pour React, remplace Create React App.

---

## 🗄️ Base de données et migrations

### Configuration
```bash
# Éditer .env pour configurer la base de données
DB_CONNECTION=sqlite
# DB_DATABASE=/chemin/absolu/vers/database.sqlite

# Créer le fichier SQLite
touch database/database.sqlite
```

**Migrations** : Fichiers versionnés qui définissent la structure de la base de données.

---

### Créer les migrations
```bash
# Migration pour la table users (déjà présente par défaut)
# Modifier : database/migrations/xxxx_create_users_table.php

# Créer migration restaurants
php artisan make:migration create_restaurants_table

# Créer migration postes
php artisan make:migration create_postes_table

# Créer migration affectations (table pivot)
php artisan make:migration create_affectations_table
```

**Exemple - Migration restaurants :**
```php
public function up(): void
{
    Schema::create('restaurants', function (Blueprint $table) {
        $table->id();
        $table->string('nom');
        $table->string('adresse');
        $table->string('code_postal');
        $table->string('ville');
        $table->timestamps();
    });
}
```

**Exemple - Migration affectations (avec clés étrangères) :**
```php
public function up(): void
{
    Schema::create('affectations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
        $table->foreignId('poste_id')->constrained()->onDelete('cascade');
        $table->date('date_debut');
        $table->date('date_fin')->nullable();
        $table->timestamps();
    });
}
```

**`foreignId()`** : Crée une colonne INT et une contrainte de clé étrangère automatiquement.  
**`constrained()`** : Référence automatiquement la table au pluriel (user_id → users).  
**`onDelete('cascade')`** : Supprime les affectations si l'entité parente est supprimée.

---

### Exécuter les migrations
```bash
# Lancer toutes les migrations en attente
php artisan migrate

# Rollback (annuler) la dernière migration
php artisan migrate:rollback

# Reset complet + remigration (⚠️ perte de données)
php artisan migrate:fresh

# Reset + migrations + seeders
php artisan migrate:fresh --seed
```

---

## 🏗️ Modèles Eloquent

### Créer les modèles
```bash
# Créer le modèle Restaurant
php artisan make:model Restaurant

# Créer modèle + migration en une commande
php artisan make:model Poste -m

# Créer modèle + migration + factory + seeder
php artisan make:model Affectation -mfs
```

**Modèles** : Classes PHP qui représentent les tables et gèrent les requêtes (ORM Eloquent).

---

### Structure d'un modèle
**Exemple - `app/Models/Restaurant.php` :**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
    /**
     * $fillable : Colonnes autorisées en assignation de masse (protection)
     * Permet : Restaurant::create(['nom' => 'McDo', 'ville' => 'Paris'])
     */
    protected $fillable = [
        'nom',
        'adresse',
        'code_postal',
        'ville',
    ];

    /**
     * $casts : Conversion automatique des types
     * 'date' → Carbon (objet DateTime PHP)
     * 'datetime' → Carbon avec heure
     * 'boolean' → true/false
     * 'array' → Sérialisation JSON automatique
     */
    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Relations : Définissent les liens entre tables
     * HasMany = "Un restaurant a plusieurs affectations"
     */
    public function affectations(): HasMany
    {
        return $this->hasMany(Affectation::class);
    }
}
```

---

**Exemple - `app/Models/User.php` (avec accesseur) :**
```php
protected $fillable = [
    'prenom',
    'nom',
    'email',
    'mot_de_passe',
];

protected $hidden = [
    'mot_de_passe',  // Caché dans les réponses JSON
    'remember_token',
];

/**
 * Accesseur : Attribut virtuel calculé dynamiquement
 * Accessible via : $user->nom_complet
 */
public function getNomCompletAttribute(): string
{
    return "{$this->prenom} {$this->nom}";
}

/**
 * Relations
 */
public function affectations(): HasMany
{
    return $this->hasMany(Affectation::class);
}
```

---

**Exemple - `app/Models/Affectation.php` (table pivot avec données) :**
```php
protected $fillable = [
    'user_id',
    'restaurant_id',
    'poste_id',
    'date_debut',
    'date_fin',
];

/**
 * Casts pour gérer les dates correctement avec SQLite
 */
protected $casts = [
    'date_debut' => 'datetime',
    'date_fin' => 'datetime',
];

/**
 * Relations BelongsTo : "Une affectation appartient à..."
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

public function restaurant(): BelongsTo
{
    return $this->belongsTo(Restaurant::class);
}

public function poste(): BelongsTo
{
    return $this->belongsTo(Poste::class);
}
```

**Types de relations :**
- **HasMany** : 1 → N (un restaurant a plusieurs affectations)
- **BelongsTo** : N → 1 (une affectation appartient à un restaurant)
- **HasOne** : 1 → 1 (un user a un profil)
- **BelongsToMany** : N → N avec table pivot (non utilisé ici)

---

## 🌱 Factories et Seeders

### Factories
**Rôle** : Génèrent des données factices pour les tests et le développement.

```bash
# Créer une factory
php artisan make:factory RestaurantFactory
```

**Exemple - `database/factories/RestaurantFactory.php` :**
```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RestaurantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => 'McDo ' . fake()->city(),
            'adresse' => fake()->streetAddress(),
            'code_postal' => fake()->postcode(),
            'ville' => fake()->city(),
        ];
    }
}
```

**`fake()`** : Génère des données aléatoires réalistes (noms, adresses, emails...).

---

### Seeders
**Rôle** : Peuplent la base de données avec des données initiales.

```bash
# Créer un seeder
php artisan make:seeder RestaurantSeeder
```

**Exemple - `database/seeders/RestaurantSeeder.php` :**
```php
<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        // Créer 10 restaurants avec la factory
        Restaurant::factory()->count(10)->create();

        // OU créer manuellement des données spécifiques
        Restaurant::create([
            'nom' => 'McDo Paris Opéra',
            'adresse' => '1 Place de l\'Opéra',
            'code_postal' => '75009',
            'ville' => 'Paris',
        ]);
    }
}
```

---

**Appeler les seeders - `database/seeders/DatabaseSeeder.php` :**
```php
public function run(): void
{
    $this->call([
        PosteSeeder::class,
        RestaurantSeeder::class,
        UserSeeder::class,
        AffectationSeeder::class,
    ]);
}
```

**Exécuter les seeders :**
```bash
# Lancer tous les seeders
php artisan db:seed

# Lancer un seeder spécifique
php artisan db:seed --class=RestaurantSeeder

# Reset + migrations + seeders en une commande
php artisan migrate:fresh --seed
```

---

## 🎮 Controllers API

### Créer les controllers
```bash
# Controller API pour Restaurant (méthodes CRUD)
php artisan make:controller Api/RestaurantController --api

# --api : Génère index, store, show, update, destroy (sans create/edit)
```

**Controllers** : Gèrent la logique métier et répondent aux requêtes HTTP.

---

### Structure d'un controller API
**Exemple - `app/Http/Controllers/Api/RestaurantController.php` :**
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    /**
     * GET /api/restaurants
     * Liste tous les restaurants
     */
    public function index()
    {
        return Restaurant::all();
    }

    /**
     * POST /api/restaurants
     * Créer un restaurant
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string',
            'code_postal' => 'required|string|max:10',
            'ville' => 'required|string|max:255',
        ]);

        $restaurant = Restaurant::create($validated);

        return response()->json($restaurant, 201);
    }

    /**
     * GET /api/restaurants/{id}
     * Détails d'un restaurant avec ses affectations
     */
    public function show(string $id)
    {
        $restaurant = Restaurant::with(['affectations.user', 'affectations.poste'])
            ->findOrFail($id);

        return response()->json($restaurant);
    }

    /**
     * PUT/PATCH /api/restaurants/{id}
     * Modifier un restaurant
     */
    public function update(Request $request, string $id)
    {
        $restaurant = Restaurant::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'adresse' => 'sometimes|required|string',
            'code_postal' => 'sometimes|required|string|max:10',
            'ville' => 'sometimes|required|string|max:255',
        ]);

        $restaurant->update($validated);

        return response()->json($restaurant);
    }

    /**
     * DELETE /api/restaurants/{id}
     * Supprimer un restaurant
     */
    public function destroy(string $id)
    {
        $restaurant = Restaurant::findOrFail($id);
        $restaurant->delete();

        return response()->json(null, 204);
    }
}
```

**Méthodes clés :**
- **`validate()`** : Valide les données avant traitement (règles Laravel)
- **`create()`** : Crée une entrée (nécessite `$fillable`)
- **`findOrFail()`** : Cherche par ID, renvoie 404 si introuvable
- **`with()`** : Eager loading (charge les relations pour éviter N+1 queries)
- **`response()->json()`** : Retourne une réponse JSON avec code HTTP

---

### Routes API
**Fichier - `routes/api.php` :**
```php
<?php

use App\Http\Controllers\Api\RestaurantController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PosteController;
use App\Http\Controllers\Api\AffectationController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Routes protégées par authentification Sanctum
Route::middleware('auth:sanctum')->group(function () {
    
    // apiResource : Crée automatiquement les 5 routes CRUD
    // GET /api/restaurants        → index
    // POST /api/restaurants       → store
    // GET /api/restaurants/{id}   → show
    // PUT /api/restaurants/{id}   → update
    // DELETE /api/restaurants/{id} → destroy
    Route::apiResource('restaurants', RestaurantController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('postes', PosteController::class);
    Route::apiResource('affectations', AffectationController::class);
});
```

**Voir toutes les routes :**
```bash
php artisan route:list
```

---

## 🔐 Authentification avec Sanctum

### Configuration
**Fichier - `config/sanctum.php` :**
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:5173')),
```

**Fichier - `app/Http/Kernel.php` (Laravel 10) ou `bootstrap/app.php` (Laravel 11) :**
```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    // ...
],
```

---

### Controller d'authentification
```bash
php artisan make:controller Api/AuthController
```

**Exemple - Méthode login :**
```php
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $credentials['email'])->first();

    if (!$user || !Hash::check($credentials['password'], $user->mot_de_passe)) {
        return response()->json(['message' => 'Identifiants invalides'], 401);
    }

    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ]);
}
```

**Sanctum** : Génère un token d'authentification API simple et sécurisé.

---

## ⚛️ Frontend React

### Structure des fichiers
```
frontend/src/
├── components/
│   ├── ProtectedRoute.jsx    # Protection des routes
│   ├── Restaurant.jsx         # Card restaurant
│   └── Collaborateur.jsx      # Card collaborateur
├── context/
│   └── AuthContext.jsx        # Gestion authentification
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── RestaurantsPage.jsx
│   ├── RestaurantDetailPage.jsx
│   ├── CollaborateursPage.jsx
│   ├── FonctionsPage.jsx
│   └── AffectationsPage.jsx
├── App.jsx                    # Routes principales
└── main.jsx                   # Point d'entrée
```

---

### Configuration Axios
**Fichier - `src/services/api.js` :**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur : Ajoute automatiquement le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

### Exemple de requête
```javascript
import api from '../services/api';

// GET
const fetchRestaurants = async () => {
  const response = await api.get('/restaurants');
  setRestaurants(response.data);
};

// POST
const createRestaurant = async (data) => {
  const response = await api.post('/restaurants', data);
  return response.data;
};

// PUT
const updateRestaurant = async (id, data) => {
  const response = await api.put(`/restaurants/${id}`, data);
  return response.data;
};

// DELETE
const deleteRestaurant = async (id) => {
  await api.delete(`/restaurants/${id}`);
};
```

---

## 🚀 Lancer les serveurs

### Backend Laravel
```bash
# Se placer dans le dossier backend
cd backend

# Lancer le serveur de développement (port 8000)
php artisan serve

# Avec un port personnalisé
php artisan serve --port=8080
```

**Serveur accessible sur :** `http://localhost:8000`

---

### Frontend React
```bash
# Se placer dans le dossier frontend
cd frontend

# Lancer le serveur de développement Vite (port 5173)
npm run dev

# Avec un port personnalisé (éditer vite.config.js)
# server: { port: 3000 }
```

**Serveur accessible sur :** `http://localhost:5173`

---

## 🛠️ Commandes principales

### Laravel (Backend)

#### Migrations
```bash
php artisan migrate              # Exécuter migrations
php artisan migrate:rollback     # Annuler dernière migration
php artisan migrate:fresh        # Reset complet
php artisan migrate:fresh --seed # Reset + seeders
```

#### Base de données
```bash
php artisan db:seed              # Lancer seeders
php artisan db:seed --class=XxxSeeder  # Seeder spécifique
php artisan tinker               # Console interactive PHP
```

#### Génération de code
```bash
php artisan make:model Xxx -mfs  # Modèle + migration + factory + seeder
php artisan make:controller Api/XxxController --api  # Controller API
php artisan make:migration create_xxx_table          # Migration
php artisan make:factory XxxFactory                  # Factory
php artisan make:seeder XxxSeeder                    # Seeder
```

#### Utilitaires
```bash
php artisan route:list           # Liste toutes les routes
php artisan config:clear         # Vider cache config
php artisan cache:clear          # Vider cache application
php artisan optimize:clear       # Vider tous les caches
```

---

### React (Frontend)

#### Développement
```bash
npm run dev                      # Lancer serveur de dev
npm run build                    # Build de production
npm run preview                  # Prévisualiser build
```

#### Dépendances
```bash
npm install                      # Installer dépendances
npm install nomdupackage         # Ajouter package
npm update                       # Mettre à jour packages
```

---

## 🔍 Debug et logs

### Laravel
```bash
# Voir les logs en temps réel
tail -f storage/logs/laravel.log

# Activer le debug (fichier .env)
APP_DEBUG=true
```

### React
```javascript
// Console navigateur
console.log('Debug:', data);
console.table(array);           // Affiche tableau
console.error('Erreur:', error);
```

---

## 📦 Résumé des commandes d'installation complète

```bash
# 1. Créer le backend Laravel
composer create-project laravel/laravel backend
cd backend
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
touch database/database.sqlite

# 2. Créer migrations, modèles, controllers
php artisan make:model Restaurant -mfs
php artisan make:model Poste -mfs
php artisan make:model Affectation -mfs
php artisan make:controller Api/RestaurantController --api
php artisan make:controller Api/PosteController --api
php artisan make:controller Api/UserController --api
php artisan make:controller Api/AffectationController --api
php artisan make:controller Api/AuthController

# 3. Configurer les modèles, migrations, seeders, routes
# (éditer les fichiers générés)

# 4. Exécuter migrations + seeders
php artisan migrate:fresh --seed

# 5. Lancer le serveur Laravel
php artisan serve

# 6. Dans un nouveau terminal : créer le frontend React
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom axios

# 7. Configurer React (App.jsx, routes, context, pages)
# (créer les fichiers nécessaires)

# 8. Lancer le serveur React
npm run dev
```

---

## 🎯 Points clés à retenir

### Backend
- **Migrations** : Structure de la base de données versionnée
- **Modèles** : ORM Eloquent pour manipuler les données
- **$fillable** : Protection contre l'assignation de masse
- **$casts** : Conversion automatique des types
- **Relations** : HasMany, BelongsTo, HasOne, BelongsToMany
- **Factories** : Données factices pour tests
- **Seeders** : Peupler la base de données
- **Controllers** : Logique métier et réponses HTTP
- **apiResource** : Génère automatiquement les 5 routes CRUD
- **Sanctum** : Authentification API par token

### Frontend
- **Vite** : Build tool rapide pour React
- **React Router** : Navigation entre pages
- **Axios** : Requêtes HTTP vers l'API
- **Context** : Gestion de l'état global (auth)
- **useState** : État local des composants
- **useEffect** : Effets de bord (fetch données)
- **ProtectedRoute** : Protéger les routes authentifiées

---

**Guide réalisé le :** 12 novembre 2025  
**Versions :** Laravel 11 | React 19 | Vite 5
