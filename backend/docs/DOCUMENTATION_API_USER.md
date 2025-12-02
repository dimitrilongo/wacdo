# 📚 Documentation API Utilisateur - WACDO

## 🔧 Architecture Backend mise en place

### 1. Structure de la base de données

#### Table `users`
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    date_embauche DATETIME NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    mot_de_passe VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### 2. Modèle User (app/Models/User.php)

#### Traits utilisés :
- `HasApiTokens` : Pour l'authentification via tokens (Laravel Sanctum)
- `HasFactory` : Pour les factories de test
- `Notifiable` : Pour les notifications

#### Attributs configurés :
- **Fillable** : `nom`, `prenom`, `email`, `date_embauche`, `is_admin`, `mot_de_passe`
- **Hidden** : `mot_de_passe`, `remember_token`
- **Casts** : 
  - `email_verified_at` → datetime
  - `date_embauche` → datetime
  - `is_admin` → boolean
  - `mot_de_passe` → hashed (automatiquement hashé)

#### Méthodes personnalisées :
- `getAuthPassword()` : Retourne le mot de passe pour l'authentification
- `getAuthIdentifierName()` : Définit l'email comme identifiant unique
- `getNomCompletAttribute()` : Accessor pour obtenir "Prénom NOM"

### 3. Contrôleur AuthController (app/Http/Controllers/AuthController.php)

#### Méthodes disponibles :
1. `register()` - Inscription
2. `login()` - Connexion
3. `logout()` - Déconnexion
4. `me()` - Informations utilisateur connecté

#### Validation des données :
- **Inscription** : nom, prenom, email unique, mot_de_passe (min 8 chars + confirmation), date_embauche, is_admin
- **Connexion** : email + mot_de_passe

#### Gestion des erreurs :
- Codes HTTP appropriés (200, 201, 401, 422, 500)
- Messages d'erreur en français
- Structure JSON cohérente

### 4. Routes API (routes/api.php)

#### Routes publiques :
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion

#### Routes protégées (middleware auth:sanctum) :
- `GET /api/me` - Informations utilisateur
- `POST /api/logout` - Déconnexion

### 5. Migrations

#### Migration principale : `2025_11_07_064157_modify_users_table_for_custom_fields.php`
- Suppression de la colonne `name`
- Ajout des colonnes : `nom`, `prenom`, `date_embauche`, `is_admin`
- Renommage `password` → `mot_de_passe`

### 6. Seeders (database/seeders/UserSeeder.php)

#### Utilisateurs de test créés :
1. **Admin** : admin@wacdo.com / admin123 (is_admin: true)
2. **Jean Dupont** : jean.dupont@wacdo.com / password123 (is_admin: false)
3. **Sophie Martin** : sophie.martin@wacdo.com / password123 (is_admin: false)

---

## 🚀 Guide d'utilisation de l'API

### Base URL
```
http://127.0.0.1:8000/api
```

### 1. 📝 Inscription d'un utilisateur

**Endpoint :** `POST /register`

**Headers :**
```
Content-Type: application/json
```

**Body :**
```json
{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "mot_de_passe": "motdepasse123",
    "mot_de_passe_confirmation": "motdepasse123",
    "date_embauche": "2025-01-15",
    "is_admin": false
}
```

**Réponse de succès (201) :**
```json
{
    "success": true,
    "message": "Utilisateur créé avec succès",
    "user": {
        "id": 1,
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@example.com",
        "date_embauche": "2025-01-15T00:00:00.000000Z",
        "is_admin": false,
        "nom_complet": "Jean Dupont"
    },
    "token": "1|abc123...xyz"
}
```

**Exemple curl :**
```bash
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "mot_de_passe": "motdepasse123",
    "mot_de_passe_confirmation": "motdepasse123",
    "date_embauche": "2025-01-15",
    "is_admin": false
  }'
```

### 2. 🔐 Connexion

**Endpoint :** `POST /login`

**Headers :**
```
Content-Type: application/json
```

**Body :**
```json
{
    "email": "jean.dupont@example.com",
    "mot_de_passe": "motdepasse123"
}
```

**Réponse de succès (200) :**
```json
{
    "success": true,
    "message": "Connexion réussie",
    "user": {
        "id": 1,
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@example.com",
        "date_embauche": "2025-01-15T00:00:00.000000Z",
        "is_admin": false,
        "nom_complet": "Jean Dupont"
    },
    "token": "2|def456...uvw"
}
```

**Exemple curl :**
```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "mot_de_passe": "motdepasse123"
  }'
```

### 3. 👤 Informations utilisateur connecté

**Endpoint :** `GET /me`

**Headers :**
```
Authorization: Bearer {token}
```

**Réponse de succès (200) :**
```json
{
    "success": true,
    "user": {
        "id": 1,
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@example.com",
        "date_embauche": "2025-01-15T00:00:00.000000Z",
        "is_admin": false,
        "nom_complet": "Jean Dupont"
    }
}
```

**Exemple curl :**
```bash
curl -X GET http://127.0.0.1:8000/api/me \
  -H "Authorization: Bearer {token}"
```

### 4. 🚪 Déconnexion

**Endpoint :** `POST /logout`

**Headers :**
```
Authorization: Bearer {token}
```

**Réponse de succès (200) :**
```json
{
    "success": true,
    "message": "Déconnexion réussie"
}
```

**Exemple curl :**
```bash
curl -X POST http://127.0.0.1:8000/api/logout \
  -H "Authorization: Bearer {token}"
```

---

## 🚨 Gestion des erreurs

### Erreurs de validation (422)
```json
{
    "success": false,
    "message": "Erreurs de validation",
    "errors": {
        "email": ["Le champ email doit être une adresse email valide."],
        "mot_de_passe": ["Le champ mot de passe doit contenir au moins 8 caractères."]
    }
}
```

### Identifiants incorrects (401)
```json
{
    "success": false,
    "message": "Identifiants incorrects"
}
```

### Token invalide/expiré (401)
```json
{
    "message": "Unauthenticated."
}
```

### Erreur serveur (500)
```json
{
    "success": false,
    "message": "Erreur lors de la création de l'utilisateur",
    "error": "Message d'erreur technique"
}
```

---

## 🛠️ Règles de validation

### Inscription
- **nom** : obligatoire, string, max 255 caractères
- **prenom** : obligatoire, string, max 255 caractères
- **email** : obligatoire, format email valide, max 255 caractères, unique en base
- **mot_de_passe** : obligatoire, string, minimum 8 caractères, confirmation requise
- **date_embauche** : obligatoire, format date valide
- **is_admin** : optionnel, boolean (défaut: false)

### Connexion
- **email** : obligatoire, format email valide
- **mot_de_passe** : obligatoire, string

---

## 🔐 Sécurité

### Authentification
- **Token-based** via Laravel Sanctum
- **Tokens personnels** générés à chaque connexion
- **Révocation** automatique à la déconnexion

### Mots de passe
- **Hashage automatique** via bcrypt
- **Minimum 8 caractères** requis
- **Confirmation** obligatoire à l'inscription

### Validation
- **Sanitisation** automatique des entrées
- **Validation stricte** des formats
- **Messages d'erreur** sécurisés

---

## 🧪 Tests

### Utilisateurs de test disponibles
```
Admin : admin@wacdo.com / admin123
Employé : jean.dupont@wacdo.com / password123  
Employée : sophie.martin@wacdo.com / password123
```

### Script de test
```bash
# Exécuter le script de test complet
./test_api.sh
```

### Commandes utiles
```bash
# Démarrer le serveur
php artisan serve --host=127.0.0.1 --port=8000

# Créer les utilisateurs de test
php artisan db:seed

# Vider et recréer la base
php artisan migrate:fresh --seed
```

---

## 📁 Structure des fichiers modifiés/créés

```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── AuthController.php          # Contrôleur d'authentification
│   └── Models/
│       └── User.php                        # Modèle utilisateur modifié
├── database/
│   ├── migrations/
│   │   └── 2025_11_07_064157_modify_users_table_for_custom_fields.php
│   └── seeders/
│       ├── DatabaseSeeder.php              # Modifié
│       └── UserSeeder.php                  # Créé
├── routes/
│   └── api.php                             # Routes API ajoutées
├── API_EXEMPLES.md                         # Exemples d'utilisation
├── DOCUMENTATION_API_USER.md               # Cette documentation
└── test_api.sh                             # Script de test
```

---

## 🎯 Points clés de l'implémentation

### ✅ Ce qui a été fait :
1. **Migration personnalisée** pour adapter la table users à vos besoins
2. **Modèle User** configuré avec les bons attributs et relations
3. **Contrôleur AuthController** complet avec validation et gestion d'erreurs
4. **Routes API** organisées (publiques/protégées)
5. **Authentification par tokens** avec Laravel Sanctum
6. **Seeders** pour les données de test
7. **Documentation complète** et exemples pratiques

### 🔄 Architecture respectée :
- **Séparation des responsabilités** (Model-Controller-Routes)
- **Validation côté serveur** stricte
- **Réponses JSON** standardisées
- **Gestion d'erreurs** appropriée
- **Sécurité** avec hashage des mots de passe et tokens

Cette API est maintenant prête à être intégrée avec votre frontend React ! 🚀
