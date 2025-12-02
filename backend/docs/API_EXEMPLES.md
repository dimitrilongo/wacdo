# Exemples d'utilisation de l'API d'authentification

## 1. Inscription d'un nouvel utilisateur

**POST** `/api/register`

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

**Réponse de succès (201):**
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

## 2. Connexion d'un utilisateur

**POST** `/api/login`

```json
{
    "email": "jean.dupont@example.com",
    "mot_de_passe": "motdepasse123"
}
```

**Réponse de succès (200):**
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

## 3. Obtenir les informations de l'utilisateur connecté

**GET** `/api/me`

**Headers:** 
```
Authorization: Bearer {token}
```

**Réponse de succès (200):**
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

## 4. Déconnexion

**POST** `/api/logout`

**Headers:** 
```
Authorization: Bearer {token}
```

**Réponse de succès (200):**
```json
{
    "success": true,
    "message": "Déconnexion réussie"
}
```

## 5. Exemples d'erreurs

### Erreur de validation (422)
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

## 6. Tester avec curl

### Inscription
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Martin",
    "prenom": "Sophie",
    "email": "sophie.martin@example.com",
    "mot_de_passe": "password123",
    "mot_de_passe_confirmation": "password123",
    "date_embauche": "2025-02-01",
    "is_admin": false
  }'
```

### Connexion
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sophie.martin@example.com",
    "mot_de_passe": "password123"
  }'
```

### Informations utilisateur (remplacer {token} par le vrai token)
```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer {token}"
```
