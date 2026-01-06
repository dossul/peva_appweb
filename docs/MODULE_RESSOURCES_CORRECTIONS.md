# Module Ressources - Documentation des Corrections

## Date: 06/01/2026

---

## 1. Architecture du Module

### Tables BDD
- **`pev_resources`** : Table principale des ressources
  - `id` : UUID
  - `title` : Titre
  - `description` : Description
  - `type` : Type (guide, tool, template, etc.)
  - `sectors` : Array de secteurs
  - `difficulty_level` : Niveau (Débutant, Intermédiaire, Avancé)
  - `language` : Langue
  - `tags` : Array de tags
  - `media_url` : URL du fichier principal (documents)
  - `cover_image_url` : URL de l'image de couverture (images)
  - `source` : Lien externe
  - `is_free` : Boolean gratuit
  - `allow_download` : Boolean téléchargement autorisé
  - `allow_sharing` : Boolean partage autorisé
  - `status` : draft | in_review | published | rejected
  - `created_by` : UUID de l'auteur
  - `views_count` : Compteur de vues
  - `created_at` / `updated_at` : Timestamps

### Buckets Storage
- **`documents`** : Fichiers principaux (PDF, Word, Excel, PPT)
  - Path: `resources/drafts/` pour brouillons
  - Path: `resources/` pour soumissions
- **`images`** : Images de couverture
  - Path: `resources/covers/`

### Services
- **`resourcesService.js`** : CRUD ressources
  - `getResources()` : Liste ressources publiées
  - `getResourceById(id)` : Détail ressource + incrémente views_count
  - `createResource(data, mainFile, coverImage)` : Soumission pour révision
  - `saveDraft(data, mainFile, coverImage)` : Sauvegarde brouillon
  - `getUserResources(userId)` : Ressources de l'utilisateur

### Vues
- **`SubmitResourceView.vue`** : Formulaire soumission/édition
- **`MyResourcesView.vue`** : Liste des ressources de l'utilisateur
- **`ResourcesView.vue`** : Bibliothèque publique
- **`ResourceDetailView.vue`** : Détail d'une ressource

### Routes
- `/resources` : Bibliothèque publique
- `/resources/:id` : Détail ressource
- `/resources/submit` : Nouvelle soumission
- `/resources/edit/:id` : Édition brouillon existant
- `/my-resources` : Mes ressources

---

## 2. Bugs Corrigés

### Bug 1: Colonne `views` inexistante
- **Erreur**: `Could not find the 'views' column`
- **Cause**: Code référençait `views` au lieu de `views_count`
- **Correction**: `resourcesService.js` ligne 88
```javascript
// AVANT (incorrect)
.update({ views: (data.views || 0) + 1 })
// APRÈS (correct)
.update({ views_count: (data.views_count || 0) + 1 })
```

### Bug 2: PATCH 400 sur update brouillon
- **Erreur**: `PATCH 400 Bad Request`
- **Cause**: `created_by` inclus dans l'update (interdit par RLS)
- **Correction**: `resourcesService.js` - saveDraft()
```javascript
// Pour UPDATE: ne pas inclure created_by
if (resourceData.id) {
  // adaptedData sans created_by
}
// Pour INSERT: inclure created_by
else {
  adaptedData.created_by = resourceData.created_by
}
```

### Bug 3: Image couverture jamais sauvegardée
- **Erreur**: `cover_image_url` toujours null en BDD
- **Cause**: `coverImageUrl` uploadé mais jamais ajouté à `adaptedData`
- **Correction**: `resourcesService.js` - createResource() ligne 162
```javascript
const adaptedData = {
  // ... autres champs
  media_url: fileUrl,
  cover_image_url: coverImageUrl, // AJOUTÉ - était manquant !
  // ...
}
```

### Bug 4: Route édition brouillon manquante
- **Erreur**: Bouton "Continuer" redirigeait vers accueil
- **Cause**: Route `/resources/edit/:id` inexistante
- **Correction**: `router/index.js`
```javascript
{
  path: '/resources/edit/:id',
  name: 'EditResource',
  component: () => import('@/views/SubmitResourceView.vue'),
  meta: { requiresAuth: true }
}
```

### Bug 5: Brouillon non chargé en édition
- **Cause**: `loadDraft()` non appelé quand route avec param id
- **Correction**: `SubmitResourceView.vue` - onMounted()
```javascript
onMounted(async () => {
  const resourceId = route.params.id
  if (resourceId) {
    await loadDraft(resourceId)
  }
})
```

### Bug 6: Loader infini sur approbation
- **Cause**: `sendModerationEmail` avec await bloquait si erreur 500
- **Correction**: `moderationService.js` - sendModerationEmail rendu non-bloquant
```javascript
// Email envoyé en arrière-plan, jamais bloquant
emailService.sendTemplateEmail(templateCode, email, variables)
  .then(result => { /* log */ })
  .catch(err => { /* log warning */ })
```

### Bug 7: Référence table audit_logs incorrecte
- **Erreur**: `audit_logs` n'existe pas
- **Cause**: Table nommée `pev_audit_logs`
- **Correction**: `moderationService.js` - toutes références corrigées

---

## 3. Checklist Développement Module

### Avant de coder
- [ ] Vérifier structure BDD avec SQL: `SELECT column_name FROM information_schema.columns WHERE table_name = 'pev_xxx';`
- [ ] Vérifier buckets storage: `SELECT id, name, public FROM storage.buckets;`
- [ ] Lister les routes existantes dans `router/index.js`

### Pendant le développement
- [ ] Toujours ajouter logs console pour debug
- [ ] Vérifier que TOUTES les variables uploadées sont ajoutées à l'objet data
- [ ] Ne jamais inclure `created_by` dans les UPDATE (RLS)
- [ ] Tester avec la console ouverte (F12)

### Après le développement
- [ ] Vérifier BDD que les données sont bien insérées
- [ ] Tester tous les cas: création, édition, affichage
- [ ] Supprimer les logs de debug en production

---

## 4. Commandes SQL Utiles

```sql
-- Vérifier colonnes d'une table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pev_resources';

-- Vérifier buckets storage
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets;

-- Vérifier ressources récentes
SELECT id, title, cover_image_url, media_url, status 
FROM pev_resources 
ORDER BY created_at DESC LIMIT 10;

-- Ajouter colonne manquante
ALTER TABLE pev_resources ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
```

---

## 5. Structure Fichiers du Module

```
peva/src/
├── services/
│   └── resourcesService.js          # CRUD ressources
├── views/
│   ├── SubmitResourceView.vue       # Formulaire soumission
│   ├── MyResourcesView.vue          # Mes ressources
│   ├── ResourcesView.vue            # Bibliothèque publique
│   └── ResourceDetailView.vue       # Détail ressource
├── components/
│   └── admin/
│       ├── ContentDetails.vue       # Vue détails modération
│       └── ModerationTab.vue        # Onglet modération
└── router/
    └── index.js                     # Routes (dont /resources/edit/:id)
```

---

## 6. Flow Complet

1. **Création brouillon**: SubmitResourceView → saveDraft() → pev_resources (status=draft)
2. **Soumission**: SubmitResourceView → createResource() → pev_resources (status=in_review)
3. **Modération**: AdminModerationView → approveContent() → pev_resources (status=published)
4. **Affichage**: ResourcesView/ContentDetails → getResources()/getResourceById()

---

*Document généré automatiquement - À maintenir lors de futures modifications*
