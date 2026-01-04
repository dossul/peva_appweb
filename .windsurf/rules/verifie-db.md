---
trigger: model_decision
---
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

**Scripts disponibles** :
- `script_tools/test-columns.js <table>` - Vérifie les colonnes d'une table
- `script_tools/get-columns.js <table>` - Liste les colonnes (si données existent)

**Credentials Supabase** : Voir `peva/.env`

