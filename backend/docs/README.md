# 📚 Documentation WACDO Backend

Ce répertoire contient toute la documentation technique du projet WACDO backend.

## 📋 Index des documents

### 🚀 **Guides d'utilisation**
- **[DOCUMENTATION_API_USER.md](./DOCUMENTATION_API_USER.md)** - Guide complet d'utilisation de l'API utilisateur
- **[API_EXEMPLES.md](./API_EXEMPLES.md)** - Exemples pratiques d'utilisation de l'API avec curl

### 🔧 **Documentation technique**
- **[RESUME_TECHNIQUE_BACKEND.md](./RESUME_TECHNIQUE_BACKEND.md)** - Architecture et implémentation détaillée du backend
- **[GUIDE_TABLEPLUS.md](./GUIDE_TABLEPLUS.md)** - Configuration de TablePlus pour la base de données

## 🗂️ Organisation des documents

### 📖 **Pour les développeurs frontend**
Consultez en priorité :
1. `DOCUMENTATION_API_USER.md` - Pour comprendre l'API
2. `API_EXEMPLES.md` - Pour les exemples concrets

### 🔩 **Pour les développeurs backend**
Consultez en priorité :
1. `RESUME_TECHNIQUE_BACKEND.md` - Architecture complète
2. `GUIDE_TABLEPLUS.md` - Accès à la base de données

## 🎯 **Endpoints API disponibles**

### Routes publiques
- `POST /api/register` - Inscription utilisateur
- `POST /api/login` - Connexion utilisateur

### Routes protégées (token requis)
- `GET /api/me` - Informations utilisateur connecté
- `POST /api/logout` - Déconnexion utilisateur

## 🧪 **Utilisateurs de test**
```
Admin : admin@wacdo.com / admin123
Employé : jean.dupont@wacdo.com / password123  
Employée : sophie.martin@wacdo.com / password123
```

## 📝 **Conventions de documentation**

### Nouveaux documents
Tous les nouveaux fichiers de documentation doivent être placés dans ce répertoire `docs/`.

### Nommage des fichiers
- **Guides utilisateur** : `GUIDE_[SUJET].md`
- **Documentation API** : `API_[ENDPOINT].md`
- **Documentation technique** : `TECH_[COMPOSANT].md`
- **Exemples** : `EXEMPLES_[SUJET].md`

### Structure des documents
1. **Titre principal** avec emoji
2. **Table des matières** si nécessaire
3. **Sections numérotées** avec sous-titres
4. **Exemples concrets** avec blocs de code
5. **Commandes utiles** à la fin

## 🔄 **Mise à jour**
Cette documentation est maintenue à jour avec chaque évolution du projet.

---

*Dernière mise à jour : 7 novembre 2025*
