# 🗄️ DUMP COMPLET SUPABASE - PROJET PEVA

**Project ID**: `vvmahjuwrswdnaugsmcz`  
**URL**: `https://vvmahjuwrswdnaugsmcz.supabase.co`  
**Date**: 29 Décembre 2024

---

## 1. CONFIGURATION

```env
VITE_SUPABASE_URL=https://vvmahjuwrswdnaugsmcz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bWFoanV3cnN3ZG5hdWdzbWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODE2NDAsImV4cCI6MjA3Mzg1NzY0MH0.Znn0gSEHvwPoN9HQ92tdwLuM65Q25oC17IXUW-ooF-g
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bWFoanV3cnN3ZG5hdWdzbWN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4MTY0MCwiZXhwIjoyMDczODU3NjQwfQ.m5NbV-UMh9Dp6tt0fceoAJ_M54CTVcrAyJ4VlEafbcI
```

---

## 2. SCRIPT SQL COMPLET D'INITIALISATION

```sql
-- ==========================================
-- PEVA - SCRIPT COMPLET DE CRÉATION
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
CREATE TABLE IF NOT EXISTS profiles (
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

CREATE TABLE IF NOT EXISTS connections (
    id BIGSERIAL PRIMARY KEY,
    requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status connection_status DEFAULT 'pending' NOT NULL,
    message TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    responded_at TIMESTAMPTZ,
    CHECK (requester_id <> addressee_id),
    UNIQUE(requester_id, addressee_id)
);

CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS company_members (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role company_role NOT NULL,
    title TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(company_id, user_id)
);

CREATE TABLE IF NOT EXISTS opportunities (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type opportunity_type NOT NULL,
    category TEXT,
    location TEXT,
    country TEXT,
    is_remote BOOLEAN DEFAULT FALSE NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'XOF',
    requirements TEXT,
    deadline DATE,
    status content_status DEFAULT 'draft' NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    applications_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS opportunity_applications (
    id BIGSERIAL PRIMARY KEY,
    opportunity_id BIGINT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    attachments JSONB,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(opportunity_id, user_id)
);

CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS resources (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS message_threads (
    id BIGSERIAL PRIMARY KEY,
    topic TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS message_thread_participants (
    thread_id BIGINT NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    thread_id BIGINT NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS message_read_status (
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (message_id, user_id)
);

CREATE TABLE IF NOT EXISTS forum_categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS forum_topics (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS forum_posts (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS groups (
    id BIGSERIAL PRIMARY KEY,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type group_type DEFAULT 'public' NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS group_members (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role group_member_role DEFAULT 'member' NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    related_entity TEXT,
    related_id TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT,
    target_id TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_applications ENABLE ROW LEVEL SECURITY;

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

-- POLICIES
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir tous les profils" ON profiles;
CREATE POLICY "Les utilisateurs peuvent voir tous les profils" ON profiles FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON profiles;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON profiles FOR UPDATE TO public USING (id = auth.uid());

DROP POLICY IF EXISTS "Tout le monde peut voir les entreprises publiées" ON companies;
CREATE POLICY "Tout le monde peut voir les entreprises publiées" ON companies FOR SELECT TO public USING (status = 'published'::content_status);

DROP POLICY IF EXISTS "Les membres 'admin' ou 'editor' peuvent voir les brouillons" ON companies;
CREATE POLICY "Les membres 'admin' ou 'editor' peuvent voir les brouillons" ON companies FOR SELECT TO public USING (is_company_member(id, auth.uid(), ARRAY['admin'::company_role, 'editor'::company_role]));

DROP POLICY IF EXISTS "Les membres 'admin' ou 'editor' peuvent mettre à jour l'entrep" ON companies;
CREATE POLICY "Les membres 'admin' ou 'editor' peuvent mettre à jour l'entrep" ON companies FOR UPDATE TO public USING (is_company_member(id, auth.uid(), ARRAY['admin'::company_role, 'editor'::company_role]));

DROP POLICY IF EXISTS "Seuls les admins de l'entreprise peuvent la supprimer" ON companies;
CREATE POLICY "Seuls les admins de l'entreprise peuvent la supprimer" ON companies FOR DELETE TO public USING (is_company_member(id, auth.uid(), ARRAY['admin'::company_role]));

DROP POLICY IF EXISTS "Les utilisateurs peuvent accéder à leurs propres messages" ON messages;
CREATE POLICY "Les utilisateurs peuvent accéder à leurs propres messages" ON messages FOR ALL TO public USING (
  thread_id IN (SELECT thread_id FROM message_thread_participants WHERE user_id = auth.uid())
);

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
```

---

## 3. RÉSUMÉ DES TABLES

| Table | Colonnes | RLS | Description |
|-------|----------|-----|-------------|
| profiles | 18 | ✅ | Profils utilisateurs étendus |
| connections | 7 | ❌ | Demandes de connexion |
| companies | 18 | ✅ | Entreprises de l'écosystème |
| company_members | 5 | ✅ | Membres d'entreprises |
| opportunities | 18 | ❌ | Opportunités (jobs, stages, etc.) |
| opportunity_applications | 6 | ✅ | Candidatures |
| events | 13 | ❌ | Événements |
| event_registrations | 4 | ❌ | Inscriptions événements |
| projects | 12 | ❌ | Projets entrepreneuriaux |
| resources | 11 | ❌ | Ressources (guides, outils) |
| message_threads | 4 | ❌ | Fils de discussion |
| message_thread_participants | 2 | ❌ | Participants conversations |
| messages | 6 | ✅ | Messages |
| message_read_status | 3 | ❌ | Statut lecture messages |
| forum_categories | 6 | ❌ | Catégories forum |
| forum_topics | 11 | ❌ | Sujets forum |
| forum_posts | 5 | ❌ | Réponses forum |
| groups | 9 | ❌ | Groupes/communautés |
| group_members | 5 | ❌ | Membres groupes |
| notifications | 8 | ❌ | Notifications |
| favorites | 5 | ❌ | Favoris (polymorphe) |
| audit_logs | 7 | ❌ | Journal d'audit |

---

## 4. SERVICES JAVASCRIPT

### dataService.js
- Méthodes: `getPlatformStats`, `getCompanies`, `getOpportunities`, `getEvents`, `getResources`, `getUserNotifications`, `markNotificationAsRead`, `getUnreadNotificationsCount`
- RPC: `mark_notification_read`, `get_unread_count`

### fileService.js
- Buckets: `peva-public`, `peva-private`
- Méthodes: `uploadFile`, `deleteFile`, `getSignedUrl`, `checkUserQuota`
- Tables: `file_uploads`, `storage_quotas`

### auth.js (Store)
- Méthodes: `signUp`, `signIn`, `signOut`, `updateProfile`, `fetchUserProfile`
- Interagit avec: `auth.users`, `profiles`

---

Ce document contient TOUT le nécessaire pour recréer l'instance Supabase du projet PEVA.
