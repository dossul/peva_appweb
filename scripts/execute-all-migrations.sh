#!/bin/bash

# ==========================================
# Script d'exécution complète de la migration PostgreSQL
# Exécute tous les dumps SQL dans le bon ordre
# ==========================================

# Configuration - À adapter selon votre environnement
PG_HOST="${PG_HOST:-localhost}"
PG_PORT="${PG_PORT:-5432}"
PG_DATABASE="${PG_DATABASE:-peva_greenhub}"
PG_USER="${PG_USER:-postgres}"

DOCS_DIR="$(dirname "$0")/../docs"

echo "🚀 Migration PostgreSQL - PEVA vers 2iE GreenHub"
echo "=================================================="
echo "Host: $PG_HOST:$PG_PORT"
echo "Database: $PG_DATABASE"
echo "User: $PG_USER"
echo ""

# Fonction pour exécuter un fichier SQL
execute_sql() {
    local file=$1
    local description=$2
    
    echo "📄 Exécution: $description"
    echo "   Fichier: $(basename $file)"
    
    if [ ! -f "$file" ]; then
        echo "   ❌ Fichier non trouvé: $file"
        exit 1
    fi
    
    psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -f "$file"
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Succès"
        echo ""
    else
        echo "   ❌ Échec"
        exit 1
    fi
}

# Confirmation
read -p "⚠️  Êtes-vous sûr de vouloir exécuter la migration? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration annulée."
    exit 0
fi

echo ""
echo "🔄 Démarrage de la migration..."
echo ""

# 1. Schema principal (37 tables)
execute_sql "$DOCS_DIR/POSTGRESQL_SELF_HOSTED_DUMP.sql" "Schema principal (37 tables, 8 ENUMs, triggers, fonctions)"

# 2. Auth & Storage (7 tables)
execute_sql "$DOCS_DIR/POSTGRESQL_MIGRATION_AUTH_STORAGE.sql" "Auth & Storage (7 tables complémentaires)"

# 3. Buckets (7 buckets)
execute_sql "$DOCS_DIR/POSTGRESQL_BUCKETS_PEVA_ONLY.sql" "Buckets de stockage (7 buckets PEVA)"

# 4. RLS & Policies (CRITIQUE)
execute_sql "$DOCS_DIR/POSTGRESQL_RLS_POLICIES.sql" "RLS & Policies de sécurité (CRITIQUE)"

echo "=================================================="
echo "🎉 Migration terminée avec succès!"
echo ""
echo "🧪 Pour tester la migration, exécutez:"
echo "   node scripts/test-migration-postgresql.js"
echo "=================================================="
