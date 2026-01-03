-- ================================================================
-- CRÉATION COMPLÈTE DES COMPTES - VERSION 3
-- Pour instance Self-Hosted avec pev_users (pas auth.users)
-- ================================================================

-- Activer extensions nécessaires
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- CRÉATION DES 6 COMPTES DANS pev_users + pev_profiles
-- ================================================================

DO $$
DECLARE
  v_user_id uuid;
  v_email text;
BEGIN

  -- ============================================================
  -- 1. ADMIN
  -- ============================================================
  v_email := 'admin@2iegreenhub.org';
  v_user_id := NULL;
  
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  
  IF v_user_id IS NULL THEN
    INSERT INTO pev_users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      v_email,
      crypt('Admin@2iE2026!', gen_salt('bf')),
      NOW(),
      '{"first_name":"Admin","last_name":"Principal","role":"admin"}'::jsonb,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_user_id;
    RAISE NOTICE '✅ % créé dans pev_users - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  % existe déjà - ID: %', v_email, v_user_id;
  END IF;
  
  INSERT INTO pev_profiles (
    id, email, first_name, last_name, display_name, role, user_type,
    location, country, is_verified, onboarding_completed, created_at, updated_at
  ) VALUES (
    v_user_id, v_email, 'Admin', 'Principal', 'Admin Principal',
    'admin', 'admin', 'Ouagadougou', 'Burkina Faso', true, true, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin', user_type = 'admin',
    is_verified = true, onboarding_completed = true, updated_at = NOW();

  -- ============================================================
  -- 2. SUPERADMIN
  -- ============================================================
  v_email := 'superadmin@2iegreenhub.org';
  v_user_id := NULL;
  
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  
  IF v_user_id IS NULL THEN
    INSERT INTO pev_users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_email,
      crypt('SuperAdmin@2iE2026!', gen_salt('bf')), NOW(),
      '{"first_name":"Super","last_name":"Admin","role":"superadmin"}'::jsonb,
      NOW(), NOW()
    )
    RETURNING id INTO v_user_id;
    RAISE NOTICE '✅ % créé dans pev_users - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  % existe déjà - ID: %', v_email, v_user_id;
  END IF;
  
  INSERT INTO pev_profiles (
    id, email, first_name, last_name, display_name, role, user_type,
    location, country, is_verified, onboarding_completed, created_at, updated_at
  ) VALUES (
    v_user_id, v_email, 'Super', 'Admin', 'Super Admin',
    'super_admin', 'admin', 'Dakar', 'Sénégal', true, true, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'super_admin', user_type = 'admin',
    is_verified = true, onboarding_completed = true, updated_at = NOW();

  -- ============================================================
  -- 3. MODERATOR
  -- ============================================================
  v_email := 'moderator@2iegreenhub.org';
  v_user_id := NULL;
  
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  
  IF v_user_id IS NULL THEN
    INSERT INTO pev_users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_email,
      crypt('Moderator@2iE2026!', gen_salt('bf')), NOW(),
      '{"first_name":"Modérateur","last_name":"Contenu","role":"moderator"}'::jsonb,
      NOW(), NOW()
    )
    RETURNING id INTO v_user_id;
    RAISE NOTICE '✅ % créé dans pev_users - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  % existe déjà - ID: %', v_email, v_user_id;
  END IF;
  
  INSERT INTO pev_profiles (
    id, email, first_name, last_name, display_name, role, user_type,
    location, country, is_verified, onboarding_completed, created_at, updated_at
  ) VALUES (
    v_user_id, v_email, 'Modérateur', 'Contenu', 'Modérateur Contenu',
    'moderator', 'moderator', 'Abidjan', 'Côte d''Ivoire', true, true, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'moderator', user_type = 'moderator',
    is_verified = true, onboarding_completed = true, updated_at = NOW();

  -- ============================================================
  -- 4. ENTREPRENEUR
  -- ============================================================
  v_email := 'entrepreneur@2iegreenhub.org';
  v_user_id := NULL;
  
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  
  IF v_user_id IS NULL THEN
    INSERT INTO pev_users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_email,
      crypt('User@2iE2026!', gen_salt('bf')), NOW(),
      '{"first_name":"Fatou","last_name":"Diallo","user_type":"entrepreneur"}'::jsonb,
      NOW(), NOW()
    )
    RETURNING id INTO v_user_id;
    RAISE NOTICE '✅ % créé dans pev_users - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  % existe déjà - ID: %', v_email, v_user_id;
  END IF;
  
  INSERT INTO pev_profiles (
    id, email, first_name, last_name, display_name, role, user_type,
    location, country, is_verified, onboarding_completed, created_at, updated_at
  ) VALUES (
    v_user_id, v_email, 'Fatou', 'Diallo', 'Fatou Diallo',
    'user', 'entrepreneur', 'Bamako', 'Mali', true, true, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    user_type = 'entrepreneur',
    is_verified = true, onboarding_completed = true, updated_at = NOW();

  -- ============================================================
  -- 5. INVESTOR
  -- ============================================================
  v_email := 'investor@2iegreenhub.org';
  v_user_id := NULL;
  
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  
  IF v_user_id IS NULL THEN
    INSERT INTO pev_users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_email,
      crypt('User@2iE2026!', gen_salt('bf')), NOW(),
      '{"first_name":"Kwame","last_name":"Mensah","user_type":"investor"}'::jsonb,
      NOW(), NOW()
    )
    RETURNING id INTO v_user_id;
    RAISE NOTICE '✅ % créé dans pev_users - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  % existe déjà - ID: %', v_email, v_user_id;
  END IF;
  
  INSERT INTO pev_profiles (
    id, email, first_name, last_name, display_name, role, user_type,
    location, country, is_verified, onboarding_completed, created_at, updated_at
  ) VALUES (
    v_user_id, v_email, 'Kwame', 'Mensah', 'Kwame Mensah',
    'user', 'investor', 'Accra', 'Ghana', true, true, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    user_type = 'investor',
    is_verified = true, onboarding_completed = true, updated_at = NOW();

  -- ============================================================
  -- 6. RESEARCHER
  -- ============================================================
  v_email := 'researcher@2iegreenhub.org';
  v_user_id := NULL;
  
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  
  IF v_user_id IS NULL THEN
    INSERT INTO pev_users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_email,
      crypt('User@2iE2026!', gen_salt('bf')), NOW(),
      '{"first_name":"Aminata","last_name":"Touré","user_type":"researcher"}'::jsonb,
      NOW(), NOW()
    )
    RETURNING id INTO v_user_id;
    RAISE NOTICE '✅ % créé dans pev_users - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  % existe déjà - ID: %', v_email, v_user_id;
  END IF;
  
  INSERT INTO pev_profiles (
    id, email, first_name, last_name, display_name, role, user_type,
    location, country, is_verified, onboarding_completed, created_at, updated_at
  ) VALUES (
    v_user_id, v_email, 'Aminata', 'Touré', 'Aminata Touré',
    'user', 'researcher', 'Dakar', 'Sénégal', true, true, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    user_type = 'researcher',
    is_verified = true, onboarding_completed = true, updated_at = NOW();

  RAISE NOTICE '════════════════════════════════════════════════════';
  RAISE NOTICE '✨ 6 comptes créés avec succès!';
  RAISE NOTICE '════════════════════════════════════════════════════';

END $$;

-- ================================================================
-- VÉRIFICATION: Afficher tous les comptes créés
-- ================================================================
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  u.created_at as user_created_at,
  p.role,
  p.user_type,
  p.first_name,
  p.last_name,
  p.is_verified,
  p.onboarding_completed
FROM pev_users u
LEFT JOIN pev_profiles p ON u.id = p.id
WHERE u.email LIKE '%@2iegreenhub.org'
ORDER BY 
  CASE p.role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'moderator' THEN 3
    ELSE 4
  END,
  u.email;

-- ================================================================
-- 📋 CREDENTIALS DES COMPTES CRÉÉS
-- ================================================================
-- ADMIN        → admin@2iegreenhub.org         | Admin@2iE2026!
-- SUPER_ADMIN  → superadmin@2iegreenhub.org    | SuperAdmin@2iE2026!
-- MODERATOR    → moderator@2iegreenhub.org     | Moderator@2iE2026!
-- USER         → entrepreneur@2iegreenhub.org  | User@2iE2026!
-- USER         → investor@2iegreenhub.org      | User@2iE2026!
-- USER         → researcher@2iegreenhub.org    | User@2iE2026!
-- ================================================================
