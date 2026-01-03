-- =====================================================
-- ÉTAPE 1 : Vérifier et créer pev_countries
-- À exécuter EN PREMIER dans Supabase SQL Editor
-- =====================================================

-- Vérifier si la table existe et son type
DO $$ 
DECLARE
  table_exists BOOLEAN;
  id_type TEXT;
BEGIN
  -- Vérifier existence
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'pev_countries'
  ) INTO table_exists;
  
  IF table_exists THEN
    -- Vérifier le type de la colonne id
    SELECT data_type INTO id_type
    FROM information_schema.columns 
    WHERE table_name = 'pev_countries' AND column_name = 'id';
    
    RAISE NOTICE 'pev_countries existe avec id de type: %', id_type;
    
    -- Si le type est UUID, on doit la supprimer et la recréer
    IF id_type = 'uuid' THEN
      RAISE NOTICE 'ATTENTION: pev_countries a un id UUID, elle doit être recréée avec BIGINT';
      -- Supprimer les contraintes FK qui pointent vers cette table
      DROP TABLE IF EXISTS pev_groups CASCADE;
      DROP TABLE IF EXISTS pev_countries CASCADE;
      RAISE NOTICE 'Tables supprimées. Continuez avec la création.';
    END IF;
  ELSE
    RAISE NOTICE 'pev_countries n existe pas. Elle va être créée.';
  END IF;
END $$;

-- Créer pev_countries avec le bon type (BIGINT)
CREATE TABLE IF NOT EXISTS pev_countries (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10),
  flag VARCHAR(10),
  continent VARCHAR(100) DEFAULT 'Afrique',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer des pays par défaut
INSERT INTO pev_countries (name, code, flag, display_order) VALUES
  ('Burkina Faso', 'BF', '🇧🇫', 1),
  ('Côte d''Ivoire', 'CI', '🇨🇮', 2),
  ('Sénégal', 'SN', '🇸🇳', 3),
  ('Mali', 'ML', '🇲🇱', 4),
  ('Niger', 'NE', '🇳🇪', 5),
  ('Togo', 'TG', '🇹🇬', 6),
  ('Bénin', 'BJ', '🇧🇯', 7),
  ('Ghana', 'GH', '🇬🇭', 8),
  ('Nigeria', 'NG', '🇳🇬', 9),
  ('Cameroun', 'CM', '🇨🇲', 10),
  ('Kenya', 'KE', '🇰🇪', 11),
  ('Maroc', 'MA', '🇲🇦', 12)
ON CONFLICT DO NOTHING;

-- Activer RLS
ALTER TABLE pev_countries ENABLE ROW LEVEL SECURITY;

-- Policy lecture publique
DROP POLICY IF EXISTS "Public read countries" ON pev_countries;
CREATE POLICY "Public read countries" ON pev_countries
  FOR SELECT USING (true);

-- Vérification finale
SELECT 'pev_countries créée avec succès!' as message;
SELECT id, name, code, flag FROM pev_countries ORDER BY display_order LIMIT 5;
