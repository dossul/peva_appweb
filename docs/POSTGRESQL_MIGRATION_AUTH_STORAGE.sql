-- ==========================================
-- 2iE GREENHUB - MIGRATION COMPLÉMENTAIRE
-- Ajout Auth & Storage aux tables existantes
-- À exécuter APRÈS le dump initial
-- Date: 2026-01-01
-- ==========================================

-- ==========================================
-- TABLES AUTH & STORAGE
-- ==========================================

-- TABLE: pev_storage_buckets (Remplace storage.buckets de Supabase)
CREATE TABLE IF NOT EXISTS pev_storage_buckets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    file_size_limit BIGINT,
    allowed_mime_types TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TABLE: pev_storage_objects (Remplace storage.objects de Supabase)
CREATE TABLE IF NOT EXISTS pev_storage_objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bucket_id TEXT NOT NULL REFERENCES pev_storage_buckets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES pev_users(id) ON DELETE SET NULL,
    file_path TEXT NOT NULL,
    size BIGINT NOT NULL,
    mime_type TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(bucket_id, name)
);

CREATE INDEX idx_pev_storage_objects_bucket ON pev_storage_objects(bucket_id);
CREATE INDEX idx_pev_storage_objects_owner ON pev_storage_objects(owner_id);
CREATE INDEX idx_pev_storage_objects_name ON pev_storage_objects(bucket_id, name);

-- TABLE: pev_file_uploads (Métadonnées fichiers uploadés)
CREATE TABLE IF NOT EXISTS pev_file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    bucket_id TEXT NOT NULL REFERENCES pev_storage_buckets(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    category TEXT,
    related_entity TEXT,
    related_id TEXT,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_file_uploads_user ON pev_file_uploads(user_id);
CREATE INDEX idx_pev_file_uploads_bucket ON pev_file_uploads(bucket_id);
CREATE INDEX idx_pev_file_uploads_related ON pev_file_uploads(related_entity, related_id);

-- TABLE: pev_storage_quotas (Quotas de stockage par utilisateur)
CREATE TABLE IF NOT EXISTS pev_storage_quotas (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES pev_profiles(id) ON DELETE CASCADE,
    total_quota BIGINT DEFAULT 524288000 NOT NULL, -- 500 MB par défaut
    used_space BIGINT DEFAULT 0 NOT NULL,
    file_count INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_storage_quotas_user ON pev_storage_quotas(user_id);

-- TABLE: pev_auth_sessions (Sessions utilisateur)
CREATE TABLE IF NOT EXISTS pev_auth_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES pev_users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    refresh_token TEXT UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_auth_sessions_user ON pev_auth_sessions(user_id);
CREATE INDEX idx_pev_auth_sessions_token ON pev_auth_sessions(token);
CREATE INDEX idx_pev_auth_sessions_expires ON pev_auth_sessions(expires_at);

-- TABLE: pev_auth_password_resets (Réinitialisation mots de passe)
CREATE TABLE IF NOT EXISTS pev_auth_password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES pev_users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_auth_password_resets_user ON pev_auth_password_resets(user_id);
CREATE INDEX idx_pev_auth_password_resets_token ON pev_auth_password_resets(token);

-- TABLE: pev_auth_email_verifications (Vérification emails)
CREATE TABLE IF NOT EXISTS pev_auth_email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES pev_users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_auth_email_verifications_user ON pev_auth_email_verifications(user_id);
CREATE INDEX idx_pev_auth_email_verifications_token ON pev_auth_email_verifications(token);

-- ==========================================
-- DONNÉES INITIALES
-- ==========================================

-- Buckets de stockage PEVA (basés sur fileService.js et dump Supabase)
INSERT INTO pev_storage_buckets (id, name, is_public, file_size_limit, allowed_mime_types) VALUES
-- Buckets publics
('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('logos', 'logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']),
('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']),
('peva-public', 'peva-public', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),

-- Buckets privés
('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
('videos', 'videos', false, 104857600, ARRAY['video/mp4', 'video/webm', 'video/ogg']),
('peva-private', 'peva-private', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'text/plain'])
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- COMMENTAIRES
-- ==========================================

COMMENT ON TABLE pev_storage_buckets IS 'Buckets de stockage (remplace storage.buckets Supabase)';
COMMENT ON TABLE pev_storage_objects IS 'Objets stockés (remplace storage.objects Supabase)';
COMMENT ON TABLE pev_file_uploads IS 'Métadonnées des fichiers uploadés';
COMMENT ON TABLE pev_storage_quotas IS 'Quotas de stockage par utilisateur (500 MB par défaut)';
COMMENT ON TABLE pev_auth_sessions IS 'Sessions d''authentification actives avec tokens JWT';
COMMENT ON TABLE pev_auth_password_resets IS 'Tokens de réinitialisation de mot de passe (expire après 1h)';
COMMENT ON TABLE pev_auth_email_verifications IS 'Tokens de vérification d''email (expire après 24h)';

-- ==========================================
-- VÉRIFICATION
-- ==========================================

-- Vérifier que toutes les tables ont été créées
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM pg_tables
    WHERE tablename IN (
        'pev_storage_buckets',
        'pev_storage_objects',
        'pev_file_uploads',
        'pev_storage_quotas',
        'pev_auth_sessions',
        'pev_auth_password_resets',
        'pev_auth_email_verifications'
    );
    
    IF table_count = 7 THEN
        RAISE NOTICE '✅ Migration Auth & Storage complétée: 7 tables créées';
    ELSE
        RAISE WARNING '⚠️ Seulement % tables créées sur 7', table_count;
    END IF;
END $$;

-- ==========================================
-- FIN DU SCRIPT COMPLÉMENTAIRE
-- ==========================================
-- 7 nouvelles tables + 7 buckets PEVA
--
-- TABLES (7):
--   - pev_storage_buckets, pev_storage_objects, pev_file_uploads, pev_storage_quotas
--   - pev_auth_sessions, pev_auth_password_resets, pev_auth_email_verifications
--
-- BUCKETS PEVA (7):
--   Publics: avatars (2MB), logos (5MB), images (10MB), peva-public (10MB)
--   Privés: documents (50MB), videos (100MB), peva-private (50MB)
--
-- Sources vérifiées:
--   ✅ fileService.js (lignes 10-16)
--   ✅ SUPABASE_DUMP_COMPLET_PEVA.md (lignes 375-376)
--   ✅ Limites selon fileService.js getFileSizeLimit()
-- ==========================================
