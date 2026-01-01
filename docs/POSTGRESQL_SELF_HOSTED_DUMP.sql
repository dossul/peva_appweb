-- ==========================================
-- 2iE GREENHUB - POSTGRESQL SELF-HOSTED
-- Migration depuis Supabase vers PostgreSQL
-- Tables préfixées: pev_
-- Date: 2026-01-01
-- ==========================================

-- ==========================================
-- 1. EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 2. TYPES ENUM
-- ==========================================
DO $$ BEGIN CREATE TYPE pev_user_role_global AS ENUM ('user', 'moderator', 'admin', 'super_admin'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE pev_company_role AS ENUM ('admin', 'editor', 'contributor', 'viewer'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE pev_opportunity_type AS ENUM ('job', 'internship', 'contract', 'funding', 'partnership', 'tender', 'call_for_projects', 'thesis', 'fundraising', 'equipment_sale', 'business_idea'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE pev_content_status AS ENUM ('draft', 'in_review', 'published', 'archived', 'rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE pev_connection_status AS ENUM ('pending', 'accepted', 'declined', 'blocked'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE pev_event_type AS ENUM ('conference', 'workshop', 'webinar', 'networking', 'competition'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE pev_group_type AS ENUM ('public', 'private'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE pev_group_member_role AS ENUM ('member', 'moderator', 'owner'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==========================================
-- 3. TABLES PRINCIPALES
-- ==========================================

-- TABLE: pev_users (Remplace auth.users de Supabase)
CREATE TABLE IF NOT EXISTS pev_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    encrypted_password TEXT NOT NULL,
    email_confirmed_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    raw_user_meta_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_users_email ON pev_users(email);

-- TABLE: pev_profiles
CREATE TABLE IF NOT EXISTS pev_profiles (
    id UUID PRIMARY KEY REFERENCES pev_users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL CHECK (char_length(first_name) > 0),
    last_name TEXT NOT NULL CHECK (char_length(last_name) > 0),
    display_name TEXT,
    user_type TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    sectors JSONB,
    preferences JSONB DEFAULT '{}'::jsonb,
    website TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    role pev_user_role_global DEFAULT 'user' NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_profiles_email ON pev_profiles(email);
CREATE INDEX idx_pev_profiles_role ON pev_profiles(role);
CREATE INDEX idx_pev_profiles_country ON pev_profiles(country);

-- TABLE: pev_connections
CREATE TABLE IF NOT EXISTS pev_connections (
    id BIGSERIAL PRIMARY KEY,
    requester_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    status pev_connection_status DEFAULT 'pending' NOT NULL,
    message TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    responded_at TIMESTAMPTZ,
    CHECK (requester_id <> addressee_id),
    UNIQUE(requester_id, addressee_id)
);

CREATE INDEX idx_pev_connections_requester ON pev_connections(requester_id);
CREATE INDEX idx_pev_connections_addressee ON pev_connections(addressee_id);
CREATE INDEX idx_pev_connections_status ON pev_connections(status);

-- TABLE: pev_companies
CREATE TABLE IF NOT EXISTS pev_companies (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID REFERENCES pev_profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    mission TEXT,
    industry TEXT,
    sector TEXT,
    size TEXT,
    employees INTEGER,
    founded_year INTEGER,
    headquarters TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    website TEXT,
    email TEXT,
    phone TEXT,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    status pev_content_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_companies_owner ON pev_companies(owner_id);
CREATE INDEX idx_pev_companies_slug ON pev_companies(slug);
CREATE INDEX idx_pev_companies_country ON pev_companies(country);
CREATE INDEX idx_pev_companies_sector ON pev_companies(sector);
CREATE INDEX idx_pev_companies_status ON pev_companies(status);

-- TABLE: pev_company_members
CREATE TABLE IF NOT EXISTS pev_company_members (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES pev_companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    role pev_company_role NOT NULL,
    title TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(company_id, user_id)
);

CREATE INDEX idx_pev_company_members_company ON pev_company_members(company_id);
CREATE INDEX idx_pev_company_members_user ON pev_company_members(user_id);

-- TABLE: pev_opportunities
CREATE TABLE IF NOT EXISTS pev_opportunities (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    company_id BIGINT REFERENCES pev_companies(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type pev_opportunity_type NOT NULL,
    category TEXT,
    location TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    is_remote BOOLEAN DEFAULT FALSE NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'XOF',
    requirements TEXT,
    deadline DATE,
    status pev_content_status DEFAULT 'draft' NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    applications_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_opportunities_creator ON pev_opportunities(created_by);
CREATE INDEX idx_pev_opportunities_company ON pev_opportunities(company_id);
CREATE INDEX idx_pev_opportunities_type ON pev_opportunities(type);
CREATE INDEX idx_pev_opportunities_status ON pev_opportunities(status);
CREATE INDEX idx_pev_opportunities_deadline ON pev_opportunities(deadline);

-- TABLE: pev_opportunity_applications
CREATE TABLE IF NOT EXISTS pev_opportunity_applications (
    id BIGSERIAL PRIMARY KEY,
    opportunity_id BIGINT NOT NULL REFERENCES pev_opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    attachments JSONB,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(opportunity_id, user_id)
);

CREATE INDEX idx_pev_opportunity_applications_opp ON pev_opportunity_applications(opportunity_id);
CREATE INDEX idx_pev_opportunity_applications_user ON pev_opportunity_applications(user_id);

-- TABLE: pev_events
CREATE TABLE IF NOT EXISTS pev_events (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type pev_event_type NOT NULL,
    sector TEXT,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    location TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    is_online BOOLEAN DEFAULT FALSE NOT NULL,
    capacity INTEGER,
    registration_url TEXT,
    cover_image_url TEXT,
    status pev_content_status DEFAULT 'published' NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    registrations_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_events_creator ON pev_events(created_by);
CREATE INDEX idx_pev_events_type ON pev_events(type);
CREATE INDEX idx_pev_events_sector ON pev_events(sector);
CREATE INDEX idx_pev_events_start_at ON pev_events(start_at);
CREATE INDEX idx_pev_events_status ON pev_events(status);

-- TABLE: pev_event_registrations
CREATE TABLE IF NOT EXISTS pev_event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES pev_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    attended BOOLEAN DEFAULT FALSE,
    UNIQUE(event_id, user_id)
);

CREATE INDEX idx_pev_event_registrations_event ON pev_event_registrations(event_id);
CREATE INDEX idx_pev_event_registrations_user ON pev_event_registrations(user_id);

-- TABLE: pev_projects
CREATE TABLE IF NOT EXISTS pev_projects (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    company_id BIGINT REFERENCES pev_companies(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    summary TEXT,
    description TEXT,
    sector TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    stage TEXT,
    funding_goal INTEGER,
    funding_raised INTEGER DEFAULT 0,
    attachments JSONB,
    status pev_content_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_projects_owner ON pev_projects(owner_id);
CREATE INDEX idx_pev_projects_company ON pev_projects(company_id);
CREATE INDEX idx_pev_projects_sector ON pev_projects(sector);
CREATE INDEX idx_pev_projects_status ON pev_projects(status);

-- TABLE: pev_resources
CREATE TABLE IF NOT EXISTS pev_resources (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    language TEXT DEFAULT 'fr' NOT NULL,
    source TEXT,
    media_url TEXT,
    media_type TEXT,
    file_size BIGINT,
    tags JSONB,
    sectors JSONB,
    downloads_count INTEGER DEFAULT 0 NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    status pev_content_status DEFAULT 'published' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_resources_creator ON pev_resources(created_by);
CREATE INDEX idx_pev_resources_type ON pev_resources(type);
CREATE INDEX idx_pev_resources_status ON pev_resources(status);

-- TABLE: pev_message_threads
CREATE TABLE IF NOT EXISTS pev_message_threads (
    id BIGSERIAL PRIMARY KEY,
    topic TEXT,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TABLE: pev_message_thread_participants
CREATE TABLE IF NOT EXISTS pev_message_thread_participants (
    thread_id BIGINT NOT NULL REFERENCES pev_message_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (thread_id, user_id)
);

CREATE INDEX idx_pev_thread_participants_user ON pev_message_thread_participants(user_id);

-- TABLE: pev_messages
CREATE TABLE IF NOT EXISTS pev_messages (
    id BIGSERIAL PRIMARY KEY,
    thread_id BIGINT NOT NULL REFERENCES pev_message_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_messages_thread ON pev_messages(thread_id);
CREATE INDEX idx_pev_messages_sender ON pev_messages(sender_id);
CREATE INDEX idx_pev_messages_created ON pev_messages(created_at DESC);

-- TABLE: pev_message_read_status
CREATE TABLE IF NOT EXISTS pev_message_read_status (
    message_id BIGINT NOT NULL REFERENCES pev_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (message_id, user_id)
);

-- TABLE: pev_forum_categories
CREATE TABLE IF NOT EXISTS pev_forum_categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    topics_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_forum_categories_slug ON pev_forum_categories(slug);

-- TABLE: pev_forum_topics
CREATE TABLE IF NOT EXISTS pev_forum_topics (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES pev_forum_categories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
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

CREATE INDEX idx_pev_forum_topics_category ON pev_forum_topics(category_id);
CREATE INDEX idx_pev_forum_topics_user ON pev_forum_topics(user_id);
CREATE INDEX idx_pev_forum_topics_last_reply ON pev_forum_topics(last_reply_at DESC);

-- TABLE: pev_forum_posts
CREATE TABLE IF NOT EXISTS pev_forum_posts (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES pev_forum_topics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_forum_posts_topic ON pev_forum_posts(topic_id);
CREATE INDEX idx_pev_forum_posts_user ON pev_forum_posts(user_id);

-- TABLE: pev_groups
CREATE TABLE IF NOT EXISTS pev_groups (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type pev_group_type DEFAULT 'public' NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    cover_image_url TEXT,
    members_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_groups_creator ON pev_groups(created_by);
CREATE INDEX idx_pev_groups_slug ON pev_groups(slug);
CREATE INDEX idx_pev_groups_type ON pev_groups(type);

-- TABLE: pev_group_members
CREATE TABLE IF NOT EXISTS pev_group_members (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL REFERENCES pev_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    role pev_group_member_role DEFAULT 'member' NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(group_id, user_id)
);

CREATE INDEX idx_pev_group_members_group ON pev_group_members(group_id);
CREATE INDEX idx_pev_group_members_user ON pev_group_members(user_id);

-- TABLE: pev_notifications
CREATE TABLE IF NOT EXISTS pev_notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES pev_profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    related_entity TEXT,
    related_id TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_notifications_recipient ON pev_notifications(recipient_id);
CREATE INDEX idx_pev_notifications_is_read ON pev_notifications(is_read);
CREATE INDEX idx_pev_notifications_created ON pev_notifications(created_at DESC);

-- TABLE: pev_favorites
CREATE TABLE IF NOT EXISTS pev_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, entity_type, entity_id)
);

CREATE INDEX idx_pev_favorites_user ON pev_favorites(user_id);
CREATE INDEX idx_pev_favorites_entity ON pev_favorites(entity_type, entity_id);

-- TABLE: pev_audit_logs
CREATE TABLE IF NOT EXISTS pev_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID REFERENCES pev_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT,
    target_id TEXT,
    payload JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_audit_logs_actor ON pev_audit_logs(actor_id);
CREATE INDEX idx_pev_audit_logs_created ON pev_audit_logs(created_at DESC);
CREATE INDEX idx_pev_audit_logs_action ON pev_audit_logs(action);

-- ==========================================
-- GESTION DES FICHIERS & STORAGE
-- ==========================================

-- TABLE: pev_storage_buckets (Remplace storage.buckets de Supabase)
CREATE TABLE IF NOT EXISTS pev_storage_buckets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    file_size_limit BIGINT,
    allowed_mime_types TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TABLE: pev_storage_objects (Remplace storage.objects de Supabase)
CREATE TABLE IF NOT EXISTS pev_storage_objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bucket_id TEXT NOT NULL REFERENCES pev_storage_buckets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES pev_users(id) ON DELETE SET NULL,
    file_path TEXT NOT NULL,
    size BIGINT NOT NULL,
    mime_type TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(bucket_id, name)
);

CREATE INDEX idx_pev_storage_objects_bucket ON pev_storage_objects(bucket_id);
CREATE INDEX idx_pev_storage_objects_owner ON pev_storage_objects(owner_id);
CREATE INDEX idx_pev_storage_objects_name ON pev_storage_objects(bucket_id, name);

-- TABLE: pev_file_uploads (Métadonnées fichiers uploadés)
CREATE TABLE IF NOT EXISTS pev_file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES pev_profiles(id) ON DELETE CASCADE,
    bucket_id TEXT NOT NULL REFERENCES pev_storage_buckets(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    category TEXT,
    related_entity TEXT,
    related_id TEXT,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_file_uploads_user ON pev_file_uploads(user_id);
CREATE INDEX idx_pev_file_uploads_bucket ON pev_file_uploads(bucket_id);
CREATE INDEX idx_pev_file_uploads_related ON pev_file_uploads(related_entity, related_id);

-- TABLE: pev_storage_quotas (Quotas de stockage par utilisateur)
CREATE TABLE IF NOT EXISTS pev_storage_quotas (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES pev_profiles(id) ON DELETE CASCADE,
    total_quota BIGINT DEFAULT 524288000 NOT NULL, -- 500 MB par défaut
    used_space BIGINT DEFAULT 0 NOT NULL,
    file_count INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_storage_quotas_user ON pev_storage_quotas(user_id);

-- TABLE: pev_auth_sessions (Sessions utilisateur)
CREATE TABLE IF NOT EXISTS pev_auth_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES pev_users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    refresh_token TEXT UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_auth_sessions_user ON pev_auth_sessions(user_id);
CREATE INDEX idx_pev_auth_sessions_token ON pev_auth_sessions(token);
CREATE INDEX idx_pev_auth_sessions_expires ON pev_auth_sessions(expires_at);

-- TABLE: pev_auth_password_resets (Réinitialisation mots de passe)
CREATE TABLE IF NOT EXISTS pev_auth_password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES pev_users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_auth_password_resets_user ON pev_auth_password_resets(user_id);
CREATE INDEX idx_pev_auth_password_resets_token ON pev_auth_password_resets(token);

-- TABLE: pev_auth_email_verifications (Vérification emails)
CREATE TABLE IF NOT EXISTS pev_auth_email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES pev_users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_pev_auth_email_verifications_user ON pev_auth_email_verifications(user_id);
CREATE INDEX idx_pev_auth_email_verifications_token ON pev_auth_email_verifications(token);

-- TABLE: pev_platform_stats
CREATE TABLE IF NOT EXISTS pev_platform_stats (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    value BIGINT DEFAULT 0 NOT NULL,
    formatted_value TEXT,
    icon TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TABLE: pev_sectors
CREATE TABLE IF NOT EXISTS pev_sectors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TABLE: pev_sdgs
CREATE TABLE IF NOT EXISTS pev_sdgs (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL UNIQUE,
    name_fr TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- ==========================================
-- 4. FONCTIONS
-- ==========================================

-- Fonction: Vérifier si un utilisateur est membre d'une entreprise
CREATE OR REPLACE FUNCTION pev_is_company_member(p_company_id BIGINT, p_user_id UUID, p_roles pev_company_role[])
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM pev_company_members
    WHERE company_id = p_company_id AND user_id = p_user_id AND role = ANY(p_roles)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Fonction: Créer profil automatiquement à l'inscription
CREATE OR REPLACE FUNCTION pev_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pev_profiles (id, email, first_name, last_name, user_type)
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

-- Fonction: Mettre à jour timestamp updated_at
CREATE OR REPLACE FUNCTION pev_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Incrémenter compteurs
CREATE OR REPLACE FUNCTION pev_increment_counter(
    p_table TEXT,
    p_column TEXT,
    p_id BIGINT,
    p_delta INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
    EXECUTE format(
        'UPDATE %I SET %I = %I + $1 WHERE id = $2',
        p_table, p_column, p_column
    ) USING p_delta, p_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 5. TRIGGERS
-- ==========================================

-- Trigger: Créer profil à l'inscription
DROP TRIGGER IF EXISTS pev_on_user_created ON pev_users;
CREATE TRIGGER pev_on_user_created
  AFTER INSERT ON pev_users
  FOR EACH ROW EXECUTE FUNCTION pev_handle_new_user();

-- Trigger: Updated_at automatique sur pev_profiles
DROP TRIGGER IF EXISTS pev_profiles_updated_at ON pev_profiles;
CREATE TRIGGER pev_profiles_updated_at
    BEFORE UPDATE ON pev_profiles
    FOR EACH ROW EXECUTE FUNCTION pev_update_updated_at_column();

-- Trigger: Updated_at automatique sur pev_companies
DROP TRIGGER IF EXISTS pev_companies_updated_at ON pev_companies;
CREATE TRIGGER pev_companies_updated_at
    BEFORE UPDATE ON pev_companies
    FOR EACH ROW EXECUTE FUNCTION pev_update_updated_at_column();

-- Trigger: Updated_at automatique sur pev_opportunities
DROP TRIGGER IF EXISTS pev_opportunities_updated_at ON pev_opportunities;
CREATE TRIGGER pev_opportunities_updated_at
    BEFORE UPDATE ON pev_opportunities
    FOR EACH ROW EXECUTE FUNCTION pev_update_updated_at_column();

-- Trigger: Updated_at automatique sur pev_events
DROP TRIGGER IF EXISTS pev_events_updated_at ON pev_events;
CREATE TRIGGER pev_events_updated_at
    BEFORE UPDATE ON pev_events
    FOR EACH ROW EXECUTE FUNCTION pev_update_updated_at_column();

-- Trigger: Updated_at automatique sur pev_projects
DROP TRIGGER IF EXISTS pev_projects_updated_at ON pev_projects;
CREATE TRIGGER pev_projects_updated_at
    BEFORE UPDATE ON pev_projects
    FOR EACH ROW EXECUTE FUNCTION pev_update_updated_at_column();

-- ==========================================
-- 6. DONNÉES INITIALES
-- ==========================================

-- Buckets de stockage
INSERT INTO pev_storage_buckets (id, name, is_public, file_size_limit, allowed_mime_types) VALUES
('greenhub-public', 'greenhub-public', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
('greenhub-private', 'greenhub-private', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
ON CONFLICT (id) DO NOTHING;

-- Secteurs d'activité
INSERT INTO pev_sectors (name, slug, color, sort_order, is_active) VALUES
('Agriculture durable', 'agriculture-durable', '#10b981', 1, true),
('Agroalimentaire', 'agroalimentaire', '#f59e0b', 2, true),
('Construction écologique', 'construction-ecologique', '#ec4899', 3, true),
('Eau et assainissement', 'eau-assainissement', '#06b6d4', 4, true),
('Écotourisme', 'ecotourisme', '#84cc16', 5, true),
('Énergie renouvelable', 'energie-renouvelable', '#FFEB3B', 6, true),
('Gestion des déchets', 'gestion-dechets', '#8b5cf6', 7, true),
('Transport vert', 'transport-vert', '#3b82f6', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Statistiques plateforme
INSERT INTO pev_platform_stats (key, label, value, formatted_value, icon, color, is_active) VALUES
('users', 'Utilisateurs actifs', 0, '0', 'mdi-account-group', 'green', true),
('companies', 'Entreprises vertes', 0, '0', 'mdi-domain', 'blue', true),
('opportunities', 'Opportunités', 0, '0', 'mdi-briefcase', 'orange', true),
('events', 'Événements', 0, '0', 'mdi-calendar', 'purple', true)
ON CONFLICT (key) DO NOTHING;

-- ODD (Objectifs de Développement Durable)
INSERT INTO pev_sdgs (number, name_fr, name_en, color, is_active) VALUES
(7, 'Énergie propre et d''un coût abordable', 'Affordable and Clean Energy', '#FCC30B', true),
(8, 'Travail décent et croissance économique', 'Decent Work and Economic Growth', '#A21942', true),
(9, 'Industrie, innovation et infrastructure', 'Industry, Innovation and Infrastructure', '#FD6925', true),
(11, 'Villes et communautés durables', 'Sustainable Cities and Communities', '#FD9D24', true),
(12, 'Consommation et production responsables', 'Responsible Consumption and Production', '#BF8B2E', true),
(13, 'Mesures relatives à la lutte contre les changements climatiques', 'Climate Action', '#3F7E44', true),
(15, 'Vie terrestre', 'Life on Land', '#56C02B', true)
ON CONFLICT (number) DO NOTHING;

-- ==========================================
-- 7. VUES UTILES
-- ==========================================

-- Vue: Profils avec informations utilisateur
CREATE OR REPLACE VIEW pev_profiles_full AS
SELECT 
    p.*,
    u.email_confirmed_at,
    u.last_sign_in_at,
    u.created_at as user_created_at
FROM pev_profiles p
LEFT JOIN pev_users u ON p.id = u.id;

-- Vue: Entreprises avec propriétaire
CREATE OR REPLACE VIEW pev_companies_with_owner AS
SELECT 
    c.*,
    p.first_name || ' ' || p.last_name as owner_name,
    p.email as owner_email
FROM pev_companies c
LEFT JOIN pev_profiles p ON c.owner_id = p.id;

-- Vue: Opportunités avec détails
CREATE OR REPLACE VIEW pev_opportunities_full AS
SELECT 
    o.*,
    p.first_name || ' ' || p.last_name as creator_name,
    c.name as company_name,
    c.logo_url as company_logo
FROM pev_opportunities o
LEFT JOIN pev_profiles p ON o.created_by = p.id
LEFT JOIN pev_companies c ON o.company_id = c.id;

-- Vue: Événements avec créateur
CREATE OR REPLACE VIEW pev_events_full AS
SELECT 
    e.*,
    p.first_name || ' ' || p.last_name as creator_name,
    p.avatar_url as creator_avatar
FROM pev_events e
LEFT JOIN pev_profiles p ON e.created_by = p.id;

-- Vue: Messages non lus par utilisateur
CREATE OR REPLACE VIEW pev_unread_messages AS
SELECT 
    mtp.user_id,
    m.thread_id,
    COUNT(*) as unread_count
FROM pev_message_thread_participants mtp
JOIN pev_messages m ON m.thread_id = mtp.thread_id
LEFT JOIN pev_message_read_status mrs ON mrs.message_id = m.id AND mrs.user_id = mtp.user_id
WHERE mrs.message_id IS NULL AND m.sender_id <> mtp.user_id
GROUP BY mtp.user_id, m.thread_id;

-- ==========================================
-- 8. COMMENTAIRES SUR TABLES
-- ==========================================

COMMENT ON TABLE pev_users IS 'Utilisateurs système (authentification)';
COMMENT ON TABLE pev_profiles IS 'Profils utilisateurs étendus';
COMMENT ON TABLE pev_connections IS 'Connexions entre utilisateurs';
COMMENT ON TABLE pev_companies IS 'Entreprises de l''écosystème';
COMMENT ON TABLE pev_company_members IS 'Membres des entreprises';
COMMENT ON TABLE pev_opportunities IS 'Opportunités (emplois, stages, appels)';
COMMENT ON TABLE pev_events IS 'Événements et formations';
COMMENT ON TABLE pev_projects IS 'Projets entrepreneuriaux';
COMMENT ON TABLE pev_resources IS 'Ressources (guides, outils, formations)';
COMMENT ON TABLE pev_messages IS 'Messages privés';
COMMENT ON TABLE pev_forum_topics IS 'Sujets du forum';
COMMENT ON TABLE pev_groups IS 'Groupes et communautés';
COMMENT ON TABLE pev_notifications IS 'Notifications utilisateur';
COMMENT ON TABLE pev_favorites IS 'Favoris (polymorphe)';
COMMENT ON TABLE pev_audit_logs IS 'Journal d''audit système';
COMMENT ON TABLE pev_storage_buckets IS 'Buckets de stockage (remplace storage.buckets Supabase)';
COMMENT ON TABLE pev_storage_objects IS 'Objets stockés (remplace storage.objects Supabase)';
COMMENT ON TABLE pev_file_uploads IS 'Métadonnées des fichiers uploadés';
COMMENT ON TABLE pev_storage_quotas IS 'Quotas de stockage par utilisateur';
COMMENT ON TABLE pev_auth_sessions IS 'Sessions d''authentification actives';
COMMENT ON TABLE pev_auth_password_resets IS 'Tokens de réinitialisation de mot de passe';
COMMENT ON TABLE pev_auth_email_verifications IS 'Tokens de vérification d''email';

-- ==========================================
-- FIN DU SCRIPT
-- ==========================================
-- Total: 37 tables + 8 types ENUM + 4 fonctions + 6 triggers + 5 vues
-- 
-- TABLES PRINCIPALES (30):
--   pev_users, pev_profiles, pev_connections, pev_companies, pev_company_members,
--   pev_opportunities, pev_opportunity_applications, pev_events, pev_event_registrations,
--   pev_projects, pev_resources, pev_message_threads, pev_message_thread_participants,
--   pev_messages, pev_message_read_status, pev_forum_categories, pev_forum_topics,
--   pev_forum_posts, pev_groups, pev_group_members, pev_notifications, pev_favorites,
--   pev_audit_logs, pev_platform_stats, pev_sectors, pev_sdgs
--
-- STORAGE & AUTH (7):
--   pev_storage_buckets, pev_storage_objects, pev_file_uploads, pev_storage_quotas,
--   pev_auth_sessions, pev_auth_password_resets, pev_auth_email_verifications
--
-- FEATURES:
--   ✅ Authentification complète (sessions, reset password, email verification)
--   ✅ Stockage de fichiers (buckets public/privé, quotas utilisateur)
--   ✅ Gestion utilisateurs autonome (pas de dépendance Supabase auth.users)
--   ✅ Préfixe pev_ sur tout pour éviter conflits
--   ✅ Compatible PostgreSQL 12+
-- ==========================================
