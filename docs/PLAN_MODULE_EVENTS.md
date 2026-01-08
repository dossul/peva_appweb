# 📅 PLAN MODULE EVENTS - Investigation Complète

## Date: 06/01/2026
## Objectif: Rendre le workflow Events 100% fonctionnel

---

## 1. ÉTAT ACTUEL DU MODULE

### 1.1 Tables BDD Vérifiées ✅

| Table | État | Colonnes |
|-------|------|----------|
| `pev_events` | VIDE | id, title, description, type, category, category_id, event_type, location, location_type, address, city, country_id, online_link, start_date, end_date, registration_deadline, max_participants, registration_required, is_free, price, currency, image_url, organizer_name, organizer_id, contact_email, contact_phone, status, is_featured, created_by, participants_count, views_count, created_at, updated_at |
| `pev_event_categories` | OK (6 catégories) | id, name, description, icon, color, display_order, is_active, created_at, updated_at |
| `pev_event_participants` | VIDE | À vérifier |
| `pev_event_comments` | VIDE | À vérifier |
| `pev_countries` | OK | id, name, code, flag, continent, is_active, display_order, created_at, updated_at |

### 1.2 Services Existants

- **`eventsService.js`** (admin) : CRUD complet, catégories, participants, stats
- **`moderationService.js`** : Support events intégré (approve/reject)

### 1.3 Vues Existantes

| Vue | Fichier | État |
|-----|---------|------|
| Liste/Calendrier | `EventsView.vue` | Partiellement fonctionnel |
| Création | `CreateEventView.vue` | Formulaire complet mais bugs |
| Admin | `AdminEventsView.vue` | À vérifier |
| Détail | **MANQUANT** | ❌ À créer |

### 1.4 Routes Existantes

| Route | Composant | État |
|-------|-----------|------|
| `/events` | EventsView | ✅ |
| `/events/create` | CreateEventView | ✅ |
| `/events/:id` | **MANQUANT** | ❌ À créer |
| `/admin/events` | AdminEventsView | ✅ |

---

## 2. PROBLÈMES IDENTIFIÉS

### 2.1 Problèmes Critiques 🔴

| # | Problème | Impact | Solution |
|---|----------|--------|----------|
| 1 | **Route `/events/:id` manquante** | Impossible de voir le détail d'un événement | Créer la route et EventDetailView.vue |
| 2 | **Status 'pending' non reconnu** | CreateEventView utilise 'pending' mais modération attend 'in_review' | Harmoniser les statuts |
| 3 | **Pas d'image upload** | CreateEventView n'a pas de champ image | Ajouter upload image_url |
| 4 | **saveDraft() non implémenté** | Le bouton "Enregistrer en brouillon" ne fait rien | Implémenter la fonction |

### 2.2 Problèmes Modérés 🟡

| # | Problème | Impact | Solution |
|---|----------|--------|----------|
| 5 | **Dialog création rapide non fonctionnel** | Le dialog dans EventsView.vue ne sauvegarde pas | Connecter à Supabase |
| 6 | **Catégories hardcodées** | CreateEventView utilise des catégories statiques | Charger depuis pev_event_categories |
| 7 | **Pas de FK created_by** | Jointures avec pev_profiles peuvent échouer | Ajouter FK si manquante |
| 8 | **Incrémentation views_count manquante** | Le compteur de vues n'est pas incrémenté | Ajouter dans getEventById |

### 2.3 Problèmes Mineurs 🟢

| # | Problème | Impact | Solution |
|---|----------|--------|----------|
| 9 | **filterByType() non implémenté** | Le filtrage par type ne fonctionne pas | Implémenter le filtre |
| 10 | **Emails templates events** | Templates event_approved, event_rejected, event_registration | Vérifier existence |
| 11 | **RPC increment_event_participants** | Utilisé mais peut ne pas exister | Vérifier/créer |

---

## 3. PLAN D'ACTION DÉTAILLÉ

### Phase 1: Routes et Navigation (Priorité: HAUTE)

#### 3.1.1 Créer EventDetailView.vue
```
- Hero banner avec image événement
- Infos: titre, description, date, lieu, prix
- Sidebar: inscription, organisateur, partager
- Bouton inscription connecté à pev_event_participants
- Compteur vues incrémenté
```

#### 3.1.2 Ajouter route /events/:id
```javascript
{
  path: '/events/:id',
  name: 'EventDetail',
  component: () => import('@/views/EventDetailView.vue'),
  meta: { title: 'Détail Événement - 2iE GreenHub' }
}
```

### Phase 2: Création d'Événements (Priorité: HAUTE)

#### 3.2.1 Corriger CreateEventView.vue
- Changer `status: 'pending'` → `status: 'in_review'`
- Ajouter upload image (bucket `images`, path `events/`)
- Implémenter `saveDraft()` avec status `'draft'`
- Charger catégories depuis BDD au lieu de hardcodé
- Mapper `category` vers `category_id`

#### 3.2.2 Créer service eventsService.js (frontend)
```javascript
// src/services/eventsService.js
export const eventsService = {
  getEvents(options),
  getEventById(id), // + incrémente views_count
  createEvent(data, imageFile),
  saveDraft(data, imageFile),
  registerForEvent(eventId, userId),
  cancelRegistration(eventId, userId),
  getUserEvents(userId),
  incrementViews(eventId)
}
```

### Phase 3: Calendrier et Affichage (Priorité: MOYENNE)

#### 3.3.1 Améliorer EventsView.vue
- Rendre les événements cliquables → `/events/:id`
- Implémenter filterByType()
- Corriger dialog création rapide
- Ajouter pagination si beaucoup d'événements

### Phase 4: Modération (Priorité: MOYENNE)

#### 3.4.1 Vérifier moderationService.js
- Events déjà supporté ✅
- Vérifier templates email: event_approved, event_rejected
- Tester workflow approve/reject

### Phase 5: Notifications Email (Priorité: BASSE)

#### 3.5.1 Templates à vérifier/créer
- `event_registration` : Confirmation inscription
- `event_reminder` : Rappel J-1
- `event_approved` : Événement approuvé
- `event_rejected` : Événement rejeté
- `event_cancelled` : Événement annulé

---

## 4. MIGRATIONS SQL POTENTIELLES

### 4.1 FK created_by (si manquante)
```sql
-- Vérifier d'abord si elle existe
ALTER TABLE pev_events 
ADD CONSTRAINT pev_events_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES pev_profiles(id);
```

### 4.2 RPC increment_event_participants (si manquante)
```sql
CREATE OR REPLACE FUNCTION increment_event_participants(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE pev_events 
  SET participants_count = COALESCE(participants_count, 0) + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.3 Colonnes manquantes (vérifier)
```sql
-- Ajouter views_count si manquant
ALTER TABLE pev_events ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- Ajouter registration_deadline si manquant  
ALTER TABLE pev_events ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMPTZ;
```

---

## 5. CHECKLIST DE VALIDATION

### Création d'événement
- [ ] Formulaire complet avec tous les champs
- [ ] Upload image de couverture fonctionnel
- [ ] Sauvegarde en brouillon fonctionnelle
- [ ] Soumission pour modération fonctionnelle
- [ ] Redirection vers /events après soumission
- [ ] Email de confirmation envoyé

### Affichage événements
- [ ] Liste des événements publiés affichée
- [ ] Calendrier affiche les événements aux bonnes dates
- [ ] Clic sur événement ouvre page détail
- [ ] Filtrage par type fonctionnel
- [ ] Statistiques correctes (upcoming, participants, etc.)

### Page détail événement
- [ ] Toutes les infos affichées (titre, description, date, lieu, prix)
- [ ] Image de couverture affichée
- [ ] Bouton inscription fonctionnel
- [ ] Compteur vues incrémenté
- [ ] Partage sur réseaux sociaux

### Inscription
- [ ] Inscription ajoute entrée dans pev_event_participants
- [ ] Compteur participants incrémenté
- [ ] Email confirmation envoyé
- [ ] Vérification doublon (pas double inscription)
- [ ] Vérification places disponibles

### Modération
- [ ] Événements in_review visibles dans admin
- [ ] Approbation change status en 'published'
- [ ] Rejet change status en 'rejected'
- [ ] Email envoyé au créateur
- [ ] Log dans pev_audit_logs

### Mes événements
- [ ] Liste des événements créés par l'utilisateur
- [ ] Liste des événements auxquels inscrit
- [ ] Possibilité d'éditer brouillons
- [ ] Possibilité d'annuler inscription

---

## 6. ORDRE D'IMPLÉMENTATION RECOMMANDÉ

1. **Créer EventDetailView.vue** + route
2. **Créer eventsService.js** (frontend)
3. **Corriger CreateEventView.vue** (status, categories, image)
4. **Implémenter saveDraft()**
5. **Rendre événements cliquables** dans EventsView.vue
6. **Tester workflow complet** création → modération → publication
7. **Vérifier emails** de notification
8. **Tests inscription** et désinscription

---

## 7. FICHIERS À CRÉER/MODIFIER

### À Créer
- [ ] `src/views/EventDetailView.vue`
- [ ] `src/services/eventsService.js` (frontend, pas admin)

### À Modifier
- [ ] `src/router/index.js` (ajouter route /events/:id)
- [ ] `src/views/CreateEventView.vue` (status, categories, image, saveDraft)
- [ ] `src/views/EventsView.vue` (cliquable, filtres)

### À Vérifier
- [ ] `src/services/admin/moderationService.js` (events déjà supporté)
- [ ] `src/services/emailService.js` (templates events)

---

## 8. LEÇONS APPRISES (Modules Opportunités/Ressources)

| Erreur à éviter | Solution |
|-----------------|----------|
| Colonne inexistante utilisée | TOUJOURS vérifier BDD avant de coder |
| Variable uploadée non sauvegardée | Vérifier que TOUTES les variables sont dans adaptedData |
| created_by dans UPDATE | Ne JAMAIS inclure created_by dans les updates (RLS) |
| Route détail manquante | Créer route /:id pour chaque module |
| Status incohérents | Utiliser 'draft', 'in_review', 'published', 'rejected' partout |
| href + @click conflit | Utiliser window.open() dans la fonction, pas href |

---

**Document créé le 06/01/2026**
**À réviser après implémentation de chaque phase**
