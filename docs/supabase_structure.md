# Supabase - Structure du projet

- Projet: `peva`
- Project ID: `vvmahjuwrswdnaugsmcz`
- URL: `https://vvmahjuwrswdnaugsmcz.supabase.co`
- Généré le: 2025-09-19 23:51:06 UTC

## Variables d'environnement (local)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (backend uniquement)

---

## Extensions

### Extensions installées (actives)
- `pgcrypto` (schema: extensions) — 1.3 — cryptographic functions
- `plpgsql` (schema: pg_catalog) — 1.0 — PL/pgSQL procedural language
- `supabase_vault` (schema: vault) — 0.3.1 — Supbase Vault Extension
- `pg_stat_statements` (schema: extensions) — 1.11 — track planning/execution statistics
- `uuid-ossp` (schema: extensions) — 1.1 — generate UUIDs
- `pg_graphql` (schema: graphql) — 1.5.11 — GraphQL support

### Extensions disponibles mais non installées (extraits)
- `postgis` 3.3.7, `postgis_raster` 3.3.7, `postgis_topology` 3.3.7, `postgis_sfcgal` 3.3.7
- `pg_cron` 1.6.4, `pg_repack` 1.5.2, `pg_net` 0.19.5, `vector` 0.8.0, `pgmq` 1.4.4
- `unaccent` 1.1, `citext` 1.6, `ltree` 1.3, `hstore` 1.8, `btree_gist` 1.7, `btree_gin` 1.3
- `pg_trgm` 1.6, `dblink` 1.2, `http` 1.6, `wrappers` 0.5.4
- ... (liste complète disponible dans le panneau Extensions de Supabase)

---

## Tables (aperçu)

> Remarque: Cette section présente un aperçu global des tables détectées, avec le schéma, l'état RLS, les clés principales et un extrait des relations. Pour un dictionnaire de données complet (toutes colonnes et contraintes), me demander une exportation détaillée.

### `public.notifications`
- RLS: désactivé
- PK: `id`
- Colonnes clés: `recipient_id` (uuid), `actor_id` (uuid), `type` (text), `is_read` (bool, défaut `false`), `created_at` (timestamptz)
- FKs: `recipient_id -> public.profiles.id`, `actor_id -> public.profiles.id`
- Commentaire: Notifications internes à l'application.

### `public.forum_posts`
- RLS: désactivé
- PK: `id`
- Colonnes clés: `topic_id` (bigint), `user_id` (uuid), `content` (text), timestamps
- FKs: `topic_id -> public.forum_topics.id`, `user_id -> public.profiles.id`

### `public.audit_logs`
- RLS: désactivé
- PK: `id`
- Colonnes clés: `actor_id` (uuid), `action` (text), `payload` (jsonb), `created_at`
- FKs: `actor_id -> public.profiles.id`
- Commentaire: Journal d'audit pour actions sensibles.

### `public.profiles`
- RLS: activé
- PK: `id` (uuid, référence `auth.users.id`)
- Colonnes clés: `email`, `first_name`, `last_name`, `display_name`, `user_type`, `avatar_url`, `bio`, `role` (enum: `user|moderator|admin|super_admin`, défaut `user`), `is_verified` (bool)
- FKs (extraits): utilisées par `connections`, `companies`, `projects`, `opportunities`, `messages`, `groups`, `notifications`, etc.
- Commentaire: Profils publics étendant `auth.users`.

### `public.group_members`
- RLS: désactivé
- PK: `id`
- Colonnes clés: `group_id` (bigint), `user_id` (uuid), `role` (enum: `member|moderator|owner`)
- FKs: `group_id -> public.groups.id`, `user_id -> public.profiles.id`

### `public.favorites`
- RLS: désactivé
- PK: `id`
- Colonnes clés: `user_id` (uuid), `entity_type` (text), `entity_id` (text)
- FKs: `user_id -> public.profiles.id`
- Commentaire: Table polymorphe pour sauvegardes.

### `public.message_read_status`
- RLS: désactivé
- PK composite: `message_id`, `user_id`
- FKs: `message_id -> public.messages.id`, `user_id -> public.profiles.id`

### `public.event_registrations`
- RLS: désactivé
- PK: `id`
- Colonnes clés: `event_id` (bigint), `user_id` (uuid), `registered_at`
- FKs: `event_id -> public.events.id`, `user_id -> public.profiles.id`

### `public.projects`
- RLS: désactivé
- PK: `id`
- Colonnes clés: `owner_id` (uuid), `company_id` (bigint, nullable), `title`, `status` (enum `content_status`, défaut `draft`), timestamps
- FKs: `owner_id -> public.profiles.id`, `company_id -> public.companies.id`
- Commentaire: Projets entrepreneuriaux.

### Autres tables détectées (extraits)
- `public.forum_topics`
- `public.messages`, `public.message_threads`, `public.message_thread_participants`
- `public.groups`, `public.group_invitations`
- `public.opportunities`, `public.opportunity_applications`
- `public.resources`
- `public.events`
- `public.companies`, `public.company_members` (RLS activé)
- `public.connections`
- ...

---

## RLS (Row Level Security)
- Activé: `public.profiles`, `public.company_members` (d'autres tables peuvent aussi l'être si des politiques existent; l'aperçu ci-dessus reflète le drapeau RLS retourné par l'API).
- Désactivé: la plupart des autres tables listées dans cet aperçu.

Si tu souhaites, je peux générer un export détaillé de toutes les politiques RLS (policies) par table.

---

## Migrations
- Aucune migration listée actuellement via l'API.

---

## Edge Functions
- Aucune Edge Function listée.

---

## Recommandations
- Activer RLS sur les tables exposées au client (si non déjà fait) et définir des policies adaptées.
- Conserver `SUPABASE_SERVICE_ROLE_KEY` uniquement côté serveur/Edge Functions.
- Documenter les enums utilisés (`user_role_global`, `group_member_role`, `content_status`, etc.).

---

_Généré automatiquement. Dis-moi si tu veux un dictionnaire de données complet (toutes colonnes/contraintes) ou des diagrammes ER._
