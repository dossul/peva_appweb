-- Migration: Synchroniser pev_profiles avec auth.users
-- Date: 2026-01-08
-- Problème: Les profils n'ont pas d'email car ils ne sont pas créés automatiquement

-- 1. Créer les profils manquants pour les utilisateurs existants
INSERT INTO pev_profiles (id, email, first_name, last_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'first_name',
  au.raw_user_meta_data->>'last_name',
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN pev_profiles pp ON au.id = pp.id
WHERE pp.id IS NULL;

-- 2. Mettre à jour les emails manquants dans les profils existants
UPDATE pev_profiles pp
SET email = au.email, updated_at = NOW()
FROM auth.users au
WHERE pp.id = au.id AND (pp.email IS NULL OR pp.email = '');

-- 3. Créer un trigger pour créer automatiquement le profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.pev_profiles (id, email, first_name, last_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le nouveau trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Profils synchronisés et trigger créé' as message;
