# Corrections Workflow Événements - 2iE GreenHub
**Date:** 2026-01-08 16:00 - 18:00 UTC
**Session:** Correction complète du workflow événements

---

## 📋 RÉSUMÉ DES CORRECTIONS

### 1. Page Profil (ProfileView.vue) - 16:00-16:30

#### Problèmes corrigés:
- ❌ Données mockées (connexions, recommandations)
- ❌ Bouton "Voir toutes" non fonctionnel
- ❌ Opportunités non cliquables
- ❌ Erreur 400 sur requête pev_event_participants

#### Solutions appliquées:
```
16:08 - Corrigé navigation opportunités -> /my-opportunities
16:13 - Corrigé colonne registered_at -> registration_date
16:13 - Séparé requêtes pour éviter jointure problématique pev_events
16:24 - Remplacé données mockées par userConnections dynamique
16:24 - Remplacé Recommandations mockées par Informations profil
```

#### Fichiers modifiés:
- `src/views/ProfileView.vue`
  - loadActivities() - Corrigé nom colonne registration_date
  - Ajouté getTypeIcon() pour icônes opportunités
  - Navigation boutons Voir toutes corrigée

---

### 2. Wizard Création Événement (EventsView.vue) - 16:29-16:46

#### Problèmes corrigés:
- ❌ Bouton "Suivant" grisé car champs date/lieu non visibles
- ❌ canProceed validait des champs non affichés dans l'étape

#### Solutions appliquées:
```
16:29 - Diagnostic: canProceed exigeait date+location non visibles
16:46 - Réorganisé wizard:
        Étape 1: Titre, Type, Description (3 champs)
        Étape 2: Date, Lieu, Organisateur, Image, Document (7 champs)
        Étape 3: Tarification (inchangé)
16:46 - canProceed corrigé pour valider uniquement champs visibles
```

#### Fichiers modifiés:
- `src/views/EventsView.vue`
  - Template wizard réorganisé
  - canProceed() simplifié par étape
  - Ajouté champ document file input
  - newEvent.document ajouté

---

### 3. Workflow Approbation Participants - 17:00-18:00

#### Fonctionnalités implémentées:
```
17:00 - Service frontend: registerForEvent() gère require_approval
17:10 - Emails automatiques:
        - "Demande prise en compte" (status=pending)
        - "Inscription confirmée" (status=registered direct)
17:20 - approveParticipant() + email confirmation
17:25 - rejectParticipant() + email rejet
17:30 - notifyParticipants() annulation/reprogrammation
17:40 - Service admin complété avec mêmes fonctions
17:50 - AdminEventsView: boutons Approuver/Rejeter ajoutés
17:55 - Migration add_event_approval_columns.sql créée
```

#### Fichiers créés/modifiés:
- `src/services/eventsService.js`
  - registerForEvent() - Gère require_approval + emails
  - approveParticipant() - Avec email
  - rejectParticipant() - Avec email
  - notifyParticipants() - Annulation/reprogrammation
  - sendEventEmail() - Template HTML

- `src/services/admin/eventsService.js`
  - approveParticipant() ajouté
  - rejectParticipant() ajouté
  - notifyAllParticipants() ajouté
  - sendEventNotificationEmail() ajouté

- `src/views/admin/AdminEventsView.vue`
  - Statuts pending/registered/rejected avec couleurs
  - Boutons Approuver/Rejeter pour status=pending

- `supabase/migrations/add_event_approval_columns.sql`
  - pev_events: require_approval, document_url
  - pev_event_participants: approved_at, rejection_reason
  - Policy UPDATE pour organisateurs

---

## 🔧 MIGRATIONS À EXÉCUTER

```sql
-- Migration: add_event_approval_columns.sql
ALTER TABLE pev_events 
ADD COLUMN IF NOT EXISTS require_approval BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS document_url TEXT;

ALTER TABLE pev_event_participants
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

DROP POLICY IF EXISTS "Organizers can update participants" ON pev_event_participants;
CREATE POLICY "Organizers can update participants" ON pev_event_participants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pev_events 
      WHERE pev_events.id = pev_event_participants.event_id 
      AND pev_events.created_by = auth.uid()
    )
  );
```

---

## ✅ USE CASES VALIDÉS

| Use Case | Service | Vue | Email |
|----------|---------|-----|-------|
| Créer événement + image | eventsService.createEvent | EventsView wizard | - |
| Créer événement + document | eventsService.createEvent | EventsView wizard | - |
| Inscription directe | registerForEvent | EventDetailView | ✅ Confirmation |
| Inscription avec approbation | registerForEvent (pending) | EventDetailView | ✅ Prise en compte |
| Admin approuve | approveParticipant | AdminEventsView | ✅ Approuvé |
| Admin rejette | rejectParticipant | AdminEventsView | ✅ Rejeté |
| Événement annulé | notifyParticipants('cancelled') | Admin | ✅ Tous |
| Événement reprogrammé | notifyParticipants('rescheduled') | Admin | ✅ Tous |
| Afficher image | banner EventDetailView | EventDetailView | - |
| Télécharger document | bouton EventDetailView | EventDetailView | - |

---

## 📁 BUCKETS STORAGE VÉRIFIÉS

| Bucket | Type | Limite | Status |
|--------|------|--------|--------|
| images | public | 10MB | ✅ OK |
| documents | public | 50MB | ✅ OK |

---

## 🎯 BONNES PRATIQUES IDENTIFIÉES

1. **Vérifier colonnes avant requêtes** - Toujours grep_search le service existant
2. **Wizard: champs visibles = champs validés** - Ne pas valider ce qu'on ne montre pas
3. **Séparer requêtes complexes** - Éviter jointures qui causent 400
4. **Emails transactionnels** - Toujours notifier l'utilisateur des actions importantes
5. **Statuts explicites** - pending/registered/rejected avec couleurs distinctes
6. **Migrations atomiques** - IF NOT EXISTS pour idempotence
