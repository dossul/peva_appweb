-- ============================================================
-- MIGRATION: Module Companies - Schéma Simplifié
-- Date: 6 février 2026
-- Description: Tables pour gestion des entreprises avec 
--              déclarations périodiques et historique
-- ============================================================

-- 1. RÉFÉRENTIELS
-- ============================================================

-- 1.1 Table des périodes (années uniquement pour simplifier)
CREATE TABLE IF NOT EXISTS pev_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL UNIQUE,
  label VARCHAR(50) NOT NULL, -- ex: "2024", "2025"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insérer les périodes 2020-2030
INSERT INTO pev_periods (year, label, start_date, end_date) VALUES
  (2020, '2020', '2020-01-01', '2020-12-31'),
  (2021, '2021', '2021-01-01', '2021-12-31'),
  (2022, '2022', '2022-01-01', '2022-12-31'),
  (2023, '2023', '2023-01-01', '2023-12-31'),
  (2024, '2024', '2024-01-01', '2024-12-31'),
  (2025, '2025', '2025-01-01', '2025-12-31'),
  (2026, '2026', '2026-01-01', '2026-12-31'),
  (2027, '2027', '2027-01-01', '2027-12-31'),
  (2028, '2028', '2028-01-01', '2028-12-31'),
  (2029, '2029', '2029-01-01', '2029-12-31'),
  (2030, '2030', '2030-01-01', '2030-12-31')
ON CONFLICT (year) DO NOTHING;

-- 1.2 Table des ODD (17 Objectifs de Développement Durable)
CREATE TABLE IF NOT EXISTS pev_sdg (
  id SERIAL PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 17),
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7),
  icon VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insérer les 17 ODD
INSERT INTO pev_sdg (number, code, name, color) VALUES
  (1, 'ODD1', 'Pas de pauvreté', '#E5243B'),
  (2, 'ODD2', 'Faim zéro', '#DDA63A'),
  (3, 'ODD3', 'Bonne santé et bien-être', '#4C9F38'),
  (4, 'ODD4', 'Éducation de qualité', '#C5192D'),
  (5, 'ODD5', 'Égalité entre les sexes', '#FF3A21'),
  (6, 'ODD6', 'Eau propre et assainissement', '#26BDE2'),
  (7, 'ODD7', 'Énergie propre et abordable', '#FCC30B'),
  (8, 'ODD8', 'Travail décent et croissance', '#A21942'),
  (9, 'ODD9', 'Industrie, innovation et infrastructure', '#FD6925'),
  (10, 'ODD10', 'Inégalités réduites', '#DD1367'),
  (11, 'ODD11', 'Villes et communautés durables', '#FD9D24'),
  (12, 'ODD12', 'Consommation et production responsables', '#BF8B2E'),
  (13, 'ODD13', 'Mesures relatives au climat', '#3F7E44'),
  (14, 'ODD14', 'Vie aquatique', '#0A97D9'),
  (15, 'ODD15', 'Vie terrestre', '#56C02B'),
  (16, 'ODD16', 'Paix, justice et institutions efficaces', '#00689D'),
  (17, 'ODD17', 'Partenariats pour les objectifs', '#19486A')
ON CONFLICT (number) DO NOTHING;

-- 1.3 Table des politiques RSE
CREATE TABLE IF NOT EXISTS pev_policies (
  id SERIAL PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO pev_policies (code, name, category) VALUES
  ('RSE', 'Politique RSE', 'general'),
  ('RH', 'Politique RH', 'social'),
  ('SST', 'Politique Santé et Sécurité au Travail', 'social'),
  ('ENV', 'Politique environnementale', 'environnement'),
  ('QUALITE', 'Politique qualité', 'general'),
  ('ANTI_CORRUPTION', 'Politique anti-corruption', 'gouvernance'),
  ('ANTI_FRAUDE', 'Politique anti-fraude', 'gouvernance'),
  ('GENRE', 'Politique genre', 'social'),
  ('HARCELEMENT', 'Politique anti-harcèlement', 'social'),
  ('CONFIDENTIALITE', 'Politique de confidentialité', 'gouvernance'),
  ('ETHIQUE', 'Code de conduite et d''éthique', 'gouvernance')
ON CONFLICT (code) DO NOTHING;

-- 2. EXTENSION DE pev_companies
-- ============================================================

-- Ajouter les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN
  -- Colonne pour les activités principales détaillées
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'main_activities') THEN
    ALTER TABLE pev_companies ADD COLUMN main_activities TEXT;
  END IF;
  
  -- Colonne pour les activités simplifiées
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'activities_summary') THEN
    ALTER TABLE pev_companies ADD COLUMN activities_summary TEXT;
  END IF;
  
  -- Colonne pour le claim (réclamation de propriété)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'claimed_by') THEN
    ALTER TABLE pev_companies ADD COLUMN claimed_by UUID REFERENCES pev_profiles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'claimed_at') THEN
    ALTER TABLE pev_companies ADD COLUMN claimed_at TIMESTAMPTZ;
  END IF;
  
  -- ODD contribués (stocké en JSONB pour flexibilité)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'sdg_contributions') THEN
    ALTER TABLE pev_companies ADD COLUMN sdg_contributions JSONB DEFAULT '[]';
  END IF;
  
  -- Région (pour localisation plus précise)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'region') THEN
    ALTER TABLE pev_companies ADD COLUMN region VARCHAR(100);
  END IF;
  
  -- Coordonnées GPS pour affichage sur la carte
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'latitude') THEN
    ALTER TABLE pev_companies ADD COLUMN latitude DECIMAL(10, 8);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'longitude') THEN
    ALTER TABLE pev_companies ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
  
  -- Liste des politiques (RSE, RH, SST, etc.) - STATIQUE
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'policies_list') THEN
    ALTER TABLE pev_companies ADD COLUMN policies_list JSONB DEFAULT '[]';
  END IF;
  
  -- NOTE: Les données RH, émissions et déchets sont ÉVOLUTIVES par période
  -- Elles sont stockées dans les tables de déclarations:
  -- - pev_company_declaration_hr (effectifs, ratios CDI/CDD, achats locaux, etc.)
  -- - pev_company_declaration_emissions (scope 1, 2, 3 en tCO2e)
  -- - pev_company_declaration_waste (déchets solides, liquides, valorisation)
END $$;

-- 3. TABLE DES DÉCLARATIONS (pivot central)
-- ============================================================

CREATE TABLE IF NOT EXISTS pev_company_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id BIGINT NOT NULL REFERENCES pev_companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES pev_periods(id),
  
  -- Source et statut
  source VARCHAR(20) NOT NULL DEFAULT 'ADMIN' CHECK (source IN ('ADMIN', 'COMPANY')),
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'VALIDATED', 'REJECTED')),
  
  -- Dates et validation
  submitted_at TIMESTAMPTZ,
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES pev_profiles(id),
  
  -- Notes
  admin_notes TEXT,
  company_notes TEXT,
  
  -- Audit
  created_by UUID REFERENCES pev_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contrainte: une seule déclaration par entreprise par période
  UNIQUE(company_id, period_id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_declarations_company ON pev_company_declarations(company_id);
CREATE INDEX IF NOT EXISTS idx_declarations_period ON pev_company_declarations(period_id);
CREATE INDEX IF NOT EXISTS idx_declarations_status ON pev_company_declarations(status);

-- 4. DONNÉES RH PAR DÉCLARATION
-- ============================================================

CREATE TABLE IF NOT EXISTS pev_company_declaration_hr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL UNIQUE REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  
  -- Effectifs
  employee_count INTEGER,
  cdi_ratio DECIMAL(5,2),
  cdd_ratio DECIMAL(5,2),
  temporary_count INTEGER,
  temporary_ratio DECIMAL(5,2),
  contractor_count INTEGER,
  
  -- Achats et consommations
  local_purchases_ratio DECIMAL(5,2),
  local_purchases_amount DECIMAL(15,2),
  water_consumption_m3 DECIMAL(15,2),
  fuel_consumption_liters DECIMAL(15,2),
  electricity_kwh DECIMAL(15,2),
  solar_percentage DECIMAL(5,2),
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DONNÉES ÉMISSIONS PAR DÉCLARATION
-- ============================================================

CREATE TABLE IF NOT EXISTS pev_company_declaration_emissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL UNIQUE REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  
  -- Émissions en tCO2e
  total_emissions DECIMAL(15,2),
  scope1_emissions DECIMAL(15,2),
  scope2_emissions DECIMAL(15,2),
  scope3_emissions DECIMAL(15,2),
  
  -- Métadonnées
  unit VARCHAR(20) DEFAULT 'tCO2e',
  methodology TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DONNÉES DÉCHETS PAR DÉCLARATION
-- ============================================================

CREATE TABLE IF NOT EXISTS pev_company_declaration_waste (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL UNIQUE REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  
  -- Déchets solides
  solid_waste_value DECIMAL(15,2),
  solid_waste_unit VARCHAR(30),
  solid_waste_raw VARCHAR(100), -- Valeur brute originale
  
  -- Déchets liquides
  liquid_waste_value DECIMAL(15,2),
  liquid_waste_unit VARCHAR(30),
  liquid_waste_raw VARCHAR(100),
  
  -- Valorisation
  composted_value DECIMAL(15,2),
  composted_unit VARCHAR(30),
  valorization_initiatives TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PIVOT DÉCLARATION <-> ODD
-- ============================================================

CREATE TABLE IF NOT EXISTS pev_company_declaration_sdg (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  sdg_id INTEGER NOT NULL REFERENCES pev_sdg(id),
  contribution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(declaration_id, sdg_id)
);

-- 8. PIVOT DÉCLARATION <-> POLITIQUES
-- ============================================================

CREATE TABLE IF NOT EXISTS pev_company_declaration_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  policy_id INTEGER NOT NULL REFERENCES pev_policies(id),
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(declaration_id, policy_id)
);

-- 9. HISTORIQUE DES MODIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS pev_company_declaration_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES pev_profiles(id),
  changes JSONB NOT NULL,
  previous_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SYSTÈME DE CLAIMS (Réclamation d'entreprise)
-- ============================================================
-- Permet à un utilisateur de réclamer une entreprise créée par l'admin
-- L'admin modère et approuve/rejette la demande

CREATE TABLE IF NOT EXISTS pev_company_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Entreprise réclamée
  company_id BIGINT NOT NULL REFERENCES pev_companies(id) ON DELETE CASCADE,
  
  -- Utilisateur qui réclame
  user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
  
  -- Informations de la demande
  message TEXT, -- Message justificatif de l'utilisateur
  proof_documents JSONB DEFAULT '[]', -- URLs des documents justificatifs
  position_in_company VARCHAR(100), -- Poste occupé dans l'entreprise
  
  -- Statut de la demande
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  -- Modération
  reviewed_by UUID REFERENCES pev_profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  admin_notes TEXT, -- Notes internes de l'admin
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Un seul claim pending par utilisateur par entreprise
  UNIQUE(company_id, user_id, status)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_claims_company ON pev_company_claims(company_id);
CREATE INDEX IF NOT EXISTS idx_claims_user ON pev_company_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON pev_company_claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_pending ON pev_company_claims(status) WHERE status = 'pending';

-- 10. RLS POLICIES
-- ============================================================

-- Activer RLS sur les tables
ALTER TABLE pev_company_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_company_declaration_hr ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_company_declaration_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pev_company_declaration_waste ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut lire les déclarations validées
DROP POLICY IF EXISTS "Public can read validated declarations" ON pev_company_declarations;
CREATE POLICY "Public can read validated declarations" 
ON pev_company_declarations FOR SELECT 
USING (status = 'VALIDATED');

-- Policy: Admins peuvent tout faire
DROP POLICY IF EXISTS "Admins full access on declarations" ON pev_company_declarations;
CREATE POLICY "Admins full access on declarations" 
ON pev_company_declarations FOR ALL 
TO authenticated
USING (
  EXISTS (SELECT 1 FROM pev_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Policy: Propriétaires peuvent gérer leurs déclarations
DROP POLICY IF EXISTS "Owners can manage own declarations" ON pev_company_declarations;
CREATE POLICY "Owners can manage own declarations" 
ON pev_company_declarations FOR ALL 
TO authenticated
USING (
  company_id IN (
    SELECT id FROM pev_companies WHERE owner_id = auth.uid() OR claimed_by = auth.uid()
  )
);

-- Policies similaires pour les tables liées
DROP POLICY IF EXISTS "Public can read validated hr" ON pev_company_declaration_hr;
CREATE POLICY "Public can read validated hr" 
ON pev_company_declaration_hr FOR SELECT 
USING (
  declaration_id IN (SELECT id FROM pev_company_declarations WHERE status = 'VALIDATED')
);

DROP POLICY IF EXISTS "Public can read validated emissions" ON pev_company_declaration_emissions;
CREATE POLICY "Public can read validated emissions" 
ON pev_company_declaration_emissions FOR SELECT 
USING (
  declaration_id IN (SELECT id FROM pev_company_declarations WHERE status = 'VALIDATED')
);

DROP POLICY IF EXISTS "Public can read validated waste" ON pev_company_declaration_waste;
CREATE POLICY "Public can read validated waste" 
ON pev_company_declaration_waste FOR SELECT 
USING (
  declaration_id IN (SELECT id FROM pev_company_declarations WHERE status = 'VALIDATED')
);

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================
