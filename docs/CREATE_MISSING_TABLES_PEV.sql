-- ================================================================
-- SCRIPT DE CRÉATION DES TABLES MANQUANTES - PEVA
-- ================================================================
-- Ce script crée toutes les tables potentiellement manquantes
-- identifiées lors de l'audit du codebase
-- Toutes les tables utilisent le préfixe pev_
-- ================================================================

-- ================================================================
-- 1. MESSAGERIE
-- ================================================================

-- Table des fils de discussion (selon schéma ligne 283)
CREATE TABLE IF NOT EXISTS pev_message_threads (
  id BIGSERIAL PRIMARY KEY,
  topic TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Participants aux discussions (structure simplifiée du schéma réel)
CREATE TABLE IF NOT EXISTS pev_message_thread_participants (
  thread_id BIGINT REFERENCES pev_message_threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES pev_profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (thread_id, user_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_message_thread_participants_thread ON pev_message_thread_participants(thread_id);
CREATE INDEX IF NOT EXISTS idx_message_thread_participants_user ON pev_message_thread_participants(user_id);

-- ================================================================
-- 2. GROUPES
-- ================================================================

-- Membres des groupes (selon schéma réel ligne 391)
CREATE TABLE IF NOT EXISTS pev_group_members (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT REFERENCES pev_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES pev_profiles(id) ON DELETE CASCADE,
  role pev_group_member_role DEFAULT 'member' NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON pev_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON pev_group_members(user_id);

-- ================================================================
-- 3. GESTION DES FICHIERS
-- ================================================================

-- Table de suivi des uploads (déjà existe dans le schéma - skip)
-- CREATE TABLE IF NOT EXISTS pev_file_uploads (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
--   bucket_id TEXT NOT NULL REFERENCES pev_storage_buckets(id) ON DELETE CASCADE,
--   file_name TEXT NOT NULL,
--   file_path TEXT NOT NULL,
--   file_size BIGINT NOT NULL,
--   mime_type TEXT NOT NULL,
--   category TEXT,
--   related_entity TEXT,
--   related_id TEXT,
--   is_public BOOLEAN DEFAULT FALSE NOT NULL,
--   metadata JSONB DEFAULT '{}'::jsonb,
--   created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
-- );

-- Les index sont déjà créés dans le schéma

-- Quotas de stockage par utilisateur (selon schéma ligne 506)
CREATE TABLE IF NOT EXISTS pev_storage_quotas (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES pev_profiles(id) ON DELETE CASCADE,
  total_quota BIGINT DEFAULT 524288000 NOT NULL, -- 500 MB par défaut
  used_space BIGINT DEFAULT 0 NOT NULL,
  file_count INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_storage_quotas_user ON pev_storage_quotas(user_id);

-- Logs d'accès aux fichiers
CREATE TABLE IF NOT EXISTS pev_file_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES pev_file_uploads(id) ON DELETE CASCADE,
  accessed_by UUID REFERENCES pev_profiles(id) ON DELETE SET NULL,
  access_type VARCHAR(50) DEFAULT 'view', -- 'view', 'download', 'delete'
  ip_address INET,
  user_agent TEXT,
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_file_access_logs_file ON pev_file_access_logs(file_id);
CREATE INDEX IF NOT EXISTS idx_file_access_logs_user ON pev_file_access_logs(accessed_by);
CREATE INDEX IF NOT EXISTS idx_file_access_logs_date ON pev_file_access_logs(accessed_at DESC);

-- ================================================================
-- 4. STATISTIQUES PLATEFORME (déjà existe - skip)
-- ================================================================

-- CREATE TABLE IF NOT EXISTS pev_platform_stats (
--   id SERIAL PRIMARY KEY,
--   key TEXT NOT NULL UNIQUE,
--   label TEXT NOT NULL,
--   value BIGINT DEFAULT 0 NOT NULL,
--   formatted_value TEXT,
--   icon TEXT,
--   color TEXT,
--   is_active BOOLEAN DEFAULT TRUE NOT NULL,
--   updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
-- );

-- Table déjà créée dans le schéma avec données initiales

-- ================================================================
-- 5. TÉMOIGNAGES
-- ================================================================

CREATE TABLE IF NOT EXISTS pev_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES pev_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'published', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_user ON pev_testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON pev_testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON pev_testimonials(is_featured, is_approved);

-- ================================================================
-- 6. DONNÉES GÉOGRAPHIQUES BURKINA FASO
-- ================================================================

-- Régions du Burkina Faso
CREATE TABLE IF NOT EXISTS pev_burkina_regions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100),
  code VARCHAR(10) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Villes du Burkina Faso
CREATE TABLE IF NOT EXISTS pev_burkina_cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100),
  region_id INTEGER REFERENCES pev_burkina_regions(id),
  population INTEGER,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_burkina_cities_region ON pev_burkina_cities(region_id);
CREATE INDEX IF NOT EXISTS idx_burkina_cities_population ON pev_burkina_cities(population DESC);

-- Insérer les 13 régions du Burkina Faso
INSERT INTO pev_burkina_regions (name, name_fr, code) VALUES
  ('Centre', 'Centre', 'CEN'),
  ('Cascades', 'Cascades', 'CAS'),
  ('Centre-Est', 'Centre-Est', 'EST'),
  ('Centre-Nord', 'Centre-Nord', 'CNO'),
  ('Centre-Ouest', 'Centre-Ouest', 'COU'),
  ('Centre-Sud', 'Centre-Sud', 'CSU'),
  ('Est', 'Est', 'EST'),
  ('Hauts-Bassins', 'Hauts-Bassins', 'HBA'),
  ('Nord', 'Nord', 'NOR'),
  ('Plateau-Central', 'Plateau-Central', 'PCE'),
  ('Sahel', 'Sahel', 'SAH'),
  ('Sud-Ouest', 'Sud-Ouest', 'SOU'),
  ('Boucle du Mouhoun', 'Boucle du Mouhoun', 'BMO')
ON CONFLICT (code) DO NOTHING;

-- Insérer quelques grandes villes
INSERT INTO pev_burkina_cities (name, name_fr, region_id, population, latitude, longitude) 
SELECT 'Ouagadougou', 'Ouagadougou', id, 2415266, 12.3714277, -1.5196603 
FROM pev_burkina_regions WHERE code = 'CEN'
ON CONFLICT DO NOTHING;

INSERT INTO pev_burkina_cities (name, name_fr, region_id, population, latitude, longitude) 
SELECT 'Bobo-Dioulasso', 'Bobo-Dioulasso', id, 904920, 11.1770587, -4.2970735 
FROM pev_burkina_regions WHERE code = 'HBA'
ON CONFLICT DO NOTHING;

-- ================================================================
-- 7. TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- ================================================================

-- Fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables concernées
CREATE TRIGGER update_message_threads_updated_at
  BEFORE UPDATE ON pev_message_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_file_uploads_updated_at
  BEFORE UPDATE ON pev_file_uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_stats_updated_at
  BEFORE UPDATE ON pev_platform_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON pev_testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 8. TRIGGER POUR MISE À JOUR DU QUOTA DE STOCKAGE
-- ================================================================

CREATE OR REPLACE FUNCTION update_storage_quota()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO pev_storage_quotas (user_id, used_space, file_count)
    VALUES (NEW.user_id, NEW.file_size, 1)
    ON CONFLICT (user_id) DO UPDATE SET
      used_space = pev_storage_quotas.used_space + NEW.file_size,
      file_count = pev_storage_quotas.file_count + 1,
      updated_at = NOW();
      
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE pev_storage_quotas
    SET 
      used_space = GREATEST(0, used_space - OLD.file_size),
      file_count = GREATEST(0, file_count - 1),
      updated_at = NOW()
    WHERE user_id = OLD.user_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_storage_quota
  AFTER INSERT OR DELETE ON pev_file_uploads
  FOR EACH ROW EXECUTE FUNCTION update_storage_quota();

-- ================================================================
-- 9. TRIGGER POUR MISE À JOUR DU DERNIER MESSAGE
-- ================================================================

CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE pev_message_threads
    SET 
      last_message_at = NEW.created_at,
      updated_at = NOW()
    WHERE id = NEW.thread_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ce trigger sera créé quand pev_messages existe
-- CREATE TRIGGER update_thread_last_message_time
--   AFTER INSERT ON pev_messages
--   FOR EACH ROW EXECUTE FUNCTION update_thread_last_message();

-- ================================================================
-- 10. POLITIQUES RLS (Row Level Security)
-- ================================================================

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE pev_message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_message_thread_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_storage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_file_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_platform_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_burkina_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_burkina_cities ENABLE ROW LEVEL SECURITY;

-- Politiques de base pour message_threads
CREATE POLICY "Users can view threads they participate in"
  ON pev_message_threads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pev_message_thread_participants
      WHERE thread_id = pev_message_threads.id
      AND user_id = auth.uid()
    )
  );

-- Politiques pour file_uploads
CREATE POLICY "Users can view their own files"
  ON pev_file_uploads FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own files"
  ON pev_file_uploads FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own files"
  ON pev_file_uploads FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own files"
  ON pev_file_uploads FOR DELETE
  USING (user_id = auth.uid());

-- Politiques pour storage_quotas
CREATE POLICY "Users can view their own quota"
  ON pev_storage_quotas FOR SELECT
  USING (user_id = auth.uid());

-- Politiques pour platform_stats (lecture publique)
CREATE POLICY "Anyone can view active platform stats"
  ON pev_platform_stats FOR SELECT
  USING (is_active = true);

-- Politiques pour testimonials
CREATE POLICY "Users can view approved testimonials"
  ON pev_testimonials FOR SELECT
  USING (is_approved = true AND status = 'published');

CREATE POLICY "Users can create their own testimonials"
  ON pev_testimonials FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pending testimonials"
  ON pev_testimonials FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending');

-- Politiques pour données géographiques (lecture publique)
CREATE POLICY "Anyone can view regions"
  ON pev_burkina_regions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view cities"
  ON pev_burkina_cities FOR SELECT
  USING (true);

-- ================================================================
-- FIN DU SCRIPT
-- ================================================================

-- Vérification des tables créées
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name LIKE 'pev_%';
  
  RAISE NOTICE 'Nombre total de tables avec préfixe pev_: %', table_count;
END $$;
