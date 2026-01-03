-- ================================================================
-- AJOUT D'OPTIONS D'AFFICHAGE POUR LES TÉMOIGNAGES
-- À exécuter dans Supabase SQL Editor
-- ================================================================

-- Ajouter colonnes pour les options de visibilité
ALTER TABLE pev_testimonials
ADD COLUMN IF NOT EXISTS display_name BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS display_avatar BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS display_company BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Commentaires pour documenter les colonnes
COMMENT ON COLUMN pev_testimonials.display_name IS 'Afficher le nom de l''utilisateur (prénom + nom)';
COMMENT ON COLUMN pev_testimonials.display_avatar IS 'Afficher la photo de profil dans l''avatar';
COMMENT ON COLUMN pev_testimonials.display_company IS 'Afficher le nom de la structure/entreprise';
COMMENT ON COLUMN pev_testimonials.company_name IS 'Nom de la structure/entreprise à afficher';

-- Vérification
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'pev_testimonials'
  AND column_name IN ('display_name', 'display_avatar', 'display_company', 'company_name')
ORDER BY ordinal_position;

-- ================================================================
-- EXEMPLES D'UTILISATION
-- ================================================================

-- Exemple 1: Afficher nom + structure
/*
INSERT INTO pev_testimonials (
  user_id, content, rating,
  display_name, display_avatar, display_company, company_name,
  is_approved, status
) VALUES (
  (SELECT id FROM pev_profiles LIMIT 1),
  'Excellent service!',
  5,
  true,
  true,
  true,
  'EcoSolar Burkina',
  true,
  'published'
);
*/

-- Exemple 2: Afficher uniquement la structure (anonyme)
/*
INSERT INTO pev_testimonials (
  user_id, content, rating,
  display_name, display_avatar, display_company, company_name,
  is_approved, status
) VALUES (
  (SELECT id FROM pev_profiles LIMIT 1),
  'Très satisfait!',
  5,
  false,
  false,
  true,
  'AgriTech CI',
  true,
  'published'
);
*/

-- Exemple 3: Afficher nom seulement (sans structure)
/*
INSERT INTO pev_testimonials (
  user_id, content, rating,
  display_name, display_avatar, display_company, company_name,
  is_approved, status
) VALUES (
  (SELECT id FROM pev_profiles LIMIT 1),
  'Plateforme indispensable!',
  5,
  true,
  true,
  false,
  NULL,
  true,
  'published'
);
*/
