# ✅ Checklist de développement - McWacdo Manager

## 📋 Comparaison Cahier des charges vs Réalisation

---

## 🔐 Système d'authentification

### Attendu
> L'application est utilisable uniquement si l'utilisateur est identifié via un compte collaborateur ayant le droit administrateur (et un mot de passe).

### État actuel
| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Authentification obligatoire | ✅ **FAIT** | Routes protégées avec `ProtectedRoute` |
| Login/Register pages | ✅ **FAIT** | Pages fonctionnelles avec token Sanctum |
| Protection des routes | ✅ **FAIT** | Middleware `auth:sanctum` sur API |
| Système de rôles/droits | ❌ **MANQUANT** | Pas de distinction Admin/User actuellement |

### 🚧 À faire
- [ ] **Ajouter un champ `role` dans la table `users`** (admin, manager, user)
- [ ] **Middleware backend** pour vérifier les droits admin sur routes sensibles
- [ ] **Restriction frontend** : Cacher boutons Créer/Modifier/Supprimer pour non-admins
- [ ] **Page d'erreur 403** (Accès refusé) si tentative d'accès sans droits

---

## 🍔 Gestion des restaurants

### Attendu
> On arrive sur la liste des restaurants, avec un formulaire pour rechercher et filtrer (par nom, par code postal, par ville).
> On a un bouton pour créer un restaurant.
> Les éléments de la liste sont cliquables, pour avoir le détail du restaurant, incluant la liste des collaborateurs en poste dans ce restaurant (poste en cours). Cette liste est filtrable par poste, par nom, par date de début d'affectation.
> Sur le détail, un bouton "modifier", permet de voir l'historique des affectations (filtrable) et d'affecter un nouveau collaborateur.

### État actuel

#### ✅ Ce qui est FAIT

| Fonctionnalité | Statut | Localisation |
|----------------|--------|--------------|
| Liste des restaurants | ✅ **FAIT** | `RestaurantsPage.jsx` |
| Formulaire de recherche (nom, code postal, ville) | ✅ **FAIT** | 3 filtres fonctionnels |
| Bouton créer restaurant | ✅ **FAIT** | Formulaire inline |
| Éléments cliquables → détail | ✅ **FAIT** | Navigation vers `/restaurants/:id` |
| Détail restaurant | ✅ **FAIT** | `RestaurantDetailPage.jsx` |
| Liste collaborateurs en poste (en cours) | ✅ **FAIT** | Affichage avec relations |
| Filtres affectations (poste, nom, date début) | ✅ **FAIT** | 3 filtres fonctionnels |
| Bouton "modifier" restaurant | ✅ **FAIT** | Édition inline du restaurant |

#### ❌ Ce qui MANQUE

| Fonctionnalité | Statut | Impact |
|----------------|--------|--------|
| **Historique complet des affectations** | ❌ **MANQUANT** | Actuellement : seulement affectations en cours |
| **Filtre sur historique** | ❌ **MANQUANT** | Filtrer affectations passées |
| **Affecter nouveau collaborateur depuis détail** | ❌ **MANQUANT** | Formulaire d'affectation absent |

### 🚧 À faire

#### 1. Afficher l'historique complet des affectations
**Backend :**
```php
// Dans RestaurantController@show, retirer le filtre sur date_fin
$restaurant->load(['affectations' => function ($query) {
    $query->with(['user', 'poste'])
          ->orderBy('date_debut', 'desc');
    // Supprimer : ->whereNull('date_fin')->orWhere(...)
}]);
```

**Frontend :**
- [ ] Afficher **toutes** les affectations (pas uniquement en cours)
- [ ] Ajouter badges de statut (En cours / Terminée / À venir)
- [ ] Ajouter filtre supplémentaire "Statut" (similaire à `AffectationsPage`)

#### 2. Formulaire d'affectation sur détail restaurant
- [ ] Ajouter section "Affecter un nouveau collaborateur"
- [ ] Dropdown : Liste des collaborateurs (`GET /api/users`)
- [ ] Dropdown : Liste des postes (`GET /api/postes`)
- [ ] Champs : `date_debut`, `date_fin` (optionnel)
- [ ] Bouton "Créer l'affectation" → `POST /api/affectations` avec `restaurant_id` pré-rempli
- [ ] Recharger la liste après création

**Exemple de structure :**
```jsx
<div className="mt-6 p-4 bg-blue-50 rounded">
  <h3>Affecter un nouveau collaborateur</h3>
  <form onSubmit={handleCreateAffectation}>
    <select name="user_id" required>
      {users.map(user => <option value={user.id}>{user.nom_complet}</option>)}
    </select>
    <select name="poste_id" required>
      {postes.map(poste => <option value={poste.id}>{poste.nom}</option>)}
    </select>
    <input type="date" name="date_debut" required />
    <input type="date" name="date_fin" />
    <button type="submit">Créer l'affectation</button>
  </form>
</div>
```

---

## 👤 Gestion des collaborateurs

### Attendu
> Dirige sur la vue comportant la liste des collaborateurs, avec un formulaire pour rechercher et filtrer (par nom, prénom, email)
> Un bouton permet de créer un collaborateur, et un bouton permet de rechercher les collaborateurs non affectés.
> Les éléments de la liste sont cliquables, pour avoir le détail du collaborateur, incluant la ou les affections en cours, et l'historique des affectations. Cette liste est filtrable par poste, par date de début d'affectation.
> Sur le détail, un bouton permet de modifier le collaborateur, pour l'affecter à un nouveau poste.
> Les affectations en cours sont modifiables.

### État actuel

#### ✅ Ce qui est FAIT

| Fonctionnalité | Statut | Localisation |
|----------------|--------|--------------|
| Liste des collaborateurs | ✅ **FAIT** | `CollaborateursPage.jsx` |
| Bouton créer collaborateur | ✅ **FAIT** | Formulaire complet (prenom, nom, email, password) |
| Affichage affectation en cours | ✅ **FAIT** | Visible dans la liste |
| Modification collaborateur | ✅ **FAIT** | Clic sur card → formulaire édition |
| Création nouvelle affectation | ✅ **FAIT** | Champs optionnels dans formulaire édition |

#### ❌ Ce qui MANQUE

| Fonctionnalité | Statut | Impact |
|----------------|--------|--------|
| **Filtres (nom, prénom, email)** | ❌ **MANQUANT** | Recherche impossible sur page liste |
| **Bouton "Collaborateurs non affectés"** | ❌ **MANQUANT** | Pas de filtre rapide |
| **Page détail collaborateur** | ❌ **MANQUANT** | Pas de vue dédiée avec historique complet |
| **Navigation cliquable vers détail** | ❌ **MANQUANT** | Actuellement : édition inline seulement |
| **Historique complet des affectations** | ❌ **MANQUANT** | Seulement dernière affectation visible |
| **Filtres sur historique** | ❌ **MANQUANT** | Filtrer par poste, date |
| **Modification affectations en cours** | ❌ **MANQUANT** | Pas de bouton pour éditer date_fin |

### 🚧 À faire

#### 1. Ajouter filtres sur liste collaborateurs
**Frontend (`CollaborateursPage.jsx`) :**
```jsx
const [filterNom, setFilterNom] = useState('');
const [filterPrenom, setFilterPrenom] = useState('');
const [filterEmail, setFilterEmail] = useState('');

const filteredCollaborateurs = users.filter(user => {
  if (filterNom && !user.nom.toLowerCase().includes(filterNom.toLowerCase())) {
    return false;
  }
  if (filterPrenom && !user.prenom.toLowerCase().includes(filterPrenom.toLowerCase())) {
    return false;
  }
  if (filterEmail && !user.email.toLowerCase().includes(filterEmail.toLowerCase())) {
    return false;
  }
  return true;
});
```

- [ ] Ajouter 3 inputs de recherche
- [ ] Implémenter logique de filtrage
- [ ] Ajouter bouton "Réinitialiser"

#### 2. Bouton "Collaborateurs non affectés"
- [ ] Ajouter état `showNonAffectes`
- [ ] Filtrer : `users.filter(user => !user.affectations || user.affectations.length === 0)`
- [ ] Bouton toggle avec compteur

**Exemple :**
```jsx
<button onClick={() => setShowNonAffectes(!showNonAffectes)}>
  {showNonAffectes ? 'Tous les collaborateurs' : 'Non affectés'} 
  ({nonAffectesCount})
</button>
```

#### 3. Créer page détail collaborateur
**Nouvelle route :** `/collaborateurs/:id`

**Fichier :** `frontend/src/pages/CollaborateurDetailPage.jsx`

**Contenu attendu :**
- Informations du collaborateur (nom, prénom, email)
- **Affectation(s) en cours** : Badge vert avec détails
- **Historique complet** : Toutes les affectations passées
  - Filtres : Poste, Date début
  - Tri : Plus récent en premier
- **Bouton "Modifier collaborateur"** : Éditer nom/prénom/email
- **Bouton "Nouvelle affectation"** : Formulaire pour affecter
- **Bouton "Modifier affectation"** sur chaque affectation en cours : Changer date_fin

**API à créer/modifier :**
```php
// Backend: UserController@show - Eager load toutes les affectations
public function show(string $id)
{
    $user = User::with(['affectations.restaurant', 'affectations.poste'])
                ->findOrFail($id);
    
    // Trier affectations par date_debut décroissant
    $user->affectations = $user->affectations->sortByDesc('date_debut')->values();
    
    return response()->json($user);
}
```

**Structure frontend :**
```jsx
function CollaborateurDetailPage() {
  const { id } = useParams();
  const [collaborateur, setCollaborateur] = useState(null);
  const [affectations, setAffectations] = useState([]);
  
  // Fetch collaborateur avec affectations
  // Calculer affectations en cours vs historique
  // Afficher avec filtres
}
```

- [ ] Créer `CollaborateurDetailPage.jsx`
- [ ] Ajouter route dans `App.jsx`
- [ ] Modifier `CollaborateursPage` : Clic sur card → Navigation vers détail (au lieu d'édition inline)
- [ ] Implémenter filtres sur historique
- [ ] Ajouter formulaire d'affectation
- [ ] Ajouter bouton "Modifier" sur affectations en cours

#### 4. Modification des affectations en cours
**Fonctionnalité :**
- Sur chaque affectation en cours, bouton "Terminer" ou "Modifier"
- Modal/formulaire pour changer `date_fin`
- Appel `PUT /api/affectations/{id}` avec nouvelle date_fin

**Exemple :**
```jsx
<button onClick={() => handleEditAffectation(affectation.id)}>
  Modifier
</button>

// Dans le handler
const handleUpdateDateFin = async (affectationId, newDateFin) => {
  await axios.put(`/api/affectations/${affectationId}`, {
    date_fin: newDateFin
  }, { headers: { Authorization: `Bearer ${token}` } });
  // Recharger données
};
```

- [ ] Ajouter bouton "Modifier" sur affectations en cours
- [ ] Modal ou formulaire inline pour éditer date_fin
- [ ] Validation : date_fin >= date_debut
- [ ] Mise à jour via API

---

## 🏷️ Gestion des fonctions

### Attendu
> Permet de voir la liste des différentes fonctions
> Un bouton permet de créer une fonction et chaque fonction est éditable

### État actuel

#### ✅ Ce qui est FAIT

| Fonctionnalité | Statut | Localisation |
|----------------|--------|--------------|
| Liste des fonctions | ✅ **FAIT** | `FonctionsPage.jsx` |
| Bouton créer fonction | ✅ **FAIT** | Formulaire inline |
| Édition fonction | ✅ **FAIT** | Édition inline du nom |
| Suppression fonction | ✅ **FAIT** | Bouton supprimer |

#### ✅ **AUCUNE MODIFICATION NÉCESSAIRE**
Cette section est **100% conforme** au cahier des charges.

---

## 🔍 Recherche des affectations

### Attendu
> Permet d'afficher la liste des affectations
> Avec un formulaire pour rechercher et filtrer par poste, par date de début et de fin, par ville.

### État actuel

#### ✅ Ce qui est FAIT

| Fonctionnalité | Statut | Localisation |
|----------------|--------|--------------|
| Liste des affectations | ✅ **FAIT** | `AffectationsPage.jsx` |
| Filtre par collaborateur (nom) | ✅ **FAIT** | Input texte |
| Filtre par restaurant | ✅ **FAIT** | Dropdown |
| Filtre par poste | ✅ **FAIT** | Dropdown |
| Filtre par statut | ✅ **FAIT** | Dropdown (En cours, À venir, Terminée) |
| Badges de statut | ✅ **FAIT** | Vert/Bleu/Gris |

#### ⚠️ Ce qui DIFFÈRE

| Fonctionnalité attendue | État actuel | Écart |
|-------------------------|-------------|-------|
| Filtre par date de début | ❌ **MANQUANT** | Pas de filtre date_debut |
| Filtre par date de fin | ❌ **MANQUANT** | Pas de filtre date_fin |
| Filtre par ville | ❌ **MANQUANT** | Filtre restaurant existe (liste déroulante) mais pas ville directement |

### 🚧 À faire

#### 1. Ajouter filtres par dates
**Frontend (`AffectationsPage.jsx`) :**
```jsx
const [filterDateDebut, setFilterDateDebut] = useState('');
const [filterDateFin, setFilterDateFin] = useState('');

const filteredAffectations = affectations.filter(affectation => {
  // ... filtres existants ...
  
  // Filtre date_debut
  if (filterDateDebut && affectation.date_debut) {
    const dateDebut = affectation.date_debut.split('T')[0];
    if (dateDebut < filterDateDebut) return false;
  }
  
  // Filtre date_fin
  if (filterDateFin && affectation.date_fin) {
    const dateFin = affectation.date_fin.split('T')[0];
    if (dateFin > filterDateFin) return false;
  }
  
  return true;
});
```

- [ ] Ajouter 2 inputs de type `date`
- [ ] Implémenter logique de filtrage
- [ ] Labels : "Date début min" et "Date fin max"

#### 2. Ajouter filtre par ville
**Deux approches possibles :**

**Option A : Filtre texte ville**
```jsx
const [filterVille, setFilterVille] = useState('');

// Dans le filtre
if (filterVille && !affectation.restaurant.ville.toLowerCase().includes(filterVille.toLowerCase())) {
  return false;
}
```

**Option B : Dropdown villes**
```jsx
const villes = [...new Set(restaurants.map(r => r.ville))].sort();

<select value={filterVille} onChange={(e) => setFilterVille(e.target.value)}>
  <option value="">Toutes les villes</option>
  {villes.map(ville => <option key={ville} value={ville}>{ville}</option>)}
</select>
```

- [ ] Choisir l'approche (recommandé : Option B pour cohérence UX)
- [ ] Implémenter filtre ville
- [ ] Ajuster le filtre restaurant actuel (peut coexister ou remplacer)

---

## 📊 Récapitulatif global

### ✅ Fonctionnalités complètes (conformes au cahier)
- ✅ Authentification (login/register)
- ✅ Protection des routes
- ✅ Gestion des fonctions (100% conforme)
- ✅ Liste restaurants avec filtres (nom, code postal, ville)
- ✅ Détail restaurant avec affectations en cours
- ✅ Liste affectations avec filtres multiples

### ⚠️ Fonctionnalités partielles (nécessitent ajustements)

| Module | % Complété | Travail restant |
|--------|------------|-----------------|
| **Gestion restaurants** | 80% | Historique affectations + Formulaire affectation |
| **Gestion collaborateurs** | 50% | Filtres liste + Page détail + Modification affectations |
| **Recherche affectations** | 75% | Filtres dates + Filtre ville |
| **Système de droits** | 0% | Rôles admin + Middleware permissions |

### ❌ Fonctionnalités manquantes critiques

#### Priorité 1 (Haute)
1. **Page détail collaborateur** avec historique complet
2. **Formulaire d'affectation** sur détail restaurant
3. **Filtres recherche** sur liste collaborateurs
4. **Filtres dates** sur recherche affectations

#### Priorité 2 (Moyenne)
5. **Système de rôles** (admin/user)
6. **Historique complet** affectations sur détail restaurant
7. **Modification affectations en cours** (changer date_fin)
8. **Bouton "Non affectés"** sur liste collaborateurs

#### Priorité 3 (Basse - Nice to have)
9. Filtre ville sur recherche affectations (déjà couvert par filtre restaurant)
10. Statistiques dashboard
11. Export Excel/PDF

---

## 📈 Estimation du travail restant

### Temps estimé par tâche

| Tâche | Temps | Complexité |
|-------|-------|------------|
| Système de rôles (backend + frontend) | 3-4h | Moyenne |
| Page détail collaborateur complète | 4-5h | Haute |
| Historique affectations restaurant | 2h | Faible |
| Formulaire affectation sur détail restaurant | 2h | Faible |
| Filtres liste collaborateurs | 1h | Faible |
| Bouton "Non affectés" | 30min | Faible |
| Modification affectations en cours | 2-3h | Moyenne |
| Filtres dates sur recherche affectations | 1h | Faible |
| Filtre ville sur recherche affectations | 30min | Faible |

**Total estimé :** 16-19 heures de développement

---

## 🎯 Plan d'action recommandé

### Phase 1 : Corrections critiques (Priorité 1)
**Objectif :** Rendre l'application conforme au cahier des charges minimum

1. ✅ Créer page détail collaborateur
   - Route `/collaborateurs/:id`
   - Affichage historique complet
   - Filtres sur historique
2. ✅ Ajouter filtres sur liste collaborateurs
   - Nom, prénom, email
3. ✅ Ajouter formulaire affectation sur détail restaurant
4. ✅ Ajouter filtres dates sur recherche affectations

**Durée :** 8-10 heures

---

### Phase 2 : Améliorations fonctionnelles (Priorité 2)
**Objectif :** Améliorer l'expérience utilisateur

5. ✅ Implémenter système de rôles
   - Migration + Middleware
   - Restriction boutons frontend
6. ✅ Afficher historique complet sur détail restaurant
7. ✅ Permettre modification affectations en cours
8. ✅ Bouton "Collaborateurs non affectés"

**Durée :** 8-10 heures

---

### Phase 3 : Améliorations UX (Optionnel)
9. ✅ Statistiques dashboard
10. ✅ Export Excel/PDF
11. ✅ Notifications
12. ✅ Planning visuel

---

## 📝 Conclusion

### État actuel du projet
**Avancement global : ~70%**

L'application dispose de :
- ✅ Architecture solide (Laravel + React)
- ✅ CRUD complets sur toutes les entités
- ✅ Système d'authentification fonctionnel
- ✅ Filtres sur plusieurs pages
- ✅ Relations entre entités bien gérées

### Points bloquants
- ❌ Pas de page détail collaborateur (attendu dans cahier)
- ❌ Historique affectations incomplet
- ❌ Formulaire affectation manquant sur détail restaurant
- ❌ Système de droits admin absent

### Recommandation
**Suivre le plan d'action Phase 1** pour atteindre 95% de conformité au cahier des charges (16-20h de travail).

Le système actuel est fonctionnel et utilisable, mais nécessite ces ajustements pour correspondre exactement aux spécifications demandées.

---

**Date de dernière mise à jour :** 12 novembre 2025  
**Prochain checkpoint :** Après Phase 1 (révision de cette checklist)
