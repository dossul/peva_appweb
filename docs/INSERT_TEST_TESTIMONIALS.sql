-- ================================================================
-- INSERTION DE TÉMOIGNAGES DE TEST
-- À exécuter dans Supabase SQL Editor
-- ================================================================

-- NOTE: Remplacez 'YOUR_USER_ID_HERE' par un UUID d'utilisateur existant
-- Vous pouvez obtenir un user_id avec: SELECT id, email FROM pev_profiles LIMIT 5;

-- ================================================================
-- MÉTHODE 1: Insertion avec user_id connu
-- ================================================================

-- Témoignage 1
INSERT INTO pev_testimonials (
  user_id,
  content,
  rating,
  is_approved,
  is_featured,
  status
) VALUES (
  (SELECT id FROM pev_profiles ORDER BY created_at DESC LIMIT 1), -- Utilise le dernier utilisateur créé
  '2iE GreenHub nous a permis de trouver des partenaires stratégiques et de lever 500k€ pour notre expansion. Une plateforme indispensable pour les entrepreneurs de l''économie verte.',
  5,
  true,
  true,
  'published'
);

-- Témoignage 2
INSERT INTO pev_testimonials (
  user_id,
  content,
  rating,
  is_approved,
  is_featured,
  status
) VALUES (
  (SELECT id FROM pev_profiles ORDER BY created_at DESC LIMIT 1 OFFSET 1), -- Deuxième utilisateur
  'La plateforme a révolutionné notre approche du networking. Nous avons doublé notre réseau en 6 mois et trouvé des opportunités incroyables.',
  5,
  true,
  true,
  'published'
);

-- Témoignage 3
INSERT INTO pev_testimonials (
  user_id,
  content,
  rating,
  is_approved,
  is_featured,
  status
) VALUES (
  (SELECT id FROM pev_profiles ORDER BY created_at DESC LIMIT 1 OFFSET 2), -- Troisième utilisateur
  'Un outil indispensable pour identifier les meilleures opportunités d''investissement en Afrique. Interface intuitive et réseau de qualité.',
  5,
  true,
  false,
  'published'
);

-- ================================================================
-- MÉTHODE 2: Insertion avec user_id spécifique
-- ================================================================

-- Remplacez 'YOUR_USER_ID_HERE' par un UUID réel
/*
INSERT INTO pev_testimonials (
  user_id,
  content,
  rating,
  is_approved,
  is_featured,
  status
) VALUES (
  'YOUR_USER_ID_HERE',
  'Votre témoignage personnalisé ici...',
  5,
  true,
  true,
  'published'
);
*/

-- ================================================================
-- VÉRIFICATION
-- ================================================================

-- Voir tous les témoignages avec infos utilisateur
SELECT 
  t.id,
  t.content,
  t.rating,
  t.is_approved,
  t.is_featured,
  t.status,
  p.first_name,
  p.last_name,
  p.user_type,
  p.location,
  t.created_at
FROM pev_testimonials t
JOIN pev_profiles p ON t.user_id = p.id
ORDER BY t.created_at DESC;

-- Compter les témoignages approuvés
SELECT COUNT(*) as total_approved_testimonials 
FROM pev_testimonials 
WHERE is_approved = true AND status = 'published';

-- ================================================================
-- SUPPRESSION (si besoin de nettoyer les tests)
-- ================================================================

-- Supprimer tous les témoignages de test
-- DELETE FROM pev_testimonials WHERE content LIKE '%2iE GreenHub%';
