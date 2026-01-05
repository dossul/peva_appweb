# 🚨 RÈGLES DE DÉVELOPPEMENT CRITIQUES

## Règle #1 : Vérification BDD Obligatoire

**TOUJOURS vérifier la structure de la base de données AVANT de coder.**

### Procédure obligatoire :

1. **Exécuter le script de vérification** :
   ```bash
   cd script_tools
   node test-columns.js <nom_table>
   ```

2. **Analyser les colonnes existantes** :
   - ✅ Colonnes qui existent → Peuvent être utilisées dans le code
   - ❌ Colonnes qui n'existent pas → NE PAS les utiliser

3. **Si des colonnes manquent** :
   - Proposer une migration SQL à l'utilisateur
   - **ATTENDRE la validation de l'utilisateur** avant de modifier le code
   - Ne JAMAIS supposer qu'une migration a été exécutée

### Exemple de workflow :

```
1. Utilisateur demande une fonctionnalité
2. → Vérifier la BDD avec le script
3. → Si colonnes manquantes :
      - Proposer : "Les colonnes X, Y, Z n'existent pas. 
                   Voulez-vous que je crée une migration SQL ?"
      - ATTENDRE confirmation
4. → Coder UNIQUEMENT avec les colonnes vérifiées
```

## Règle #2 : Cohérence Code ↔ BDD

- Le code doit **TOUJOURS** refléter la structure réelle de la BDD
- Ne jamais utiliser de colonnes non vérifiées
- Commenter la date de vérification dans le code :
  ```javascript
  // Colonnes vérifiées via script test-columns.js le DD/MM/YYYY
  ```

## Règle #3 : Proposer des Amendements

Si la BDD nécessite des modifications :
1. **Rédiger la migration SQL** dans `peva/supabase/migrations/`
2. **Présenter à l'utilisateur** pour validation
3. **Ne modifier le code qu'APRÈS** confirmation de l'exécution

---

## Règle #4 : Vérification Storage Obligatoire (Ajoutée 2026-01-04)

**TOUJOURS vérifier les buckets Storage AVANT de coder des uploads.**

### Procédure obligatoire :

1. **Exécuter le script de vérification** :
   ```bash
   cd script_tools
   node verify-buckets.js
   ```

2. **Si des buckets manquent** :
   - Proposer le SQL de création à l'utilisateur
   - **ATTENDRE la validation de l'utilisateur**
   - NE JAMAIS tenter de créer un bucket depuis le code frontend

### Buckets requis par le projet PEVA :
| Bucket | Type | Usage |
|--------|------|-------|
| `avatars` | Public | Photos de profil |
| `logos` | Public | Logos entreprises |
| `documents` | Public | Opportunités, ressources |
| `images` | Public | Images contenu |
| `videos` | Privé | Vidéos uploadées |
| `greenhub-private` | Privé | Rapports RSE |

---

## Règle #5 : Interdiction de Modification Non Demandée (Ajoutée 2026-01-04)

**NE JAMAIS modifier le code sans que l'utilisateur l'ait explicitement demandé.**

### Exemples d'erreurs à éviter :
- ❌ Ajouter des fonctions "helper" non demandées
- ❌ Créer des workarounds pour contourner des problèmes
- ❌ Modifier la logique existante pour "améliorer"

### Comportement correct :
- ✅ Identifier le problème
- ✅ Proposer la solution à l'utilisateur
- ✅ Attendre la validation
- ✅ Implémenter uniquement ce qui est validé

---

**Scripts disponibles** :
- `script_tools/test-columns.js <table>` - Vérifie les colonnes d'une table
- `script_tools/verify-buckets.js` - Vérifie les buckets Storage
- `script_tools/get-columns.js <table>` - Liste les colonnes (si données existent)

**Credentials Supabase** : Voir `peva/.env`

---

## Règle #6 : Foreign Keys Obligatoires pour Jointures (Ajoutée 2026-01-04)

**Les jointures Supabase/PostgREST nécessitent des FK explicites.**

### Exemple d'erreur :
```javascript
// ❌ ERREUR si pas de FK
.select('id, pev_profiles:created_by(first_name)')
// → "Could not find a relationship between 'table' and 'created_by'"
```

### Solution :
```sql
-- ✅ Ajouter la FK
ALTER TABLE pev_events 
ADD CONSTRAINT pev_events_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES pev_profiles(id);
```

---

## Règle #7 : Policies RLS Sans Récursion (Ajoutée 2026-01-04)

**JAMAIS créer de policies RLS qui se référencent circulairement.**

### ❌ INTERDIT (cause erreur 500) :
```sql
-- Table A référence B
CREATE POLICY ON table_a USING (x IN (SELECT y FROM table_b WHERE ...))
-- Table B référence A
CREATE POLICY ON table_b USING (y IN (SELECT x FROM table_a WHERE ...))
```

### ✅ CORRECT :
```sql
-- Policies simples basées sur auth.uid() uniquement
CREATE POLICY ON table_a USING (user_id = auth.uid());
CREATE POLICY ON table_b USING (owner_id = auth.uid());
```

---

## Règle #8 : Colonnes Timestamps Obligatoires (Ajoutée 2026-01-04)

**Toute nouvelle table DOIT avoir ces colonnes :**

```sql
CREATE TABLE nouvelle_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- colonnes métier...
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## HISTORIQUE DES CORRECTIONS

| Date | Problème | Solution | Fichier |
|------|----------|----------|---------|
| 2026-01-04 | Buckets Storage manquants | Création des 6 buckets + policies RLS | `docs/HISTORIQUE_CORRECTIONS_STORAGE.md` |
| 2026-01-04 | Erreurs Admin Dashboard (6) | Tables, colonnes, FK, RLS corrigés | `docs/ANALYSE_ERREURS_ADMIN_DASHBOARD.md` |
