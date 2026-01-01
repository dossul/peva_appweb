# 📋 PLAN DE MIGRATION - PEVA → 2iE GreenHub

**Date de création**: 29 Décembre 2024 - 10:49 UTC  
**Projet**: Migration complète PEVA vers 2iE GreenHub  
**Statut**: Planification - NON EXÉCUTÉ

---

## 📑 TABLE DES MATIÈRES

- [1. REBRANDING GLOBAL](#1-rebranding-global)
- [2. MODIFICATIONS CARTE INTERACTIVE](#2-modifications-carte-interactive)
- [3. MODIFICATIONS ANNUAIRE](#3-modifications-annuaire)
- [4. MODIFICATIONS PLACE DE MARCHÉ](#4-modifications-place-de-marché)
- [5. MODIFICATIONS RESSOURCES](#5-modifications-ressources)
- [6. MODIFICATIONS ÉVÉNEMENTS](#6-modifications-événements)
- [7. FONCTIONNALITÉS NOUVELLES](#7-fonctionnalités-nouvelles)
- [8. MODIFICATIONS BASE DE DONNÉES](#8-modifications-base-de-données)
- [9. TIMELINE ET PRIORISATION](#9-timeline-et-priorisation)

---

## 1. REBRANDING GLOBAL

### 1.1 Changements de Nom (Automatique ✅)

| Fichier | Ligne(s) | Ancien | Nouveau | Complexité |
|---------|----------|--------|---------|------------|
| `MapView.vue` | 10 | "Carte Interactive PEVA" | "Carte Interactive 2iE GreenHub" | Simple |
| `MapView.vue` | 11 | "Entreprises de l'économie verte en Afrique" | "Entreprises de l'économie verte" | Simple |
| `DirectoryView.vue` | 10 | "Annuaire PEVA" | "Annuaire 2iE Green Hub" | Simple |
| `DirectoryView.vue` | 11 | "Découvrez les acteurs de l'économie verte en Afrique" | "Découvrez les acteurs de l'économie verte" | Simple |
| `EventsView.vue` | 10 | "Événements PEVA" | "Événements 2iE Green Hub" | Simple |
| `ResourcesView.vue` | ~10 | "Newsletter PEVA" | "Newsletter 2iE Green HUB" | Simple |
| `AppHeader.vue` | Multiple | "PEVA" | "2iE GreenHub" | Simple |
| `LandingView.vue` | Multiple | "PEVA" | "2iE GreenHub" | Simple |

**Méthode**: Recherche/Remplacement global avec validation manuelle

**Commande proposée**:
```bash
# Rechercher toutes les occurrences
grep -r "PEVA" src/views/*.vue src/components/*.vue
grep -r "Carte Interactive PEVA" src/
```

**Tâches**:
- [ ] Remplacer "PEVA" par "2iE GreenHub" (sauf dans noms de fichiers/variables)
- [ ] Remplacer "Newsletter PEVA" par "Newsletter 2iE Green HUB"
- [ ] Vérifier meta tags, titres de pages, SEO
- [ ] Mettre à jour les fichiers de configuration (package.json, .env, README)

### 1.2 Logos et Assets (Manuel 🔧)

**Tâches manuelles**:
- [ ] Remplacer logo PEVA par logo 2iE GreenHub dans `public/`
- [ ] Mettre à jour favicon
- [ ] Mettre à jour images de bannière
- [ ] Mettre à jour Open Graph images pour partage social
- [ ] Mettre à jour screenshots pour tests E2E

**Fichiers concernés**:
- `public/logo.png`
- `public/favicon.ico`
- `public/og-image.png`
- `src/assets/images/`

---

## 2. MODIFICATIONS CARTE INTERACTIVE

### 2.1 Titre et Description (Automatique ✅)

**Fichier**: `src/views/MapView.vue`

| Ligne | Changement |
|-------|-----------|
| 10 | `<h1>Carte Interactive PEVA</h1>` → `<h1>Carte Interactive 2iE GreenHub</h1>` |
| 11 | `<p>Entreprises de l'économie verte en Afrique</p>` → `<p>Entreprises de l'économie verte</p>` |

### 2.2 Secteurs d'Activité (Automatique ✅ + Config)

**Fichier**: `src/views/MapView.vue` (section data/computed)

**Modifications à faire**:
```javascript
// AVANT
sectors: [
  'Énergie Renouvelable',
  'Agriculture Durable',
  'Gestion des Déchets',
  'Transport Vert',
  'Construction Écologique',
  'Eau et Assainissement'
]

// APRÈS
sectors: [
  'Agriculture Durable',
  'Agroalimentaire',              // NOUVEAU
  'Construction Écologique',
  'Eau et Assainissement',
  'Écotourisme',                   // NOUVEAU
  'Énergie Renouvelable',         // Couleur jaune à ajouter
  'Gestion des Déchets',
  'Transport Vert'
].sort() // Tri alphabétique
```

**Tâches**:
- [ ] Ajouter secteur "Agroalimentaire"
- [ ] Ajouter secteur "Écotourisme"
- [ ] Trier les secteurs par ordre alphabétique
- [ ] Appliquer couleur jaune pour "Énergie Renouvelable"

**Code couleur à ajouter**:
```javascript
getSectorColor(sector) {
  const colors = {
    'Énergie Renouvelable': '#FFEB3B', // JAUNE
    'Agriculture Durable': '#4CAF50',
    'Agroalimentaire': '#FF9800',      // ORANGE
    'Gestion des Déchets': '#795548',
    'Transport Vert': '#2196F3',
    'Construction Écologique': '#9C27B0',
    'Eau et Assainissement': '#00BCD4',
    'Écotourisme': '#8BC34A'           // VERT CLAIR
  }
  return colors[sector] || '#757575'
}
```

### 2.3 Taille des Entreprises (Automatique ✅)

**Fichier**: `src/views/MapView.vue`

**AVANT**:
```javascript
companySizes: [
  { value: 'PME', label: 'PME (< 50 employés)' },
  { value: 'Moyenne', label: 'Moyenne (50-250)' },
  { value: 'Grande', label: 'Grande (> 250)' }
]
```

**APRÈS**:
```javascript
companySizes: [
  { value: 'TPME', label: 'TPME (1-10 employés)' },     // NOUVEAU
  { value: 'PME', label: 'PME (11-50 employés)' },      // MODIFIÉ
  { value: 'Moyenne', label: 'Moyenne (51-250)' },
  { value: 'Grande', label: 'Grande (> 250)' }
]
```

**Tâches**:
- [ ] Ajouter catégorie TPME (1-10 employés)
- [ ] Modifier PME (11-50 au lieu de < 50)
- [ ] Ajuster les marqueurs sur la carte pour TPME (plus petits)

**Code taille marqueurs**:
```javascript
getMarkerSize(companySize) {
  const sizes = {
    'TPME': 8,      // NOUVEAU - Plus petit
    'PME': 12,      // Existant
    'Moyenne': 16,
    'Grande': 20
  }
  return sizes[companySize] || 12
}
```

### 2.4 Filtres Géographiques (Automatique ✅)

**Fichier**: `src/views/MapView.vue`

**Modifications**:
- [ ] Tri alphabétique des pays
- [ ] Ajouter option "Autres" dans liste pays
- [ ] Ajouter champs "Région" et "Ville" dans recherche

**Code à ajouter**:
```javascript
// Tri alphabétique des pays
countries: [...this.uniqueCountries].sort((a, b) => 
  a.localeCompare(b, 'fr', { sensitivity: 'base' })
)

// Ajouter "Autres"
countries: [...this.uniqueCountries, 'Autres'].sort()
```

**Formulaire de recherche à enrichir**:
```vue
<v-text-field
  v-model="searchFilters.region"
  label="Région"
  variant="outlined"
  density="compact"
/>
<v-text-field
  v-model="searchFilters.city"
  label="Ville"
  variant="outlined"
  density="compact"
/>
```

### 2.5 Carte Bilingue (Manuel 🔧)

**Observation**: "Chercher une carte anglais français"

**Options**:
1. **Leaflet avec tuiles multilingues**
   - OpenStreetMap avec paramètre langue
   - Mapbox avec localization

2. **Sélecteur de langue**
```vue
<v-select
  v-model="mapLanguage"
  :items="['Français', 'English']"
  label="Langue de la carte"
  @update:model-value="changeMapLanguage"
/>
```

**Tâches**:
- [ ] Rechercher provider de cartes bilingues
- [ ] Implémenter basculement FR/EN
- [ ] Tester avec OpenStreetMap ou Mapbox

---

## 3. MODIFICATIONS ANNUAIRE

### 3.1 Titre et Description (Automatique ✅)

**Fichier**: `src/views/DirectoryView.vue`

| Ligne | Changement |
|-------|-----------|
| 10 | `Annuaire PEVA` → `Annuaire 2iE Green Hub` |
| 11 | `Découvrez les acteurs de l'économie verte en Afrique` → `Découvrez les acteurs de l'économie verte` |

### 3.2 Types de Profil (Automatique ✅)

**Fichier**: `src/views/DirectoryView.vue`

**AVANT**:
```javascript
profileTypes: [
  { value: 'entrepreneur', label: 'Entrepreneurs' },
  { value: 'investor', label: 'Investisseurs' },
  { value: 'organization', label: 'Organisations' },
  { value: 'recruiter', label: 'Recruteurs' }
]
```

**APRÈS**:
```javascript
profileTypes: [
  { value: 'learner', label: 'Apprenant' },                    // Remplace "entrepreneur"
  { value: 'company', label: 'Entreprises' },                  // Remplace "recruiter"
  { value: 'investor', label: 'Investisseur/banque' },         // Modifié
  { value: 'ptf', label: 'Partenaires techniques et financiers (PTF)' }, // Remplace "organization"
  { value: 'research', label: 'Institution de recherche/Université' }    // NOUVEAU
].sort((a, b) => a.label.localeCompare(b.label, 'fr'))
```

**Tâches**:
- [ ] Remplacer "entrepreneur" → "Apprenant"
- [ ] Remplacer "recruteurs" → "Entreprises"
- [ ] Remplacer "organisation" → "PTF"
- [ ] Modifier "Investisseur" → "Investisseur/banque"
- [ ] Ajouter "Institution de recherche/Université"
- [ ] Appliquer tri alphabétique

**⚠️ IMPORTANT**: Vérifier impact sur base de données (enum `user_type`)

### 3.3 Secteurs d'Expertise (Automatique ✅)

**Fichier**: `src/views/DirectoryView.vue`

**APRÈS**:
```javascript
expertiseSectors: [
  'Bilan carbone',
  'Gestion des déchets',
  'RSE/ESG',
  'Transformation agroalimentaire',
  'Éco-matériaux',
  'Équipementiers',
  'Communication d\'impact',
  'Autres'  // NOUVEAU
].sort()
```

**Tâches**:
- [ ] Remplacer secteurs génériques par secteurs spécifiques
- [ ] Ajouter onglet "Autres"
- [ ] Trier par ordre alphabétique

---

## 4. MODIFICATIONS PLACE DE MARCHÉ

### 4.1 Types d'Opportunités (Automatique ✅)

**Fichier**: `src/views/OpportunitiesView.vue`

**AVANT** (dans base de données):
```sql
CREATE TYPE opportunity_type AS ENUM (
  'job', 
  'internship', 
  'contract', 
  'funding', 
  'partnership', 
  'tender'
);
```

**APRÈS** (proposé):
```javascript
opportunityTypes: [
  { value: 'call_for_projects', label: 'Appels à projets' },    // NOUVEAU
  { value: 'internship', label: 'Stages' },                     // Existant
  { value: 'thesis', label: 'Thèses' },                         // NOUVEAU
  { value: 'fundraising', label: 'Found raising' },             // NOUVEAU
  { value: 'job', label: 'Emplois' },                           // Existant
  { value: 'equipment_sale', label: 'Vente et achats d\'équipements et matières' }, // NOUVEAU
  { value: 'business_idea', label: 'Idées business' }           // NOUVEAU
]
```

**⚠️ MIGRATION BASE DE DONNÉES REQUISE**:
```sql
-- À exécuter sur Supabase
ALTER TYPE opportunity_type ADD VALUE 'call_for_projects';
ALTER TYPE opportunity_type ADD VALUE 'thesis';
ALTER TYPE opportunity_type ADD VALUE 'fundraising';
ALTER TYPE opportunity_type ADD VALUE 'equipment_sale';
ALTER TYPE opportunity_type ADD VALUE 'business_idea';
```

**Tâches**:
- [ ] Ajouter nouveaux types dans enum SQL
- [ ] Mettre à jour interface Vue.js
- [ ] Mettre à jour formulaire création opportunité
- [ ] Tester migration données existantes

### 4.2 Explication Place de Marché (Manuel 🔧)

**Observation**: "Nous avions besoins d'explications"

**Tâches**:
- [ ] Créer section "Comment ça marche" sur OpportunitiesView
- [ ] Ajouter tooltip/modal explicatif
- [ ] Créer page d'aide dédiée

**Exemple de contenu**:
```vue
<v-alert type="info" class="mb-4">
  <h3>Comment fonctionne la Place de Marché ?</h3>
  <ul>
    <li>Publiez vos opportunités (emplois, stages, projets)</li>
    <li>Consultez les offres disponibles</li>
    <li>Candidatez directement en ligne</li>
    <li>Suivez l'état de vos candidatures</li>
  </ul>
</v-alert>
```

---

## 5. MODIFICATIONS RESSOURCES

### 5.1 Description (Automatique ✅)

**Fichier**: `src/views/ResourcesView.vue`

**Changement**:
```
AVANT: "Découvrir notre collection de guides, rapports, outils et formations pour l'économie verte en Afrique"
APRÈS: "Découvrir notre collection de guides, rapports, outils et formations pour l'économie verte"
```

### 5.2 Support Vidéo (Automatique ✅ + Supabase)

**Observation**: "Ya il des possibilités des tutoriels vidéo ?"

**Tâches**:
- [ ] Ajouter type "Vidéo/Tutoriel" dans filtres ressources
- [ ] Supporter upload vidéo ou liens YouTube/Vimeo
- [ ] Créer player vidéo dans modal détail ressource

**Code à ajouter**:
```javascript
resourceTypes: [
  { value: 'guide', label: 'Guides' },
  { value: 'report', label: 'Rapports' },
  { value: 'tool', label: 'Outils' },
  { value: 'training', label: 'Formations' },
  { value: 'video', label: 'Vidéos/Tutoriels' }  // NOUVEAU
]
```

**Composant vidéo**:
```vue
<v-dialog v-model="videoDialog" max-width="800">
  <video-player
    v-if="selectedResource.type === 'video'"
    :src="selectedResource.media_url"
    controls
  />
</v-dialog>
```

### 5.3 Filtres Secteurs (Automatique ✅)

**Tâches**:
- [ ] Adapter filtres aux mêmes secteurs d'activités que carte
- [ ] Synchroniser avec liste maître des secteurs

---

## 6. MODIFICATIONS ÉVÉNEMENTS

### 6.1 Titre (Automatique ✅)

**Fichier**: `src/views/EventsView.vue`

```
Ligne 10: "Événements PEVA" → "Événements 2iE Green Hub"
```

### 6.2 Tri par Secteurs (Automatique ✅)

**AVANT**: Tri par type (conference, workshop, webinar, etc.)

**APRÈS**: Tri par secteur d'activité

**Code à modifier**:
```javascript
// Remplacer
eventTypes: [
  { value: 'conference', label: 'Conférence' },
  { value: 'workshop', label: 'Atelier' },
  { value: 'webinar', label: 'Webinaire' }
]

// Par
eventSectors: [
  'Valorisation des déchets',
  'Bilan carbone',
  'Économie circulaire',
  'Énergies renouvelables',
  'Agriculture durable',
  // ... autres secteurs
]
```

**Tâches**:
- [ ] Ajouter colonne `sector` dans table `events` (Supabase)
- [ ] Modifier filtres Vue.js
- [ ] Mettre à jour formulaire création événement

### 6.3 Historique Événements (Automatique ✅)

**Tâches**:
- [ ] Ajouter onglet "Événements passés"
- [ ] Filtrer par `end_at < NOW()`
- [ ] Afficher avec style différent (grisé)

**Code à ajouter**:
```vue
<v-tab value="past-events">
  <v-icon class="mr-2">mdi-history</v-icon>
  Événements passés
</v-tab>

<v-tab-item value="past-events">
  <event-list
    :events="pastEvents"
    :is-past="true"
  />
</v-tab-item>
```

```javascript
computed: {
  pastEvents() {
    return this.events.filter(e => new Date(e.end_at) < new Date())
  }
}
```

### 6.4 Bande Annonce Défilante (Manuel 🔧)

**Observation**: "Ya il une possibilité d'ajouter une bande d'annonce pour faire défiler l'évènement ?"

**Options**:
1. **Carousel automatique**
```vue
<v-carousel
  cycle
  height="200"
  hide-delimiters
  show-arrows="hover"
>
  <v-carousel-item
    v-for="event in upcomingEvents.slice(0, 5)"
    :key="event.id"
  >
    <event-announcement-card :event="event" />
  </v-carousel-item>
</v-carousel>
```

2. **Marquee CSS**
```vue
<div class="event-marquee">
  <div class="marquee-content">
    <span v-for="event in upcomingEvents" :key="event.id">
      📅 {{ event.title }} - {{ formatDate(event.start_at) }}
    </span>
  </div>
</div>
```

**Tâches**:
- [ ] Choisir implémentation (Carousel vs Marquee)
- [ ] Créer composant EventAnnouncement
- [ ] Ajouter en haut de EventsView
- [ ] Rendre configurable (vitesse, durée)

---

## 7. FONCTIONNALITÉS NOUVELLES

### 7.1 Inscription avec Préférences (Manuel 🔧 + Supabase)

**Observation**: "Ajouter un onglet préférence (énergies renouvelables, formations, opportunités d'emplois, gestion des déchets)"

**Migration Supabase**:
```sql
-- Ajouter colonne préférences dans profiles
ALTER TABLE public.profiles 
ADD COLUMN preferences JSONB DEFAULT '{}';

-- Commentaire
COMMENT ON COLUMN public.profiles.preferences IS 'Préférences utilisateur: secteurs, types opportunités, notifications';
```

**Structure JSON proposée**:
```json
{
  "sectors": ["Énergies renouvelables", "Gestion des déchets"],
  "opportunity_types": ["job", "training"],
  "notification_frequency": "daily",
  "languages": ["fr", "en"]
}
```

**Modifications RegisterView.vue**:
```vue
<v-step value="preferences">
  <h3>Vos préférences</h3>
  
  <v-select
    v-model="form.preferences.sectors"
    :items="sectors"
    label="Secteurs d'intérêt"
    multiple
    chips
  />
  
  <v-select
    v-model="form.preferences.opportunity_types"
    :items="opportunityTypes"
    label="Types d'opportunités"
    multiple
    chips
  />
</v-step>
```

**Tâches**:
- [ ] Ajouter colonne `preferences` JSONB dans Supabase
- [ ] Créer step "Préférences" dans RegisterView
- [ ] Implémenter sauvegarde préférences
- [ ] Utiliser préférences pour filtrer contenu

### 7.2 Système de Notifications (Manuel 🔧)

**Observation**: "Créer un onglet alerte (cloches de notifications)"

**Tables Supabase existantes**:
- ✅ `notifications` (déjà créée)

**Tâches**:
- [ ] Créer composant NotificationBell dans AppHeader
- [ ] Implémenter badge count non-lus
- [ ] Créer menu dropdown notifications
- [ ] Marquer comme lu au clic
- [ ] Ajouter filtres notifications (types, dates)

**Composant à créer**:
```vue
<!-- components/NotificationBell.vue -->
<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-badge
          :content="unreadCount"
          :model-value="unreadCount > 0"
          color="red"
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>
    
    <v-list max-height="400" width="350">
      <v-list-item
        v-for="notif in notifications"
        :key="notif.id"
        @click="markAsRead(notif.id)"
        :class="{ 'bg-blue-lighten-5': !notif.is_read }"
      >
        <notification-item :notification="notif" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>
```

**Intégration**:
```vue
<!-- AppHeader.vue -->
<notification-bell />
```

### 7.3 Upload Photos/Logos Profils (Automatique ✅)

**Observation**: "Création des profils, mettre une possibilité de mettre les photos, logos de l'entreprise"

**État actuel**:
- ✅ Storage bucket `peva-public/avatars/` existe
- ✅ Storage bucket `peva-public/company_logos/` existe
- ✅ Colonne `avatar_url` dans `profiles`
- ✅ Colonne `logo_url` dans `companies`

**Tâches**:
- [ ] Ajouter composant ImageUploader
- [ ] Intégrer dans ProfileView (avatar)
- [ ] Intégrer dans formulaire entreprise (logo)
- [ ] Implémenter crop/resize image
- [ ] Ajouter preview avant upload

**Composant à créer**:
```vue
<!-- components/ImageUploader.vue -->
<template>
  <div class="image-uploader">
    <v-avatar size="120" class="mb-4">
      <v-img :src="previewUrl || currentImage" />
    </v-avatar>
    
    <v-file-input
      v-model="file"
      accept="image/*"
      label="Choisir une image"
      prepend-icon="mdi-camera"
      @change="handleFileChange"
    />
    
    <v-btn
      v-if="file"
      color="primary"
      @click="uploadImage"
      :loading="uploading"
    >
      Uploader
    </v-btn>
  </div>
</template>
```

### 7.4 Partage Social (Manuel 🔧)

**Observation**: "Sur toutes les publications ajouter l'onglée de partage sur linkding, whatsap, facebook"

**Tâches**:
- [ ] Créer composant SocialShareButtons
- [ ] Intégrer sur toutes les cartes de contenu
- [ ] Supporter: LinkedIn, WhatsApp, Facebook, Twitter/X
- [ ] Générer URLs de partage appropriées

**Composant à créer**:
```vue
<!-- components/SocialShareButtons.vue -->
<template>
  <div class="social-share-buttons">
    <v-btn
      icon
      size="small"
      @click="shareOnLinkedIn"
      title="Partager sur LinkedIn"
    >
      <v-icon>mdi-linkedin</v-icon>
    </v-btn>
    
    <v-btn
      icon
      size="small"
      @click="shareOnWhatsApp"
      title="Partager sur WhatsApp"
    >
      <v-icon>mdi-whatsapp</v-icon>
    </v-btn>
    
    <v-btn
      icon
      size="small"
      @click="shareOnFacebook"
      title="Partager sur Facebook"
    >
      <v-icon>mdi-facebook</v-icon>
    </v-btn>
    
    <v-btn
      icon
      size="small"
      @click="shareOnTwitter"
      title="Partager sur X/Twitter"
    >
      <v-icon>mdi-twitter</v-icon>
    </v-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  url: String,
  title: String,
  description: String
})

const shareOnLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`
  window.open(url, '_blank')
}

const shareOnWhatsApp = () => {
  const text = `${props.title} - ${props.url}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`
  window.open(url, '_blank')
}

const shareOnTwitter = () => {
  const text = `${props.title}`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(props.url)}`
  window.open(url, '_blank')
}
</script>
```

**Intégration sur cartes**:
```vue
<!-- Exemple: OpportunityCard.vue -->
<v-card-actions>
  <v-btn>Voir détails</v-btn>
  <v-spacer />
  <social-share-buttons
    :url="`${window.location.origin}/opportunities/${opportunity.id}`"
    :title="opportunity.title"
    :description="opportunity.description"
  />
</v-card-actions>
```

### 7.5 Newsletter 2iE Green HUB (Automatique ✅)

**Fichier**: `src/views/auth/RegisterView.vue`

**Tâches**:
- [ ] Remplacer "Newsletter PEVA" → "Newsletter 2iE Green HUB"
- [ ] Vérifier intégration service email (Mailchimp, SendGrid, etc.)

---

## 8. MODIFICATIONS BASE DE DONNÉES

### 8.1 Migrations Supabase Requises

**Fichier à créer**: `migrations/20241229_migration_2ie_greenhub.sql`

```sql
-- ================================================
-- MIGRATION PEVA → 2iE GREENHUB
-- Date: 2024-12-29
-- ================================================

BEGIN;

-- 1. Ajouter colonne préférences
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

COMMENT ON COLUMN public.profiles.preferences IS 
'Préférences utilisateur: secteurs d''intérêt, types opportunités, langue';

-- 2. Ajouter secteur aux événements
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS sector TEXT;

COMMENT ON COLUMN public.events.sector IS 
'Secteur d''activité: valorisation déchets, bilan carbone, etc.';

-- 3. Étendre enum opportunity_type
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'call_for_projects';
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'thesis';
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'fundraising';
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'equipment_sale';
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'business_idea';

-- 4. Ajouter région/ville aux entreprises
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- 5. Ajouter support vidéo aux ressources
-- (colonne media_url existe déjà, juste documenter usage)
COMMENT ON COLUMN public.resources.media_url IS 
'URL fichier/vidéo dans storage ou lien externe (YouTube, Vimeo)';

COMMIT;
```

**Tâches**:
- [ ] Créer fichier migration SQL
- [ ] Tester en local
- [ ] Exécuter sur Supabase Production
- [ ] Vérifier rollback si erreur

### 8.2 Données de Référence

**Fichier à créer**: `seeds/sectors_and_types.sql`

```sql
-- Secteurs d'activité (pour référence)
-- À intégrer dans l'application comme constantes

-- Secteurs principaux
INSERT INTO reference_data (category, value, label_fr, display_order) VALUES
('sector', 'agriculture_durable', 'Agriculture Durable', 1),
('sector', 'agroalimentaire', 'Agroalimentaire', 2),
('sector', 'bilan_carbone', 'Bilan carbone', 3),
('sector', 'construction_ecologique', 'Construction Écologique', 4),
('sector', 'eau_assainissement', 'Eau et Assainissement', 5),
('sector', 'eco_materiaux', 'Éco-matériaux', 6),
('sector', 'ecotourisme', 'Écotourisme', 7),
('sector', 'energie_renouvelable', 'Énergie Renouvelable', 8),
('sector', 'gestion_dechets', 'Gestion des Déchets', 9),
('sector', 'transport_vert', 'Transport Vert', 10);

-- Types de profils
INSERT INTO reference_data (category, value, label_fr, display_order) VALUES
('profile_type', 'learner', 'Apprenant', 1),
('profile_type', 'company', 'Entreprises', 2),
('profile_type', 'investor', 'Investisseur/banque', 3),
('profile_type', 'ptf', 'Partenaires techniques et financiers (PTF)', 4),
('profile_type', 'research', 'Institution de recherche/Université', 5);
```

---

## 9. TIMELINE ET PRIORISATION

### Phase 1: REBRANDING (1 semaine)
**Priorité**: 🔴 CRITIQUE

- [ ] **Jour 1-2**: Remplacement textes PEVA → 2iE GreenHub
  - MapView.vue
  - DirectoryView.vue
  - EventsView.vue
  - ResourcesView.vue
  - AppHeader.vue
  - LandingView.vue
  
- [ ] **Jour 3-4**: Logos et assets
  - Remplacement logos
  - Favicon
  - Images SEO
  
- [ ] **Jour 5**: Tests et validation
  - Tests E2E
  - Validation visuelle
  - SEO check

### Phase 2: MODIFICATIONS STRUCTURELLES (2 semaines)
**Priorité**: 🟠 HAUTE

- [ ] **Semaine 1**: Secteurs et catégories
  - Ajout secteurs (Agroalimentaire, Écotourisme)
  - Modification types profils
  - Modification tailles entreprises (TPME, PME)
  - Tri alphabétique
  
- [ ] **Semaine 2**: Base de données
  - Migrations Supabase
  - Nouveaux types opportunités
  - Ajout région/ville
  - Tests migration

### Phase 3: NOUVELLES FONCTIONNALITÉS (3 semaines)
**Priorité**: 🟡 MOYENNE

- [ ] **Semaine 1**: Notifications et préférences
  - Système notifications
  - Préférences inscription
  - Badge notifications
  
- [ ] **Semaine 2**: Médias et partage
  - Support vidéos tutoriels
  - Boutons partage social
  - Upload photos/logos
  
- [ ] **Semaine 3**: Événements améliorés
  - Tri par secteurs
  - Historique événements
  - Bande annonce défilante

### Phase 4: AMÉLIORATIONS UX (1 semaine)
**Priorité**: 🟢 BASSE

- [ ] Carte bilingue FR/EN
- [ ] Explications Place de Marché
- [ ] Optimisations performances
- [ ] Tests utilisateurs

---

## 10. CHECKLIST FINALE

### ✅ Avant Déploiement

**Tests**:
- [ ] Tests E2E passent (playwright)
- [ ] Tests unitaires passent
- [ ] Tests manuels sur dev
- [ ] Tests sur staging

**Documentation**:
- [ ] README mis à jour
- [ ] CHANGELOG créé
- [ ] Documentation utilisateur
- [ ] Guide migration pour équipe

**Sécurité**:
- [ ] Vérifier RLS policies Supabase
- [ ] Vérifier variables d'environnement
- [ ] Scanner vulnérabilités (npm audit)
- [ ] Backup base de données

**Performance**:
- [ ] Lighthouse score > 90
- [ ] Bundle size < 500KB
- [ ] Images optimisées
- [ ] Lazy loading activé

**SEO**:
- [ ] Meta tags mis à jour
- [ ] Open Graph images
- [ ] Sitemap généré
- [ ] robots.txt configuré

---

## 11. RISQUES ET MITIGATIONS

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Migration enum casse données existantes | 🔴 Élevé | Moyenne | Backup + test rollback |
| Changement types profils impacte utilisateurs | 🟠 Moyen | Haute | Migration douce + emails |
| Nouveau branding non validé | 🟡 Faible | Faible | Validation client avant |
| Performance dégradée | 🟡 Faible | Moyenne | Tests de charge |

---

## 12. CONTACTS ET VALIDATIONS

**Validations requises**:
- [ ] Logo 2iE GreenHub (Design)
- [ ] Palette couleurs (Design)
- [ ] Textes marketing (Communication)
- [ ] Nouveaux types opportunités (Business)
- [ ] Migration base données (Tech Lead)

**Responsables**:
- **Rebranding**: Designer + Front-end Dev
- **Base de données**: Back-end Dev + DBA
- **Nouvelles fonctionnalités**: Full-stack Dev
- **Tests**: QA Team
- **Déploiement**: DevOps

---

## 13. NOTES TECHNIQUES

### Fichiers à Modifier (Liste exhaustive)

**Vues (40 fichiers)**:
```
src/views/MapView.vue                    - Carte Interactive
src/views/DirectoryView.vue              - Annuaire
src/views/EventsView.vue                 - Événements
src/views/ResourcesView.vue              - Ressources
src/views/OpportunitiesView.vue          - Place de Marché
src/views/LandingView.vue                - Page accueil
src/views/auth/RegisterView.vue          - Inscription
src/components/AppHeader.vue             - Header global
```

**Services**:
```
src/services/dataService.js              - Adapter nouveaux types
src/services/fileService.js              - Upload images
```

**Configuration**:
```
package.json                             - Nom projet
.env                                     - Variables
public/index.html                        - Meta tags
```

### Commandes Utiles

**Recherche**:
```bash
# Trouver toutes occurrences PEVA
grep -r "PEVA" src/ --exclude-dir=node_modules

# Trouver types d'opportunités
grep -r "opportunity_type" src/

# Trouver secteurs
grep -r "sectors" src/ | grep -i "array\|items"
```

**Tests**:
```bash
# Tests E2E
npm run test:e2e

# Tests unitaires
npm run test:unit

# Linter
npm run lint
```

---

**FIN DU DOCUMENT**

📅 **Date de création**: 29 Décembre 2024  
📝 **Statut**: Planification complète - En attente d'exécution  
✍️ **Auteur**: Assistant AI (Documentation exhaustive)

**Ce document doit être validé avant toute implémentation.**
