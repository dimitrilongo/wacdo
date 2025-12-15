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
```

### Frontend (React)

```bash
cd frontend
npm install
```

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

## API Routes

Le backend Laravel expose les routes API suivantes :

- `GET /api/` - Route de test de l'API

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
npm run build      # Build de production
npm run preview    # Prévisualiser le build
npm run lint       # Linter le code
```
