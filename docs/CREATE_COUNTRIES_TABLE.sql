-- ================================================================
-- TABLE PEV_COUNTRIES - GESTION DES PAYS
-- À exécuter dans Supabase SQL Editor
-- ================================================================

-- Créer la table des pays
CREATE TABLE IF NOT EXISTS pev_countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE, -- Code ISO (ex: BF, SN, CI)
  continent TEXT NOT NULL DEFAULT 'Afrique',
  flag_emoji TEXT, -- Emoji drapeau (ex: 🇧🇫, 🇸🇳)
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_countries_name ON pev_countries(name);
CREATE INDEX IF NOT EXISTS idx_countries_continent ON pev_countries(continent);
CREATE INDEX IF NOT EXISTS idx_countries_active ON pev_countries(is_active);

-- Trigger pour updated_at
CREATE TRIGGER update_countries_updated_at
  BEFORE UPDATE ON pev_countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- INSERTION DES PAYS AFRICAINS (PAR ORDRE ALPHABÉTIQUE)
-- ================================================================

INSERT INTO pev_countries (name, code, continent, flag_emoji, display_order) VALUES
('Afrique du Sud', 'ZA', 'Afrique', '🇿🇦', 1),
('Algérie', 'DZ', 'Afrique', '🇩🇿', 2),
('Angola', 'AO', 'Afrique', '🇦🇴', 3),
('Bénin', 'BJ', 'Afrique', '🇧🇯', 4),
('Botswana', 'BW', 'Afrique', '🇧🇼', 5),
('Burkina Faso', 'BF', 'Afrique', '🇧🇫', 6),
('Burundi', 'BI', 'Afrique', '🇧🇮', 7),
('Cameroun', 'CM', 'Afrique', '🇨🇲', 8),
('Cap-Vert', 'CV', 'Afrique', '🇨🇻', 9),
('Comores', 'KM', 'Afrique', '🇰🇲', 10),
('Côte d''Ivoire', 'CI', 'Afrique', '🇨🇮', 11),
('Djibouti', 'DJ', 'Afrique', '🇩🇯', 12),
('Égypte', 'EG', 'Afrique', '🇪🇬', 13),
('Érythrée', 'ER', 'Afrique', '🇪🇷', 14),
('Eswatini', 'SZ', 'Afrique', '🇸🇿', 15),
('Éthiopie', 'ET', 'Afrique', '🇪🇹', 16),
('Gabon', 'GA', 'Afrique', '🇬🇦', 17),
('Gambie', 'GM', 'Afrique', '🇬🇲', 18),
('Ghana', 'GH', 'Afrique', '🇬🇭', 19),
('Guinée', 'GN', 'Afrique', '🇬🇳', 20),
('Guinée équatoriale', 'GQ', 'Afrique', '🇬🇶', 21),
('Guinée-Bissau', 'GW', 'Afrique', '🇬🇼', 22),
('Kenya', 'KE', 'Afrique', '🇰🇪', 23),
('Lesotho', 'LS', 'Afrique', '🇱🇸', 24),
('Libéria', 'LR', 'Afrique', '🇱🇷', 25),
('Libye', 'LY', 'Afrique', '🇱🇾', 26),
('Madagascar', 'MG', 'Afrique', '🇲🇬', 27),
('Malawi', 'MW', 'Afrique', '🇲🇼', 28),
('Mali', 'ML', 'Afrique', '🇲🇱', 29),
('Maroc', 'MA', 'Afrique', '🇲🇦', 30),
('Maurice', 'MU', 'Afrique', '🇲🇺', 31),
('Mauritanie', 'MR', 'Afrique', '🇲🇷', 32),
('Mozambique', 'MZ', 'Afrique', '🇲🇿', 33),
('Namibie', 'NA', 'Afrique', '🇳🇦', 34),
('Niger', 'NE', 'Afrique', '🇳🇪', 35),
('Nigéria', 'NG', 'Afrique', '🇳🇬', 36),
('Ouganda', 'UG', 'Afrique', '🇺🇬', 37),
('République centrafricaine', 'CF', 'Afrique', '🇨🇫', 38),
('République démocratique du Congo', 'CD', 'Afrique', '🇨🇩', 39),
('République du Congo', 'CG', 'Afrique', '🇨🇬', 40),
('Rwanda', 'RW', 'Afrique', '🇷🇼', 41),
('São Tomé-et-Príncipe', 'ST', 'Afrique', '🇸🇹', 42),
('Sénégal', 'SN', 'Afrique', '🇸🇳', 43),
('Seychelles', 'SC', 'Afrique', '🇸🇨', 44),
('Sierra Leone', 'SL', 'Afrique', '🇸🇱', 45),
('Somalie', 'SO', 'Afrique', '🇸🇴', 46),
('Soudan', 'SD', 'Afrique', '🇸🇩', 47),
('Soudan du Sud', 'SS', 'Afrique', '🇸🇸', 48),
('Tanzanie', 'TZ', 'Afrique', '🇹🇿', 49),
('Tchad', 'TD', 'Afrique', '🇹🇩', 50),
('Togo', 'TG', 'Afrique', '🇹🇬', 51),
('Tunisie', 'TN', 'Afrique', '🇹🇳', 52),
('Zambie', 'ZM', 'Afrique', '🇿🇲', 53),
('Zimbabwe', 'ZW', 'Afrique', '🇿🇼', 54),
('Autre', 'XX', 'Autre', '🌍', 999)
ON CONFLICT (name) DO NOTHING;

-- ================================================================
-- POLITIQUES RLS (Row Level Security)
-- ================================================================

ALTER TABLE pev_countries ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les pays actifs
CREATE POLICY "Everyone can view active countries"
  ON pev_countries FOR SELECT
  USING (is_active = true);

-- Seuls les admins peuvent créer/modifier/supprimer
CREATE POLICY "Only admins can manage countries"
  ON pev_countries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pev_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- ================================================================
-- VÉRIFICATION
-- ================================================================

-- Compter les pays
SELECT continent, COUNT(*) as total
FROM pev_countries
WHERE is_active = true
GROUP BY continent
ORDER BY continent;

-- Lister tous les pays par ordre alphabétique
SELECT name, code, flag_emoji, continent
FROM pev_countries
WHERE is_active = true
ORDER BY 
  CASE WHEN continent = 'Autre' THEN 1 ELSE 0 END,
  name;
