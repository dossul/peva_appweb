-- ==========================================
-- CRÉATION DE LA TABLE OPPORTUNITIES
-- ==========================================

-- 1. Créer les ENUMs nécessaires (si pas déjà créés)
DO $$ BEGIN 
    CREATE TYPE opportunity_type AS ENUM (
        'job', 
        'internship', 
        'contract', 
        'funding', 
        'partnership', 
        'tender'
    ); 
EXCEPTION 
    WHEN duplicate_object THEN null; 
END $$;

DO $$ BEGIN 
    CREATE TYPE content_status AS ENUM (
        'draft', 
        'in_review', 
        'published', 
        'archived', 
        'rejected'
    ); 
EXCEPTION 
    WHEN duplicate_object THEN null; 
END $$;

-- 2. Créer la table opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id BIGINT REFERENCES public.companies(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type opportunity_type NOT NULL,
    category TEXT,
    location TEXT,
    country TEXT,
    countries JSONB,
    is_multi_country BOOLEAN DEFAULT FALSE,
    is_remote BOOLEAN DEFAULT FALSE NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'XOF',
    requirements TEXT,
    deadline DATE,
    status content_status DEFAULT 'draft' NOT NULL,
    moderation_status TEXT DEFAULT 'pending',
    visibility TEXT DEFAULT 'public',
    promote_premium BOOLEAN DEFAULT FALSE,
    send_notifications BOOLEAN DEFAULT TRUE,
    auto_share_social BOOLEAN DEFAULT FALSE,
    social_links JSONB,
    attachments JSONB,
    views_count INTEGER DEFAULT 0 NOT NULL,
    applications_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_opportunities_created_by ON public.opportunities(created_by);
CREATE INDEX IF NOT EXISTS idx_opportunities_company_id ON public.opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON public.opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_moderation_status ON public.opportunities(moderation_status);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities(created_at DESC);

-- 4. Activer RLS (Row Level Security)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- 5. Créer les policies RLS
-- Policy: Tout le monde peut voir les opportunités publiées et approuvées
CREATE POLICY "Les opportunités publiées sont visibles par tous"
ON public.opportunities FOR SELECT
USING (
    status = 'published' AND 
    moderation_status = 'approved'
);

-- Policy: Les utilisateurs authentifiés peuvent créer des opportunités
CREATE POLICY "Les utilisateurs authentifiés peuvent créer des opportunités"
ON public.opportunities FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Policy: Les créateurs peuvent modifier leurs propres opportunités
CREATE POLICY "Les créateurs peuvent modifier leurs opportunités"
ON public.opportunities FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Policy: Les créateurs peuvent supprimer leurs propres opportunités
CREATE POLICY "Les créateurs peuvent supprimer leurs opportunités"
ON public.opportunities FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- 6. Créer la table des candidatures (opportunity_applications)
CREATE TABLE IF NOT EXISTS public.opportunity_applications (
    id BIGSERIAL PRIMARY KEY,
    opportunity_id BIGINT NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    attachments JSONB,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(opportunity_id, user_id)
);

-- Index pour opportunity_applications
CREATE INDEX IF NOT EXISTS idx_opportunity_applications_opportunity_id ON public.opportunity_applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_applications_user_id ON public.opportunity_applications(user_id);

-- RLS pour opportunity_applications
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leurs candidatures"
ON public.opportunity_applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer des candidatures"
ON public.opportunity_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 7. Créer la fonction de mise à jour automatique du updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Créer le trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- FIN DU SCRIPT
