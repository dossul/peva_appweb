-- Migration: Ajouter tous les champs manquants pour pev_opportunities
-- Date: 2026-01-04
-- Description: Ajoute les colonnes pour stocker TOUS les champs du formulaire de création d'opportunité

ALTER TABLE public.pev_opportunities 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS budget_salary TEXT,
ADD COLUMN IF NOT EXISTS required_skills JSONB,
ADD COLUMN IF NOT EXISTS organization TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS funding_amount NUMERIC,
ADD COLUMN IF NOT EXISTS funding_type TEXT,
ADD COLUMN IF NOT EXISTS equity_percentage NUMERIC,
ADD COLUMN IF NOT EXISTS stage TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS contract_type TEXT,
ADD COLUMN IF NOT EXISTS partnership_type TEXT,
ADD COLUMN IF NOT EXISTS duration TEXT,
ADD COLUMN IF NOT EXISTS partnership_benefits TEXT,
ADD COLUMN IF NOT EXISTS mission_duration TEXT,
ADD COLUMN IF NOT EXISTS daily_rate NUMERIC,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS send_notifications BOOLEAN DEFAULT TRUE;

-- Commentaires pour documentation
COMMENT ON COLUMN public.pev_opportunities.detailed_description IS 'Description complète détaillée';
COMMENT ON COLUMN public.pev_opportunities.budget_salary IS 'Budget ou salaire en texte libre';
COMMENT ON COLUMN public.pev_opportunities.required_skills IS 'Compétences requises (tableau JSON)';
COMMENT ON COLUMN public.pev_opportunities.organization IS 'Nom de l organisation';
COMMENT ON COLUMN public.pev_opportunities.contact_email IS 'Email de contact';
COMMENT ON COLUMN public.pev_opportunities.contact_phone IS 'Téléphone de contact';
COMMENT ON COLUMN public.pev_opportunities.funding_amount IS 'Montant du financement';
COMMENT ON COLUMN public.pev_opportunities.funding_type IS 'Type de financement';
COMMENT ON COLUMN public.pev_opportunities.equity_percentage IS 'Pourcentage équité';
COMMENT ON COLUMN public.pev_opportunities.stage IS 'Stade de développement';
COMMENT ON COLUMN public.pev_opportunities.job_title IS 'Intitulé du poste';
COMMENT ON COLUMN public.pev_opportunities.contract_type IS 'Type de contrat';
COMMENT ON COLUMN public.pev_opportunities.partnership_type IS 'Type de partenariat';
COMMENT ON COLUMN public.pev_opportunities.duration IS 'Durée prévue';
COMMENT ON COLUMN public.pev_opportunities.partnership_benefits IS 'Bénéfices du partenariat';
COMMENT ON COLUMN public.pev_opportunities.mission_duration IS 'Durée de la mission';
COMMENT ON COLUMN public.pev_opportunities.daily_rate IS 'Tarif journalier';
COMMENT ON COLUMN public.pev_opportunities.start_date IS 'Date de début';
COMMENT ON COLUMN public.pev_opportunities.visibility IS 'Visibilité (public/private)';
COMMENT ON COLUMN public.pev_opportunities.send_notifications IS 'Envoyer des notifications';
