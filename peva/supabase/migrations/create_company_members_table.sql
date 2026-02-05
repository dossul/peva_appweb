-- =====================================================
-- Migration: Création de la table pev_company_members
-- Date: 2026-01-10
-- Description: Gestion des membres d'entreprise pour éviter
--              les duplications et permettre plusieurs utilisateurs
--              par entreprise
-- =====================================================

-- 1. Créer la table pev_company_members
CREATE TABLE IF NOT EXISTS pev_company_members (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES pev_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  position VARCHAR(255),
  department VARCHAR(255),
  can_manage_company BOOLEAN DEFAULT false,
  can_create_opportunities BOOLEAN DEFAULT true,
  can_create_events BOOLEAN DEFAULT true,
  can_manage_rse BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte d'unicité: un utilisateur ne peut être membre qu'une fois par entreprise
  CONSTRAINT unique_company_member UNIQUE(company_id, user_id),
  
  -- Contrainte sur les rôles valides
  CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'manager', 'member')),
  
  -- Contrainte sur les statuts valides
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'))
);

-- 2. Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_company_members_company_id ON pev_company_members(company_id);
CREATE INDEX IF NOT EXISTS idx_company_members_user_id ON pev_company_members(user_id);
CREATE INDEX IF NOT EXISTS idx_company_members_status ON pev_company_members(status);
CREATE INDEX IF NOT EXISTS idx_company_members_role ON pev_company_members(role);

-- 3. Ajouter contrainte UNIQUE sur le slug des entreprises
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_company_slug'
  ) THEN
    ALTER TABLE pev_companies ADD CONSTRAINT unique_company_slug UNIQUE(slug);
  END IF;
END $$;

-- 4. Créer index pour recherche de noms similaires (fuzzy matching)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_companies_name_trgm ON pev_companies USING gin(name gin_trgm_ops);

-- 5. Fonction pour vérifier si un nom d'entreprise existe déjà (recherche similaire)
CREATE OR REPLACE FUNCTION check_similar_company_name(
  p_name TEXT,
  p_threshold FLOAT DEFAULT 0.6
)
RETURNS TABLE(
  id BIGINT,
  name TEXT,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    similarity(lower(c.name), lower(p_name)) as sim
  FROM pev_companies c
  WHERE similarity(lower(c.name), lower(p_name)) >= p_threshold
  ORDER BY sim DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 6. Fonction pour générer un slug unique
CREATE OR REPLACE FUNCTION generate_unique_company_slug(p_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Générer le slug de base
  base_slug := lower(
    regexp_replace(
      regexp_replace(
        unaccent(p_name),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
  
  -- Nettoyer les tirets multiples
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Vérifier l'unicité et ajouter un suffixe si nécessaire
  WHILE EXISTS (SELECT 1 FROM pev_companies WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger pour auto-générer le slug si absent
CREATE OR REPLACE FUNCTION auto_generate_company_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_unique_company_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_company_slug ON pev_companies;
CREATE TRIGGER trigger_auto_company_slug
  BEFORE INSERT ON pev_companies
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_company_slug();

-- 8. Trigger pour créer automatiquement le owner comme membre
CREATE OR REPLACE FUNCTION auto_create_owner_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer le propriétaire comme membre avec le rôle 'owner'
  INSERT INTO pev_company_members (
    company_id, 
    user_id, 
    role, 
    status, 
    can_manage_company, 
    can_create_opportunities, 
    can_create_events, 
    can_manage_rse,
    approved_at
  )
  VALUES (
    NEW.id, 
    NEW.owner_id, 
    'owner', 
    'approved', 
    true, 
    true, 
    true, 
    true,
    NOW()
  )
  ON CONFLICT (company_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_owner_member ON pev_companies;
CREATE TRIGGER trigger_auto_owner_member
  AFTER INSERT ON pev_companies
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_owner_member();

-- 9. Migrer les propriétaires existants vers pev_company_members
INSERT INTO pev_company_members (company_id, user_id, role, status, can_manage_company, can_create_opportunities, can_create_events, can_manage_rse, approved_at)
SELECT 
  id as company_id,
  owner_id as user_id,
  'owner' as role,
  'approved' as status,
  true as can_manage_company,
  true as can_create_opportunities,
  true as can_create_events,
  true as can_manage_rse,
  created_at as approved_at
FROM pev_companies
WHERE owner_id IS NOT NULL
ON CONFLICT (company_id, user_id) DO NOTHING;

-- 10. Policies RLS pour pev_company_members
ALTER TABLE pev_company_members ENABLE ROW LEVEL SECURITY;

-- Lecture: membres de ses propres entreprises ou admin
CREATE POLICY "Users can view members of their companies"
  ON pev_company_members FOR SELECT
  USING (
    user_id = auth.uid() 
    OR company_id IN (
      SELECT company_id FROM pev_company_members 
      WHERE user_id = auth.uid() AND status = 'approved'
    )
    OR EXISTS (
      SELECT 1 FROM pev_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Insertion: propriétaires et admins de l'entreprise peuvent inviter
CREATE POLICY "Company owners/admins can invite members"
  ON pev_company_members FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM pev_company_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin') 
      AND status = 'approved'
    )
    OR EXISTS (
      SELECT 1 FROM pev_companies 
      WHERE id = company_id AND owner_id = auth.uid()
    )
  );

-- Mise à jour: propriétaires et admins peuvent modifier
CREATE POLICY "Company owners/admins can update members"
  ON pev_company_members FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM pev_company_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin') 
      AND status = 'approved'
    )
  );

-- Suppression: propriétaires peuvent supprimer des membres
CREATE POLICY "Company owners can delete members"
  ON pev_company_members FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM pev_company_members 
      WHERE user_id = auth.uid() 
      AND role = 'owner' 
      AND status = 'approved'
    )
    OR user_id = auth.uid()
  );

-- 11. Table pour les demandes d'adhésion à une entreprise
CREATE TABLE IF NOT EXISTS pev_company_join_requests (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES pev_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_join_request UNIQUE(company_id, user_id),
  CONSTRAINT valid_join_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_join_requests_company ON pev_company_join_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_user ON pev_company_join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON pev_company_join_requests(status);

-- RLS pour les demandes d'adhésion
ALTER TABLE pev_company_join_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own join requests"
  ON pev_company_join_requests FOR SELECT
  USING (
    user_id = auth.uid()
    OR company_id IN (
      SELECT company_id FROM pev_company_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin') 
      AND status = 'approved'
    )
  );

CREATE POLICY "Users can create join requests"
  ON pev_company_join_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Company admins can update join requests"
  ON pev_company_join_requests FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM pev_company_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin') 
      AND status = 'approved'
    )
  );

-- 12. Fonction pour approuver une demande d'adhésion
CREATE OR REPLACE FUNCTION approve_join_request(
  p_request_id BIGINT,
  p_role VARCHAR DEFAULT 'member'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_request RECORD;
BEGIN
  -- Récupérer la demande
  SELECT * INTO v_request 
  FROM pev_company_join_requests 
  WHERE id = p_request_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Créer le membre
  INSERT INTO pev_company_members (company_id, user_id, role, status, approved_by, approved_at)
  VALUES (v_request.company_id, v_request.user_id, p_role, 'approved', auth.uid(), NOW())
  ON CONFLICT (company_id, user_id) DO UPDATE SET
    status = 'approved',
    approved_by = auth.uid(),
    approved_at = NOW();
  
  -- Mettre à jour la demande
  UPDATE pev_company_join_requests
  SET status = 'approved', reviewed_by = auth.uid(), reviewed_at = NOW()
  WHERE id = p_request_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Commentaires pour documentation
COMMENT ON TABLE pev_company_members IS 'Membres des entreprises - permet plusieurs utilisateurs par entreprise';
COMMENT ON TABLE pev_company_join_requests IS 'Demandes d''adhésion aux entreprises';
COMMENT ON FUNCTION check_similar_company_name IS 'Recherche d''entreprises avec des noms similaires pour éviter les duplications';
COMMENT ON FUNCTION generate_unique_company_slug IS 'Génère un slug unique pour une entreprise';
COMMENT ON FUNCTION approve_join_request IS 'Approuve une demande d''adhésion et crée le membre';
