# PLAN DE SUPPRESSION DES CONTENUS (Events, Opportunities, Resources)
**Date:** 2026-01-08
**Objectif:** Permettre la suppression par admin ET créateur, même après validation (status=published)

---

## 📋 ANALYSE GRANULAIRE DU CODEBASE EXISTANT

### 1. ÉVÉNEMENTS (pev_events)

#### Services existants:
| Fichier | Fonction | Statuts autorisés | Commentaire |
|---------|----------|-------------------|-------------|
| `eventsService.js` | `deleteEvent(eventId)` | draft, rejected | ❌ Limité aux brouillons |
| `admin/eventsService.js` | `deleteEvent(eventId)` | TOUS | ✅ Supprime participants + commentaires + événement |

#### Vues existantes:
| Fichier | Bouton suppression | Condition |
|---------|-------------------|-----------|
| `AdminEventsView.vue` | ✅ Présent | Tous les événements |
| `MyEventsView.vue` | ✅ Présent | Seulement si `status IN ('draft', 'rejected')` |
| `EventDetailView.vue` | ❌ Absent | - |

#### RLS existantes (fix_events_delete_rls.sql):
```sql
-- Users: draft, rejected seulement
CREATE POLICY "Users can delete own events" ON pev_events FOR DELETE
USING (created_by = auth.uid() AND status IN ('draft', 'rejected'));

-- Admins: tous les événements
CREATE POLICY "Admins can delete any event" ON pev_events FOR DELETE
USING (EXISTS (SELECT 1 FROM pev_users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
```

#### ⚠️ MANQUES IDENTIFIÉS:
1. **RLS:** Users ne peuvent PAS supprimer leurs événements `published` ou `in_review`
2. **UI:** Pas de bouton suppression dans `EventDetailView.vue` pour le créateur
3. **MyEventsView:** Bouton suppression visible uniquement pour `draft`

---

### 2. OPPORTUNITÉS (pev_opportunities)

#### Services existants:
| Fichier | Fonction | Statuts autorisés | Commentaire |
|---------|----------|-------------------|-------------|
| `opportunitiesService.js` | `deleteDraft(id, userId)` | draft | ❌ Vérifie status=draft |
| `adminService.js` | `deleteOpportunity(id)` | TOUS | ✅ Suppression directe |

#### Vues existantes:
| Fichier | Bouton suppression | Condition |
|---------|-------------------|-----------|
| `AdminOpportunitiesManager.vue` | ✅ Présent | Tous |
| `MyOpportunitiesView.vue` | ✅ Présent | Seulement si `status === 'draft'` |

#### ⚠️ MANQUES IDENTIFIÉS:
1. **Service:** Pas de fonction pour supprimer opportunités publiées par le créateur
2. **RLS:** Vérifier si policy DELETE existe pour créateurs (tous statuts)
3. **UI:** Bouton suppression non visible si `status !== 'draft'` dans MyOpportunitiesView

---

### 3. RESSOURCES (pev_resources)

#### Services existants:
| Fichier | Fonction | Statuts autorisés | Commentaire |
|---------|----------|-------------------|-------------|
| `resourcesService.js` | `deleteDraft(id, userId)` | draft | ❌ Vérifie status=draft |
| `AdminResourcesManager.vue` | Suppression directe | TOUS | ✅ Utilise supabase.delete() |

#### Vues existantes:
| Fichier | Bouton suppression | Condition |
|---------|-------------------|-----------|
| `AdminResourcesManager.vue` | ✅ Présent | Tous |
| `MyResourcesView.vue` | ✅ Présent | Seulement si `status === 'draft'` |
| `ResourceDetailView.vue` | ❌ Absent | - |

#### ⚠️ MANQUES IDENTIFIÉS:
1. **Service:** Pas de fonction pour supprimer ressources publiées par le créateur
2. **RLS:** Vérifier si policy DELETE existe pour créateurs (tous statuts)
3. **UI:** Bouton suppression non visible si `status !== 'draft'` dans MyResourcesView

---

## 🎯 MODIFICATIONS À EFFECTUER

### PHASE 1: MIGRATIONS RLS SUPABASE

#### 1.1 Migration: `allow_delete_own_content.sql`

```sql
-- ============================================
-- Migration: Permettre suppression contenus propres
-- Date: 2026-01-08
-- ============================================

-- ÉVÉNEMENTS: Créateurs peuvent supprimer leurs événements (tous statuts)
DROP POLICY IF EXISTS "Users can delete own events" ON pev_events;
CREATE POLICY "Users can delete own events"
ON pev_events FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- OPPORTUNITÉS: Créateurs peuvent supprimer leurs opportunités (tous statuts)
DROP POLICY IF EXISTS "Users can delete own opportunities" ON pev_opportunities;
CREATE POLICY "Users can delete own opportunities"
ON pev_opportunities FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- RESSOURCES: Créateurs peuvent supprimer leurs ressources (tous statuts)
DROP POLICY IF EXISTS "Users can delete own resources" ON pev_resources;
CREATE POLICY "Users can delete own resources"
ON pev_resources FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- ADMINS: Peuvent supprimer tout contenu
DROP POLICY IF EXISTS "Admins can delete any opportunity" ON pev_opportunities;
CREATE POLICY "Admins can delete any opportunity"
ON pev_opportunities FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM pev_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

DROP POLICY IF EXISTS "Admins can delete any resource" ON pev_resources;
CREATE POLICY "Admins can delete any resource"
ON pev_resources FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM pev_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

SELECT 'Policies DELETE créées pour events, opportunities, resources' as message;
```

---

### PHASE 2: SERVICES FRONTEND

#### 2.1 `eventsService.js` - Modifier deleteEvent

**Avant:**
```javascript
async deleteEvent(eventId) {
  // Supprime seulement draft/rejected
}
```

**Après:**
```javascript
async deleteEvent(eventId, userId) {
  try {
    // Vérifier que l'utilisateur est le créateur
    const { data: event } = await supabase
      .from('pev_events')
      .select('created_by')
      .eq('id', eventId)
      .single()

    if (!event || event.created_by !== userId) {
      return { success: false, error: 'Non autorisé' }
    }

    // Supprimer participants et commentaires d'abord
    await supabase.from('pev_event_participants').delete().eq('event_id', eventId)
    await supabase.from('pev_event_comments').delete().eq('event_id', eventId)

    // Supprimer l'événement
    const { error } = await supabase
      .from('pev_events')
      .delete()
      .eq('id', eventId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

#### 2.2 `opportunitiesService.js` - Ajouter deleteOpportunity

```javascript
async deleteOpportunity(opportunityId, userId) {
  try {
    // Vérifier propriétaire
    const { data } = await supabase
      .from('pev_opportunities')
      .select('created_by')
      .eq('id', opportunityId)
      .single()

    if (!data || data.created_by !== userId) {
      return { success: false, error: 'Non autorisé' }
    }

    // Supprimer candidatures liées
    await supabase.from('pev_opportunity_applications').delete().eq('opportunity_id', opportunityId)

    // Supprimer l'opportunité
    const { error } = await supabase
      .from('pev_opportunities')
      .delete()
      .eq('id', opportunityId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

#### 2.3 `resourcesService.js` - Ajouter deleteResource

```javascript
async deleteResource(resourceId, userId) {
  try {
    // Vérifier propriétaire
    const { data } = await supabase
      .from('pev_resources')
      .select('created_by')
      .eq('id', resourceId)
      .single()

    if (!data || data.created_by !== userId) {
      return { success: false, error: 'Non autorisé' }
    }

    // Supprimer la ressource
    const { error } = await supabase
      .from('pev_resources')
      .delete()
      .eq('id', resourceId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

### PHASE 3: VUES FRONTEND

#### 3.1 `MyEventsView.vue` - Étendre bouton suppression

**Modifier condition:**
```html
<!-- AVANT: Visible seulement pour draft/rejected -->
<v-btn v-if="event.status === 'draft'" @click="confirmDelete(event)">

<!-- APRÈS: Visible pour TOUS les événements de l'utilisateur -->
<v-btn @click="confirmDelete(event)">
```

**Ajouter message de confirmation adaptatif:**
```html
<v-card-text>
  <template v-if="eventToDelete?.status === 'published'">
    <v-alert type="warning" class="mb-4">
      Cet événement est publié. Les participants seront notifiés de l'annulation.
    </v-alert>
  </template>
  Êtes-vous sûr de vouloir supprimer "{{ eventToDelete?.title }}" ?
</v-card-text>
```

#### 3.2 `EventDetailView.vue` - Ajouter bouton suppression

**Ajouter dans la sidebar si créateur ou admin:**
```html
<v-btn
  v-if="isOwner || isAdmin"
  color="error"
  variant="outlined"
  block
  class="mt-4"
  @click="confirmDelete"
>
  <v-icon class="mr-2">mdi-delete</v-icon>
  Supprimer l'événement
</v-btn>
```

**Ajouter dialog de confirmation et logique:**
```javascript
const isOwner = computed(() => event.value?.created_by === authStore.user?.id)
const isAdmin = computed(() => authStore.isAdmin)

const confirmDelete = () => { deleteDialog.value = true }

const deleteEvent = async () => {
  deleting.value = true
  const result = await eventsService.deleteEvent(event.value.id, authStore.user?.id)
  if (result.success) {
    router.push('/my-events')
  } else {
    showError(result.error)
  }
  deleting.value = false
}
```

#### 3.3 `MyOpportunitiesView.vue` - Étendre bouton suppression

**Supprimer condition `status === 'draft'`:**
```html
<!-- Bouton suppression visible pour TOUS les statuts -->
<v-btn color="error" variant="text" @click="confirmDelete(opportunity)">
  <v-icon>mdi-delete</v-icon>
</v-btn>
```

**Modifier fonction suppression:**
```javascript
const deleteOpportunity = async () => {
  deleting.value = true
  const result = await opportunitiesService.deleteOpportunity(
    opportunityToDelete.value.id,
    authStore.user?.id
  )
  // ... reste du code
}
```

#### 3.4 `MyResourcesView.vue` - Étendre bouton suppression

**Supprimer condition `status === 'draft'`:**
```html
<!-- Bouton suppression visible pour TOUS les statuts -->
<v-btn color="error" variant="text" @click="confirmDelete(resource)">
  <v-icon>mdi-delete</v-icon>
</v-btn>
```

**Modifier fonction suppression:**
```javascript
const deleteResource = async () => {
  deleting.value = true
  const result = await resourcesService.deleteResource(
    resourceToDelete.value.id,
    authStore.user?.id
  )
  // ... reste du code
}
```

#### 3.5 `ResourceDetailView.vue` - Ajouter bouton suppression (si absent)

Même logique que EventDetailView.vue.

---

## 📁 FICHIERS À MODIFIER

### Migrations:
| Fichier | Action | Priorité |
|---------|--------|----------|
| `supabase/migrations/allow_delete_own_content.sql` | CRÉER | P1 |

### Services:
| Fichier | Action | Priorité |
|---------|--------|----------|
| `src/services/eventsService.js` | MODIFIER deleteEvent | P1 |
| `src/services/opportunitiesService.js` | AJOUTER deleteOpportunity | P1 |
| `src/services/resourcesService.js` | AJOUTER deleteResource | P1 |

### Vues:
| Fichier | Action | Priorité |
|---------|--------|----------|
| `src/views/MyEventsView.vue` | MODIFIER condition bouton | P2 |
| `src/views/EventDetailView.vue` | AJOUTER bouton suppression | P2 |
| `src/views/MyOpportunitiesView.vue` | MODIFIER condition bouton | P2 |
| `src/views/MyResourcesView.vue` | MODIFIER condition bouton | P2 |
| `src/views/ResourceDetailView.vue` | AJOUTER bouton suppression | P3 |

---

## ✅ CHECKLIST AVANT EXÉCUTION

- [ ] Migration RLS validée
- [ ] Services frontend validés
- [ ] Vues frontend validées
- [ ] Tests manuels prévus

---

## 🔒 SÉCURITÉ

1. **Vérification propriétaire:** Chaque fonction vérifie `created_by === userId`
2. **RLS Supabase:** Double protection côté base de données
3. **Confirmation utilisateur:** Dialog de confirmation obligatoire
4. **Avertissement événements publiés:** Message spécial si contenu déjà publié

---

## ⏰ ESTIMATION

| Phase | Durée estimée |
|-------|---------------|
| Migration RLS | 5 min |
| Services | 15 min |
| Vues | 20 min |
| Tests | 10 min |
| **TOTAL** | **50 min** |

---

---

## 🆕 PHASE 4: EMAILS DE NOTIFICATION LORS SUPPRESSION

### 4.1 Suppression Événement → Email à TOUS les participants

**Fichier:** `eventsService.js`

```javascript
async deleteEventWithNotification(eventId, userId, reason = 'Événement annulé') {
  try {
    // 1. Récupérer l'événement et ses participants
    const { data: event } = await supabase
      .from('pev_events')
      .select('title, start_date, location')
      .eq('id', eventId)
      .single()

    const { data: participants } = await supabase
      .from('pev_event_participants')
      .select('user_id, pev_profiles:user_id(email, first_name, last_name)')
      .eq('event_id', eventId)

    // 2. Envoyer emails à tous les participants (en arrière-plan)
    if (participants?.length > 0) {
      for (const p of participants) {
        emailService.sendTemplateEmail('event_cancelled', p.pev_profiles.email, {
          recipient_name: `${p.pev_profiles.first_name} ${p.pev_profiles.last_name}`,
          event_title: event.title,
          event_date: new Date(event.start_date).toLocaleDateString('fr-FR'),
          cancellation_reason: reason
        }).catch(e => console.warn('Email erreur:', e))
      }
    }

    // 3. Supprimer participants et commentaires
    await supabase.from('pev_event_participants').delete().eq('event_id', eventId)
    await supabase.from('pev_event_comments').delete().eq('event_id', eventId)

    // 4. Supprimer l'événement
    const { error } = await supabase.from('pev_events').delete().eq('id', eventId)
    if (error) throw error

    return { success: true, notifiedCount: participants?.length || 0 }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### 4.2 Suppression Opportunité → Email à TOUS les candidats

**Fichier:** `opportunitiesService.js`

```javascript
async deleteOpportunityWithNotification(opportunityId, userId, reason = 'Opportunité retirée') {
  try {
    // 1. Récupérer l'opportunité et ses candidats
    const { data: opportunity } = await supabase
      .from('pev_opportunities')
      .select('title, type, company')
      .eq('id', opportunityId)
      .single()

    const { data: applicants } = await supabase
      .from('pev_opportunity_applications')
      .select('user_id, pev_profiles:user_id(email, first_name, last_name)')
      .eq('opportunity_id', opportunityId)

    // 2. Envoyer emails à tous les candidats (en arrière-plan)
    if (applicants?.length > 0) {
      for (const a of applicants) {
        emailService.sendTemplateEmail('opportunity_cancelled', a.pev_profiles.email, {
          recipient_name: `${a.pev_profiles.first_name} ${a.pev_profiles.last_name}`,
          opportunity_title: opportunity.title,
          opportunity_type: opportunity.type,
          cancellation_reason: reason
        }).catch(e => console.warn('Email erreur:', e))
      }
    }

    // 3. Supprimer candidatures
    await supabase.from('pev_opportunity_applications').delete().eq('opportunity_id', opportunityId)

    // 4. Supprimer l'opportunité
    const { error } = await supabase.from('pev_opportunities').delete().eq('id', opportunityId)
    if (error) throw error

    return { success: true, notifiedCount: applicants?.length || 0 }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### 4.3 Templates Email à créer

| Template Code | Sujet | Usage |
|---------------|-------|-------|
| `event_cancelled` | Événement annulé : {event_title} | Suppression événement |
| `opportunity_cancelled` | Opportunité retirée : {opportunity_title} | Suppression opportunité |

**Migration:** `add_cancellation_email_templates.sql`

```sql
INSERT INTO pev_email_templates (code, name, subject, body_html, variables) VALUES
('event_cancelled', 'Événement annulé', 'Événement annulé : {{event_title}}', 
'<h2>Bonjour {{recipient_name}},</h2>
<p>Nous vous informons que l''événement <strong>{{event_title}}</strong> prévu le {{event_date}} a été annulé.</p>
<p><strong>Raison :</strong> {{cancellation_reason}}</p>
<p>Nous vous prions de nous excuser pour ce désagrément.</p>
<p>Cordialement,<br>L''équipe 2iE GreenHub</p>',
'["recipient_name", "event_title", "event_date", "cancellation_reason"]'),

('opportunity_cancelled', 'Opportunité retirée', 'Opportunité retirée : {{opportunity_title}}',
'<h2>Bonjour {{recipient_name}},</h2>
<p>Nous vous informons que l''opportunité <strong>{{opportunity_title}}</strong> pour laquelle vous aviez candidaté n''est plus disponible.</p>
<p><strong>Raison :</strong> {{cancellation_reason}}</p>
<p>Nous vous invitons à consulter d''autres opportunités sur notre plateforme.</p>
<p>Cordialement,<br>L''équipe 2iE GreenHub</p>',
'["recipient_name", "opportunity_title", "opportunity_type", "cancellation_reason"]')
ON CONFLICT (code) DO UPDATE SET 
  subject = EXCLUDED.subject,
  body_html = EXCLUDED.body_html,
  variables = EXCLUDED.variables;
```

---

## 🆕 PHASE 5: WORKFLOW COMPLET CANDIDATURES

### 5.1 État actuel du workflow candidature

| Fonctionnalité | Status | Fichier |
|----------------|--------|---------|
| Postuler à une opportunité | ✅ Existe | `opportunitiesService.js` |
| Table `pev_opportunity_applications` | ✅ Existe | Migration créée |
| Colonnes: cover_letter, resume_url, portfolio_url | ✅ Existent | Migration |
| Vue liste candidatures | ✅ Existe | `OpportunityApplicationsView.vue` |
| Accepter/Rejeter candidature | ✅ Existe | `OpportunityApplicationsView.vue` |
| Email acceptation/rejet | ✅ Existe | Templates existants |

### 5.2 MANQUES IDENTIFIÉS - Documents candidature

#### ⚠️ Problème: Les documents (CV, lettre motivation) ne sont PAS uploadés

**Table actuelle:**
```sql
resume_url VARCHAR(500),      -- URL du CV (VIDE actuellement)
portfolio_url VARCHAR(500),   -- URL portfolio (VIDE actuellement)
cover_letter TEXT,            -- Lettre motivation texte (OK)
```

#### Solution: Ajouter upload documents dans le formulaire de candidature

**5.2.1 Migration: Ajouter colonnes documents**

```sql
-- Migration: add_application_documents.sql
ALTER TABLE pev_opportunity_applications 
ADD COLUMN IF NOT EXISTS cv_url TEXT,
ADD COLUMN IF NOT EXISTS motivation_letter_url TEXT,
ADD COLUMN IF NOT EXISTS additional_documents JSONB DEFAULT '[]';

COMMENT ON COLUMN pev_opportunity_applications.cv_url IS 'URL du CV uploadé';
COMMENT ON COLUMN pev_opportunity_applications.motivation_letter_url IS 'URL lettre motivation PDF';
COMMENT ON COLUMN pev_opportunity_applications.additional_documents IS 'Documents supplémentaires [{name, url, type}]';
```

**5.2.2 Service: Upload documents candidature**

```javascript
// opportunitiesService.js - Nouvelle fonction
async applyWithDocuments(opportunityId, userId, applicationData, files) {
  try {
    const uploadedUrls = {}

    // Upload CV si fourni
    if (files.cv) {
      const cvPath = `applications/${opportunityId}/${userId}/cv_${Date.now()}.pdf`
      const { error: cvError } = await supabase.storage
        .from('documents')
        .upload(cvPath, files.cv)
      if (!cvError) {
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(cvPath)
        uploadedUrls.cv_url = publicUrl
      }
    }

    // Upload lettre motivation si fournie
    if (files.motivationLetter) {
      const mlPath = `applications/${opportunityId}/${userId}/motivation_${Date.now()}.pdf`
      const { error: mlError } = await supabase.storage
        .from('documents')
        .upload(mlPath, files.motivationLetter)
      if (!mlError) {
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(mlPath)
        uploadedUrls.motivation_letter_url = publicUrl
      }
    }

    // Upload documents additionnels
    if (files.additionalDocs?.length > 0) {
      const additionalDocs = []
      for (const doc of files.additionalDocs) {
        const docPath = `applications/${opportunityId}/${userId}/doc_${Date.now()}_${doc.name}`
        const { error } = await supabase.storage
          .from('documents')
          .upload(docPath, doc)
        if (!error) {
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(docPath)
          additionalDocs.push({ name: doc.name, url: publicUrl, type: doc.type })
        }
      }
      uploadedUrls.additional_documents = additionalDocs
    }

    // Créer la candidature
    const { data, error } = await supabase
      .from('pev_opportunity_applications')
      .insert([{
        opportunity_id: opportunityId,
        user_id: userId,
        cover_letter: applicationData.coverLetter,
        applicant_notes: applicationData.notes,
        ...uploadedUrls
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

**5.2.3 Vue: Formulaire candidature avec upload**

**Fichier à modifier:** Ajouter dialog candidature dans `OpportunitiesView.vue` ou créer `ApplyOpportunityDialog.vue`

```html
<!-- Dialog Candidature -->
<v-dialog v-model="applyDialog" max-width="700">
  <v-card>
    <v-card-title>
      <v-icon class="mr-2">mdi-send</v-icon>
      Postuler à : {{ selectedOpportunity?.title }}
    </v-card-title>
    
    <v-card-text>
      <v-form ref="applicationForm">
        <!-- Lettre de motivation -->
        <v-textarea
          v-model="applicationData.coverLetter"
          label="Lettre de motivation *"
          rows="5"
          variant="outlined"
          :rules="[v => !!v || 'Requis']"
        />
        
        <!-- CV (PDF) -->
        <v-file-input
          v-model="applicationData.cv"
          label="CV (PDF) *"
          accept=".pdf"
          prepend-icon="mdi-file-document"
          variant="outlined"
          :rules="[v => !!v || 'CV requis']"
        />
        
        <!-- Lettre motivation PDF (optionnel) -->
        <v-file-input
          v-model="applicationData.motivationLetterFile"
          label="Lettre de motivation (PDF - optionnel)"
          accept=".pdf"
          prepend-icon="mdi-file-pdf-box"
          variant="outlined"
        />
        
        <!-- Documents additionnels -->
        <v-file-input
          v-model="applicationData.additionalDocs"
          label="Documents supplémentaires (optionnel)"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          multiple
          chips
        />
        
        <!-- Notes -->
        <v-textarea
          v-model="applicationData.notes"
          label="Notes additionnelles (optionnel)"
          rows="2"
          variant="outlined"
        />
      </v-form>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer />
      <v-btn @click="applyDialog = false">Annuler</v-btn>
      <v-btn color="primary" @click="submitApplication" :loading="submitting">
        <v-icon class="mr-2">mdi-send</v-icon>
        Envoyer ma candidature
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

### 5.3 Vue candidatures - Afficher documents

**Modifier `OpportunityApplicationsView.vue`:**

```html
<!-- Dans la liste des candidatures, ajouter boutons téléchargement -->
<template #append>
  <div class="d-flex flex-column align-end ga-1">
    <!-- Statut -->
    <v-chip :color="getStatusColor(application.status)" size="small">
      {{ getStatusLabel(application.status) }}
    </v-chip>
    
    <!-- Documents -->
    <div class="d-flex ga-1 mt-2">
      <v-btn
        v-if="application.cv_url"
        icon="mdi-file-document"
        size="x-small"
        color="blue"
        variant="tonal"
        :href="application.cv_url"
        target="_blank"
        title="Voir CV"
      />
      <v-btn
        v-if="application.motivation_letter_url"
        icon="mdi-file-pdf-box"
        size="x-small"
        color="red"
        variant="tonal"
        :href="application.motivation_letter_url"
        target="_blank"
        title="Voir lettre motivation"
      />
      <v-btn
        v-if="application.additional_documents?.length"
        icon="mdi-paperclip"
        size="x-small"
        color="grey"
        variant="tonal"
        @click="showDocuments(application)"
        title="Documents supplémentaires"
      />
    </div>
    
    <!-- Actions -->
    <div class="d-flex ga-1 mt-2">
      <!-- ... boutons accepter/rejeter existants ... -->
    </div>
  </div>
</template>
```

---

## 📁 FICHIERS À MODIFIER (MISE À JOUR)

### Migrations:
| Fichier | Action | Priorité |
|---------|--------|----------|
| `allow_delete_own_content.sql` | CRÉER | P1 |
| `add_cancellation_email_templates.sql` | CRÉER | P1 |
| `add_application_documents.sql` | CRÉER | P2 |

### Services:
| Fichier | Action | Priorité |
|---------|--------|----------|
| `eventsService.js` | AJOUTER `deleteEventWithNotification` | P1 |
| `opportunitiesService.js` | AJOUTER `deleteOpportunityWithNotification` | P1 |
| `opportunitiesService.js` | AJOUTER `applyWithDocuments` | P2 |
| `resourcesService.js` | AJOUTER `deleteResource` | P1 |

### Vues:
| Fichier | Action | Priorité |
|---------|--------|----------|
| `MyEventsView.vue` | MODIFIER suppression + raison | P1 |
| `MyOpportunitiesView.vue` | MODIFIER suppression + raison | P1 |
| `MyResourcesView.vue` | MODIFIER suppression | P1 |
| `EventDetailView.vue` | AJOUTER bouton suppression | P2 |
| `OpportunitiesView.vue` | AJOUTER dialog candidature avec upload | P2 |
| `OpportunityApplicationsView.vue` | AJOUTER affichage documents | P2 |

---

## ✅ CHECKLIST COMPLÈTE

### Phase 1: Migrations RLS
- [ ] `allow_delete_own_content.sql` créée
- [ ] `add_cancellation_email_templates.sql` créée
- [ ] `add_application_documents.sql` créée

### Phase 2: Services suppression
- [ ] `eventsService.deleteEventWithNotification()` implémentée
- [ ] `opportunitiesService.deleteOpportunityWithNotification()` implémentée
- [ ] `resourcesService.deleteResource()` implémentée

### Phase 3: Vues suppression
- [ ] `MyEventsView` - bouton tous statuts + dialog raison
- [ ] `MyOpportunitiesView` - bouton tous statuts + dialog raison
- [ ] `MyResourcesView` - bouton tous statuts
- [ ] `EventDetailView` - bouton si créateur/admin
- [ ] `ResourceDetailView` - bouton si créateur/admin

### Phase 4: Workflow candidature
- [ ] Upload CV dans formulaire candidature
- [ ] Upload lettre motivation dans formulaire
- [ ] Upload documents additionnels
- [ ] Affichage documents dans `OpportunityApplicationsView`
- [ ] Boutons téléchargement pour le créateur

### Phase 5: Suppression Admin/Modération
- [ ] `AdminModerationView` - Bouton supprimer dans modale détails
- [ ] `ModerationTab` - Bouton supprimer dans liste
- [ ] `ContentDetails` - Bouton supprimer visible admin
- [ ] `AdminEventsView` - Bouton supprimer (déjà présent ✅)
- [ ] `AdminOpportunitiesManager` - Bouton supprimer (déjà présent ✅)
- [ ] `AdminResourcesManager` - Bouton supprimer (déjà présent ✅)
- [ ] `moderationService` - Ajouter fonction `deleteContent()`

---

## 🆕 PHASE 6: SUPPRESSION CÔTÉ ADMIN/MODÉRATION

### 6.1 État actuel des vues Admin

| Vue | Bouton Supprimer | Commentaire |
|-----|-----------------|-------------|
| `AdminEventsView.vue` | ✅ Présent | Fonctionne |
| `AdminOpportunitiesManager.vue` | ✅ Présent | Fonctionne |
| `AdminResourcesManager.vue` | ✅ Présent | Fonctionne |
| `AdminModerationView.vue` | ❌ Absent | À ajouter |
| `ModerationTab.vue` | ❌ Absent | À ajouter |
| `ContentDetails.vue` | ❌ Absent | À ajouter |

### 6.2 Service: `moderationService.js` - Ajouter deleteContent

```javascript
/**
 * Supprimer un contenu (avec notification si applicable)
 * @param {string} contentType - Type de contenu (events, opportunities, resources)
 * @param {string|number} contentId - ID du contenu
 * @param {string} reason - Raison de suppression
 */
async deleteContent(contentType, contentId, reason = 'Supprimé par l\'administrateur') {
  console.log('deleteContent:', { contentType, contentId, reason })
  
  try {
    let result
    
    switch (contentType) {
      case 'events':
        // Notifier les participants avant suppression
        result = await this.deleteEventWithNotification(contentId, reason)
        break
        
      case 'opportunities':
        // Notifier les candidats avant suppression
        result = await this.deleteOpportunityWithNotification(contentId, reason)
        break
        
      case 'resources':
        // Suppression simple
        const { error } = await supabase
          .from('pev_resources')
          .delete()
          .eq('id', contentId)
        if (error) throw error
        result = { success: true }
        break
        
      case 'companies':
        const { error: compError } = await supabase
          .from('pev_companies')
          .delete()
          .eq('id', contentId)
        if (compError) throw compError
        result = { success: true }
        break
        
      case 'forum_topics':
        // Supprimer posts associés d'abord
        await supabase.from('pev_forum_posts').delete().eq('topic_id', contentId)
        const { error: topicError } = await supabase
          .from('pev_forum_topics')
          .delete()
          .eq('id', contentId)
        if (topicError) throw topicError
        result = { success: true }
        break
        
      default:
        throw new Error(`Type non supporté: ${contentType}`)
    }
    
    // Logger l'action
    this.logModerationAction(null, 'delete', contentType, contentId, { reason }).catch(() => {})
    
    return result
  } catch (error) {
    console.error('Erreur deleteContent:', error)
    return { success: false, error: error.message }
  }
},

async deleteEventWithNotification(eventId, reason) {
  // Récupérer événement et participants
  const { data: event } = await supabase
    .from('pev_events')
    .select('title, start_date')
    .eq('id', eventId)
    .single()

  const { data: participants } = await supabase
    .from('pev_event_participants')
    .select('user_id, pev_profiles:user_id(email, first_name, last_name)')
    .eq('event_id', eventId)

  // Envoyer emails (arrière-plan)
  if (participants?.length > 0) {
    for (const p of participants) {
      if (p.pev_profiles?.email) {
        emailService.sendTemplateEmail('event_cancelled', p.pev_profiles.email, {
          recipient_name: `${p.pev_profiles.first_name || ''} ${p.pev_profiles.last_name || ''}`,
          event_title: event?.title || 'Événement',
          event_date: event?.start_date ? new Date(event.start_date).toLocaleDateString('fr-FR') : 'Non définie',
          cancellation_reason: reason
        }).catch(e => console.warn('Email erreur:', e))
      }
    }
  }

  // Supprimer données liées
  await supabase.from('pev_event_participants').delete().eq('event_id', eventId)
  await supabase.from('pev_event_comments').delete().eq('event_id', eventId)

  // Supprimer événement
  const { error } = await supabase.from('pev_events').delete().eq('id', eventId)
  if (error) throw error

  return { success: true, notifiedCount: participants?.length || 0 }
},

async deleteOpportunityWithNotification(opportunityId, reason) {
  // Récupérer opportunité et candidats
  const { data: opportunity } = await supabase
    .from('pev_opportunities')
    .select('title, type')
    .eq('id', opportunityId)
    .single()

  const { data: applicants } = await supabase
    .from('pev_opportunity_applications')
    .select('user_id, pev_profiles:user_id(email, first_name, last_name)')
    .eq('opportunity_id', opportunityId)

  // Envoyer emails (arrière-plan)
  if (applicants?.length > 0) {
    for (const a of applicants) {
      if (a.pev_profiles?.email) {
        emailService.sendTemplateEmail('opportunity_cancelled', a.pev_profiles.email, {
          recipient_name: `${a.pev_profiles.first_name || ''} ${a.pev_profiles.last_name || ''}`,
          opportunity_title: opportunity?.title || 'Opportunité',
          cancellation_reason: reason
        }).catch(e => console.warn('Email erreur:', e))
      }
    }
  }

  // Supprimer candidatures
  await supabase.from('pev_opportunity_applications').delete().eq('opportunity_id', opportunityId)

  // Supprimer opportunité
  const { error } = await supabase.from('pev_opportunities').delete().eq('id', opportunityId)
  if (error) throw error

  return { success: true, notifiedCount: applicants?.length || 0 }
}
```

### 6.3 Vue: `AdminModerationView.vue` - Ajouter bouton Supprimer dans modale

```html
<!-- Dans la modale détails, à côté des boutons Rejeter/Approuver -->
<v-btn 
  color="error" 
  variant="outlined"
  @click="confirmDeleteContent"
  :disabled="!selectedContent?.id"
>
  <v-icon class="mr-2">mdi-delete</v-icon>
  Supprimer
</v-btn>

<!-- Dialog confirmation suppression -->
<v-dialog v-model="deleteContentDialog" max-width="500">
  <v-card>
    <v-card-title class="text-error">
      <v-icon class="mr-2">mdi-alert</v-icon>
      Confirmer la suppression
    </v-card-title>
    <v-card-text>
      <p class="mb-4">
        Êtes-vous sûr de vouloir supprimer définitivement ce contenu ?
        <strong>{{ selectedContent?.title || selectedContent?.name }}</strong>
      </p>
      <v-alert v-if="selectedContentType === 'events'" type="warning" density="compact" class="mb-3">
        Les participants inscrits seront notifiés par email.
      </v-alert>
      <v-alert v-if="selectedContentType === 'opportunities'" type="warning" density="compact" class="mb-3">
        Les candidats seront notifiés par email.
      </v-alert>
      <v-textarea
        v-model="deleteReason"
        label="Raison de la suppression"
        variant="outlined"
        rows="2"
        placeholder="Ex: Contenu inapproprié, Demande du créateur..."
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="deleteContentDialog = false">Annuler</v-btn>
      <v-btn color="error" variant="flat" @click="executeDeleteContent" :loading="deleting">
        Supprimer définitivement
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

**Script:**
```javascript
const deleteContentDialog = ref(false)
const deleteReason = ref('')
const deleting = ref(false)

const confirmDeleteContent = () => {
  deleteReason.value = ''
  deleteContentDialog.value = true
}

const executeDeleteContent = async () => {
  if (!selectedContent.value?.id) return
  
  deleting.value = true
  try {
    const result = await moderationService.deleteContent(
      selectedContentType.value,
      selectedContent.value.id,
      deleteReason.value || 'Supprimé par l\'administrateur'
    )
    
    if (result.success) {
      showMessage(`Contenu supprimé. ${result.notifiedCount || 0} personne(s) notifiée(s).`, 'success')
      deleteContentDialog.value = false
      detailsDialog.value = false
      await loadAllStats()
    } else {
      showMessage('Erreur: ' + result.error, 'error')
    }
  } catch (error) {
    showMessage('Erreur: ' + error.message, 'error')
  } finally {
    deleting.value = false
  }
}
```

### 6.4 Composant: `ModerationTab.vue` - Ajouter bouton supprimer dans liste

```html
<!-- Dans les actions de chaque item -->
<v-btn
  icon="mdi-delete"
  size="small"
  color="error"
  variant="text"
  @click.stop="$emit('delete', contentType, item)"
  title="Supprimer"
/>
```

**Ajouter emit dans le composant:**
```javascript
const emit = defineEmits(['approve', 'reject', 'view-details', 'bulk-action', 'delete'])
```

### 6.5 Fichiers Admin à modifier

| Fichier | Modification |
|---------|--------------|
| `AdminModerationView.vue` | Bouton + dialog suppression dans modale |
| `ModerationTab.vue` | Bouton suppression dans liste items |
| `ContentDetails.vue` | Afficher infos suppression si admin |
| `moderationService.js` | Fonction `deleteContent()` avec notifications |

---

## ⏰ ESTIMATION FINALE

| Phase | Durée estimée |
|-------|---------------|
| Migrations (3 fichiers) | 10 min |
| Services suppression + emails | 25 min |
| Vues utilisateur suppression | 20 min |
| Workflow candidature complet | 35 min |
| **Admin/Modération suppression** | **20 min** |
| Tests | 15 min |
| **TOTAL** | **~125 min (~2h)** |

---

**ATTENTE VALIDATION UTILISATEUR AVANT EXÉCUTION**
