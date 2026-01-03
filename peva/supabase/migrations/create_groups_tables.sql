-- =====================================================
-- Tables pour les Communautés/Groupes - 2iEGreenHub
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Table des catégories de groupes
CREATE TABLE IF NOT EXISTS pev_group_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100) DEFAULT 'mdi-folder',
  color VARCHAR(50) DEFAULT 'teal',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTE: pev_countries doit être créée séparément si elle n'existe pas
-- Voir le fichier docs/CREATE_COUNTRIES_TABLE.sql

-- Table des groupes/communautés
CREATE TABLE IF NOT EXISTS pev_groups (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  category_id BIGINT REFERENCES pev_group_categories(id) ON DELETE SET NULL,
  category_color VARCHAR(50) DEFAULT 'teal',
  icon VARCHAR(100) DEFAULT 'mdi-account-group',
  color VARCHAR(50) DEFAULT 'teal',
  cover_url TEXT,
  is_public BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  country_id BIGINT,
  created_by UUID,
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter la foreign key vers countries si la table existe
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pev_countries') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'pev_groups_country_id_fkey'
    ) THEN
      ALTER TABLE pev_groups 
        ADD CONSTRAINT pev_groups_country_id_fkey 
        FOREIGN KEY (country_id) REFERENCES pev_countries(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- Table des membres de groupes
CREATE TABLE IF NOT EXISTS pev_group_members (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES pev_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  status VARCHAR(50) DEFAULT 'pending',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(group_id, user_id)
);

-- Table des publications dans les groupes
CREATE TABLE IF NOT EXISTS pev_group_posts (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES pev_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_pev_groups_is_active ON pev_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_pev_groups_category_id ON pev_groups(category_id);
CREATE INDEX IF NOT EXISTS idx_pev_groups_country_id ON pev_groups(country_id);
CREATE INDEX IF NOT EXISTS idx_pev_group_members_group_id ON pev_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_pev_group_members_user_id ON pev_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_pev_group_members_status ON pev_group_members(status);
CREATE INDEX IF NOT EXISTS idx_pev_group_posts_group_id ON pev_group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_pev_group_posts_created_at ON pev_group_posts(created_at);

-- RLS Policies
ALTER TABLE pev_group_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_group_posts ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les catégories et groupes actifs
CREATE POLICY "Public read group categories" ON pev_group_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read active groups" ON pev_groups
  FOR SELECT USING (is_active = true);

CREATE POLICY "Members can view group members" ON pev_group_members
  FOR SELECT USING (true);

CREATE POLICY "Members can view group posts" ON pev_group_posts
  FOR SELECT USING (true);

-- Insertion pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can join groups" ON pev_group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can post in groups" ON pev_group_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insertion de catégories par défaut
INSERT INTO pev_group_categories (name, description, icon, color, display_order) VALUES
  ('Énergies Renouvelables', 'Solaire, éolien, hydraulique et autres énergies propres', 'mdi-solar-power', 'green', 1),
  ('Agriculture Durable', 'Techniques agricoles respectueuses de l''environnement', 'mdi-sprout', 'light-green', 2),
  ('Gestion des Déchets', 'Recyclage, économie circulaire et valorisation', 'mdi-recycle', 'orange', 3),
  ('Transport Vert', 'Mobilité durable et véhicules électriques', 'mdi-car-electric', 'blue', 4),
  ('Construction Écologique', 'Bâtiments durables et éco-construction', 'mdi-home-city', 'brown', 5),
  ('Fintech Verte', 'Finance durable et investissements verts', 'mdi-currency-eur', 'purple', 6)
ON CONFLICT DO NOTHING;

-- Les colonnes supplémentaires pour pev_countries sont déjà définies ci-dessus

-- Insérer quelques pays par défaut si la table pev_countries existe et est vide
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pev_countries') THEN
    INSERT INTO pev_countries (name, code, flag) 
    SELECT * FROM (VALUES
      ('Burkina Faso', 'BF', '🇧🇫'),
      ('Côte d''Ivoire', 'CI', '🇨🇮'),
      ('Sénégal', 'SN', '🇸🇳'),
      ('Mali', 'ML', '🇲🇱'),
      ('Niger', 'NE', '🇳🇪'),
      ('Togo', 'TG', '🇹🇬'),
      ('Bénin', 'BJ', '🇧🇯'),
      ('Ghana', 'GH', '🇬🇭'),
      ('Nigeria', 'NG', '🇳🇬'),
      ('Cameroun', 'CM', '🇨🇲'),
      ('Kenya', 'KE', '🇰🇪'),
      ('Maroc', 'MA', '🇲🇦')
    ) AS v(name, code, flag)
    WHERE NOT EXISTS (SELECT 1 FROM pev_countries LIMIT 1);
    
    -- Activer RLS sur pev_countries
    ALTER TABLE pev_countries ENABLE ROW LEVEL SECURITY;
    
    -- Policy pour lecture publique des pays
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pev_countries' AND policyname = 'Public read countries') THEN
      EXECUTE 'CREATE POLICY "Public read countries" ON pev_countries FOR SELECT USING (true)';
    END IF;
  END IF;
END $$;
