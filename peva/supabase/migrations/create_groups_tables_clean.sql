-- =====================================================
-- SCRIPT COMPLET - Tables Communautés/Groupes
-- Exécuter ce script dans Supabase SQL Editor
-- =====================================================

-- 1. Créer pev_countries D'ABORD
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

-- 2. Créer pev_group_categories
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

-- 3. Créer pev_groups
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
  country_id BIGINT REFERENCES pev_countries(id) ON DELETE SET NULL,
  created_by UUID,
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer pev_group_members
CREATE TABLE IF NOT EXISTS pev_group_members (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES pev_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  status VARCHAR(50) DEFAULT 'pending',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(group_id, user_id)
);

-- 5. Créer pev_group_posts
CREATE TABLE IF NOT EXISTS pev_group_posts (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES pev_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
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
ALTER TABLE pev_countries ENABLE ROW LEVEL SECURITY;

-- Policies lecture publique
DROP POLICY IF EXISTS "Public read group categories" ON pev_group_categories;
CREATE POLICY "Public read group categories" ON pev_group_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read active groups" ON pev_groups;
CREATE POLICY "Public read active groups" ON pev_groups
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Members can view group members" ON pev_group_members;
CREATE POLICY "Members can view group members" ON pev_group_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Members can view group posts" ON pev_group_posts;
CREATE POLICY "Members can view group posts" ON pev_group_posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read countries" ON pev_countries;
CREATE POLICY "Public read countries" ON pev_countries
  FOR SELECT USING (true);

-- Policies insertion
DROP POLICY IF EXISTS "Authenticated users can join groups" ON pev_group_members;
CREATE POLICY "Authenticated users can join groups" ON pev_group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can post in groups" ON pev_group_posts;
CREATE POLICY "Authenticated users can post in groups" ON pev_group_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insertion données par défaut
INSERT INTO pev_group_categories (name, description, icon, color, display_order) VALUES
  ('Énergies Renouvelables', 'Solaire, éolien, hydraulique et autres énergies propres', 'mdi-solar-power', 'green', 1),
  ('Agriculture Durable', 'Techniques agricoles respectueuses de l''environnement', 'mdi-sprout', 'light-green', 2),
  ('Gestion des Déchets', 'Recyclage, économie circulaire et valorisation', 'mdi-recycle', 'orange', 3),
  ('Transport Vert', 'Mobilité durable et véhicules électriques', 'mdi-car-electric', 'blue', 4),
  ('Construction Écologique', 'Bâtiments durables et éco-construction', 'mdi-home-city', 'brown', 5),
  ('Fintech Verte', 'Finance durable et investissements verts', 'mdi-currency-eur', 'purple', 6)
ON CONFLICT DO NOTHING;

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

-- Vérification
SELECT 'Tables créées avec succès!' as message;
SELECT COUNT(*) as nb_categories FROM pev_group_categories;
SELECT COUNT(*) as nb_pays FROM pev_countries;
