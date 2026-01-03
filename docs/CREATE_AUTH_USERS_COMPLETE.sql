-- ================================================================
-- CRÉATION COMPLÈTE DES COMPTES AUTH + PROFILES
-- Pour instance Supabase Self-Hosted (benga.live)
-- ================================================================

-- IMPORTANT: Ce script doit être exécuté avec des privilèges suffisants
-- Exécutez dans SQL Editor avec le service_role ou postgres user

-- ================================================================
-- PARTIE 1: CRÉER LES UTILISATEURS AUTH
-- ================================================================

-- Activer l'extension pgcrypto si pas déjà fait
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fonction helper pour créer un user auth avec email confirmé
DO $$
DECLARE
  v_user_id uuid;
BEGIN

  -- 1. ADMIN
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    aud,
    role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@2iegreenhub.org',
    crypt('Admin@2iE2026!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"Principal","role":"admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_user_id;

  -- Créer le profil associé
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.pev_profiles (
      id, email, first_name, last_name, display_name, role, user_type,
      location, country, is_verified, onboarding_completed,
      created_at, updated_at
    ) VALUES (
      v_user_id,
      'admin@2iegreenhub.org',
      'Admin',
      'Principal',
      'Admin Principal',
      'admin',
      'admin',
      'Ouagadougou',
      'Burkina Faso',
      true,
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role,
      user_type = EXCLUDED.user_type,
      is_verified = EXCLUDED.is_verified,
      onboarding_completed = EXCLUDED.onboarding_completed;
    
    RAISE NOTICE '✅ admin@2iegreenhub.org créé avec ID: %', v_user_id;
  END IF;

  -- 2. SUPERADMIN
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token, aud, role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'superadmin@2iegreenhub.org',
    crypt('SuperAdmin@2iE2026!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Super","last_name":"Admin","role":"superadmin"}',
    NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'
  ) ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_user_id;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.pev_profiles (
      id, email, first_name, last_name, display_name, role, user_type,
      location, country, is_verified, onboarding_completed,
      created_at, updated_at
    ) VALUES (
      v_user_id, 'superadmin@2iegreenhub.org', 'Super', 'Admin',
      'Super Admin', 'superadmin', 'admin', 'Dakar', 'Sénégal',
      true, true, NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role, user_type = EXCLUDED.user_type,
      is_verified = EXCLUDED.is_verified, onboarding_completed = EXCLUDED.onboarding_completed;
    RAISE NOTICE '✅ superadmin@2iegreenhub.org créé avec ID: %', v_user_id;
  END IF;

  -- 3. MODERATOR
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token, aud, role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'moderator@2iegreenhub.org',
    crypt('Moderator@2iE2026!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Modérateur","last_name":"Contenu","role":"moderator"}',
    NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'
  ) ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_user_id;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.pev_profiles (
      id, email, first_name, last_name, display_name, role, user_type,
      location, country, is_verified, onboarding_completed,
      created_at, updated_at
    ) VALUES (
      v_user_id, 'moderator@2iegreenhub.org', 'Modérateur', 'Contenu',
      'Modérateur Contenu', 'moderator', 'moderator', 'Abidjan', 'Côte d''Ivoire',
      true, true, NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role, user_type = EXCLUDED.user_type,
      is_verified = EXCLUDED.is_verified, onboarding_completed = EXCLUDED.onboarding_completed;
    RAISE NOTICE '✅ moderator@2iegreenhub.org créé avec ID: %', v_user_id;
  END IF;

  -- 4. ENTREPRENEUR
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token, aud, role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'entrepreneur@2iegreenhub.org',
    crypt('User@2iE2026!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Fatou","last_name":"Diallo","user_type":"entrepreneur"}',
    NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'
  ) ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_user_id;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.pev_profiles (
      id, email, first_name, last_name, display_name, role, user_type,
      location, country, is_verified, onboarding_completed,
      created_at, updated_at
    ) VALUES (
      v_user_id, 'entrepreneur@2iegreenhub.org', 'Fatou', 'Diallo',
      'Fatou Diallo', 'user', 'entrepreneur', 'Bamako', 'Mali',
      true, true, NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      user_type = EXCLUDED.user_type,
      is_verified = EXCLUDED.is_verified, onboarding_completed = EXCLUDED.onboarding_completed;
    RAISE NOTICE '✅ entrepreneur@2iegreenhub.org créé avec ID: %', v_user_id;
  END IF;

  -- 5. INVESTOR
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token, aud, role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'investor@2iegreenhub.org',
    crypt('User@2iE2026!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Kwame","last_name":"Mensah","user_type":"investor"}',
    NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'
  ) ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_user_id;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.pev_profiles (
      id, email, first_name, last_name, display_name, role, user_type,
      location, country, is_verified, onboarding_completed,
      created_at, updated_at
    ) VALUES (
      v_user_id, 'investor@2iegreenhub.org', 'Kwame', 'Mensah',
      'Kwame Mensah', 'user', 'investor', 'Accra', 'Ghana',
      true, true, NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      user_type = EXCLUDED.user_type,
      is_verified = EXCLUDED.is_verified, onboarding_completed = EXCLUDED.onboarding_completed;
    RAISE NOTICE '✅ investor@2iegreenhub.org créé avec ID: %', v_user_id;
  END IF;

  -- 6. RESEARCHER
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token, aud, role
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'researcher@2iegreenhub.org',
    crypt('User@2iE2026!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Aminata","last_name":"Touré","user_type":"researcher"}',
    NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'
  ) ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_user_id;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.pev_profiles (
      id, email, first_name, last_name, display_name, role, user_type,
      location, country, is_verified, onboarding_completed,
      created_at, updated_at
    ) VALUES (
      v_user_id, 'researcher@2iegreenhub.org', 'Aminata', 'Touré',
      'Aminata Touré', 'user', 'researcher', 'Dakar', 'Sénégal',
      true, true, NOW(), NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      user_type = EXCLUDED.user_type,
      is_verified = EXCLUDED.is_verified, onboarding_completed = EXCLUDED.onboarding_completed;
    RAISE NOTICE '✅ researcher@2iegreenhub.org créé avec ID: %', v_user_id;
  END IF;

END $$;

-- ================================================================
-- VÉRIFICATION: Afficher tous les comptes créés
-- ================================================================
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  p.role,
  p.user_type,
  p.first_name,
  p.last_name,
  p.is_verified,
  p.onboarding_completed
FROM auth.users u
LEFT JOIN public.pev_profiles p ON u.id = p.id
WHERE u.email LIKE '%@2iegreenhub.org'
ORDER BY 
  CASE p.role
    WHEN 'superadmin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'moderator' THEN 3
    ELSE 4
  END,
  u.email;

-- ================================================================
-- CREDENTIALS DES COMPTES CRÉÉS
-- ================================================================
-- ADMIN        → admin@2iegreenhub.org         | Admin@2iE2026!
-- SUPERADMIN   → superadmin@2iegreenhub.org    | SuperAdmin@2iE2026!
-- MODERATOR    → moderator@2iegreenhub.org     | Moderator@2iE2026!
-- USER         → entrepreneur@2iegreenhub.org  | User@2iE2026!
-- USER         → investor@2iegreenhub.org      | User@2iE2026!
-- USER         → researcher@2iegreenhub.org    | User@2iE2026!
-- ================================================================

-- ⚠️ SI CE SCRIPT ÉCHOUE avec "permission denied for table auth.users"
-- C'est normal - il faut des privilèges postgres/service_role
-- 
-- ALTERNATIVE: Utilisez le Dashboard Supabase:
-- 1. Allez sur: https://supabase.benga.live
-- 2. Authentication → Users → Invite User
-- 3. Créez manuellement chaque compte avec email/password ci-dessus
-- 4. Ensuite exécutez SEED_ACCOUNTS_MANUAL.sql pour assigner les rôles
