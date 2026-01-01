-- ==========================================
-- PEVA - RLS ET POLICIES DE SÉCURITÉ
-- Migration complète depuis Supabase
-- CRITIQUE: Sans ceci, aucune sécurité!
-- Date: 2026-01-01
-- ==========================================

-- ==========================================
-- 1. ACTIVER RLS SUR LES TABLES
-- ==========================================

-- Source: SUPABASE_DUMP_COMPLET_PEVA.md lignes 314-318
ALTER TABLE pev_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_opportunity_applications ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. FONCTIONS HELPER POUR POLICIES
-- ==========================================

-- Fonction pour obtenir l'ID utilisateur courant (remplace auth.uid() de Supabase)
-- À adapter selon votre système d'auth
CREATE OR REPLACE FUNCTION pev_current_user_id()
RETURNS UUID AS $$
BEGIN
    -- Option 1: Via variable de session PostgreSQL
    RETURN current_setting('app.current_user_id', true)::uuid;
    
    -- Option 2: Retourner NULL si pas connecté
    -- RETURN NULL;
    
    -- IMPORTANT: Cette fonction doit être adaptée selon votre
    -- système d'authentification (JWT, sessions, etc.)
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION pev_current_user_id IS 'Retourne l''ID utilisateur courant - REMPLACE auth.uid() de Supabase';

-- ==========================================
-- 3. POLICIES SUR TABLES
-- ==========================================

-- POLICIES: pev_profiles
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir tous les profils" ON pev_profiles;
CREATE POLICY "Les utilisateurs peuvent voir tous les profils" 
    ON pev_profiles 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON pev_profiles;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" 
    ON pev_profiles 
    FOR UPDATE 
    USING (id = pev_current_user_id());

-- POLICIES: pev_companies
DROP POLICY IF EXISTS "Tout le monde peut voir les entreprises publiées" ON pev_companies;
CREATE POLICY "Tout le monde peut voir les entreprises publiées" 
    ON pev_companies 
    FOR SELECT 
    USING (status = 'published'::pev_content_status);

DROP POLICY IF EXISTS "Les membres admin ou editor peuvent voir les brouillons" ON pev_companies;
CREATE POLICY "Les membres admin ou editor peuvent voir les brouillons" 
    ON pev_companies 
    FOR SELECT 
    USING (pev_is_company_member(id, pev_current_user_id(), ARRAY['admin'::pev_company_role, 'editor'::pev_company_role]));

DROP POLICY IF EXISTS "Les membres admin ou editor peuvent mettre à jour l'entreprise" ON pev_companies;
CREATE POLICY "Les membres admin ou editor peuvent mettre à jour l'entreprise" 
    ON pev_companies 
    FOR UPDATE 
    USING (pev_is_company_member(id, pev_current_user_id(), ARRAY['admin'::pev_company_role, 'editor'::pev_company_role]));

DROP POLICY IF EXISTS "Seuls les admins de l'entreprise peuvent la supprimer" ON pev_companies;
CREATE POLICY "Seuls les admins de l'entreprise peuvent la supprimer" 
    ON pev_companies 
    FOR DELETE 
    USING (pev_is_company_member(id, pev_current_user_id(), ARRAY['admin'::pev_company_role]));

-- POLICIES: pev_messages
DROP POLICY IF EXISTS "Les utilisateurs peuvent accéder à leurs propres messages" ON pev_messages;
CREATE POLICY "Les utilisateurs peuvent accéder à leurs propres messages" 
    ON pev_messages 
    FOR ALL 
    USING (
        thread_id IN (
            SELECT thread_id 
            FROM pev_message_thread_participants 
            WHERE user_id = pev_current_user_id()
        )
    );

-- ==========================================
-- 4. POLICIES SUR STORAGE
-- ==========================================

-- Activer RLS sur tables storage
ALTER TABLE pev_storage_objects ENABLE ROW LEVEL SECURITY;

-- POLICY: Upload vers buckets publics
DROP POLICY IF EXISTS "Allow authenticated users to upload to public buckets" ON pev_storage_objects;
CREATE POLICY "Allow authenticated users to upload to public buckets" 
    ON pev_storage_objects 
    FOR INSERT 
    WITH CHECK (
        pev_current_user_id() IS NOT NULL 
        AND bucket_id IN (SELECT id FROM pev_storage_buckets WHERE is_public = true)
    );

-- POLICY: Lecture fichiers publics
DROP POLICY IF EXISTS "Allow public read on public buckets" ON pev_storage_objects;
CREATE POLICY "Allow public read on public buckets" 
    ON pev_storage_objects 
    FOR SELECT 
    USING (
        bucket_id IN (SELECT id FROM pev_storage_buckets WHERE is_public = true)
    );

-- POLICY: Update ses propres fichiers publics
DROP POLICY IF EXISTS "Allow users to UPDATE their own public files" ON pev_storage_objects;
CREATE POLICY "Allow users to UPDATE their own public files" 
    ON pev_storage_objects 
    FOR UPDATE 
    USING (
        owner_id = pev_current_user_id() 
        AND bucket_id IN (SELECT id FROM pev_storage_buckets WHERE is_public = true)
    );

-- POLICY: Delete ses propres fichiers publics
DROP POLICY IF EXISTS "Allow users to DELETE their own public files" ON pev_storage_objects;
CREATE POLICY "Allow users to DELETE their own public files" 
    ON pev_storage_objects 
    FOR DELETE 
    USING (
        owner_id = pev_current_user_id() 
        AND bucket_id IN (SELECT id FROM pev_storage_buckets WHERE is_public = true)
    );

-- POLICY: Upload fichiers privés (propre dossier)
DROP POLICY IF EXISTS "Allow users to upload their own private files" ON pev_storage_objects;
CREATE POLICY "Allow users to upload their own private files" 
    ON pev_storage_objects 
    FOR INSERT 
    WITH CHECK (
        owner_id = pev_current_user_id() 
        AND bucket_id IN (SELECT id FROM pev_storage_buckets WHERE is_public = false)
    );

-- POLICY: Lecture ses propres fichiers privés
DROP POLICY IF EXISTS "Allow users to read their own private files" ON pev_storage_objects;
CREATE POLICY "Allow users to read their own private files" 
    ON pev_storage_objects 
    FOR SELECT 
    USING (
        owner_id = pev_current_user_id() 
        AND bucket_id IN (SELECT id FROM pev_storage_buckets WHERE is_public = false)
    );

-- POLICY: Update ses propres fichiers privés
DROP POLICY IF EXISTS "Allow users to UPDATE their own private files" ON pev_storage_objects;
CREATE POLICY "Allow users to UPDATE their own private files" 
    ON pev_storage_objects 
    FOR UPDATE 
    USING (
        owner_id = pev_current_user_id() 
        AND bucket_id IN (SELECT id FROM pev_storage_buckets WHERE is_public = false)
    );

-- POLICY: Delete ses propres fichiers privés
DROP POLICY IF EXISTS "Allow users to DELETE their own private files" ON pev_storage_objects;
CREATE POLICY "Allow users to DELETE their own private files" 
    ON pev_storage_objects 
    FOR DELETE 
    USING (
        owner_id = pev_current_user_id() 
        AND bucket_id IN (SELECT id FROM pev_storage_buckets WHERE is_public = false)
    );

-- ==========================================
-- 5. POLICIES SPÉCIFIQUES MÉTIER
-- ==========================================

-- POLICY: Propriétaire opportunité peut lire candidatures
DROP POLICY IF EXISTS "Allow opportunity owner to read applications" ON pev_storage_objects;
CREATE POLICY "Allow opportunity owner to read applications" 
    ON pev_storage_objects 
    FOR SELECT 
    USING (
        bucket_id = 'documents' 
        AND name LIKE 'opportunity_applications/%'
        AND pev_current_user_id() IN (
            SELECT created_by 
            FROM pev_opportunities 
            WHERE id::text = split_part(name, '/', 2)
        )
    );

-- POLICY: Admins entreprise peuvent uploader rapports
DROP POLICY IF EXISTS "Allow company admins to upload reports" ON pev_storage_objects;
CREATE POLICY "Allow company admins to upload reports" 
    ON pev_storage_objects 
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'documents' 
        AND name LIKE 'company_reports/%'
        AND pev_is_company_member(
            split_part(name, '/', 2)::bigint, 
            pev_current_user_id(), 
            ARRAY['admin'::pev_company_role, 'editor'::pev_company_role]
        )
    );

-- POLICY: Membres entreprise peuvent lire rapports
DROP POLICY IF EXISTS "Allow company members to read reports" ON pev_storage_objects;
CREATE POLICY "Allow company members to read reports" 
    ON pev_storage_objects 
    FOR SELECT 
    USING (
        bucket_id = 'documents' 
        AND name LIKE 'company_reports/%'
        AND pev_is_company_member(
            split_part(name, '/', 2)::bigint, 
            pev_current_user_id(), 
            ARRAY['admin'::pev_company_role, 'editor'::pev_company_role, 'contributor'::pev_company_role, 'viewer'::pev_company_role]
        )
    );

-- ==========================================
-- 6. VÉRIFICATION
-- ==========================================

DO $$
DECLARE
    rls_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Compter tables avec RLS
    SELECT COUNT(*) INTO rls_count
    FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE t.tablename LIKE 'pev_%' 
    AND c.relrowsecurity = true;
    
    -- Compter policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename LIKE 'pev_%';
    
    RAISE NOTICE '✅ Tables avec RLS activé: %', rls_count;
    RAISE NOTICE '✅ Policies créées: %', policy_count;
    
    IF rls_count >= 5 AND policy_count >= 15 THEN
        RAISE NOTICE '🎉 RLS et Policies correctement configurés!';
    ELSE
        RAISE WARNING '⚠️ Configuration incomplète - Vérifier manuellement';
    END IF;
END $$;

-- ==========================================
-- NOTES IMPORTANTES
-- ==========================================

-- ⚠️ CRITIQUE: La fonction pev_current_user_id() DOIT être adaptée
--    selon votre système d'authentification!
--
-- Options possibles:
--   1. Variable de session PostgreSQL (current_setting)
--   2. JWT token décodé côté serveur
--   3. Middleware qui set la session avant chaque requête
--   4. Extension PostgreSQL personnalisée
--
-- Exemple d'utilisation avec variable de session:
--   SET app.current_user_id = 'uuid-de-l-utilisateur';
--   SELECT * FROM pev_profiles; -- Les policies s'appliquent
--
-- Sans auth.uid() natif de Supabase, vous devez gérer
-- l'authentification au niveau application/middleware!

-- ==========================================
-- FIN DU SCRIPT RLS & POLICIES
-- ==========================================
-- Total: 
--   - 5 tables avec RLS activé
--   - 1 fonction helper (pev_current_user_id)
--   - 7 policies sur tables métier
--   - 11 policies sur storage
--
-- Sources vérifiées:
--   ✅ SUPABASE_DUMP_COMPLET_PEVA.md (lignes 314-414)
--   ✅ Adapté pour PostgreSQL self-hosted (sans auth.uid())
-- ==========================================
