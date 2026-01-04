-- =====================================================
-- MIGRATION: FONCTIONNALITÉS SOCIALES ET PREMIUM
-- Date: 04/01/2026
-- Description: Ajout des tables pour la gestion des réseaux sociaux
-- et des colonnes pour la gestion Premium des opportunités.
-- =====================================================

-- 1. Mettre à jour la table pev_opportunities pour le Premium
-- Ajout des colonnes manquantes si elles n'existent pas
ALTER TABLE public.pev_opportunities 
ADD COLUMN IF NOT EXISTS promote_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS auto_share_social BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS social_links JSONB,
ADD COLUMN IF NOT EXISTS premium_starts_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS premium_ends_at TIMESTAMPTZ;

-- Index pour requêtes rapides sur les opportunités premium actives
CREATE INDEX IF NOT EXISTS idx_opportunities_premium_active 
ON public.pev_opportunities(promote_premium, premium_starts_at, premium_ends_at);

-- 2. Créer la table des comptes réseaux sociaux (Admin)
CREATE TABLE IF NOT EXISTS public.pev_social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram')),
    name VARCHAR(100) NOT NULL,
    credentials JSONB, -- Pour stocker tokens/clés API (à sécuriser)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- RLS pour pev_social_accounts (Seuls les admins peuvent gérer)
ALTER TABLE public.pev_social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage social accounts"
ON public.pev_social_accounts
USING (
  EXISTS (
    SELECT 1 FROM public.pev_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- 3. Créer la table d'historique des publications sociales
CREATE TABLE IF NOT EXISTS public.pev_social_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id BIGINT REFERENCES public.pev_opportunities(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.pev_social_accounts(id) ON DELETE SET NULL,
    platform VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed', 'skipped')),
    external_post_id VARCHAR(255),
    error_message TEXT,
    posted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    retry_count INTEGER DEFAULT 0
);

-- Index pour l'historique
CREATE INDEX IF NOT EXISTS idx_social_posts_opportunity ON public.pev_social_posts(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON public.pev_social_posts(status);

-- RLS pour pev_social_posts
ALTER TABLE public.pev_social_posts ENABLE ROW LEVEL SECURITY;

-- Les admins voient tout
CREATE POLICY "Admins can view all social posts"
ON public.pev_social_posts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.pev_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Les créateurs voient les posts de leurs opportunités
CREATE POLICY "Creators can view social posts for their opportunities"
ON public.pev_social_posts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.pev_opportunities
    WHERE id = pev_social_posts.opportunity_id AND created_by = auth.uid()
  )
);

-- Trigger updated_at pour social_accounts
DROP TRIGGER IF EXISTS update_pev_social_accounts_updated_at ON public.pev_social_accounts;
CREATE TRIGGER update_pev_social_accounts_updated_at
    BEFORE UPDATE ON public.pev_social_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); -- Assurez-vous que cette fonction existe (créée précédemment)

-- =====================================================
-- FIN MIGRATION
-- =====================================================
