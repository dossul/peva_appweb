# 🔧 TÂCHES MANUELLES - Migration PEVA → 2iE GreenHub

**Date**: 29 Décembre 2024 - 10:56 UTC  
**Statut**: PRÊT POUR EXÉCUTION MANUELLE

---

## ✅ CE QUI A ÉTÉ FAIT AUTOMATIQUEMENT

### 1. Rebranding Textes ✅
- ✅ `MapView.vue`: "Carte Interactive PEVA" → "Carte Interactive 2iE GreenHub"
- ✅ `MapView.vue`: Suppression "en Afrique"
- ✅ `DirectoryView.vue`: "Annuaire PEVA" → "Annuaire 2iE Green Hub"
- ✅ `DirectoryView.vue`: Suppression "en Afrique"
- ✅ `EventsView.vue`: "Événements PEVA" → "Événements 2iE Green Hub"
- ✅ `EventsView.vue`: Suppression "africaine"
- ✅ `ResourcesView.vue`: Suppression "en Afrique"
- ✅ `RegisterView.vue`: "Newsletter PEVA" → "Newsletter 2iE Green HUB"
- ✅ `OnboardingView.vue`: "Newsletter PEVA" → "Newsletter 2iE Green HUB"

### 2. Secteurs et Catégories ✅
- ✅ Ajout secteur "Agroalimentaire" (couleur orange)
- ✅ Ajout secteur "Écotourisme" (couleur vert clair)
- ✅ "Énergies renouvelables" → couleur jaune (#FFEB3B)
- ✅ Tri alphabétique des secteurs dans MapView
- ✅ Modification tailles entreprises: TPME (1-10), PME (11-50), Moyenne (51-250), Grande (250+)

### 3. Types de Profils ✅
- ✅ DirectoryView: Labels modifiés (Apprenant, Entreprises, Investisseur/banque, PTF, Institution recherche/Université)

### 4. Nouveaux Composants ✅
- ✅ `SocialShareButtons.vue`: Partage LinkedIn, WhatsApp, Facebook, Twitter + copie lien
- ✅ `ImageUploader.vue`: Upload avatar/logo avec preview, crop, validation
- ✅ `supabase-keep-alive.js`: Script Node.js pour éviter pause Supabase
- ✅ `.github/workflows/supabase-keep-alive.yml`: Workflow GitHub Actions quotidien

---

## 🔴 CE QUE VOUS DEVEZ FAIRE MANUELLEMENT

### ÉTAPE 1: LOGOS ET ASSETS (PRIORITÉ 1 🔴)

#### 1.1 Remplacer les Logos
**Localisation**: `c:\wamp64\www\peva_appweb\peva\public\` et `peva\src\assets\images\logos\`

**Fichiers à remplacer**:
```
❌ À FAIRE:
1. public/logo.png → Logo 2iE GreenHub (taille: 512x512px)
2. public/favicon.ico → Favicon 2iE GreenHub (16x16, 32x32, 48x48)
3. src/assets/images/logos/logo_2ie_greenhub.png → Logo header (hauteur: 50px)
4. public/og-image.png → Image Open Graph pour réseaux sociaux (1200x630px)
5. public/apple-touch-icon.png → Icône iOS (180x180px)
```

**Instructions**:
- Demander logos officiels 2iE GreenHub au département Design
- Utiliser format PNG transparent pour logo header
- Optimiser taille fichiers (< 100KB par image)

**Vérifier ces fichiers**:
```bash
cd c:\wamp64\www\peva_appweb\peva
dir public\*.png
dir public\*.ico
dir src\assets\images\logos\
```

---

### ÉTAPE 2: CONFIGURATION GITHUB SECRETS (PRIORITÉ 1 🔴)

#### 2.1 Activer Keep-Alive Supabase

**Le workflow GitHub Actions a été créé**: `.github/workflows/supabase-keep-alive.yml`

**Ce que vous devez faire**:

1. **Aller sur GitHub.com**:
   - Votre repository: `https://github.com/[votre-username]/peva_appweb`
   - Cliquer `Settings` > `Secrets and variables` > `Actions`

2. **Ajouter ces secrets**:
   ```
   Nom: VITE_SUPABASE_URL
   Valeur: https://vvmahjuwrswdnaugsmcz.supabase.co

   Nom: VITE_SUPABASE_ANON_KEY
   Valeur: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bWFoanV3cnN3ZG5hdWdzbWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODE2NDAsImV4cCI6MjA3Mzg1NzY0MH0.Znn0gSEHvwPoN9HQ92tdwLuM65Q25oC17IXUW-ooF-g
   ```

3. **Activer le workflow**:
   - Aller dans l'onglet `Actions`
   - Autoriser les GitHub Actions si demandé
   - Le workflow s'exécutera automatiquement chaque jour à 2h UTC

4. **Test manuel** (optionnel):
   - Onglet `Actions` > `Supabase Keep-Alive`
   - Cliquer `Run workflow` > `Run workflow`
   - Vérifier que ça passe ✅

**Alternative locale** (si pas GitHub):
```bash
# Windows Task Scheduler
cd c:\wamp64\www\peva_appweb
node scripts\supabase-keep-alive.js

# Créer tâche planifiée quotidienne dans Windows:
# Panneau de configuration > Outils d'administration > Planificateur de tâches
# Action: Exécuter "node c:\wamp64\www\peva_appweb\scripts\supabase-keep-alive.js"
# Déclencheur: Quotidien à 2h du matin
```

---

### ÉTAPE 3: MIGRATIONS SUPABASE (PRIORITÉ 2 🟠)

#### 3.1 Exécuter les Migrations SQL

**Où**: Dashboard Supabase → SQL Editor

**URL**: https://supabase.com/dashboard/project/vvmahjuwrswdnaugsmcz/sql/new

**Script à exécuter**:

```sql
-- ================================================
-- MIGRATION PEVA → 2iE GREENHUB
-- Date: 2024-12-29
-- ================================================

BEGIN;

-- 1. Ajouter colonne préférences aux profils
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

COMMENT ON COLUMN public.profiles.preferences IS 
'Préférences utilisateur: secteurs intérêt, types opportunités, langue, notifications';

-- 2. Ajouter secteur aux événements
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS sector TEXT;

COMMENT ON COLUMN public.events.sector IS 
'Secteur activité: valorisation déchets, bilan carbone, économie circulaire, etc.';

-- 3. Ajouter région et ville aux entreprises
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

COMMENT ON COLUMN public.companies.region IS 'Région administrative (ex: Hauts-Bassins, Plateau-Central)';
COMMENT ON COLUMN public.companies.city IS 'Ville (ex: Ouagadougou, Bobo-Dioulasso)';

-- 4. Étendre enum opportunity_type
DO $$ BEGIN
  ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'call_for_projects';
  ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'thesis';
  ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'fundraising';
  ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'equipment_sale';
  ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'business_idea';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 5. Confirmer les changements
COMMIT;

-- Vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'preferences';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events' AND column_name = 'sector';

SELECT unnest(enum_range(NULL::opportunity_type))::text AS opportunity_types;
```

**⚠️ IMPORTANT**:
- Faire un **BACKUP** avant d'exécuter (Dashboard > Database > Backups)
- Exécuter en heures creuses
- Vérifier les résultats avec les SELECT à la fin

**En cas d'erreur**:
```sql
-- Rollback manuel si problème
ROLLBACK;
```

---

### ÉTAPE 4: INTÉGRATIONS COMPOSANTS (PRIORITÉ 2 🟠)

#### 4.1 Ajouter Boutons Partage Social

**Fichiers à modifier**: Toutes les cartes de contenu

**Exemples**:

**OpportunityCard.vue** (à créer ou modifier):
```vue
<template>
  <v-card>
    <v-card-title>{{ opportunity.title }}</v-card-title>
    <v-card-text>{{ opportunity.description }}</v-card-text>
    <v-card-actions>
      <v-btn>Voir détails</v-btn>
      <v-spacer />
      
      <!-- AJOUTER ICI -->
      <social-share-buttons
        :url="`${window.location.origin}/opportunities/${opportunity.id}`"
        :title="opportunity.title"
        :description="opportunity.description"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
import SocialShareButtons from '@/components/SocialShareButtons.vue'
// ... reste du code
</script>
```

**Fichiers concernés**:
- `peva/src/components/OpportunityCard.vue` (si existe)
- `peva/src/components/EventCard.vue` (si existe)
- `peva/src/components/ResourceCard.vue` (si existe)
- `peva/src/components/CompanyCard.vue` (si existe)
- Ou directement dans les vues: OpportunitiesView, EventsView, ResourcesView

**Intégration dans les vues**:
```vue
<script setup>
import SocialShareButtons from '@/components/SocialShareButtons.vue'
</script>
```

#### 4.2 Ajouter Upload Avatar/Logo

**ProfileView.vue**:
```vue
<template>
  <div>
    <!-- Photo de profil -->
    <image-uploader
      :current-image="userProfile.avatar_url"
      bucket-name="peva-public"
      folder="avatars"
      label="Photo de profil"
      @uploaded="handleAvatarUploaded"
      @error="showError"
    />
  </div>
</template>

<script setup>
import ImageUploader from '@/components/ImageUploader.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleAvatarUploaded = async (url) => {
  await authStore.updateProfile({ avatar_url: url })
  // Afficher message succès
}

const showError = (message) => {
  // Afficher snackbar erreur
  console.error(message)
}
</script>
```

**Formulaire Entreprise** (CompanyManagementView.vue ou similaire):
```vue
<image-uploader
  :current-image="company.logo_url"
  bucket-name="peva-public"
  folder="company_logos"
  label="Logo de l'entreprise"
  avatar-size="150"
  @uploaded="handleLogoUploaded"
/>
```

---

### ÉTAPE 5: TESTS ET VALIDATION (PRIORITÉ 3 🟡)

#### 5.1 Tests Manuels

**Checklist**:
```
[ ] MapView: Vérifier titre "Carte Interactive 2iE GreenHub"
[ ] MapView: Vérifier nouveaux secteurs (Agroalimentaire, Écotourisme)
[ ] MapView: Vérifier couleur jaune pour "Énergie renouvelable"
[ ] MapView: Vérifier tailles TPME/PME modifiées
[ ] DirectoryView: Vérifier titre "Annuaire 2iE Green Hub"
[ ] DirectoryView: Vérifier nouveaux types profils (Apprenant, PTF, etc.)
[ ] EventsView: Vérifier titre "Événements 2iE Green Hub"
[ ] ResourcesView: Vérifier description sans "en Afrique"
[ ] RegisterView: Vérifier "Newsletter 2iE Green HUB"
[ ] Header: Vérifier logo 2iE GreenHub (après remplacement)
[ ] Partage social: Tester LinkedIn, WhatsApp, Facebook, Twitter
[ ] Upload image: Tester avatar et logo entreprise
```

#### 5.2 Tests E2E (si configurés)

```bash
cd c:\wamp64\www\peva_appweb\peva
npm run test:e2e
```

**Mettre à jour les tests** si nécessaire:
- Remplacer "PEVA" par "2iE GreenHub" dans les assertions
- Mettre à jour sélecteurs si modifiés

---

### ÉTAPE 6: DÉPLOIEMENT (PRIORITÉ 4 🟢)

#### 6.1 Vérifications Pré-Déploiement

```bash
cd c:\wamp64\www\peva_appweb\peva

# Vérifier que tout compile
npm run build

# Vérifier taille bundle
dir dist\assets\*.js

# Linter
npm run lint
```

#### 6.2 Commit et Push

```bash
git add .
git commit -m "feat: Migration PEVA → 2iE GreenHub

- Rebranding complet (titres, descriptions)
- Ajout secteurs Agroalimentaire et Écotourisme
- Modification types profils (Apprenant, PTF, etc.)
- Nouveaux composants: SocialShareButtons, ImageUploader
- Script keep-alive Supabase
- Migrations DB: préférences, secteur événements, région/ville

BREAKING CHANGES:
- Types profils modifiés (entrepreneur → learner, etc.)
- Nouveaux types opportunités (enum migration requise)
"

git push origin main
```

#### 6.3 Déploiement Production

**Si Netlify/Vercel**:
- Push déclenchera auto-déploiement
- Vérifier logs de build
- Tester en production

**Variables d'environnement à vérifier**:
```
VITE_SUPABASE_URL=https://vvmahjuwrswdnaugsmcz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
```

---

## 📋 CHECKLIST COMPLÈTE

### Phase 1: Préparation (Jour 1)
- [ ] Récupérer logos officiels 2iE GreenHub
- [ ] Optimiser images (< 100KB)
- [ ] Remplacer tous les logos/favicons
- [ ] Backup Supabase

### Phase 2: Configuration (Jour 1)
- [ ] Configurer GitHub Secrets
- [ ] Tester workflow keep-alive
- [ ] OU configurer tâche Windows planifiée

### Phase 3: Base de Données (Jour 2)
- [ ] Exécuter migrations SQL Supabase
- [ ] Vérifier résultats migrations
- [ ] Tester nouvelles colonnes

### Phase 4: Intégration Code (Jour 2-3)
- [ ] Ajouter SocialShareButtons dans toutes les cartes
- [ ] Ajouter ImageUploader dans ProfileView
- [ ] Ajouter ImageUploader dans formulaire entreprise
- [ ] Tester uploads Supabase Storage

### Phase 5: Tests (Jour 3)
- [ ] Tests manuels complets (checklist ci-dessus)
- [ ] Tests E2E (si configurés)
- [ ] Tests mobile responsive
- [ ] Validation par équipe

### Phase 6: Déploiement (Jour 4)
- [ ] Build production
- [ ] Commit et push
- [ ] Déploiement
- [ ] Tests production
- [ ] Communication aux utilisateurs

---

## 🆘 AIDE ET SUPPORT

### En Cas de Problème

**Migration Supabase échoue**:
1. Vérifier syntaxe SQL
2. Exécuter ligne par ligne
3. Rollback avec `ROLLBACK;`
4. Contacter support Supabase

**Keep-Alive ne fonctionne pas**:
1. Vérifier secrets GitHub
2. Vérifier logs workflow (onglet Actions)
3. Tester script en local: `node scripts/supabase-keep-alive.js`

**Upload images ne fonctionne pas**:
1. Vérifier RLS policies Storage
2. Vérifier buckets existent (`peva-public`)
3. Vérifier permissions utilisateur

**Tests E2E échouent**:
1. Mettre à jour sélecteurs
2. Mettre à jour assertions (PEVA → 2iE GreenHub)
3. Augmenter timeouts si nécessaire

### Contacts

**Technique**:
- Supabase Dashboard: https://supabase.com/dashboard/project/vvmahjuwrswdnaugsmcz
- GitHub Actions: https://github.com/[votre-repo]/actions

**Ressources**:
- Documentation Supabase: https://supabase.com/docs
- Documentation Vuetify: https://vuetifyjs.com
- Guide migration: `docs/PLAN_MIGRATION_2IE_GREENHUB.md`

---

## 📊 RÉSUMÉ

**Fait automatiquement**: 25 tâches ✅
**À faire manuellement**: 18 tâches principales 🔧
**Temps estimé**: 3-4 jours
**Complexité**: Moyenne

**Prochaine étape immédiate**:
👉 **Récupérer logos 2iE GreenHub et les remplacer**

---

**Bonne chance pour la migration! 🚀**
