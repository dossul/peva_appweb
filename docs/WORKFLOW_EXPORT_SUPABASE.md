# 🔄 Workflow d'Export Supabase Self-Hosted

Guide complet pour exporter votre instance Supabase self-hosted vers des fichiers SQL.

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Scripts disponibles](#scripts-disponibles)
4. [Utilisation](#utilisation)
5. [Exemples](#exemples)
6. [Automatisation](#automatisation)
7. [Restauration](#restauration)
8. [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

Ce workflow permet d'exporter facilement et rapidement votre base de données Supabase self-hosted (`supabase.benga.live`) vers des fichiers SQL pour:

- ✅ **Backup régulier** de vos données
- ✅ **Migration** vers une autre instance
- ✅ **Versionnement** de la structure de base
- ✅ **Restauration** en cas de problème
- ✅ **Développement** avec copies de la production

---

## 🔧 Prérequis

### Logiciels requis

- **Node.js** v16+ (déjà installé)
- **@supabase/supabase-js** (déjà installé dans le projet)

### Configuration

Votre fichier `.env` doit contenir:

```env
VITE_SUPABASE_URL=https://supabase.benga.live
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

**Important**: Utilisez le **SERVICE_ROLE_KEY** (pas l'ANON_KEY) pour avoir accès complet aux tables.

---

## 📦 Scripts Disponibles

### 1. `export-supabase-to-sql.js`

**Script principal d'export**

Génère un fichier SQL complet avec:
- Structure des tables (CREATE TABLE)
- Données (INSERT statements)
- Extensions PostgreSQL

**Localisation**: `scripts/export-supabase-to-sql.js`

### 2. `backup-supabase.bat` (Windows)

**Script de backup automatique**

Crée un backup horodaté dans le dossier `backups/`.

**Localisation**: `scripts/backup-supabase.bat`

### 3. `backup-supabase.sh` (Linux/Mac)

**Équivalent Linux/Mac du script de backup**

**Localisation**: `scripts/backup-supabase.sh`

### 4. `explore-all-tables.js`

**Script d'exploration**

Liste toutes les tables et leurs contenus sans créer de fichier.

**Localisation**: `scripts/explore-all-tables.js`

---

## 🚀 Utilisation

### Export Complet (Recommandé)

**Windows**:
```bash
.\scripts\backup-supabase.bat
```

**Linux/Mac**:
```bash
chmod +x scripts/backup-supabase.sh
./scripts/backup-supabase.sh
```

**Résultat**: Fichier `backups/backup-YYYYMMDD-HHMMSS.sql`

---

### Export Manuel avec Options

```bash
# Export complet (structure + données)
node scripts/export-supabase-to-sql.js

# Export structure uniquement
node scripts/export-supabase-to-sql.js --schema-only

# Export données uniquement
node scripts/export-supabase-to-sql.js --data-only

# Export avec nom personnalisé
node scripts/export-supabase-to-sql.js --output=mon-export.sql

# Export de tables spécifiques
node scripts/export-supabase-to-sql.js --tables=pev_users,pev_profiles,pev_companies

# Combiner les options
node scripts/export-supabase-to-sql.js --schema-only --tables=pev_users --output=users-schema.sql
```

---

## 📝 Exemples

### Exemple 1: Backup Quotidien

Créer un backup quotidien automatique:

**Windows** (Tâche planifiée):
1. Ouvrir "Planificateur de tâches"
2. Créer une tâche
3. Déclencheur: Tous les jours à 2h00
4. Action: `C:\wamp64\www\peva_appweb\scripts\backup-supabase.bat`

**Linux** (Cron):
```bash
# Ajouter au crontab
0 2 * * * /chemin/vers/peva_appweb/scripts/backup-supabase.sh
```

---

### Exemple 2: Export Avant Mise à Jour

Avant toute modification majeure:

```bash
node scripts/export-supabase-to-sql.js --output=before-update-20260101.sql
```

---

### Exemple 3: Export pour Développement

Créer une copie de production pour dev:

```bash
# 1. Exporter la prod
node scripts/export-supabase-to-sql.js --output=prod-snapshot.sql

# 2. Restaurer sur instance dev
psql -h localhost -U postgres -d peva_dev -f docs/prod-snapshot.sql
```

---

### Exemple 4: Export Tables Utilisateurs Uniquement

```bash
node scripts/export-supabase-to-sql.js \
  --tables=pev_users,pev_profiles,pev_auth_sessions \
  --output=users-backup.sql
```

---

## ⚙️ Automatisation

### Backup Automatique Windows

Créer un fichier `backup-auto.bat`:

```batch
@echo off
cd C:\wamp64\www\peva_appweb
call scripts\backup-supabase.bat

REM Optionnel: Upload vers cloud
REM rclone copy backups remote:supabase-backups
```

### Backup Automatique Linux

Créer un script `backup-auto.sh`:

```bash
#!/bin/bash
cd /chemin/vers/peva_appweb
./scripts/backup-supabase.sh

# Optionnel: Upload vers cloud
# rclone copy backups remote:supabase-backups
```

### Nettoyage des Anciens Backups

**Windows** (dans backup-supabase.bat):
```batch
REM Supprimer backups > 30 jours
forfiles /p "%BACKUP_DIR%" /m backup-*.sql /d -30 /c "cmd /c del @path"
```

**Linux** (dans backup-supabase.sh):
```bash
# Supprimer backups > 30 jours
find "$BACKUP_DIR" -name "backup-*.sql" -mtime +30 -delete
```

---

## 🔄 Restauration

### Restauration Complète

```bash
# Sur votre instance PostgreSQL
psql -h localhost -U postgres -d peva_greenhub -f backups/backup-20260101-120000.sql
```

### Restauration Sélective

```bash
# Extraire et restaurer uniquement certaines tables
grep "pev_users" backups/backup-20260101-120000.sql > users-only.sql
psql -h localhost -U postgres -d peva_greenhub -f users-only.sql
```

### Restauration sur Supabase

Si votre instance self-hosted utilise Supabase:

```bash
# Via supabase CLI
supabase db reset
supabase db push --file backups/backup-20260101-120000.sql
```

---

## 🛠️ Dépannage

### Erreur: "Cannot find module '@supabase/supabase-js'"

```bash
npm install @supabase/supabase-js
```

---

### Erreur: "Invalid authentication credentials"

Vérifiez que vous utilisez le **SERVICE_ROLE_KEY** et non l'ANON_KEY dans votre `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Commence par eyJ
```

---

### Export Trop Lent

Pour les grandes bases:

1. **Exporter par tables**:
```bash
node scripts/export-supabase-to-sql.js --tables=pev_users
node scripts/export-supabase-to-sql.js --tables=pev_companies
# etc.
```

2. **Exporter structure séparément**:
```bash
node scripts/export-supabase-to-sql.js --schema-only --output=structure.sql
node scripts/export-supabase-to-sql.js --data-only --output=data.sql
```

---

### Fichier SQL Trop Gros

Compresser après export:

**Windows**:
```bash
# Utiliser 7zip
"C:\Program Files\7-Zip\7z.exe" a backup.sql.7z backup.sql
```

**Linux**:
```bash
gzip backups/backup-20260101-120000.sql
```

---

### Tables Manquantes dans l'Export

Vérifier les tables existantes:

```bash
node scripts/explore-all-tables.js
```

Puis spécifier manuellement:

```bash
node scripts/export-supabase-to-sql.js --tables=table1,table2,table3
```

---

## 📊 Bonnes Pratiques

### 1. Backup Régulier

✅ **Quotidien**: Pour données critiques  
✅ **Hebdomadaire**: Pour données stables  
✅ **Avant mise à jour**: Toujours

### 2. Vérification des Backups

Testez régulièrement la restauration:

```bash
# Créer une base de test
createdb peva_test

# Restaurer le backup
psql -d peva_test -f backups/backup-latest.sql

# Vérifier
psql -d peva_test -c "SELECT COUNT(*) FROM pev_users"
```

### 3. Stockage Multiple

- 💾 **Local**: SSD rapide
- ☁️ **Cloud**: AWS S3, Google Drive, Dropbox
- 🖥️ **Serveur distant**: Via rsync, rclone

### 4. Rotation des Backups

Garder:
- 7 derniers backups quotidiens
- 4 derniers backups hebdomadaires
- 12 derniers backups mensuels

### 5. Documentation des Exports

Créer un `BACKUPS.md` avec:
- Date de chaque backup
- Raison (routine, avant mise à jour, etc.)
- Taille du fichier
- Nombre de lignes exportées

---

## 📁 Structure des Fichiers

```
peva_appweb/
├── scripts/
│   ├── export-supabase-to-sql.js    # Script principal
│   ├── backup-supabase.bat          # Backup Windows
│   ├── backup-supabase.sh           # Backup Linux/Mac
│   └── explore-all-tables.js        # Exploration
├── backups/                          # Dossier des backups (créé auto)
│   ├── backup-20260101-120000.sql
│   ├── backup-20260102-120000.sql
│   └── ...
├── docs/
│   ├── WORKFLOW_EXPORT_SUPABASE.md  # Cette doc
│   └── *.sql                         # Exports manuels
└── peva/
    └── .env                          # Configuration
```

---

## 🎯 Checklist Rapide

Avant chaque export important:

- [ ] `.env` configuré avec SERVICE_ROLE_KEY
- [ ] Node.js et dépendances installés
- [ ] Espace disque suffisant (vérifier avec `df -h`)
- [ ] Permissions d'écriture dans `backups/`
- [ ] Instance Supabase accessible

---

## 📞 Support

En cas de problème:

1. **Tester l'exploration**: `node scripts/explore-all-tables.js`
2. **Vérifier les logs**: Le script affiche des messages détaillés
3. **Vérifier la connexion**: Tester l'URL Supabase dans un navigateur
4. **Réessayer avec options**: `--schema-only` ou `--tables=`

---

## 🔒 Sécurité

⚠️ **IMPORTANT**:

- ❌ Ne JAMAIS commiter les fichiers `.sql` dans Git (contiennent données sensibles)
- ❌ Ne JAMAIS partager le `SERVICE_ROLE_KEY`
- ✅ Ajouter `backups/` et `*.sql` au `.gitignore`
- ✅ Chiffrer les backups si stockés sur cloud public
- ✅ Limiter l'accès au dossier `backups/`

---

## 📈 Évolutions Futures

Fonctionnalités prévues:

- [ ] Export incrémental (delta uniquement)
- [ ] Compression automatique
- [ ] Upload cloud intégré (S3, GCS)
- [ ] Notifications (email, Slack)
- [ ] Dashboard de monitoring des backups
- [ ] Restauration sélective par table
- [ ] Export au format JSON

---

## 📜 Licence

Ces scripts font partie du projet PEVA / 2iE GreenHub.

---

**Date de création**: 2026-01-01  
**Dernière mise à jour**: 2026-01-01  
**Version**: 1.0.0
