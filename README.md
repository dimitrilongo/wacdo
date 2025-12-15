# Application Wacdo

Cette application est composée d'un backend Laravel et d'un frontend React.

## Structure du projet

```
wacdo/
├── backend/          # Application Laravel (API)
├── frontend/         # Application React
└── README.md         # Ce fichier
```

## Prérequis

- PHP >= 8.2
- Composer
- Node.js >= 18
- npm

## Installation et configuration

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=AdminUserSeeder  # Créer un utilisateur admin (email: admin@wacdo.com, mot de passe: Admin123!)
```

**Note :** En production, pensez à changer le mot de passe admin après la première connexion.

### Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env.local  # Copier le fichier d'environnement pour le développement local
```

**Note:** Le fichier `.env.local` contient l'URL de l'API pour le développement local (`http://127.0.0.1:8000/api`). En production, le fichier `.env` contient l'URL de production. Le fichier `.env.local` n'est pas versionné (ignoré par Git).

## Démarrage des serveurs

### Backend Laravel

```bash
cd backend
php artisan serve --port=8000
```

Le backend sera accessible sur : http://localhost:8000

### Frontend React

```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur : http://localhost:5173

## URLs des applications

### Production

- **Application en ligne** : https://eager-mestorf.141-94-242-165.plesk.page/login

### Développement local

- **Backend Laravel** : http://localhost:8000
- **Frontend React** : http://localhost:5173

## Technologies utilisées

### Backend

- Laravel 12.x
- PHP 8.x
- SQLite (base de données par défaut)

### Frontend

- React 19.x
- Vite 7.x
- JavaScript (ES6+)

## Architecture

### Diagrammes

- **Diagramme de classes UML** : [docs/diagramme-classes.mmd](docs/diagramme-classes.mmd)
- **Diagramme de base de données (ERD)** : [docs/diagramme-base-donnees.mmd](docs/diagramme-base-donnees.mmd)

## 🔒 Sécurité

### Scanner les secrets avec Gitleaks

Gitleaks détecte les secrets (mots de passe, tokens, clés) dans le code Git.

**Installation (macOS):**
```bash
brew install gitleaks
```

**Scanner le projet:**
```bash
./gitleaks-scan.sh
```

**Commandes manuelles:**
```bash
# Scan complet
gitleaks detect --config .gitleaks.toml --verbose

# Générer rapport JSON
gitleaks detect --config .gitleaks.toml --report-path gitleaks-report.json

# Scan avant commit (pre-commit hook)
gitleaks protect --staged --verbose
```

**⚠️ Fichiers sensibles à ne JAMAIS commiter:**
- `backend/.env` (contient APP_KEY, DB_PASSWORD)
- `frontend/.env.local` (config locale)
- `gitleaks-report.json` (rapport de scan)

## API Routes

Le backend Laravel expose les routes API suivantes :

- `GET /api/` - Route de test de l'API

### Documentation et tests API

- **Collection Postman** : [Workspace Wacdo](https://solar-satellite-201711.postman.co/workspace/Wacdo~019869bf-2339-4c0b-a6bc-1ed2a11380b9/overview)
  - Testez toutes les routes API directement depuis Postman

## Développement

### Commandes utiles Laravel

```bash
php artisan route:list          # Lister toutes les routes
php artisan make:controller     # Créer un contrôleur
php artisan make:model          # Créer un modèle
php artisan migrate             # Exécuter les migrations
```

### Commandes utiles React

```bash
npm run build                        # Build de production
npm run preview                      # Prévisualiser le build
npm run lint                         # Linter le code
rm -rf dist node_modules/.vite       # Nettoyer le cache Vite (si problème d'affichage)
```

## Déploiement en production (Plesk)

### Script de déploiement automatique

Le projet utilise un script de déploiement automatique [`frontend/deploy.sh`](frontend/deploy.sh) qui :

1. **Nettoie le cache** : Supprime `dist` et `.vite` pour éviter les problèmes de cache
2. **Installe les dépendances** : Execute `npm install` avec Node.js 20 de Plesk
3. **Build l'application** : Génère les fichiers de production dans `dist/`
4. **Nettoie l'ancien build** : Supprime les anciens fichiers dans `backend/public/`
5. **Copie les nouveaux fichiers** : Déplace le contenu de `dist/` vers `backend/public/`
6. **Configure le .htaccess** : Crée les règles de réécriture pour React Router

### Exécution du déploiement

```bash
# Depuis le serveur Plesk via SSH
cd /var/www/vhosts/eager-mestorf.141-94-242-165.plesk.page/httpdocs/frontend
bash deploy.sh
```

### Architecture de déploiement

```
/var/www/vhosts/eager-mestorf.141-94-242-165.plesk.page/httpdocs/
├── frontend/          # Code source React + script deploy.sh
│   ├── src/
│   ├── deploy.sh
│   └── ...
└── backend/
    ├── app/
    ├── public/        # Build React déployé ici (assets/, index.html)
    │   ├── .htaccess  # Géré par deploy.sh
    │   ├── index.html # Point d'entrée React
    │   └── assets/    # JS/CSS compilés
    └── ...
```

### Points importants

- Le frontend React est servi depuis `backend/public/` (même domaine que l'API Laravel)
- Le `.htaccess` redirige toutes les routes vers `index.html` pour React Router
- Les headers de cache sont désactivés pour forcer le rechargement des nouvelles versions
- Le script utilise le binaire Node.js de Plesk : `/opt/plesk/node/20/bin/npm`

## TODO

- [ ] Gérer les mots de passe oubliés (backend + envoi d'email)
