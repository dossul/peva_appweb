-- ============================================================
-- MIGRATION: Compléter la table pev_resources + créer buckets
-- Date: 2026-01-05
-- Description: Ajouter colonnes manquantes et créer buckets storage
-- ============================================================

-- ============================================================
-- 1. AJOUTER LES COLONNES MANQUANTES À pev_resources
-- ============================================================

-- Colonne difficulty_level (niveau de difficulté)
ALTER TABLE pev_resources 
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(50);

-- Colonne is_free (ressource gratuite)
ALTER TABLE pev_resources 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT true;

-- Colonne allow_download (autoriser téléchargement)
ALTER TABLE pev_resources 
ADD COLUMN IF NOT EXISTS allow_download BOOLEAN DEFAULT true;

-- Colonne allow_sharing (autoriser partage)
ALTER TABLE pev_resources 
ADD COLUMN IF NOT EXISTS allow_sharing BOOLEAN DEFAULT true;

-- ============================================================
-- 2. AJOUTER FK pour jointures PostgREST (si manquante)
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'pev_resources_created_by_fkey'
    AND table_name = 'pev_resources'
  ) THEN
    ALTER TABLE pev_resources 
    ADD CONSTRAINT pev_resources_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES pev_profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 3. CRÉER LES BUCKETS STORAGE (via SQL)
-- ============================================================

-- Bucket 'documents' pour fichiers PDF, Word, etc.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 
  'documents', 
  true, 
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket 'images' pour images de couverture
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 
  'images', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket 'avatars' pour photos de profil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket 'logos' pour logos entreprises
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos', 
  'logos', 
  true, 
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. POLICIES RLS POUR STORAGE
-- ============================================================

-- Policy pour documents - lecture publique
DROP POLICY IF EXISTS "Documents are publicly accessible" ON storage.objects;
CREATE POLICY "Documents are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Policy pour documents - upload authentifié
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Policy pour documents - suppression par propriétaire
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy pour images - lecture publique
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy pour images - upload authentifié
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Policy pour avatars - lecture publique
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy pour avatars - upload authentifié
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Policy pour logos - lecture publique
DROP POLICY IF EXISTS "Logos are publicly accessible" ON storage.objects;
CREATE POLICY "Logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

-- Policy pour logos - upload authentifié
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

-- ============================================================
-- 5. INDEX POUR PERFORMANCES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_pev_resources_status ON pev_resources(status);
CREATE INDEX IF NOT EXISTS idx_pev_resources_sector ON pev_resources(sector);
CREATE INDEX IF NOT EXISTS idx_pev_resources_created_by ON pev_resources(created_by);
CREATE INDEX IF NOT EXISTS idx_pev_resources_created_at ON pev_resources(created_at DESC);

-- ============================================================
-- VÉRIFICATION
-- ============================================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pev_resources';
-- SELECT * FROM storage.buckets;
