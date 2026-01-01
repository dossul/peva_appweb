-- ==========================================
-- BUCKETS PEVA - CORRECTION
-- Uniquement les 7 buckets utilisés par PEVA
-- Sources: fileService.js + SUPABASE_DUMP_COMPLET_PEVA.md
-- Date: 2026-01-01
-- ==========================================

-- Créer la table des buckets si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS pev_storage_buckets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    file_size_limit BIGINT,
    allowed_mime_types TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==========================================
-- INSERTION DES 7 BUCKETS PEVA
-- ==========================================

-- Buckets de stockage PEVA (basés sur fileService.js lignes 10-16)
INSERT INTO pev_storage_buckets (id, name, is_public, file_size_limit, allowed_mime_types) VALUES

-- ========== BUCKETS PUBLICS (4) ==========

-- 1. avatars (fileService.js ligne 11)
-- Limite: 2 MB (fileService.js ligne 64)
-- Types: image/jpeg, image/png, image/webp (fileService.js ligne 50)
('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),

-- 2. logos (fileService.js ligne 12)
-- Limite: 5 MB (fileService.js ligne 65)
-- Types: image/jpeg, image/png, image/svg+xml, image/webp (fileService.js ligne 51)
('logos', 'logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']),

-- 3. images (fileService.js ligne 14)
-- Limite: 10 MB (fileService.js ligne 66)
-- Types: image/jpeg, image/png, image/gif, image/webp, image/svg+xml (fileService.js ligne 52)
('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']),

-- 4. peva-public (SUPABASE_DUMP_COMPLET_PEVA.md ligne 375)
('peva-public', 'peva-public', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),

-- ========== BUCKETS PRIVÉS (3) ==========

-- 5. documents (fileService.js ligne 13)
-- Limite: 50 MB (fileService.js ligne 67)
-- Types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document (fileService.js ligne 53)
('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),

-- 6. videos (fileService.js ligne 15)
-- Limite: 100 MB (fileService.js ligne 68)
-- Types: video/mp4, video/webm, video/ogg (fileService.js ligne 54)
('videos', 'videos', false, 104857600, ARRAY['video/mp4', 'video/webm', 'video/ogg']),

-- 7. peva-private (SUPABASE_DUMP_COMPLET_PEVA.md ligne 376)
('peva-private', 'peva-private', false, 52428800, ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'text/plain'
])

ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- VÉRIFICATION
-- ==========================================

DO $$
DECLARE
    bucket_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO bucket_count
    FROM pev_storage_buckets
    WHERE id IN ('avatars', 'logos', 'images', 'videos', 'documents', 'peva-public', 'peva-private');
    
    RAISE NOTICE '✅ Buckets PEVA insérés: %/7', bucket_count;
    
    IF bucket_count = 7 THEN
        RAISE NOTICE '🎉 Tous les buckets PEVA sont présents!';
    ELSE
        RAISE WARNING '⚠️ Il manque des buckets PEVA';
    END IF;
END $$;

-- ==========================================
-- RÉSUMÉ
-- ==========================================
-- 7 buckets PEVA créés:
--
-- PUBLICS (4):
--   1. avatars       - 2 MB   - Images profil
--   2. logos         - 5 MB   - Logos entreprises
--   3. images        - 10 MB  - Images générales
--   4. peva-public   - 10 MB  - Bucket public global
--
-- PRIVÉS (3):
--   5. documents     - 50 MB  - PDF, Word, etc.
--   6. videos        - 100 MB - MP4, WebM, Ogg
--   7. peva-private  - 50 MB  - Bucket privé global
--
-- Sources vérifiées:
--   ✅ fileService.js (lignes 10-16, 48-70)
--   ✅ SUPABASE_DUMP_COMPLET_PEVA.md (lignes 375-376)
-- ==========================================
