-- ============================================================
-- MIGRATION: Création de TOUS les buckets Storage pour PEVA
-- Date: 2026-01-04
-- Description: Crée les 6 buckets requis avec leurs policies RLS
-- ============================================================

-- ============================================================
-- PARTIE 1: CRÉATION DES BUCKETS
-- ============================================================

-- Bucket: avatars (public) - Photos de profil utilisateurs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket: logos (public) - Logos des entreprises
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('logos', 'logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket: documents (public) - Documents opportunités, ressources
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', true, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket: images (public) - Images générales du contenu
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket: videos (privé) - Vidéos uploadées
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('videos', 'videos', false, 104857600, ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'])
ON CONFLICT (id) DO UPDATE SET public = false;

-- Bucket: greenhub-private (privé) - Rapports RSE confidentiels
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('greenhub-private', 'greenhub-private', false, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET public = false;

-- ============================================================
-- PARTIE 2: POLICIES RLS POUR BUCKETS PUBLICS
-- ============================================================

-- === AVATARS ===
DROP POLICY IF EXISTS "Allow public read avatars" ON storage.objects;
CREATE POLICY "Allow public read avatars" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow authenticated upload avatars" ON storage.objects;
CREATE POLICY "Allow authenticated upload avatars" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow authenticated update avatars" ON storage.objects;
CREATE POLICY "Allow authenticated update avatars" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow authenticated delete avatars" ON storage.objects;
CREATE POLICY "Allow authenticated delete avatars" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- === LOGOS ===
DROP POLICY IF EXISTS "Allow public read logos" ON storage.objects;
CREATE POLICY "Allow public read logos" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'logos');

DROP POLICY IF EXISTS "Allow authenticated upload logos" ON storage.objects;
CREATE POLICY "Allow authenticated upload logos" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'logos');

DROP POLICY IF EXISTS "Allow authenticated update logos" ON storage.objects;
CREATE POLICY "Allow authenticated update logos" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'logos');

DROP POLICY IF EXISTS "Allow authenticated delete logos" ON storage.objects;
CREATE POLICY "Allow authenticated delete logos" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'logos');

-- === DOCUMENTS ===
DROP POLICY IF EXISTS "Allow public read documents" ON storage.objects;
CREATE POLICY "Allow public read documents" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Allow authenticated upload documents" ON storage.objects;
CREATE POLICY "Allow authenticated upload documents" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Allow authenticated update documents" ON storage.objects;
CREATE POLICY "Allow authenticated update documents" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Allow authenticated delete documents" ON storage.objects;
CREATE POLICY "Allow authenticated delete documents" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'documents');

-- === IMAGES ===
DROP POLICY IF EXISTS "Allow public read images" ON storage.objects;
CREATE POLICY "Allow public read images" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Allow authenticated upload images" ON storage.objects;
CREATE POLICY "Allow authenticated upload images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Allow authenticated update images" ON storage.objects;
CREATE POLICY "Allow authenticated update images" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Allow authenticated delete images" ON storage.objects;
CREATE POLICY "Allow authenticated delete images" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'images');

-- ============================================================
-- PARTIE 3: POLICIES RLS POUR BUCKETS PRIVÉS
-- ============================================================

-- === VIDEOS (privé) ===
DROP POLICY IF EXISTS "Allow authenticated all videos" ON storage.objects;
CREATE POLICY "Allow authenticated all videos" ON storage.objects
FOR ALL TO authenticated 
USING (bucket_id = 'videos')
WITH CHECK (bucket_id = 'videos');

-- === GREENHUB-PRIVATE (privé) ===
DROP POLICY IF EXISTS "Allow authenticated all greenhub-private" ON storage.objects;
CREATE POLICY "Allow authenticated all greenhub-private" ON storage.objects
FOR ALL TO authenticated 
USING (bucket_id = 'greenhub-private')
WITH CHECK (bucket_id = 'greenhub-private');

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================
