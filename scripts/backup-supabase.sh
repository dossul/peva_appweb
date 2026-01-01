#!/bin/bash

# ==========================================
# Script de backup automatique Supabase
# Crée un export SQL horodaté
# ==========================================

BACKUP_DIR="$(dirname "$0")/../backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Créer le dossier backups s'il n'existe pas
mkdir -p "$BACKUP_DIR"

echo "=========================================="
echo "Backup Supabase Self-Hosted"
echo "=========================================="
echo "Destination: $BACKUP_DIR"
echo "Timestamp: $TIMESTAMP"
echo ""

# Exécuter l'export
node "$(dirname "$0")/export-supabase-to-sql.js" --output="backup-$TIMESTAMP.sql"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Backup échoué"
    exit 1
fi

# Déplacer le backup dans le dossier backups
mv "$(dirname "$0")/../docs/backup-$TIMESTAMP.sql" "$BACKUP_DIR/"

echo ""
echo "=========================================="
echo "✅ Backup terminé avec succès!"
echo "=========================================="
echo "Fichier: $BACKUP_DIR/backup-$TIMESTAMP.sql"
echo "=========================================="

# Optionnel: Nettoyer les anciens backups (garder 30 derniers jours)
# find "$BACKUP_DIR" -name "backup-*.sql" -mtime +30 -delete

exit 0
