# 📚 Documentation McWacdo Manager

## Table des matières
1. [Fonctionnement du système de filtres](#1-fonctionnement-du-système-de-filtres)
2. [Architecture Backend - Classes et Modèles](#2-architecture-backend---classes-et-modèles)
3. [Documentation API](#3-documentation-api)
4. [Pages et Routes Frontend](#4-pages-et-routes-frontend)

---

## 1. Fonctionnement du système de filtres

### 🔍 Principe général
Les filtres en React fonctionnent sur le principe de la **réactivité** : chaque modification d'un filtre déclenche automatiquement un re-calcul et un re-render de la liste filtrée.

### Architecture du filtrage

#### Étape 1 : Déclaration des états
```jsx
const [filterNom, setFilterNom] = useState('');
const [filterCodePostal, setFilterCodePostal] = useState('');
const [filterVille, setFilterVille] = useState('');
```
- **États React** : Variables qui stockent les valeurs des filtres
- **Valeur initiale** : Chaîne vide `''` = aucun filtre actif
- **Fonctions set** : Permettent de modifier ces valeurs

#### Étape 2 : Fonction de filtrage
```jsx
const filteredRestaurants = restaurants.filter(restaurant => {
  // Filtre par nom (insensible à la casse)
  if (filterNom && !restaurant.nom.toLowerCase().includes(filterNom.toLowerCase())) {
    return false; // Exclut ce restaurant
  }
  
  // Filtre par code postal (recherche exacte ou partielle)
  if (filterCodePostal && !restaurant.code_postal.includes(filterCodePostal)) {
    return false;
  }
  
  // Filtre par ville (insensible à la casse)
  if (filterVille && !restaurant.ville.toLowerCase().includes(filterVille.toLowerCase())) {
    return false;
  }
  
  return true; // Restaurant inclus si tous les filtres passent
});
```

**Logique de filtrage :**
- `.filter()` : Méthode JavaScript native qui crée un nouveau tableau
- Pour chaque restaurant :
  - Si un filtre est actif ET que la condition n'est pas remplie → `return false` (exclusion)
  - Si tous les filtres passent → `return true` (inclusion)
- Les filtres sont **cumulatifs** (logique ET)

#### Étape 3 : Liaison avec les inputs
```jsx
<input
  type="text"
  value={filterNom}
  onChange={(e) => setFilterNom(e.target.value)}
/>
```

**Flux de données :**
1. Utilisateur tape dans l'input → Événement `onChange`
2. `setFilterNom(nouvellValeur)` → Met à jour l'état
3. React détecte le changement → Re-render automatique
4. `filteredRestaurants` se recalcule avec les nouvelles valeurs
5. Liste affichée mise à jour instantanément

#### Exemple concret

**Données :**
```js
restaurants = [
  { nom: "McDo Paris Opéra", code_postal: "75009", ville: "Paris" },
  { nom: "McDo Lyon Perrache", code_postal: "69002", ville: "Lyon" },
  { nom: "McDo Paris Bastille", code_postal: "75011", ville: "Paris" }
]
```

**Scénario 1 : Filtre par nom = "Paris"**
```js
filteredRestaurants = [
  { nom: "McDo Paris Opéra", ... },
  { nom: "McDo Paris Bastille", ... }
]
// "Lyon Perrache" exclu (ne contient pas "Paris")
```

**Scénario 2 : Filtre par ville = "Lyon" + code_postal = "69002"**
```js
filteredRestaurants = [
  { nom: "McDo Lyon Perrache", ... }
]
// Seul restaurant répondant aux 2 critères
```

### Optimisation et bonnes pratiques
- ✅ Filtrage côté client = Réactivité instantanée
- ✅ `.toLowerCase()` = Recherche insensible à la casse
- ✅ `.includes()` = Recherche partielle (sous-chaîne)
- ✅ Bouton "Réinitialiser" apparaît seulement si filtres actifs

---

## 2. Architecture Backend - Classes et Modèles

### 🏗️ Modèle relationnel

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   User      │         │ Affectation  │         │ Restaurant  │
│ (Collab.)   │────────▶│  (Pivot)     │◀────────│             │
└─────────────┘   1:N   └──────────────┘   N:1   └─────────────┘
                              │ N:1
                              ▼
                        ┌─────────────┐
                        │   Poste     │
                        │ (Fonction)  │
                        └─────────────┘
```

### Classe `User` (Collaborateur)
**Fichier :** `backend/app/Models/User.php`

#### Propriétés
```php
protected $fillable = [
    'prenom',         // Prénom du collaborateur
    'nom',            // Nom du collaborateur
    'email',          // Email (unique)
    'mot_de_passe',   // Mot de passe hashé
];

protected $hidden = [
    'mot_de_passe',   // Caché dans les réponses JSON
    'remember_token',
];
```

#### Accesseurs (Getters)
```php
// Renvoie "Prénom Nom"
public function getNomCompletAttribute(): string
public function getNameAttribute(): string  // Alias de nom_complet

// Pour l'authentification Sanctum
public function getAuthPassword(): string   // Retourne mot_de_passe
```

#### Relations
```php
// Un user a plusieurs affectations
public function affectations(): HasMany
    return $this->hasMany(Affectation::class);
```

---

### Classe `Restaurant`
**Fichier :** `backend/app/Models/Restaurant.php`

#### Propriétés
```php
protected $fillable = [
    'nom',          // Nom du restaurant
    'adresse',      // Adresse complète
    'code_postal',  // Code postal
    'ville',        // Ville
];
```

#### Relations
```php
// Un restaurant a plusieurs affectations
public function affectations(): HasMany
    return $this->hasMany(Affectation::class);
```

---

### Classe `Poste` (Fonction)
**Fichier :** `backend/app/Models/Poste.php`

#### Propriétés
```php
protected $fillable = [
    'nom',  // Nom du poste (ex: Manager, Équipier, Chef de cuisine)
];
```

#### Relations
```php
// Un poste peut être dans plusieurs affectations
public function affectations(): HasMany
    return $this->hasMany(Affectation::class);
```

---

### Classe `Affectation` (Table pivot avec données)
**Fichier :** `backend/app/Models/Affectation.php`

#### Propriétés
```php
protected $fillable = [
    'user_id',       // FK vers User
    'restaurant_id', // FK vers Restaurant
    'poste_id',      // FK vers Poste
    'date_debut',    // Date de début d'affectation
    'date_fin',      // Date de fin (nullable)
];

protected $casts = [
    'date_debut' => 'datetime',
    'date_fin' => 'datetime',
];
```

#### Relations
```php
// Une affectation appartient à un user
public function user(): BelongsTo
    return $this->belongsTo(User::class);

// Une affectation appartient à un restaurant
public function restaurant(): BelongsTo
    return $this->belongsTo(Restaurant::class);

// Une affectation appartient à un poste
public function poste(): BelongsTo
    return $this->belongsTo(Poste::class);
```

#### Logique métier
**Affectation en cours :**
```sql
WHERE date_fin IS NULL 
   OR date_fin >= NOW()
```

**Affectation terminée :**
```sql
WHERE date_fin < NOW()
```

**Affectation à venir :**
```sql
WHERE date_debut > NOW()
```

---

### Diagramme de classes complet

```
┌─────────────────────────────────────┐
│           User (Collaborateur)      │
├─────────────────────────────────────┤
│ - id: int                           │
│ - prenom: string                    │
│ - nom: string                       │
│ - email: string (unique)            │
│ - mot_de_passe: string (hashed)     │
│ - created_at: datetime              │
│ - updated_at: datetime              │
├─────────────────────────────────────┤
│ + getNomCompletAttribute(): string  │
│ + getNameAttribute(): string        │
│ + affectations(): HasMany           │
└─────────────────────────────────────┘
                │
                │ 1:N
                ▼
┌─────────────────────────────────────┐
│          Affectation                │
├─────────────────────────────────────┤
│ - id: int                           │
│ - user_id: int (FK)                 │
│ - restaurant_id: int (FK)           │
│ - poste_id: int (FK)                │
│ - date_debut: date                  │
│ - date_fin: date (nullable)         │
│ - created_at: datetime              │
│ - updated_at: datetime              │
├─────────────────────────────────────┤
│ + user(): BelongsTo                 │
│ + restaurant(): BelongsTo           │
│ + poste(): BelongsTo                │
└─────────────────────────────────────┘
                │
       ┌────────┴────────┐
       │                 │
       │ N:1             │ N:1
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│ Restaurant  │   │   Poste     │
├─────────────┤   ├─────────────┤
│ - id        │   │ - id        │
│ - nom       │   │ - nom       │
│ - adresse   │   │             │
│ - code_post │   │             │
│ - ville     │   │             │
└─────────────┘   └─────────────┘
```

---

## 3. Documentation API

### 🔐 Authentification
**Type :** Laravel Sanctum (Token-based)

**Headers requis pour routes protégées :**
```http
Authorization: Bearer {token}
Content-Type: application/json
```

---

### 📍 Endpoints disponibles

#### 🔓 Routes publiques (sans authentification)

##### POST `/api/login`
**Description :** Connexion utilisateur

**Body :**
```json
{
  "email": "user@example.com",
  "password": "motdepasse"
}
```

**Réponse (200) :**
```json
{
  "user": {
    "id": 1,
    "prenom": "John",
    "nom": "Doe",
    "email": "john@example.com",
    "nom_complet": "John Doe"
  },
  "token": "1|abc123xyz..."
}
```

**Erreur (401) :**
```json
{
  "message": "Identifiants invalides"
}
```

---

##### POST `/api/register`
**Description :** Inscription nouveau utilisateur

**Body :**
```json
{
  "prenom": "John",
  "nom": "Doe",
  "email": "john@example.com",
  "password": "motdepasse123",
  "password_confirmation": "motdepasse123"
}
```

**Réponse (201) :**
```json
{
  "user": {
    "id": 1,
    "prenom": "John",
    "nom": "Doe",
    "email": "john@example.com"
  },
  "token": "1|abc123xyz..."
}
```

---

#### 🔒 Routes protégées (authentification requise)

### Restaurants

##### GET `/api/restaurants`
**Description :** Liste tous les restaurants

**Réponse (200) :**
```json
[
  {
    "id": 1,
    "nom": "McDo Paris Opéra",
    "adresse": "1 Place de l'Opéra",
    "code_postal": "75009",
    "ville": "Paris",
    "created_at": "2025-11-12T10:00:00.000000Z",
    "updated_at": "2025-11-12T10:00:00.000000Z"
  }
]
```

---

##### GET `/api/restaurants/{id}`
**Description :** Détails d'un restaurant avec affectations en cours

**Réponse (200) :**
```json
{
  "id": 1,
  "nom": "McDo Paris Opéra",
  "adresse": "1 Place de l'Opéra",
  "code_postal": "75009",
  "ville": "Paris",
  "affectations": [
    {
      "id": 1,
      "user_id": 2,
      "restaurant_id": 1,
      "poste_id": 3,
      "date_debut": "2025-11-01",
      "date_fin": null,
      "user": {
        "id": 2,
        "prenom": "Marie",
        "nom": "Martin",
        "email": "marie@example.com"
      },
      "poste": {
        "id": 3,
        "nom": "Manager"
      }
    }
  ]
}
```

**Note :** Affectations filtrées = `date_fin IS NULL` OU `date_fin >= NOW()`

---

##### POST `/api/restaurants`
**Description :** Créer un nouveau restaurant

**Body :**
```json
{
  "nom": "McDo Lyon Perrache",
  "adresse": "10 Cours de Verdun",
  "code_postal": "69002",
  "ville": "Lyon"
}
```

**Réponse (201) :**
```json
{
  "id": 2,
  "nom": "McDo Lyon Perrache",
  "adresse": "10 Cours de Verdun",
  "code_postal": "69002",
  "ville": "Lyon",
  "created_at": "2025-11-12T12:00:00.000000Z",
  "updated_at": "2025-11-12T12:00:00.000000Z"
}
```

---

##### PUT `/api/restaurants/{id}`
**Description :** Modifier un restaurant

**Body :**
```json
{
  "nom": "McDo Lyon Perrache Rénové",
  "adresse": "10 Cours de Verdun",
  "code_postal": "69002",
  "ville": "Lyon"
}
```

**Réponse (200) :** Restaurant mis à jour

---

##### DELETE `/api/restaurants/{id}`
**Description :** Supprimer un restaurant

**Réponse (204) :** Pas de contenu

---

### Postes (Fonctions)

##### GET `/api/postes`
**Description :** Liste tous les postes

**Réponse (200) :**
```json
[
  {
    "id": 1,
    "nom": "Manager",
    "created_at": "2025-11-12T10:00:00.000000Z",
    "updated_at": "2025-11-12T10:00:00.000000Z"
  },
  {
    "id": 2,
    "nom": "Équipier"
  }
]
```

---

##### POST `/api/postes`
**Description :** Créer un nouveau poste

**Body :**
```json
{
  "nom": "Chef de cuisine"
}
```

**Réponse (201) :** Poste créé

---

##### PUT `/api/postes/{id}`
**Description :** Modifier un poste

**Body :**
```json
{
  "nom": "Chef de cuisine senior"
}
```

**Réponse (200) :** Poste mis à jour

---

##### DELETE `/api/postes/{id}`
**Description :** Supprimer un poste

**Réponse (204) :** Pas de contenu

---

### Users (Collaborateurs)

##### GET `/api/users`
**Description :** Liste tous les collaborateurs avec leur affectation en cours

**Réponse (200) :**
```json
[
  {
    "id": 2,
    "prenom": "Marie",
    "nom": "Martin",
    "email": "marie@example.com",
    "nom_complet": "Marie Martin",
    "affectations": [
      {
        "id": 1,
        "date_debut": "2025-11-01",
        "date_fin": null,
        "restaurant": {
          "id": 1,
          "nom": "McDo Paris Opéra"
        },
        "poste": {
          "id": 3,
          "nom": "Manager"
        }
      }
    ]
  }
]
```

**Note :** Affectations = seulement la plus récente en cours

---

##### GET `/api/users/{id}`
**Description :** Détails d'un collaborateur

**Réponse (200) :**
```json
{
  "id": 2,
  "prenom": "Marie",
  "nom": "Martin",
  "email": "marie@example.com",
  "nom_complet": "Marie Martin"
}
```

---

##### POST `/api/users`
**Description :** Créer un nouveau collaborateur

**Body :**
```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean@example.com",
  "password": "motdepasse123",
  "password_confirmation": "motdepasse123"
}
```

**Validation :**
- `prenom` : requis, max 255 caractères
- `nom` : requis, max 255 caractères
- `email` : requis, format email, unique
- `password` : requis, confirmé, respect des règles Laravel

**Réponse (201) :** User créé

---

##### PUT `/api/users/{id}`
**Description :** Modifier un collaborateur

**Body :**
```json
{
  "prenom": "Jean",
  "nom": "Dupont-Martin"
}
```

**Note :** 
- Champs optionnels : `prenom`, `nom`, `email`, `password`
- `password` nécessite `password_confirmation` si fourni
- `email` doit rester unique

**Réponse (200) :** User mis à jour

---

##### DELETE `/api/users/{id}`
**Description :** Supprimer un collaborateur

**Réponse (204) :** Pas de contenu

---

### Affectations

##### GET `/api/affectations`
**Description :** Liste toutes les affectations avec relations complètes

**Réponse (200) :**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "restaurant_id": 1,
    "poste_id": 3,
    "date_debut": "2025-11-01T00:00:00.000000Z",
    "date_fin": "2025-12-31T00:00:00.000000Z",
    "created_at": "2025-11-12T10:00:00.000000Z",
    "updated_at": "2025-11-12T10:00:00.000000Z",
    "user": {
      "id": 2,
      "prenom": "Marie",
      "nom": "Martin",
      "email": "marie@example.com"
    },
    "restaurant": {
      "id": 1,
      "nom": "McDo Paris Opéra",
      "ville": "Paris"
    },
    "poste": {
      "id": 3,
      "nom": "Manager"
    }
  }
]
```

---

##### POST `/api/affectations`
**Description :** Créer une nouvelle affectation

**Body :**
```json
{
  "user_id": 2,
  "restaurant_id": 1,
  "poste_id": 3,
  "date_debut": "2025-11-15",
  "date_fin": "2025-12-31"
}
```

**Validation :**
- `user_id` : requis, doit exister dans `users`
- `restaurant_id` : requis, doit exister dans `restaurants`
- `poste_id` : requis, doit exister dans `postes`
- `date_debut` : requis, format date
- `date_fin` : optionnel, format date, doit être >= `date_debut`

**Réponse (201) :**
```json
{
  "id": 14,
  "user_id": 2,
  "restaurant_id": 1,
  "poste_id": 3,
  "date_debut": "2025-11-15T00:00:00.000000Z",
  "date_fin": "2025-12-31T00:00:00.000000Z",
  "user": { ... },
  "restaurant": { ... },
  "poste": { ... }
}
```

---

##### GET `/api/affectations/{id}`
**Description :** Détails d'une affectation

**Réponse (200) :** Affectation avec relations

---

##### PUT `/api/affectations/{id}`
**Description :** Modifier une affectation

**Body :**
```json
{
  "date_fin": "2026-01-31"
}
```

**Réponse (200) :** Affectation mise à jour

---

##### DELETE `/api/affectations/{id}`
**Description :** Supprimer une affectation

**Réponse (204) :** Pas de contenu

---

### Récapitulatif des endpoints

| Méthode | Endpoint | Protection | Description |
|---------|----------|------------|-------------|
| POST | `/api/login` | ❌ Public | Connexion |
| POST | `/api/register` | ❌ Public | Inscription |
| GET | `/api/restaurants` | ✅ Protégé | Liste restaurants |
| GET | `/api/restaurants/{id}` | ✅ Protégé | Détails restaurant + affectations |
| POST | `/api/restaurants` | ✅ Protégé | Créer restaurant |
| PUT | `/api/restaurants/{id}` | ✅ Protégé | Modifier restaurant |
| DELETE | `/api/restaurants/{id}` | ✅ Protégé | Supprimer restaurant |
| GET | `/api/postes` | ✅ Protégé | Liste postes |
| POST | `/api/postes` | ✅ Protégé | Créer poste |
| PUT | `/api/postes/{id}` | ✅ Protégé | Modifier poste |
| DELETE | `/api/postes/{id}` | ✅ Protégé | Supprimer poste |
| GET | `/api/users` | ✅ Protégé | Liste collaborateurs |
| GET | `/api/users/{id}` | ✅ Protégé | Détails collaborateur |
| POST | `/api/users` | ✅ Protégé | Créer collaborateur |
| PUT | `/api/users/{id}` | ✅ Protégé | Modifier collaborateur |
| DELETE | `/api/users/{id}` | ✅ Protégé | Supprimer collaborateur |
| GET | `/api/affectations` | ✅ Protégé | Liste affectations |
| GET | `/api/affectations/{id}` | ✅ Protégé | Détails affectation |
| POST | `/api/affectations` | ✅ Protégé | Créer affectation |
| PUT | `/api/affectations/{id}` | ✅ Protégé | Modifier affectation |
| DELETE | `/api/affectations/{id}` | ✅ Protégé | Supprimer affectation |

---

## 4. Pages et Routes Frontend

### 🗺️ Architecture des routes
**Fichier :** `frontend/src/App.jsx`

```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  {/* Routes protégées */}
  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
  <Route path="/restaurants" element={<ProtectedRoute><RestaurantsPage /></ProtectedRoute>} />
  <Route path="/restaurants/:id" element={<ProtectedRoute><RestaurantDetailPage /></ProtectedRoute>} />
  <Route path="/collaborateurs" element={<ProtectedRoute><CollaborateursPage /></ProtectedRoute>} />
  <Route path="/fonctions" element={<ProtectedRoute><FonctionsPage /></ProtectedRoute>} />
  <Route path="/affectations" element={<ProtectedRoute><AffectationsPage /></ProtectedRoute>} />
</Routes>
```

---

### 📄 Pages disponibles

#### 1. `/login` - Page de connexion
**Fichier :** `frontend/src/pages/LoginPage.jsx`

**Fonctionnalités :**
- Formulaire email + password
- Appel API `POST /api/login`
- Stockage du token dans AuthContext
- Redirection vers `/dashboard` après connexion

**Composants :**
- Formulaire avec validation
- Message d'erreur si identifiants invalides

---

#### 2. `/register` - Page d'inscription
**Fichier :** `frontend/src/pages/RegisterPage.jsx`

**Fonctionnalités :**
- Formulaire : prenom, nom, email, password, password_confirmation
- Appel API `POST /api/register`
- Redirection vers `/dashboard` après inscription

---

#### 3. `/dashboard` - Tableau de bord
**Fichier :** `frontend/src/pages/DashboardPage.jsx`

**Fonctionnalités :**
- Vue d'ensemble de l'application
- Liens vers les différentes sections
- Affichage du nom de l'utilisateur connecté

**Composants :**
- Cards cliquables pour navigation rapide
- Statistiques (à venir)

---

#### 4. `/restaurants` - Gestion des restaurants
**Fichier :** `frontend/src/pages/RestaurantsPage.jsx`

**Fonctionnalités :**
- **Liste** : Tous les restaurants
- **Création** : Formulaire (nom, adresse, code_postal, ville)
- **Modification** : Non disponible sur cette page (voir détails)
- **Suppression** : Bouton sur chaque restaurant
- **Filtres** : Nom, code postal, ville
- **Navigation** : Clic sur restaurant → page détails

**API appelées :**
- `GET /api/restaurants` : Chargement liste
- `POST /api/restaurants` : Création
- `DELETE /api/restaurants/{id}` : Suppression

**Composants :**
- `Restaurant.jsx` : Card affichant un restaurant

---

#### 5. `/restaurants/:id` - Détails d'un restaurant
**Fichier :** `frontend/src/pages/RestaurantDetailPage.jsx`

**Fonctionnalités :**
- **Affichage** : Informations complètes du restaurant
- **Modification** : Bouton "Modifier" → Formulaire inline
- **Affectations** : Liste des collaborateurs en poste
- **Filtres affectations** : Poste, nom collaborateur, date début

**API appelées :**
- `GET /api/restaurants/{id}` : Chargement détails + affectations
- `PUT /api/restaurants/{id}` : Modification
- `GET /api/postes` : Liste postes pour filtre

**Workflow modification :**
1. Clic sur "Modifier"
2. Formulaire s'affiche avec données pré-remplies
3. Modification des champs
4. "Enregistrer" → Appel API PUT → Rechargement données
5. Retour en mode affichage

---

#### 6. `/collaborateurs` - Gestion des collaborateurs
**Fichier :** `frontend/src/pages/CollaborateursPage.jsx`

**Fonctionnalités :**
- **Liste** : Tous les collaborateurs avec affectation en cours
- **Création** : Formulaire complet (prenom, nom, email, password)
- **Modification** : 
  - Clic sur collaborateur → Formulaire édition
  - Modification : prenom, nom
  - Optionnel : Créer nouvelle affectation (restaurant, poste, date_debut, date_fin)
- **Suppression** : Bouton sur chaque collaborateur

**API appelées :**
- `GET /api/users` : Chargement liste
- `POST /api/users` : Création
- `PUT /api/users/{id}` : Modification nom
- `POST /api/affectations` : Création affectation (si renseignée)
- `DELETE /api/users/{id}` : Suppression
- `GET /api/restaurants` : Dropdown restaurants
- `GET /api/postes` : Dropdown postes

**Composants :**
- `Collaborateur.jsx` : Card affichant un collaborateur

**Workflow modification :**
1. Clic sur collaborateur
2. Formulaire s'ouvre avec 2 sections :
   - **Identité** : prenom, nom (pré-rempli)
   - **Nouvelle affectation (optionnelle)** : restaurant, poste, date_debut, date_fin
3. "Mettre à jour" :
   - PUT `/api/users/{id}` avec prenom/nom
   - Si affectation renseignée → POST `/api/affectations`

---

#### 7. `/fonctions` - Gestion des fonctions (postes)
**Fichier :** `frontend/src/pages/FonctionsPage.jsx`

**Fonctionnalités :**
- **Liste** : Tous les postes
- **Création** : Formulaire (nom)
- **Modification** : Édition inline du nom
- **Suppression** : Bouton sur chaque poste

**API appelées :**
- `GET /api/postes` : Chargement liste
- `POST /api/postes` : Création
- `PUT /api/postes/{id}` : Modification
- `DELETE /api/postes/{id}` : Suppression

**Composants :**
- `Poste.jsx` : Card affichant un poste avec boutons

---

#### 8. `/affectations` - Vue globale des affectations
**Fichier :** `frontend/src/pages/AffectationsPage.jsx`

**Fonctionnalités :**
- **Liste** : Toutes les affectations (tableau)
- **Filtres** : 
  - Collaborateur (nom ou email)
  - Restaurant
  - Poste
  - Statut (En cours / À venir / Terminée)
- **Statuts automatiques** :
  - 🟢 **En cours** : date_debut ≤ aujourd'hui ET (date_fin = null OU date_fin ≥ aujourd'hui)
  - 🔵 **À venir** : date_debut > aujourd'hui
  - ⚫ **Terminée** : date_fin < aujourd'hui

**API appelées :**
- `GET /api/affectations` : Chargement toutes les affectations
- `GET /api/restaurants` : Dropdown restaurants pour filtre
- `GET /api/postes` : Dropdown postes pour filtre

**Tableau affiché :**
| Collaborateur | Restaurant | Poste | Date début | Date fin | Statut |
|---------------|------------|-------|------------|----------|--------|
| Marie Martin | McDo Paris | Manager | 01/11/2025 | 31/12/2025 | En cours |

---

### 🔐 Protection des routes

#### Composant `ProtectedRoute`
**Fichier :** `frontend/src/components/ProtectedRoute.jsx`

```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
}
```

**Fonctionnement :**
- Vérifie si utilisateur connecté via `AuthContext`
- Si non connecté → Redirection vers `/login`
- Si connecté → Affiche la page demandée

---

### 🧭 Navigation entre pages

#### Header commun
Présent sur toutes les pages protégées :
```jsx
<nav>
  <button onClick={() => navigate('/dashboard')}>Dashboard</button>
  <button onClick={() => navigate('/restaurants')}>Restaurants</button>
  <button onClick={() => navigate('/collaborateurs')}>Collaborateurs</button>
  <button onClick={() => navigate('/fonctions')}>Fonctions</button>
  <button onClick={() => navigate('/affectations')}>Affectations</button>
  <button onClick={handleLogout}>Déconnexion</button>
</nav>
```

#### Navigation programmatique
```jsx
const navigate = useNavigate();

// Exemple : Clic sur restaurant → Aller vers détails
onClick={() => navigate(`/restaurants/${restaurant.id}`)}

// Retour à la liste
onClick={() => navigate('/restaurants')}
```

---

### 📊 Flux de données

```
┌──────────────────────────────────────────────┐
│              Page Component                  │
│  - useState pour données                     │
│  - useEffect pour fetch initial              │
│  - Fonctions de gestion (CRUD)               │
└──────────┬───────────────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │   axios      │ ← Token from AuthContext
    │  HTTP calls  │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  Laravel API │
    │  (Backend)   │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │   SQLite DB  │
    └──────────────┘
```

**Exemple concret : Chargement restaurants**
1. `RestaurantsPage` monte → `useEffect` s'exécute
2. `fetchRestaurants()` → `axios.get('/api/restaurants', { headers: { Authorization: Bearer ${token} } })`
3. Backend vérifie token → Requête validée
4. `RestaurantController@index` → `Restaurant::all()`
5. Réponse JSON renvoyée au frontend
6. `setRestaurants(response.data)` → State mis à jour
7. React re-render → Liste affichée

---

### 🎨 Composants réutilisables

#### `Restaurant.jsx`
```jsx
<Restaurant 
  restaurant={restaurant} 
  onUpdate={fetchRestaurants} 
  token={token} 
/>
```
Affiche un restaurant avec boutons Modifier/Supprimer

#### `Collaborateur.jsx`
```jsx
<Collaborateur 
  collaborateur={user} 
  onEdit={handleEdit} 
  onDelete={handleDelete} 
/>
```
Affiche un collaborateur avec son affectation en cours

#### `Poste.jsx`
```jsx
<Poste 
  poste={poste} 
  onUpdate={fetchPostes} 
  token={token} 
/>
```
Affiche un poste avec édition inline

---

### 📱 Responsive Design

Toutes les pages utilisent **Tailwind CSS** avec breakpoints :
- **Mobile** : 1 colonne
- **Tablet (md)** : 2-3 colonnes
- **Desktop (lg)** : Mise en page optimisée

Classes utilisées :
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

---

## 🚀 Points d'amélioration futurs

### Backend
- [ ] Pagination sur liste des restaurants/collaborateurs
- [ ] Recherche API-side (plus performant que filtrage client)
- [ ] Logs des actions (audit trail)
- [ ] Gestion des rôles (Admin, Manager, User)
- [ ] Export PDF/Excel des affectations

### Frontend
- [ ] Gestion d'erreurs plus élaborée (toasts)
- [ ] Loading states avec spinners
- [ ] Confirmation avant suppression (modal)
- [ ] Validation côté client avant envoi API
- [ ] Dark mode
- [ ] Graphiques/statistiques sur dashboard

### Fonctionnalités métier
- [ ] Historique complet des affectations d'un collaborateur
- [ ] Détection conflits d'affectations (même user, même période)
- [ ] Notifications par email
- [ ] Planning visuel (calendrier)
- [ ] Import CSV de collaborateurs/restaurants

---

## 📞 Support

Pour toute question ou amélioration, consultez le code source ou contactez l'équipe de développement.

**Version :** 1.0  
**Dernière mise à jour :** 12 novembre 2025
