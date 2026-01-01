-- ==========================================
-- PEVA - SCRIPT COMPLET DE CRÉATION
-- BASE DE DONNÉES COMPLÈTE
-- ==========================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS
DO $$ BEGIN CREATE TYPE user_role_global AS ENUM ('user', 'moderator', 'admin', 'super_admin'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE company_role AS ENUM ('admin', 'editor', 'contributor', 'viewer'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE opportunity_type AS ENUM ('job', 'internship', 'contract', 'funding', 'partnership', 'tender'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE content_status AS ENUM ('draft', 'in_review', 'published', 'archived', 'rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'declined', 'blocked'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE event_type AS ENUM ('conference', 'workshop', 'webinar', 'networking', 'competition'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE group_type AS ENUM ('public', 'private'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE group_member_role AS ENUM ('member', 'moderator', 'owner'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- TABLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL CHECK (char_length(first_name) > 0),
    last_name TEXT NOT NULL CHECK (char_length(last_name) > 0),
    display_name TEXT,
    user_type TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    country TEXT,
    sectors JSONB,
    website TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    role user_role_global DEFAULT 'user' NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.connections (
    id BIGSERIAL PRIMARY KEY,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status connection_status DEFAULT 'pending' NOT NULL,
    message TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    responded_at TIMESTAMPTZ,
    CHECK (requester_id <> addressee_id),
    UNIQUE(requester_id, addressee_id)
);

CREATE TABLE IF NOT EXISTS public.companies (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    mission TEXT,
    industry TEXT,
    size TEXT,
    founded_year INTEGER,
    headquarters TEXT,
    country TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    website TEXT,
    email TEXT,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    status content_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.company_members (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role company_role NOT NULL,
    title TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(company_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.opportunities (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS public.opportunity_applications (
    id BIGSERIAL PRIMARY KEY,
    opportunity_id BIGINT NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    attachments JSONB,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(opportunity_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.events (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type event_type NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    location TEXT,
    is_online BOOLEAN DEFAULT FALSE NOT NULL,
    capacity INTEGER,
    registration_url TEXT,
    cover_image_url TEXT,
    status content_status DEFAULT 'published' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.projects (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_id BIGINT REFERENCES public.companies(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    summary TEXT,
    description TEXT,
    sector TEXT,
    country TEXT,
    stage TEXT,
    attachments JSONB,
    status content_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.resources (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    language TEXT DEFAULT 'fr' NOT NULL,
    source TEXT,
    media_url TEXT,
    tags JSONB,
    status content_status DEFAULT 'published' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.message_threads (
    id BIGSERIAL PRIMARY KEY,
    topic TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.message_thread_participants (
    thread_id BIGINT NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id BIGSERIAL PRIMARY KEY,
    thread_id BIGINT NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.message_read_status (
    message_id BIGINT NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (message_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.forum_categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.forum_topics (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    replies_count INTEGER DEFAULT 0 NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_reply_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.forum_posts (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.groups (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type group_type DEFAULT 'public' NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.group_members (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role group_member_role DEFAULT 'member' NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    related_entity TEXT,
    related_id TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT,
    target_id TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_opportunities_created_by ON public.opportunities(created_by);
CREATE INDEX IF NOT EXISTS idx_opportunities_company_id ON public.opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON public.opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_moderation_status ON public.opportunities(moderation_status);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities(created_at DESC);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- FONCTION
CREATE OR REPLACE FUNCTION is_company_member(p_company_id BIGINT, p_user_id UUID, p_roles company_role[])
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_members
    WHERE company_id = p_company_id AND user_id = p_user_id AND role = ANY(p_roles)
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Nouveau'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Utilisateur'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- POLICIES
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir tous les profils" ON public.profiles;
CREATE POLICY "Les utilisateurs peuvent voir tous les profils" ON public.profiles FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles FOR UPDATE TO public USING (id = auth.uid());

DROP POLICY IF EXISTS "Tout le monde peut voir les entreprises publiées" ON public.companies;
CREATE POLICY "Tout le monde peut voir les entreprises publiées" ON public.companies FOR SELECT TO public USING (status = 'published'::content_status);

DROP POLICY IF EXISTS "Les membres 'admin' ou 'editor' peuvent voir les brouillons" ON public.companies;
CREATE POLICY "Les membres 'admin' ou 'editor' peuvent voir les brouillons" ON public.companies FOR SELECT TO public USING (is_company_member(id, auth.uid(), ARRAY['admin'::company_role, 'editor'::company_role]));

DROP POLICY IF EXISTS "Les membres 'admin' ou 'editor' peuvent mettre à jour l'entrep" ON public.companies;
CREATE POLICY "Les membres 'admin' ou 'editor' peuvent mettre à jour l'entrep" ON public.companies FOR UPDATE TO public USING (is_company_member(id, auth.uid(), ARRAY['admin'::company_role, 'editor'::company_role]));

DROP POLICY IF EXISTS "Seuls les admins de l'entreprise peuvent la supprimer" ON public.companies;
CREATE POLICY "Seuls les admins de l'entreprise peuvent la supprimer" ON public.companies FOR DELETE TO public USING (is_company_member(id, auth.uid(), ARRAY['admin'::company_role]));

DROP POLICY IF EXISTS "Les utilisateurs peuvent accéder à leurs propres messages" ON public.messages;
CREATE POLICY "Les utilisateurs peuvent accéder à leurs propres messages" ON public.messages FOR ALL TO public USING (
  thread_id IN (SELECT thread_id FROM public.message_thread_participants WHERE user_id = auth.uid())
);

-- POLICIES OPPORTUNITIES
DROP POLICY IF EXISTS "Les opportunités publiées sont visibles par tous" ON public.opportunities;
CREATE POLICY "Les opportunités publiées sont visibles par tous"
ON public.opportunities FOR SELECT
USING (
    status = 'published' AND 
    moderation_status = 'approved'
);

DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent créer des opportunités" ON public.opportunities;
CREATE POLICY "Les utilisateurs authentifiés peuvent créer des opportunités"
ON public.opportunities FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Les créateurs peuvent modifier leurs opportunités" ON public.opportunities;
CREATE POLICY "Les créateurs peuvent modifier leurs opportunités"
ON public.opportunities FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Les créateurs peuvent supprimer leurs opportunités" ON public.opportunities;
CREATE POLICY "Les créateurs peuvent supprimer leurs opportunités"
ON public.opportunities FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- POLICIES OPPORTUNITY_APPLICATIONS
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leurs candidatures" ON public.opportunity_applications;
CREATE POLICY "Les utilisateurs peuvent voir leurs candidatures"
ON public.opportunity_applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent créer des candidatures" ON public.opportunity_applications;
CREATE POLICY "Les utilisateurs peuvent créer des candidatures"
ON public.opportunity_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('peva-public', 'peva-public', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('peva-private', 'peva-private', FALSE) ON CONFLICT (id) DO NOTHING;

-- STORAGE FOLDERS
INSERT INTO storage.objects (bucket_id, name, owner, metadata) VALUES
    ('peva-public', 'avatars/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-public', 'company_logos/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-public', 'event_covers/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-public', 'resource_thumbnails/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-private', 'opportunity_applications/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-private', 'company_reports/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-private', 'user_documents/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}')
ON CONFLICT (bucket_id, name) DO NOTHING;

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Allow authenticated users to upload to public bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload to public bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'peva-public');

DROP POLICY IF EXISTS "Allow users to UPDATE their own public files" ON storage.objects;
CREATE POLICY "Allow users to UPDATE their own public files" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'peva-public' AND ((name LIKE 'avatars/%' AND auth.uid() = (regexp_replace(split_part(name, '/', 2), '\..*$', ''))::uuid) OR (name LIKE 'company_logos/%' AND is_company_member((regexp_replace(split_part(name, '/', 2), '\..*$', ''))::bigint, auth.uid(), ARRAY['admin', 'editor']::company_role[]))));

DROP POLICY IF EXISTS "Allow users to DELETE their own public files" ON storage.objects;
CREATE POLICY "Allow users to DELETE their own public files" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'peva-public' AND ((name LIKE 'avatars/%' AND auth.uid() = (regexp_replace(split_part(name, '/', 2), '\..*$', ''))::uuid) OR (name LIKE 'company_logos/%' AND is_company_member((regexp_replace(split_part(name, '/', 2), '\..*$', ''))::bigint, auth.uid(), ARRAY['admin', 'editor']::company_role[]))));

DROP POLICY IF EXISTS "Allow users to upload their own application files" ON storage.objects;
CREATE POLICY "Allow users to upload their own application files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'peva-private' AND auth.uid() = (string_to_array(name, '/'))[3]::uuid);

DROP POLICY IF EXISTS "Allow users to read their own application files" ON storage.objects;
CREATE POLICY "Allow users to read their own application files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'peva-private' AND auth.uid() = (string_to_array(name, '/'))[3]::uuid);

DROP POLICY IF EXISTS "Allow opportunity owner to read submitted applications" ON storage.objects;
CREATE POLICY "Allow opportunity owner to read submitted applications" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'peva-private' AND name LIKE 'opportunity_applications/%' AND auth.uid() = (SELECT created_by FROM public.opportunities WHERE id = ((string_to_array(name, '/'))[2])::bigint));

DROP POLICY IF EXISTS "Allow company admins to upload reports" ON storage.objects;
CREATE POLICY "Allow company admins to upload reports" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'peva-private' AND name LIKE 'company_reports/%' AND (SELECT is_company_member(((string_to_array(name, '/'))[2])::bigint, auth.uid(), ARRAY['admin', 'editor']::company_role[])));

DROP POLICY IF EXISTS "Allow company members to read reports" ON storage.objects;
CREATE POLICY "Allow company members to read reports" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'peva-private' AND name LIKE 'company_reports/%' AND (SELECT is_company_member(((string_to_array(name, '/'))[2])::bigint, auth.uid(), ARRAY['admin', 'editor', 'contributor', 'viewer']::company_role[])));

-- FIN DU SCRIPT
