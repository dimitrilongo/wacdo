# Documentation des Routes API - McWacdo Manager

## Base URL

```
http://127.0.0.1:8000/api
```

---

## 🔓 Routes Publiques (Non authentifiées)

### Authentification

| Méthode | Route       | Description                         | Corps de la requête                                                            |
| ------- | ----------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| `POST`  | `/register` | Créer un nouveau compte utilisateur | `{ name, email, password, password_confirmation, nom, prenom, date_embauche }` |
| `POST`  | `/login`    | Se connecter et obtenir un token    | `{ email, mot_de_passe }`                                                      |

### Test

| Méthode | Route   | Description                          |
| ------- | ------- | ------------------------------------ |
| `GET`   | `/test` | Route de test de l'API               |
| `GET`   | `/data` | Route de test retournant des données |

---

## 🔒 Routes Protégées (Authentification requise)

**Header requis :** `Authorization: Bearer {token}`

### Authentification

| Méthode | Route     | Description                                                  |
| ------- | --------- | ------------------------------------------------------------ |
| `POST`  | `/logout` | Se déconnecter et révoquer le token                          |
| `GET`   | `/me`     | Obtenir les informations de l'utilisateur connecté           |
| `GET`   | `/user`   | Obtenir les informations de l'utilisateur connecté (Sanctum) |

---

### 🍔 Restaurants

| Méthode     | Route               | Description                       | Corps de la requête                    |
| ----------- | ------------------- | --------------------------------- | -------------------------------------- |
| `GET`       | `/restaurants`      | Liste tous les restaurants        | -                                      |
| `POST`      | `/restaurants`      | Créer un nouveau restaurant       | `{ nom, adresse, code_postal, ville }` |
| `GET`       | `/restaurants/{id}` | Afficher un restaurant spécifique | -                                      |
| `PUT/PATCH` | `/restaurants/{id}` | Modifier un restaurant            | `{ nom, adresse, code_postal, ville }` |
| `DELETE`    | `/restaurants/{id}` | Supprimer un restaurant           | -                                      |

**Réponse GET /restaurants/{id} inclut :**

- Informations du restaurant
- Liste des affectations avec collaborateurs et postes

---

### 👥 Utilisateurs (Collaborateurs)

| Méthode     | Route         | Description                        | Corps de la requête                                     |
| ----------- | ------------- | ---------------------------------- | ------------------------------------------------------- |
| `GET`       | `/users`      | Liste tous les utilisateurs        | -                                                       |
| `POST`      | `/users`      | Créer un nouvel utilisateur        | `{ name, email, password, nom, prenom, date_embauche }` |
| `GET`       | `/users/{id}` | Afficher un utilisateur spécifique | -                                                       |
| `PUT/PATCH` | `/users/{id}` | Modifier un utilisateur            | `{ name, email, nom, prenom, date_embauche }`           |
| `DELETE`    | `/users/{id}` | Supprimer un utilisateur           | -                                                       |

**Réponse GET /users inclut :**

- Informations de l'utilisateur
- Liste des affectations (pour filtrer les "Non affectés")

---

### 💼 Postes (Fonctions)

| Méthode     | Route          | Description                  | Corps de la requête    |
| ----------- | -------------- | ---------------------------- | ---------------------- |
| `GET`       | `/postes`      | Liste tous les postes        | -                      |
| `POST`      | `/postes`      | Créer un nouveau poste       | `{ nom, description }` |
| `GET`       | `/postes/{id}` | Afficher un poste spécifique | -                      |
| `PUT/PATCH` | `/postes/{id}` | Modifier un poste            | `{ nom, description }` |
| `DELETE`    | `/postes/{id}` | Supprimer un poste           | -                      |

---

### 📋 Affectations

| Méthode     | Route                | Description                         | Corps de la requête                                           |
| ----------- | -------------------- | ----------------------------------- | ------------------------------------------------------------- |
| `GET`       | `/affectations`      | Liste toutes les affectations       | -                                                             |
| `POST`      | `/affectations`      | Créer une nouvelle affectation      | `{ user_id, restaurant_id, poste_id, date_debut, date_fin? }` |
| `GET`       | `/affectations/{id}` | Afficher une affectation spécifique | -                                                             |
| `PUT/PATCH` | `/affectations/{id}` | Modifier une affectation            | `{ user_id, restaurant_id, poste_id, date_debut, date_fin? }` |
| `DELETE`    | `/affectations/{id}` | Supprimer une affectation           | -                                                             |

**Note :** `date_fin` est optionnel (null = affectation en cours)

---

## 📝 Exemples de requêtes

### Inscription

```bash
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "nom": "Doe",
    "prenom": "John",
    "date_embauche": "2025-01-15"
  }'
```

### Connexion

```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Récupérer les restaurants (avec token)

```bash
curl -X GET http://127.0.0.1:8000/api/restaurants \
  -H "Authorization: Bearer {votre_token}"
```

### Créer une affectation

```bash
curl -X POST http://127.0.0.1:8000/api/affectations \
  -H "Authorization: Bearer {votre_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "restaurant_id": 2,
    "poste_id": 3,
    "date_debut": "2025-12-01",
    "date_fin": null
  }'
```

---

## 🔐 Authentification

L'API utilise **Laravel Sanctum** pour l'authentification par tokens.

### Processus

1. **Inscription** ou **Connexion** → Récupération d'un token
2. Inclusion du token dans le header `Authorization: Bearer {token}` pour toutes les requêtes protégées
3. **Déconnexion** → Révocation du token

### Format du token

```
Authorization: Bearer 1|AbCdEfGhIjKlMnOpQrStUvWxYz...
```

---

## 📊 Codes de réponse HTTP

| Code  | Signification                               |
| ----- | ------------------------------------------- |
| `200` | Succès - Requête GET/PUT réussie            |
| `201` | Créé - Ressource POST créée avec succès     |
| `204` | Pas de contenu - DELETE réussi              |
| `400` | Mauvaise requête - Données invalides        |
| `401` | Non autorisé - Token manquant ou invalide   |
| `404` | Non trouvé - Ressource inexistante          |
| `422` | Entité non traitable - Erreur de validation |
| `500` | Erreur serveur - Erreur interne             |

---

## 🛠️ Outils recommandés

- **Postman** - Interface graphique pour tester les API
- **Insomnia** - Alternative à Postman
- **curl** - Ligne de commande
- **HTTPie** - Ligne de commande plus lisible
- **Extensions VS Code** - REST Client, Thunder Client

---

_Dernière mise à jour : 2 décembre 2025_
