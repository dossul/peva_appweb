Absolument. Voici un document Markdown complet qui consolide toute la structure Supabase que nous avons élaborée et corrigée.

Ce fichier contient tous les scripts SQL finalisés, dans l'ordre d'exécution, pour initialiser complètement votre projet PEVA sur Supabase.

---

# PEVA - Documentation Complète de la Structure Supabase

Ce document contient l'ensemble des scripts SQL nécessaires pour configurer la base de données, le stockage (Storage), les triggers, et les politiques de sécurité (RLS) pour le projet PEVA sur la plateforme Supabase.

### Comment Utiliser ce Document

Les scripts ci-dessous doivent être exécutés dans l'éditeur SQL de votre tableau de bord Supabase (**SQL Editor**). Il est crucial de les exécuter dans l'ordre présenté pour garantir que les dépendances (comme les tables et les fonctions) soient créées avant d'être utilisées.

1.  **Partie 1 : Schéma de la Base de Données** - Crée toutes les tables.
2.  **Partie 2 : Fonctions et Triggers** - Met en place la logique automatisée.
3.  **Partie 3 : Configuration du Stockage** - Crée les buckets pour les fichiers.
4.  **Partie 4 : Politiques de Sécurité (RLS)** - Sécurise l'accès aux fichiers.

---

## Partie 1 : Schéma Complet de la Base de Données (`public`)

Ce script crée toutes les tables de l'application dans le schéma `public`.

```sql
--============== EXTENSIONS ET TYPES ==============--
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création des types ENUM pour la cohérence des données (ignore si déjà existant)
DO $$ BEGIN CREATE TYPE user_role_global AS ENUM ('user', 'moderator', 'admin', 'super_admin'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE company_role AS ENUM ('admin', 'editor', 'contributor', 'viewer'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE opportunity_type AS ENUM ('job', 'internship', 'contract', 'funding', 'partnership', 'tender'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE content_status AS ENUM ('draft', 'in_review', 'published', 'archived', 'rejected'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'declined', 'blocked'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE event_type AS ENUM ('conference', 'workshop', 'webinar', 'networking', 'competition'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE group_type AS ENUM ('public', 'private'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE group_member_role AS ENUM ('member', 'moderator', 'owner'); EXCEPTION WHEN duplicate_object THEN null; END $$;


--============== MODULE 1: UTILISATEURS & PROFILS ==============--
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


--============== MODULE 2: ANNUAIRE (ENTREPRISES) ==============--
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


--============== MODULE 3: OPPORTUNITÉS ==============--
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
    deadline DATE,
    status content_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS opportunity_applications (
    id BIGSERIAL PRIMARY KEY,
    opportunity_id BIGINT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(opportunity_id, user_id)
);
```

---

## Partie 2 : Fonctions et Triggers

Ces scripts créent la logique automatisée dans la base de données.

### 2.1 - Fonction d'Aide pour RLS : `is_company_member`

Cette fonction est essentielle pour les politiques de sécurité qui vérifient les permissions au sein d'une entreprise.

```sql
CREATE OR REPLACE FUNCTION is_company_member(p_company_id BIGINT, p_user_id UUID, p_roles company_role[])
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_members
    WHERE company_id = p_company_id
      AND user_id = p_user_id
      AND role = ANY(p_roles)
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

### 2.2 - Trigger de Création de Profil Utilisateur

Ce trigger crée automatiquement une entrée dans la table `public.profiles` chaque fois qu'un nouvel utilisateur s'inscrit.

```sql
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

-- Supprimer l'ancien trigger s'il existe pour éviter les doublons
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## Partie 3 : Configuration du Stockage (Storage)

### Script 1 : Création des Buckets

Ce script crée les buckets `peva-public` (pour les fichiers publics) et `peva-private` (pour les fichiers privés).

```sql
-- Création du bucket PUBLIC pour les avatars, logos, etc.
INSERT INTO storage.buckets (id, name, public)
VALUES ('peva-public', 'peva-public', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Création du bucket PRIVÉ pour les documents sensibles (CV, rapports).
INSERT INTO storage.buckets (id, name, public)
VALUES ('peva-private', 'peva-private', FALSE)
ON CONFLICT (id) DO NOTHING;

SELECT id, name, public FROM storage.buckets WHERE id IN ('peva-public', 'peva-private');
```

---

## Partie 4 : Politiques de Sécurité (Row-Level Security - RLS)

Ces scripts sécurisent l'accès aux fichiers dans les buckets de stockage.

### Script 2 : Politiques pour le Bucket `peva-public` (Définitif)

```sql
-- 1. Politique d'INSERTION (Upload)
DROP POLICY IF EXISTS "Allow authenticated users to upload to public bucket" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload to public bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( bucket_id = 'peva-public' );

-- 2. Politique d'UPDATE
DROP POLICY IF EXISTS "Allow users to UPDATE their own public files" ON storage.objects;
CREATE POLICY "Allow users to UPDATE their own public files"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'peva-public' AND (
        -- Cas 1: L'utilisateur met à jour son propre avatar (chemin: avatars/user-id.ext)
        (name LIKE 'avatars/%' AND auth.uid() = (regexp_replace(split_part(name, '/', 2), '\..*$', ''))::uuid)
        OR
        -- Cas 2: L'utilisateur est admin/éditeur de l'entreprise et met à jour le logo (chemin: company_logos/company-id.ext)
        (name LIKE 'company_logos/%' AND
         is_company_member(
             (regexp_replace(split_part(name, '/', 2), '\..*$', ''))::bigint,
             auth.uid(),
             ARRAY['admin', 'editor']::company_role[]
         )
        )
    )
);

-- 3. Politique de DELETE
DROP POLICY IF EXISTS "Allow users to DELETE their own public files" ON storage.objects;
CREATE POLICY "Allow users to DELETE their own public files"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'peva-public' AND (
        -- Cas 1: L'utilisateur supprime son propre avatar
        (name LIKE 'avatars/%' AND auth.uid() = (regexp_replace(split_part(name, '/', 2), '\..*$', ''))::uuid)
        OR
        -- Cas 2: L'utilisateur est admin/éditeur de l'entreprise et supprime le logo
        (name LIKE 'company_logos/%' AND
         is_company_member(
             (regexp_replace(split_part(name, '/', 2), '\..*$', ''))::bigint,
             auth.uid(),
             ARRAY['admin', 'editor']::company_role[]
         )
        )
    )
);
```

### Script 3 : Politiques pour le Bucket `peva-private` (Définitif)

```sql
-- 1. Politique d'INSERTION (Upload de candidature)
DROP POLICY IF EXISTS "Allow users to upload their own application files" ON storage.objects;
CREATE POLICY "Allow users to upload their own application files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'peva-private'
    AND auth.uid() = (string_to_array(name, '/'))[3]::uuid
);

-- 2. Politique de LECTURE pour l'auteur de la candidature
DROP POLICY IF EXISTS "Allow users to read their own application files" ON storage.objects;
CREATE POLICY "Allow users to read their own application files"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'peva-private'
    AND auth.uid() = (string_to_array(name, '/'))[3]::uuid
);

-- 3. Politique de LECTURE pour le propriétaire de l'opportunité
DROP POLICY IF EXISTS "Allow opportunity owner to read submitted applications" ON storage.objects;
CREATE POLICY "Allow opportunity owner to read submitted applications"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'peva-private'
    AND name LIKE 'opportunity_applications/%'
    AND auth.uid() = (
        SELECT created_by FROM public.opportunities
        WHERE id = ((string_to_array(name, '/'))[2])::bigint
    )
);

-- 4. Politique d'INSERTION pour les rapports d'entreprise
DROP POLICY IF EXISTS "Allow company admins to upload reports" ON storage.objects;
CREATE POLICY "Allow company admins to upload reports"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'peva-private'
    AND name LIKE 'company_reports/%'
    AND (
        SELECT is_company_member(
            ((string_to_array(name, '/'))[2])::bigint,
            auth.uid(),
            ARRAY['admin', 'editor']::company_role[]
        )
    )
);

-- 5. Politique de LECTURE pour les membres de l'entreprise
DROP POLICY IF EXISTS "Allow company members to read reports" ON storage.objects;
CREATE POLICY "Allow company members to read reports"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'peva-private'
    AND name LIKE 'company_reports/%'
    AND (
        SELECT is_company_member(
            ((string_to_array(name, '/'))[2])::bigint,
            auth.uid(),
            ARRAY['admin', 'editor', 'contributor', 'viewer']::company_role[]
        )
    )
);

-- REQUÊTE DE VÉRIFICATION FINALE
SELECT policyname, cmd, schemaname, tablename FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
```


Oui, absolument. C'est une excellente question.

Contrairement à un système de fichiers traditionnel, les "dossiers" dans un stockage d'objets comme celui de Supabase n'existent pas en tant que tels. Ce sont simplement des **préfixes** dans le nom des fichiers. Pour qu'un "dossier" apparaisse dans l'interface du tableau de bord, il faut y créer un objet. La pratique courante est de créer un objet vide, souvent nommé `.emptyFolderPlaceholder`.

On peut faire cela directement avec SQL en insérant des lignes dans la table `storage.objects`.

Voici un script SQL unique que vous pouvez copier-coller et exécuter dans l'éditeur SQL de votre dashboard Supabase. Il créera toute la structure de répertoires que vous avez définie.

---

### Script SQL pour la Création de la Structure de Dossiers

Ce script est **idempotent**, ce qui signifie que vous pouvez l'exécuter plusieurs fois sans risque. Il ignorera les dossiers qui existent déjà grâce à la clause `ON CONFLICT DO NOTHING`.

**Instructions :**
1.  Allez dans le **SQL Editor** de votre dashboard Supabase.
2.  Cliquez sur **+ New query**.
3.  Copiez l'intégralité du script ci-dessous, collez-le dans la fenêtre, puis cliquez sur **RUN**.

```sql
-- ====================================================================
-- SCRIPT DE CRÉATION DE LA STRUCTURE DES DOSSIERS DANS LES BUCKETS
-- Ce script insère des objets vides pour matérialiser les "dossiers".
-- ====================================================================

-- 1. Création des dossiers dans le bucket PUBLIC: 'peva-public'
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES
    ('peva-public', 'avatars/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-public', 'company_logos/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-public', 'event_covers/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-public', 'resource_thumbnails/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}')
ON CONFLICT (bucket_id, name) DO NOTHING;


-- 2. Création des dossiers dans le bucket PRIVÉ: 'peva-private'
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES
    ('peva-private', 'opportunity_applications/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-private', 'company_reports/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}'),
    ('peva-private', 'user_documents/.emptyFolderPlaceholder', NULL, '{"size":0, "mimetype":"application/x-empty"}')
ON CONFLICT (bucket_id, name) DO NOTHING;


-- 3. VÉRIFICATION
-- Cette requête liste tous les objets "placeholder" que nous venons de créer
-- pour confirmer que la structure est en place.
SELECT
    bucket_id,
    name AS "dossier_cree"
FROM
    storage.objects
WHERE
    name LIKE '%/.emptyFolderPlaceholder'
ORDER BY
    bucket_id, name;

```

### Que Fait ce Script ?

1.  **`INSERT INTO storage.objects`** : Il ajoute directement des entrées dans la table qui gère tous les objets de votre stockage Supabase.
2.  **`bucket_id`** : Il spécifie dans quel bucket (`peva-public` or `peva-private`) l'objet doit être créé.
3.  **`name`** : C'est la partie la plus importante. Il définit le chemin complet de l'objet. En créant `avatars/.emptyFolderPlaceholder`, nous créons un fichier placeholder qui force l'interface à afficher un "dossier" nommé `avatars`.
4.  **`owner`** : Nous mettons `NULL` car ces dossiers sont des éléments de structure système et n'appartiennent pas à un utilisateur spécifique.
5.  **`metadata`** : Nous ajoutons des métadonnées basiques indiquant que le fichier est vide (`"size":0`) et d'un type générique.
6.  **`ON CONFLICT (bucket_id, name) DO NOTHING`** : C'est la clause de sécurité. Si vous exécutez le script une deuxième fois, PostgreSQL verra que des objets avec ces chemins existent déjà et ne fera rien, évitant ainsi les erreurs.
7.  **`SELECT ...`** : La dernière partie du script est une simple requête de vérification qui vous montrera, dans le panneau des résultats, la liste des structures de dossiers qui ont été créées.

Après avoir exécuté ce script, allez dans la section **Storage** de votre dashboard, et vous verrez les dossiers apparaître dans leurs buckets respectifs.