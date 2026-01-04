# HISTORIQUE DES CORRECTIONS - Storage Supabase
**Date**: 2026-01-04 20:47 UTC

---

## CONTEXTE DU PROBLÈME

L'upload de fichiers pour les opportunités échouait avec l'erreur "Bucket not found".
Cause: Les buckets Storage Supabase n'existaient pas.

---

## ACTIONS RÉALISÉES

### 1. Analyse du codebase (20:35 UTC)
- Recherche de tous les buckets utilisés dans le projet
- Fichiers analysés: `fileService.js`, `opportunitiesService.js`, `rseService.js`, `ImageUploader.vue`

### 2. Identification des buckets requis (20:36 UTC)
| Bucket | Type | Usage |
|--------|------|-------|
| `avatars` | Public | Photos de profil utilisateurs |
| `logos` | Public | Logos des entreprises |
| `documents` | Public | Documents opportunités, ressources |
| `images` | Public | Images générales du contenu |
| `videos` | Privé | Vidéos uploadées |
| `greenhub-private` | Privé | Rapports RSE confidentiels |

### 3. Création du script de vérification (20:37 UTC)
- Fichier: `script_tools/verify-buckets.js`
- Permet de vérifier quels buckets existent et lesquels manquent

### 4. Création de la migration SQL (20:38 UTC)
- Fichier: `peva/supabase/migrations/create_all_storage_buckets.sql`
- Contient la création des 6 buckets + policies RLS

### 5. Exécution SQL par l'utilisateur (20:39 UTC)
```sql
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('logos', 'logos', true),
('documents', 'documents', true),
('images', 'images', true),
('videos', 'videos', false),
('greenhub-private', 'greenhub-private', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
```
**Résultat**: Success

### 6. Vérification des policies RLS (20:41 UTC)
- Policies déjà existantes pour les buckets publics
- Aucune action supplémentaire requise

---

## ERREURS À NE PLUS REPRODUIRE

### ❌ ERREUR COMMISE
- Ajout de la fonction `ensureBucketExists()` dans `opportunitiesService.js` sans permission
- Cette fonction tentait de créer le bucket depuis le frontend, ce qui est impossible avec la clé anon

### ✅ CORRECTION APPLIQUÉE
- Suppression de `ensureBucketExists()` du code
- Les buckets doivent être créés côté Supabase (SQL ou interface)

---

## SCRIPTS DE VÉRIFICATION

### Vérifier les buckets
```bash
cd script_tools && node verify-buckets.js
```

### Tester un bucket spécifique
```bash
node -e "import { createClient } from '@supabase/supabase-js'; const s = createClient('URL', 'KEY'); const { data, error } = await s.storage.from('documents').list('', { limit: 1 }); console.log(error ? 'ERREUR: ' + error.message : 'OK');"
```

---

## FICHIERS CRÉÉS/MODIFIÉS

| Fichier | Action | Description |
|---------|--------|-------------|
| `script_tools/verify-buckets.js` | Créé | Script vérification buckets |
| `peva/supabase/migrations/create_all_storage_buckets.sql` | Créé | Migration SQL complète |
| `peva/src/services/opportunitiesService.js` | Restauré | Suppression fonction non autorisée |

---

## RÈGLE CRITIQUE RENFORCÉE

**AVANT TOUT CODAGE IMPLIQUANT SUPABASE:**
1. Exécuter `node verify-buckets.js` pour Storage
2. Exécuter `node test-columns.js <table>` pour les tables
3. NE JAMAIS supposer qu'une ressource existe
4. PROPOSER les migrations SQL et ATTENDRE validation utilisateur
5. NE JAMAIS modifier le code sans vérification préalable
