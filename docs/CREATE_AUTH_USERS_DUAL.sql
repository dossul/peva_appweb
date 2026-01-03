-- ================================================================
-- CRÉATION COMPTES DANS auth.users (pour Supabase Auth SDK)
-- Version DUAL: auth.users + pev_users + pev_profiles
-- ================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- CRÉATION DANS auth.users (pour que l'app puisse se connecter)
-- ================================================================

DO $$
DECLARE
  v_user_id uuid;
  v_email text;
  v_instance_id uuid := '00000000-0000-0000-0000-000000000000';
BEGIN

  -- ============================================================
  -- 1. ADMIN
  -- ============================================================
  v_email := 'admin@2iegreenhub.org';
  
  -- Récupérer ID existant de pev_users ou auth.users
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email LIMIT 1;
  END IF;
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
  END IF;
  
  -- Créer dans auth.users si pas existe
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
      v_instance_id, v_user_id, 'authenticated', 'authenticated',
      v_email, crypt('Admin@2iE2026!', gen_salt('bf')),
      NOW(), 
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"first_name":"Admin","last_name":"Principal","role":"admin"}'::jsonb,
      NOW(), NOW(), '', ''
    );
    RAISE NOTICE '✅ auth.users: % créé - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  auth.users: % existe déjà', v_email;
  END IF;
  
  -- Créer dans pev_users si pas existe
  IF NOT EXISTS (SELECT 1 FROM pev_users WHERE email = v_email) THEN
    INSERT INTO pev_users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at
    ) VALUES (
      v_user_id, v_email, crypt('Admin@2iE2026!', gen_salt('bf')),
      NOW(), '{"first_name":"Admin","last_name":"Principal","role":"admin"}'::jsonb,
      NOW(), NOW()
    );
  END IF;
  
  -- Créer dans pev_profiles
  INSERT INTO pev_profiles (
    id, email, first_name, last_name, display_name, role, user_type,
    location, country, is_verified, onboarding_completed, created_at, updated_at
  ) VALUES (
    v_user_id, v_email, 'Admin', 'Principal', 'Admin Principal',
    'admin', 'admin', 'Ouagadougou', 'Burkina Faso', true, true, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin', user_type = 'admin', is_verified = true, 
    onboarding_completed = true, updated_at = NOW();

  -- ============================================================
  -- 2. SUPER_ADMIN
  -- ============================================================
  v_email := 'superadmin@2iegreenhub.org';
  v_user_id := NULL;
  
  -- Récupérer ID existant de pev_users ou auth.users
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email LIMIT 1;
  END IF;
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
  END IF;
  
  -- Créer dans auth.users si pas existe
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
      v_instance_id, v_user_id, 'authenticated', 'authenticated',
      v_email, crypt('SuperAdmin@2iE2026!', gen_salt('bf')),
      NOW(), 
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"first_name":"Super","last_name":"Admin","role":"super_admin"}'::jsonb,
      NOW(), NOW(), '', ''
    );
    RAISE NOTICE '✅ auth.users: % créé - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  auth.users: % existe déjà', v_email;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pev_users WHERE email = v_email) THEN
    INSERT INTO pev_users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at
    ) VALUES (
      v_user_id, v_email, crypt('SuperAdmin@2iE2026!', gen_salt('bf')),
      NOW(), '{"first_name":"Super","last_name":"Admin","role":"super_admin"}'::jsonb,
      NOW(), NOW()
    );
  END IF;
  
  INSERT INTO pev_profiles (
    id, email, first_name, last_name, display_name, role, user_type,
    location, country, is_verified, onboarding_completed, created_at, updated_at
  ) VALUES (
    v_user_id, v_email, 'Super', 'Admin', 'Super Admin',
    'super_admin', 'admin', 'Dakar', 'Sénégal', true, true, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'super_admin', user_type = 'admin', is_verified = true,
    onboarding_completed = true, updated_at = NOW();

  -- ============================================================
  -- 3. MODERATOR
  -- ============================================================
  v_email := 'moderator@2iegreenhub.org';
  v_user_id := NULL;
  
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email LIMIT 1;
  END IF;
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
      v_instance_id, v_user_id, 'authenticated', 'authenticated',
      v_email, crypt('Moderator@2iE2026!', gen_salt('bf')),
      NOW(), 
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"first_name":"Modérateur","last_name":"Contenu","role":"moderator"}'::jsonb,
      NOW(), NOW(), '', ''
    );
    RAISE NOTICE '✅ auth.users: % créé - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  auth.users: % existe déjà', v_email;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pev_users WHERE email = v_email) THEN
    INSERT INTO pev_users (
      id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at
    ) VALUES (
      v_user_id, v_email, crypt('Moderator@2iE2026!', gen_salt('bf')),
      NOW(), '{"first_name":"Modérateur","last_name":"Contenu","role":"moderator"}'::jsonb,
      NOW(), NOW()
    );
  END IF;
  
  INSERT INTO pev_profiles (
    id, email, first_name, last_name, display_name, role, user_type,
    location, country, is_verified, onboarding_completed, created_at, updated_at
  ) VALUES (
    v_user_id, v_email, 'Modérateur', 'Contenu', 'Modérateur Contenu',
    'moderator', 'moderator', 'Abidjan', 'Côte d''Ivoire', true, true, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'moderator', user_type = 'moderator', is_verified = true,
    onboarding_completed = true, updated_at = NOW();

  -- ============================================================
  -- 4-6. USERS (entrepreneur, investor, researcher)
  -- ============================================================
  
  -- ENTREPRENEUR
  v_email := 'entrepreneur@2iegreenhub.org';
  v_user_id := NULL;
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email LIMIT 1;
  END IF;
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
      v_instance_id, v_user_id, 'authenticated', 'authenticated',
      v_email, crypt('User@2iE2026!', gen_salt('bf')), NOW(), 
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"first_name":"Fatou","last_name":"Diallo","user_type":"entrepreneur"}'::jsonb,
      NOW(), NOW(), '', ''
    );
    RAISE NOTICE '✅ auth.users: % créé - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  auth.users: % existe déjà', v_email;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pev_users WHERE email = v_email) THEN
    INSERT INTO pev_users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    VALUES (v_user_id, v_email, crypt('User@2iE2026!', gen_salt('bf')), NOW(), 
      '{"first_name":"Fatou","last_name":"Diallo","user_type":"entrepreneur"}'::jsonb, NOW(), NOW());
  END IF;
  INSERT INTO pev_profiles (id, email, first_name, last_name, display_name, role, user_type, location, country, is_verified, onboarding_completed, created_at, updated_at)
  VALUES (v_user_id, v_email, 'Fatou', 'Diallo', 'Fatou Diallo', 'user', 'entrepreneur', 'Bamako', 'Mali', true, true, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET user_type = 'entrepreneur', is_verified = true, onboarding_completed = true, updated_at = NOW();

  -- INVESTOR
  v_email := 'investor@2iegreenhub.org';
  v_user_id := NULL;
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email LIMIT 1;
  END IF;
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
    VALUES (v_instance_id, v_user_id, 'authenticated', 'authenticated', v_email, crypt('User@2iE2026!', gen_salt('bf')), NOW(), 
      '{"provider":"email","providers":["email"]}'::jsonb, '{"first_name":"Kwame","last_name":"Mensah","user_type":"investor"}'::jsonb, NOW(), NOW(), '', '');
    RAISE NOTICE '✅ auth.users: % créé - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  auth.users: % existe déjà', v_email;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pev_users WHERE email = v_email) THEN
    INSERT INTO pev_users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    VALUES (v_user_id, v_email, crypt('User@2iE2026!', gen_salt('bf')), NOW(), 
      '{"first_name":"Kwame","last_name":"Mensah","user_type":"investor"}'::jsonb, NOW(), NOW());
  END IF;
  INSERT INTO pev_profiles (id, email, first_name, last_name, display_name, role, user_type, location, country, is_verified, onboarding_completed, created_at, updated_at)
  VALUES (v_user_id, v_email, 'Kwame', 'Mensah', 'Kwame Mensah', 'user', 'investor', 'Accra', 'Ghana', true, true, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET user_type = 'investor', is_verified = true, onboarding_completed = true, updated_at = NOW();

  -- RESEARCHER
  v_email := 'researcher@2iegreenhub.org';
  v_user_id := NULL;
  SELECT id INTO v_user_id FROM pev_users WHERE email = v_email LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email LIMIT 1;
  END IF;
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token)
    VALUES (v_instance_id, v_user_id, 'authenticated', 'authenticated', v_email, crypt('User@2iE2026!', gen_salt('bf')), NOW(), 
      '{"provider":"email","providers":["email"]}'::jsonb, '{"first_name":"Aminata","last_name":"Touré","user_type":"researcher"}'::jsonb, NOW(), NOW(), '', '');
    RAISE NOTICE '✅ auth.users: % créé - ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '⚠️  auth.users: % existe déjà', v_email;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pev_users WHERE email = v_email) THEN
    INSERT INTO pev_users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    VALUES (v_user_id, v_email, crypt('User@2iE2026!', gen_salt('bf')), NOW(), 
      '{"first_name":"Aminata","last_name":"Touré","user_type":"researcher"}'::jsonb, NOW(), NOW());
  END IF;
  INSERT INTO pev_profiles (id, email, first_name, last_name, display_name, role, user_type, location, country, is_verified, onboarding_completed, created_at, updated_at)
  VALUES (v_user_id, v_email, 'Aminata', 'Touré', 'Aminata Touré', 'user', 'researcher', 'Dakar', 'Sénégal', true, true, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET user_type = 'researcher', is_verified = true, onboarding_completed = true, updated_at = NOW();

  RAISE NOTICE '════════════════════════════════════════════════════';
  RAISE NOTICE '✨ 6 comptes créés dans auth.users + pev_users + pev_profiles';
  RAISE NOTICE '════════════════════════════════════════════════════';

END $$;

-- Vérification
SELECT 
  'auth.users' as table_name,
  COUNT(*) as count
FROM auth.users 
WHERE email LIKE '%@2iegreenhub.org'
UNION ALL
SELECT 
  'pev_users' as table_name,
  COUNT(*) as count
FROM pev_users 
WHERE email LIKE '%@2iegreenhub.org'
UNION ALL
SELECT 
  'pev_profiles' as table_name,
  COUNT(*) as count
FROM pev_profiles 
WHERE email LIKE '%@2iegreenhub.org';
