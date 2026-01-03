-- ================================================================
-- SEED COMPTES UTILISATEURS POUR 2iE GREEN HUB
-- À exécuter dans Supabase SQL Editor
-- ================================================================

-- IMPORTANT: Ce script crée les PROFILS uniquement
-- Les utilisateurs doivent d'abord être créés via le Dashboard Supabase:
-- Authentication → Users → Invite User

-- ================================================================
-- ÉTAPE 1: Créer les utilisateurs dans Supabase Dashboard
-- ================================================================
-- Allez dans: Authentication → Users → Invite User
-- Créez ces comptes (notez bien les UUID générés):
--
-- 1. admin@2iegreenhub.org         | Password: Admin@2iE2026!
-- 2. superadmin@2iegreenhub.org    | Password: SuperAdmin@2iE2026!
-- 3. moderator@2iegreenhub.org     | Password: Moderator@2iE2026!
-- 4. entrepreneur@2iegreenhub.org  | Password: User@2iE2026!
-- 5. investor@2iegreenhub.org      | Password: User@2iE2026!
-- 6. researcher@2iegreenhub.org    | Password: User@2iE2026!
--
-- ================================================================

-- ================================================================
-- ÉTAPE 2: Une fois les users créés, exécutez ce script
-- ================================================================

-- Promouvoir les admins
UPDATE pev_profiles 
SET 
  role = 'admin',
  user_type = 'admin',
  location = 'Ouagadougou',
  country = 'Burkina Faso',
  is_verified = true,
  onboarding_completed = true,
  updated_at = NOW()
WHERE email = 'admin@2iegreenhub.org';

UPDATE pev_profiles 
SET 
  role = 'superadmin',
  user_type = 'admin',
  location = 'Dakar',
  country = 'Sénégal',
  is_verified = true,
  onboarding_completed = true,
  updated_at = NOW()
WHERE email = 'superadmin@2iegreenhub.org';

UPDATE pev_profiles 
SET 
  role = 'moderator',
  user_type = 'moderator',
  location = 'Abidjan',
  country = 'Côte d''Ivoire',
  is_verified = true,
  onboarding_completed = true,
  updated_at = NOW()
WHERE email = 'moderator@2iegreenhub.org';

-- Configurer les utilisateurs standards
UPDATE pev_profiles 
SET 
  role = 'user',
  user_type = 'entrepreneur',
  location = 'Bamako',
  country = 'Mali',
  is_verified = true,
  onboarding_completed = true,
  updated_at = NOW()
WHERE email = 'entrepreneur@2iegreenhub.org';

UPDATE pev_profiles 
SET 
  role = 'user',
  user_type = 'investor',
  location = 'Accra',
  country = 'Ghana',
  is_verified = true,
  onboarding_completed = true,
  updated_at = NOW()
WHERE email = 'investor@2iegreenhub.org';

UPDATE pev_profiles 
SET 
  role = 'user',
  user_type = 'researcher',
  location = 'Dakar',
  country = 'Sénégal',
  is_verified = true,
  onboarding_completed = true,
  updated_at = NOW()
WHERE email = 'researcher@2iegreenhub.org';

-- ================================================================
-- VÉRIFICATION: Afficher tous les comptes créés
-- ================================================================
SELECT 
  email,
  first_name,
  last_name,
  role,
  user_type,
  country,
  is_verified,
  onboarding_completed,
  created_at
FROM pev_profiles
WHERE email LIKE '%@2iegreenhub.org'
ORDER BY 
  CASE role
    WHEN 'superadmin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'moderator' THEN 3
    ELSE 4
  END,
  email;

-- ================================================================
-- CREDENTIALS DES COMPTES
-- ================================================================
-- ADMIN        → admin@2iegreenhub.org         | Admin@2iE2026!
-- SUPERADMIN   → superadmin@2iegreenhub.org    | SuperAdmin@2iE2026!
-- MODERATOR    → moderator@2iegreenhub.org     | Moderator@2iE2026!
-- USER         → entrepreneur@2iegreenhub.org  | User@2iE2026!
-- USER         → investor@2iegreenhub.org      | User@2iE2026!
-- USER         → researcher@2iegreenhub.org    | User@2iE2026!
-- ================================================================
