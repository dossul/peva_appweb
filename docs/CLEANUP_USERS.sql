-- ================================================================
-- NETTOYAGE COMPLET - Supprimer tous les utilisateurs @2iegreenhub.org
-- À exécuter AVANT de recréer via API
-- ================================================================

-- 1. Supprimer de pev_profiles
DELETE FROM pev_profiles WHERE email LIKE '%@2iegreenhub.org';

-- 2. Supprimer de pev_users
DELETE FROM pev_users WHERE email LIKE '%@2iegreenhub.org';

-- 3. Supprimer de auth.identities (via user_id)
DELETE FROM auth.identities 
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@2iegreenhub.org');

-- 4. Supprimer de auth.users
DELETE FROM auth.users WHERE email LIKE '%@2iegreenhub.org';

-- Vérification
SELECT 'auth.users' as table_name, COUNT(*) as count 
FROM auth.users WHERE email LIKE '%@2iegreenhub.org'
UNION ALL
SELECT 'auth.identities', COUNT(*) 
FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@2iegreenhub.org')
UNION ALL
SELECT 'pev_users', COUNT(*) 
FROM pev_users WHERE email LIKE '%@2iegreenhub.org'
UNION ALL
SELECT 'pev_profiles', COUNT(*) 
FROM pev_profiles WHERE email LIKE '%@2iegreenhub.org';

-- Résultat attendu: tous à 0
