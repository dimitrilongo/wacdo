# 🚀 Guide Frontend - Pages Login & Register

## 📋 Vue d'ensemble

Ce document explique la mise en place du frontend React avec les pages de connexion et d'inscription utilisant ShadCN/UI et Tailwind CSS.

---

## 🛠️ Technologies utilisées

- **React 19** - Framework frontend
- **React Router DOM** - Navigation entre pages
- **Tailwind CSS** - Framework CSS utilitaire
- **ShadCN/UI** - Composants UI modernes
- **Lucide React** - Icônes
- **Axios** - Client HTTP pour l'API
- **Vite** - Bundler et serveur de développement

---

## 📁 Structure du projet frontend

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/                 # Composants ShadCN/UI
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Input.jsx
│   │       └── Label.jsx
│   ├── context/
│   │   └── AuthContext.jsx     # Contexte d'authentification
│   ├── lib/
│   │   └── utils.js            # Utilitaires CSS (cn function)
│   ├── pages/
│   │   ├── LoginPage.jsx       # Page de connexion
│   │   ├── RegisterPage.jsx    # Page d'inscription
│   │   └── Dashboard.jsx   # Page d'accueil après connexion
│   ├── services/
│   │   └── authService.js      # Service API d'authentification
│   ├── App.jsx                 # Composant principal avec routes
│   ├── main.jsx               # Point d'entrée
│   └── index.css              # Styles globaux avec Tailwind
├── tailwind.config.js         # Configuration Tailwind
├── postcss.config.js          # Configuration PostCSS
└── package.json               # Dépendances
```

---

## 🎨 Design System

### Couleurs
- **Rouge WACDO** : `#dc2626` (rouge principal)
- **Jaune WACDO** : `#fbbf24` (accent)
- **Système ShadCN** : Variables CSS personnalisées

### Composants UI
- **Cards** : Conteneurs avec ombres et bordures arrondies
- **Inputs** : Champs de saisie avec icônes et états d'erreur
- **Buttons** : Boutons avec variants (primary, outline, etc.)
- **Labels** : Étiquettes de formulaire accessibles

---

## 🔐 Système d'authentification

### AuthContext
Le contexte fournit :
- **État utilisateur** : `user`, `loading`, `isAuthenticated`
- **Méthodes** : `login()`, `register()`, `logout()`, `refreshUser()`
- **Stockage local** : Token et données utilisateur

### Service API
Le service `authService.js` gère :
- **Intercepteurs Axios** : Ajout automatique du token
- **Gestion d'erreurs** : Redirection si token expiré
- **Stockage local** : Persistance des données de session

---

## 🛣️ Système de routes

### Routes publiques
- `/login` - Page de connexion
- `/register` - Page d'inscription

### Routes privées (protégées)
- `/dashboard` - Tableau de bord utilisateur

### Composants de protection
- **PrivateRoute** : Redirige vers login si non connecté
- **PublicRoute** : Redirige vers dashboard si déjà connecté

---

## 📝 Pages détaillées

### Page de connexion (`LoginPage.jsx`)
**Fonctionnalités :**
- Formulaire email + mot de passe
- Validation en temps réel
- Affichage des erreurs backend
- Bouton "Afficher/Masquer" le mot de passe
- Liens vers la page d'inscription
- Comptes de test affichés

**Champs :**
- `email` : Email de l'utilisateur
- `mot_de_passe` : Mot de passe

### Page d'inscription (`RegisterPage.jsx`)
**Fonctionnalités :**
- Formulaire complet avec tous les champs backend
- Validation côté client et serveur
- Confirmation du mot de passe
- Checkbox pour statut administrateur
- Design responsive (grid layout)

**Champs :**
- `nom` : Nom de famille
- `prenom` : Prénom
- `email` : Adresse email (unique)
- `mot_de_passe` : Mot de passe (min 8 caractères)
- `mot_de_passe_confirmation` : Confirmation du mot de passe
- `date_embauche` : Date d'embauche (date picker)
- `is_admin` : Statut administrateur (checkbox)

### Page Dashboard (`Dashboard.jsx`)
**Fonctionnalités :**
- Header avec logo et bouton déconnexion
- Cartes d'informations utilisateur
- Statistiques (ancienneté, etc.)
- Actions rapides contextuelles
- Design responsive

---

## 🎯 Flux d'authentification

### 1. Connexion
```
Utilisateur → LoginPage → authService.login() 
→ Stockage token + user → AuthContext 
→ Redirection Dashboard
```

### 2. Inscription
```
Utilisateur → RegisterPage → authService.register() 
→ Stockage token + user → AuthContext 
→ Redirection Dashboard
```

### 3. Déconnexion
```
Dashboard → logout() → authService.logout() 
→ Suppression token + user → AuthContext 
→ Redirection Login
```

---

## 🚀 Démarrage du frontend

### Prérequis
- Node.js installé
- Backend Laravel démarré sur `http://127.0.0.1:8000`

### Commandes
```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Accès à l'application
# Frontend : http://localhost:5173
# Backend API : http://127.0.0.1:8000/api
```

---

## 🔧 Configuration

### Variables d'environnement
Le service API pointe vers :
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

### Tailwind CSS
Configuration personnalisée avec :
- Variables CSS ShadCN
- Couleurs WACDO
- Utilitaires étendus

---

## 🧪 Tests manuels

### Scénarios à tester
1. **Connexion avec comptes de test**
   - admin@wacdo.com / admin123
   - jean.dupont@wacdo.com / password123

2. **Inscription d'un nouvel utilisateur**
   - Tous les champs requis
   - Validation des erreurs
   - Confirmation mot de passe

3. **Navigation entre pages**
   - Protection des routes
   - Redirection automatique
   - Persistance de session

4. **Déconnexion**
   - Nettoyage du localStorage
   - Redirection vers login

---

## 🎨 Personnalisation

### Couleurs
Modifier dans `tailwind.config.js` :
```javascript
colors: {
  'wacdo-red': '#dc2626',
  'wacdo-yellow': '#fbbf24',
}
```

### Composants
Personnaliser dans `src/components/ui/` :
- Variants de boutons
- Styles de cartes
- États d'inputs

---

## 📱 Responsive Design

- **Mobile First** : Design adapté aux petits écrans
- **Breakpoints Tailwind** : sm, md, lg, xl
- **Grid adaptatif** : Colonnes variables selon l'écran
- **Navigation tactile** : Boutons et zones de clic adaptées

---

## 🚨 Gestion d'erreurs

### Types d'erreurs gérées
- **Validation backend** : Affichage sous chaque champ
- **Erreurs réseau** : Messages génériques
- **Token expiré** : Déconnexion automatique
- **Erreurs générales** : Alertes utilisateur

### Exemple d'affichage d'erreur
```jsx
{errors.email && (
  <p className="text-sm text-red-600">{errors.email[0]}</p>
)}
```

---

## 🔄 Prochaines améliorations

1. **Loading states** améliorés
2. **Toast notifications** pour les succès/erreurs
3. **Validation côté client** plus poussée
4. **Mode sombre** avec toggle
5. **Animations** de transition entre pages
6. **Tests unitaires** avec Jest/React Testing Library
7. **PWA** : Application web progressive
8. **Internationalisation** (i18n)

---

## 🏗️ Architecture technique

### Patterns utilisés
- **Context API** : Gestion d'état global
- **Custom Hooks** : `useAuth()`
- **Compound Components** : Cards avec sous-composants
- **Protected Routes** : HOCs pour la sécurité
- **Service Layer** : Séparation API/UI

### Bonnes pratiques respectées
- **Composants purs** : Props → UI
- **Séparation des responsabilités**
- **Gestion d'état centralisée**
- **Accessibilité** : Labels, focus, ARIA
- **Performance** : Lazy loading potentiel

---

*Frontend WACDO - Interface moderne et responsive pour la gestion des employés* 🍟
