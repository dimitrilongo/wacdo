# 🗄️ Guide de connexion TablePlus - WACDO

## Configuration rapide SQLite

### Informations de connexion
- **Type de base** : SQLite
- **Nom de connexion** : WACDO Local Database  
- **Chemin du fichier** : `/Users/dimitrilongo/Clone-repo/wacdo/backend/database/database.sqlite`

### Étapes de connexion
1. Ouvrir TablePlus
2. Créer une nouvelle connexion
3. Sélectionner SQLite
4. Renseigner le chemin du fichier
5. Tester et connecter

### Requêtes utiles

#### Voir tous les utilisateurs
```sql
SELECT id, nom, prenom, email, date_embauche, is_admin, created_at 
FROM users
ORDER BY created_at DESC;
```

#### Voir les tokens actifs
```sql
SELECT id, tokenable_id, name, created_at, last_used_at
FROM personal_access_tokens
WHERE tokenable_type = 'App\Models\User'
ORDER BY created_at DESC;
```

#### Compter les utilisateurs par rôle
```sql
SELECT 
    CASE WHEN is_admin = 1 THEN 'Admin' ELSE 'Employé' END as role,
    COUNT(*) as nombre
FROM users 
GROUP BY is_admin;
```

#### Voir les utilisateurs récemment créés
```sql
SELECT nom, prenom, email, created_at
FROM users 
WHERE created_at >= date('now', '-7 days')
ORDER BY created_at DESC;
```

### Structure de la table users
```sql
PRAGMA table_info(users);
```

### Backup rapide (via terminal)
```bash
cd /Users/dimitrilongo/Clone-repo/wacdo/backend/database
cp database.sqlite database_backup_$(date +%Y%m%d_%H%M%S).sqlite
```

### Remarques importantes
- ⚠️ SQLite = un seul fichier, attention aux sauvegardes
- 📁 Le fichier se trouve dans `backend/database/database.sqlite`
- 🔄 Les changements sont immédiats (pas de serveur séparé)
- 🚀 Parfait pour le développement local
