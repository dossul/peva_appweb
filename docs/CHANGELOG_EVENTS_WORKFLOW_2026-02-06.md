# Changelog - Workflow Événements 2iE GreenHub

**Date:** 6 février 2026  
**Session:** 00:56 - 01:30 UTC  
**Auteur:** Cascade AI Assistant

---

## Résumé Exécutif

Correction complète du workflow de gestion des événements incluant:
- Correction du rôle admin dans la base de données
- Ajout des notifications email à la création d'événements
- Mise à jour des templates email avec logo et footer cohérents
- Amélioration du système de modération

---

## Problèmes Identifiés

### 1. Événements invisibles en modération admin
**Symptôme:** L'administrateur ne voyait aucun événement dans l'onglet "Modération de Contenu" malgré 3 événements en attente de validation.

**Diagnostic:**
- Les événements existaient bien en base avec `status: 'in_review'`
- Le compte `admin@2iegreenhub.org` avait `role: 'user'` au lieu de `'admin'` ou `'super_admin'`
- Les RLS (Row Level Security) policies de Supabase bloquaient l'accès

**Données vérifiées:**
```json
// Événements en base
[
  { "id": 10, "title": "azer", "status": "in_review", "created_by": "969cfc5a-..." },
  { "id": 9, "title": "addd", "status": "in_review", "created_by": "969cfc5a-..." },
  { "id": 8, "title": "manger", "status": "in_review", "created_by": "969cfc5a-..." },
  { "id": 7, "title": "erzzrr", "status": "published", "created_by": "d5080418-..." }
]

// Profil admin AVANT correction
{ "email": "admin@2iegreenhub.org", "role": "user" }
```

### 2. Absence d'emails de notification à la création
**Symptôme:** Aucun email envoyé au créateur ni aux admins lors de la soumission d'un événement.

### 3. Templates email sans branding cohérent
**Symptôme:** Les emails n'avaient pas le logo 2iE GreenHub ni un footer professionnel.

---

## Corrections Appliquées

### 01:19 UTC - Correction du rôle admin

**Action:** Mise à jour du rôle dans `pev_profiles`

```sql
UPDATE pev_profiles 
SET role = 'super_admin' 
WHERE email = 'admin@2iegreenhub.org';
```

**Résultat:**
```json
{ "email": "admin@2iegreenhub.org", "role": "super_admin" }
```

---

### 01:00 UTC - Ajout des emails de notification à la création

**Fichier modifié:** `src/services/eventsService.js`

**Fonctionnalités ajoutées:**

1. **Email au créateur** après soumission:
```javascript
// Après création réussie de l'événement
await this.sendEventEmail({
  to: eventData.contact_email,
  subject: `Événement soumis - ${eventData.title}`,
  type: 'event_submitted',
  data: {
    recipientName: eventData.organizer_name,
    eventTitle: eventData.title,
    eventDate: eventData.start_date,
    eventLocation: eventData.location
  }
})
```

2. **Notification aux admins** pour modération:
```javascript
async notifyAdminsNewEvent(event) {
  const { data: admins } = await supabase
    .from('pev_profiles')
    .select('email, first_name')
    .in('role', ['admin', 'super_admin'])
  
  for (const admin of admins) {
    await this.sendEventEmail({
      to: admin.email,
      subject: `[Modération] Nouvel événement à valider`,
      type: 'admin_event_review',
      data: {
        recipientName: admin.first_name,
        eventTitle: event.title,
        moderationUrl: 'https://app.2iegreenhub.org/admin/moderation'
      }
    })
  }
}
```

3. **Types d'emails supportés** dans `sendEventEmail`:
- `event_submitted` - Confirmation de soumission
- `admin_event_review` - Notification admin
- `registration_pending` - Inscription en attente
- `registration_confirmed` - Inscription confirmée
- `registration_approved` - Inscription approuvée
- `registration_rejected` - Inscription rejetée
- `event_cancelled` - Événement annulé

---

### 01:27 UTC - Mise à jour des templates email

**Table modifiée:** `pev_email_templates`

**Templates mis à jour:**
- `event_approved`
- `event_rejected`
- `opportunity_approved`
- `opportunity_rejected`
- `resource_approved`
- `resource_rejected`

**Structure HTML standardisée:**

```html
<!-- Logo -->
<img src="https://app.2iegreenhub.org/assets/logo_2ie_greenhub-D0lisDSr.png" 
     alt="2iE GreenHub" style="max-width:200px;">

<!-- Header coloré avec icône -->
<td style="background:linear-gradient(135deg,#7b1fa2 0%,#9c27b0 100%);">
  <span style="font-size:40px;">✅</span>
  <h1>Événement Approuvé</h1>
</td>

<!-- Contenu -->
<p>Bonjour {{recipient_name}},</p>
<p>Votre événement "{{event_title}}" a été approuvé !</p>

<!-- Footer -->
<p>© 2026 2iE GreenHub - L'Écosystème Digital de l'Économie Verte</p>
```

---

### 01:08 UTC - Ajout de logs de debug

**Fichier modifié:** `src/services/admin/moderationService.js`

**Logs ajoutés pour diagnostic:**
```javascript
console.log('📅 Chargement événements en modération...')
console.log('📅 Stats événements brut:', result)
console.log('📊 Modération events:', { data, error, count })
```

---

## Fichiers Modifiés

| Fichier | Modifications |
|---------|---------------|
| `src/services/eventsService.js` | Ajout emails création + types email |
| `src/services/admin/moderationService.js` | Ajout logs debug |
| `pev_profiles` (Supabase) | Role admin corrigé |
| `pev_email_templates` (Supabase) | 6 templates mis à jour |

---

## Tests de Validation

### ✅ Modération admin
- Les 3 événements `in_review` sont maintenant visibles
- L'approbation fonctionne et change le status à `published`

### ✅ Emails de modération
- Email envoyé au créateur lors de l'approbation
- Template avec logo et footer cohérents

### ⏳ À tester
- Email de notification à la création d'événement
- Notification aux admins pour nouvel événement

---

## RLS Policies Recommandées

Si des problèmes de visibilité persistent, appliquer ces policies sur `pev_events`:

```sql
-- SELECT: Admins voient tout, users voient published + leurs propres
CREATE POLICY "pev_events_select_policy" ON pev_events
FOR SELECT USING (
  status = 'published'
  OR created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM pev_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- INSERT: Users peuvent créer
CREATE POLICY "pev_events_insert_policy" ON pev_events
FOR INSERT WITH CHECK (auth.uid() = created_by);

-- UPDATE: Créateur ou admin
CREATE POLICY "pev_events_update_policy" ON pev_events
FOR UPDATE USING (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM pev_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);
```

---

## Workflow Événements - Flux Complet

```
┌─────────────────┐
│ Utilisateur     │
│ crée événement  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│ status:         │────▶│ Email créateur:  │
│ 'in_review'     │     │ "Soumis pour     │
└────────┬────────┘     │  modération"     │
         │              └──────────────────┘
         │              ┌──────────────────┐
         └─────────────▶│ Email admins:    │
                        │ "Nouvel événement│
                        │  à valider"      │
                        └──────────────────┘
         │
         ▼
┌─────────────────┐
│ Admin modère    │
│ /admin/moderation│
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐  ┌────────┐
│Approuver│  │Rejeter │
└───┬───┘  └───┬────┘
    │          │
    ▼          ▼
┌─────────┐ ┌─────────┐
│status:  │ │status:  │
│published│ │rejected │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌──────────┐ ┌──────────┐
│Email:    │ │Email:    │
│"Approuvé"│ │"Rejeté"  │
└──────────┘ └──────────┘
     │
     ▼
┌─────────────────┐
│ Visible dans:   │
│ - Slider landing│
│ - Page events   │
│ - Calendrier    │
└─────────────────┘
```

---

## Contact

Pour toute question sur ces modifications:
- Code source: `/peva/src/services/`
- Templates email: Supabase → `pev_email_templates`
- Profils admin: Supabase → `pev_profiles`

---

*Document généré automatiquement le 6 février 2026 à 01:30 UTC*
