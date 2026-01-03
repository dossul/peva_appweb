-- ================================================================
-- CRÉER auth.identities POUR LES UTILISATEURS EXISTANTS
-- Obligatoire pour Supabase Auth fonctionnel
-- ================================================================

-- Insérer identities pour tous les users @2iegreenhub.org
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid() as id,
  u.id as user_id,
  jsonb_build_object(
    'sub', u.id::text,
    'email', u.email,
    'email_verified', true,
    'phone_verified', false
  ) as identity_data,
  'email' as provider,
  u.id::text as provider_id,
  NOW() as last_sign_in_at,
  u.created_at as created_at,
  NOW() as updated_at
FROM auth.users u
WHERE u.email LIKE '%@2iegreenhub.org'
  AND NOT EXISTS (
    SELECT 1 FROM auth.identities i 
    WHERE i.user_id = u.id AND i.provider = 'email'
  );

-- Vérification
SELECT 
  u.email,
  u.id as user_id,
  i.id as identity_id,
  i.provider,
  i.created_at
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
WHERE u.email LIKE '%@2iegreenhub.org'
ORDER BY u.email;
