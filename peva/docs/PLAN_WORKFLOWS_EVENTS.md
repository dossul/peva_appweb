# 📅 PLAN WORKFLOWS ÉVÉNEMENTS - 2iE GreenHub

> **Date** : 8 janvier 2026  
> **Fichier concerné** : `src/views/EventsView.vue`  
> **Statut** : ✅ IMPLÉMENTÉ

---

## 📊 ANALYSE ACTUELLE

### ✅ Ce qui fonctionne
| Onglet | Statut | Description |
|--------|--------|-------------|
| **CALENDRIER** | ✅ Fonctionnel | Affichage mensuel avec événements colorés par type, navigation mois précédent/suivant, sidebar "Prochains événements" |

### ✅ Implémenté le 08/01/2026
| Onglet | Statut | Description |
|--------|--------|-------------|
| **LISTE** | ✅ Implémenté | Vue liste avec filtres (catégorie, type, tarification, recherche) et tri |
| **MES ÉVÉNEMENTS** | ✅ Implémenté | Redirection vers `/my-events` (vue existante complète) |
| **CARTE** | ❌ Supprimé | Décision utilisateur : pas pertinent sans géolocalisation |
| **HISTORIQUE** | ❌ Supprimé | Décision utilisateur : pas pertinent |

---

## 🔍 RESSOURCES EXISTANTES

### Table `pev_events` (colonnes vérifiées)
```
id, title, description, category, category_id, event_type, location, location_type,
address, city, country_id, online_link, start_date, end_date, registration_deadline,
max_participants, registration_required, is_free, price, currency, image_url, document_url,
organizer_name, organizer_id, contact_email, contact_phone, status, is_featured,
participants_count, views_count, created_by, created_at, updated_at
```

### Vue existante
- **`MyEventsView.vue`** : Vue complète pour gérer ses propres événements (brouillons, en attente, publiés)
- **Route** : `/my-events` (déjà configurée dans le router)

---

## 🎯 PROPOSITIONS PAR ONGLET

---

### 1️⃣ ONGLET "LISTE" - Vue par catégorie

**Objectif** : Afficher les événements sous forme de liste filtrable par catégorie/type.

**Fonctionnalités proposées** :
- [ ] Filtres en sidebar : catégorie, type d'événement, ville, gratuit/payant
- [ ] Liste des événements avec cartes (image, titre, date, lieu, type)
- [ ] Tri par : date (asc/desc), popularité
- [ ] Pagination ou scroll infini
- [ ] Bouton "S'inscrire" sur chaque carte

**Données nécessaires** :
- `pev_events` avec `status = 'published'` et `start_date >= now()`
- Jointure `pev_event_categories` pour les catégories

**Complexité** : ⭐⭐ Moyenne (réutilise le code existant)

**✅ PERTINENT** - Permet une navigation alternative au calendrier

---

### 2️⃣ ONGLET "CARTE" - Géolocalisation des événements

**Objectif** : Afficher les événements sur une carte interactive Leaflet.

**Fonctionnalités proposées** :
- [ ] Carte Leaflet centrée sur l'Afrique de l'Ouest
- [ ] Marqueurs par événement avec popup (titre, date, type)
- [ ] Filtres : type d'événement, période
- [ ] Clustering pour les zones avec plusieurs événements
- [ ] Clic sur marqueur → popup avec bouton "Voir détails"

**Données nécessaires** :
- `city`, `country_id`, `address` pour la géolocalisation
- ⚠️ **PROBLÈME** : Pas de colonnes `latitude`/`longitude` dans `pev_events`

**Solutions possibles** :
1. **Option A** : Ajouter les colonnes `latitude`, `longitude` à `pev_events` (migration SQL)
2. **Option B** : Utiliser un service de géocodage (ex: Nominatim) pour convertir `city` en coordonnées
3. **Option C** : Créer une table `pev_cities` avec les coordonnées des villes principales

**Complexité** : ⭐⭐⭐ Élevée (nécessite géocodage ou migration BDD)

**✅ PERTINENT** - Visualisation géographique utile pour les événements physiques

**🔧 RECOMMANDATION** : Option A - Ajouter `latitude`, `longitude` à `pev_events`
```sql
ALTER TABLE pev_events 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8);
```

---

### 3️⃣ ONGLET "MES ÉVÉNEMENTS" - Redirection simple

**Objectif** : Afficher les événements créés par l'utilisateur connecté.

**Solution proposée** :
- [ ] **Option simple** : Rediriger vers `/my-events` (vue existante complète)
- [ ] **Option intégrée** : Intégrer le contenu de `MyEventsView.vue` dans l'onglet

**Analyse** :
- `MyEventsView.vue` existe déjà (330 lignes)
- Gère : brouillons, en attente de modération, publiés
- Route `/my-events` déjà configurée

**Complexité** : ⭐ Facile (simple redirection)

**✅ PERTINENT** - Fonctionnalité attendue par les utilisateurs

**🔧 RECOMMANDATION** : Redirection vers `/my-events` avec message si non connecté

```javascript
// Dans EventsView.vue, watcher sur activeTab
watch(activeTab, (newTab) => {
  if (newTab === 'my-events') {
    if (!authStore.isAuthenticated) {
      snackbar.value = { show: true, message: 'Connectez-vous pour voir vos événements', color: 'warning' }
      activeTab.value = 'calendar'
      return
    }
    router.push('/my-events')
  }
})
```

---

### 4️⃣ ONGLET "HISTORIQUE" - Événements passés

**Objectif** : Afficher les événements terminés (archive).

**Fonctionnalités proposées** :
- [ ] Liste des événements où `start_date < now()`
- [ ] Tri par date (plus récent d'abord)
- [ ] Filtres : année, catégorie, type
- [ ] Badge "Terminé" sur chaque carte
- [ ] Statistiques : nombre de participants (si disponible)
- [ ] Option : Accès aux replays/documents si événement en ligne

**Données nécessaires** :
- `pev_events` avec `status = 'published'` et `start_date < now()`
- `pev_event_participants` pour le nombre de participants

**Complexité** : ⭐⭐ Moyenne

**✅ PERTINENT** - Archive utile pour consulter les événements passés

---

## 📋 RÉCAPITULATIF DES ACTIONS

| # | Onglet | Action | Complexité | Priorité |
|---|--------|--------|------------|----------|
| 1 | **MES ÉVÉNEMENTS** | Redirection vers `/my-events` | ⭐ Facile | 🔴 Haute |
| 2 | **LISTE** | Créer vue liste avec filtres | ⭐⭐ Moyenne | 🔴 Haute |
| 3 | **HISTORIQUE** | Créer vue événements passés | ⭐⭐ Moyenne | 🟡 Moyenne |
| 4 | **CARTE** | Créer carte Leaflet + migration BDD | ⭐⭐⭐ Élevée | 🟢 Basse |

---

## ❓ QUESTIONS POUR VALIDATION

1. **CARTE** : Voulez-vous ajouter les colonnes `latitude`/`longitude` à `pev_events` ?
   - [ ] Oui, faire la migration SQL
   - [ ] Non, utiliser le géocodage automatique
   - [ ] Non, supprimer cet onglet (pas pertinent)

2. **MES ÉVÉNEMENTS** : Préférez-vous :
   - [ ] Redirection vers `/my-events` (simple)
   - [ ] Intégrer le contenu dans l'onglet (plus complexe)

3. **HISTORIQUE** : Quelles infos afficher pour les événements passés ?
   - [ ] Juste titre, date, lieu
   - [ ] + Nombre de participants
   - [ ] + Liens vers replays/documents

4. **ORDRE DE PRIORITÉ** : Confirmer l'ordre d'implémentation ?
   - [ ] Oui, commencer par MES ÉVÉNEMENTS
   - [ ] Non, autre ordre : ___________

---

## 🚀 PRÊT À IMPLÉMENTER

Après validation, les actions seront implémentées dans l'ordre défini.

**Estimation** :
- MES ÉVÉNEMENTS : ~15 min
- LISTE : ~45 min
- HISTORIQUE : ~30 min
- CARTE : ~1h30 (avec migration BDD)

**Total estimé** : ~3h
