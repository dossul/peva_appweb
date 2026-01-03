-- =====================================================
-- Tables pour les Événements - 2iEGreenHub
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Table des catégories d'événements
CREATE TABLE IF NOT EXISTS pev_event_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100) DEFAULT 'mdi-calendar',
  color VARCHAR(50) DEFAULT 'blue',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des événements
CREATE TABLE IF NOT EXISTS pev_events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  category_id BIGINT REFERENCES pev_event_categories(id) ON DELETE SET NULL,
  event_type VARCHAR(50) DEFAULT 'conference',
  location VARCHAR(255),
  location_type VARCHAR(50) DEFAULT 'physical',
  address TEXT,
  city VARCHAR(100),
  country_id BIGINT,
  online_link TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  registration_required BOOLEAN DEFAULT true,
  is_free BOOLEAN DEFAULT false,
  price DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'XOF',
  image_url TEXT,
  organizer_name VARCHAR(255),
  organizer_id UUID,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  participants_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des participants aux événements
CREATE TABLE IF NOT EXISTS pev_event_participants (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES pev_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'registered',
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attendance_status VARCHAR(50),
  attended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(event_id, user_id)
);

-- Table des commentaires sur les événements
CREATE TABLE IF NOT EXISTS pev_event_comments (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES pev_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_id BIGINT REFERENCES pev_event_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_pev_events_start_date ON pev_events(start_date);
CREATE INDEX IF NOT EXISTS idx_pev_events_status ON pev_events(status);
CREATE INDEX IF NOT EXISTS idx_pev_events_category_id ON pev_events(category_id);
CREATE INDEX IF NOT EXISTS idx_pev_events_country_id ON pev_events(country_id);
CREATE INDEX IF NOT EXISTS idx_pev_events_is_featured ON pev_events(is_featured);
CREATE INDEX IF NOT EXISTS idx_pev_event_participants_event_id ON pev_event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_pev_event_participants_user_id ON pev_event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_pev_event_comments_event_id ON pev_event_comments(event_id);

-- RLS Policies
ALTER TABLE pev_event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_event_comments ENABLE ROW LEVEL SECURITY;

-- Policies lecture publique
DROP POLICY IF EXISTS "Public read event categories" ON pev_event_categories;
CREATE POLICY "Public read event categories" ON pev_event_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read published events" ON pev_events;
CREATE POLICY "Public read published events" ON pev_events
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Users can view event participants" ON pev_event_participants;
CREATE POLICY "Users can view event participants" ON pev_event_participants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view event comments" ON pev_event_comments;
CREATE POLICY "Users can view event comments" ON pev_event_comments
  FOR SELECT USING (true);

-- Policies insertion
DROP POLICY IF EXISTS "Authenticated users can register for events" ON pev_event_participants;
CREATE POLICY "Authenticated users can register for events" ON pev_event_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can comment on events" ON pev_event_comments;
CREATE POLICY "Authenticated users can comment on events" ON pev_event_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insertion de catégories par défaut
INSERT INTO pev_event_categories (name, description, icon, color, display_order) VALUES
  ('Conférences', 'Conférences et séminaires sur l''économie verte', 'mdi-presentation', 'blue', 1),
  ('Ateliers', 'Ateliers pratiques et formations', 'mdi-hammer-wrench', 'orange', 2),
  ('Webinaires', 'Événements en ligne et webinaires', 'mdi-video', 'purple', 3),
  ('Networking', 'Événements de réseautage et rencontres professionnelles', 'mdi-account-group', 'green', 4),
  ('Salons', 'Salons et expositions', 'mdi-store', 'red', 5),
  ('Formations', 'Sessions de formation et certification', 'mdi-school', 'teal', 6)
ON CONFLICT DO NOTHING;

-- Vérification
SELECT 'Tables événements créées avec succès!' as message;
SELECT COUNT(*) as nb_categories FROM pev_event_categories;
