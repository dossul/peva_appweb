# 📋 CHANGELOG - Améliorations Opportunités & Réseaux Sociaux

**Date**: 4 janvier 2026  
**Version**: 1.2.0  
**Auteur**: Équipe PEVA

---

## 🎯 Objectif

Amélioration complète du workflow des opportunités avec :
- ✅ Validation cohérente des dates
- ✅ Gestion multi-fichiers
- ✅ Système Premium avec mise en avant
- ✅ Partage automatique sur réseaux sociaux
- ✅ Correction bugs d'enregistrement

---

## 🐛 Bugs Corrigés

### 1. **Erreur d'enregistrement des opportunités**
- **Problème**: Mapping incorrect des champs `salary_min`/`salary_max` dans `opportunitiesService.js`
- **Solution**: Logique de mapping intelligente selon le type d'opportunité
  - **Financement**: `funding_amount` → `salary_min`
  - **Mission**: `daily_rate` → `salary_min`
  - **Emploi**: `salary_min` et `salary_max` directs
  - **Autres**: Parsing du champ `budget_salary`

### 2. **Fichiers joints non sauvegardés**
- **Problème**: Les fichiers étaient uploadés mais pas enregistrés en base
- **Solution**: Ajout du champ `attachments` dans `adaptedData` avec métadonnées complètes

### 3. **Erreur async listener**
- **Problème**: Message d'erreur dans la console lors de la création
- **Solution**: Correction du mapping et gestion asynchrone des uploads

---

## ✨ Nouvelles Fonctionnalités

### 1. **Validation des Dates** ⏰

**Fichier**: `peva/src/views/CreateOpportunityView.vue`

**Règles implémentées**:
- ✅ Date limite ≥ Aujourd'hui
- ✅ Date de début > Date limite
- ✅ Validation en temps réel dans le formulaire
- ✅ Messages d'erreur explicites

**Code ajouté**:
```javascript
rules: {
  futureDate: value => {
    if (!value) return true
    const date = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today || 'La date doit être ultérieure ou égale à aujourd\'hui'
  },
  afterDeadline: (value) => {
    if (!value || !opportunityData.value.deadline) return true
    const startDate = new Date(value)
    const deadline = new Date(opportunityData.value.deadline)
    return startDate > deadline || 'La date de début doit être après la date limite'
  }
}
```

---

### 2. **Gestion Multi-Fichiers** 📎

**Fichier**: `peva/src/views/CreateOpportunityView.vue`

**Fonctionnalités**:
- ✅ Upload multiple de fichiers (PDF, DOC, XLS, PPT)
- ✅ Limite de 10MB par fichier
- ✅ Prévisualisation des fichiers sélectionnés
- ✅ Suppression individuelle avant upload
- ✅ Icônes selon le type de fichier
- ✅ Affichage de la taille formatée

**Formats acceptés**: `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, `.xls`, `.xlsx`, `.txt`

---

### 3. **Système Premium** ⭐

#### **Base de données** (`add_social_and_premium_features.sql`)

**Nouvelles colonnes** dans `pev_opportunities`:
```sql
ALTER TABLE public.pev_opportunities 
ADD COLUMN IF NOT EXISTS premium_starts_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS premium_ends_at TIMESTAMPTZ;
```

**Index de performance**:
```sql
CREATE INDEX idx_opportunities_premium_active 
ON public.pev_opportunities(promote_premium, premium_starts_at, premium_ends_at);
```

#### **Frontend** (`OpportunitiesView.vue`)

**Affichage Featured**:
- Badge "À la une" doré avec icône étoile
- Bordure dorée autour de la carte
- Fond légèrement jaune
- Effet hover spécial

**Tri intelligent**:
- Opportunités Premium affichées en premier
- Tri par date pour les opportunités de même niveau
- Option "Trier par pertinence" priorise le Premium

**CSS ajouté**:
```css
.premium-card {
  border: 2px solid #FFC107;
  background: linear-gradient(to bottom right, #fff, #fffbf0);
}

.premium-card:hover {
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.2) !important;
}
```

---

### 4. **Partage Automatique Réseaux Sociaux** 🌐

#### **Base de données**

**Table `pev_social_accounts`** - Comptes sociaux GreenHub:
```sql
CREATE TABLE public.pev_social_accounts (
    id UUID PRIMARY KEY,
    platform VARCHAR(50) CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram')),
    name VARCHAR(100) NOT NULL,
    credentials JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id)
);
```

**Table `pev_social_posts`** - Historique des publications:
```sql
CREATE TABLE public.pev_social_posts (
    id UUID PRIMARY KEY,
    opportunity_id UUID REFERENCES public.pev_opportunities(id),
    social_account_id UUID REFERENCES public.pev_social_accounts(id),
    platform VARCHAR(50) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'published', 'failed', 'skipped')),
    external_post_id VARCHAR(255),
    error_message TEXT,
    posted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    retry_count INTEGER DEFAULT 0
);
```

**Sécurité RLS**:
- Admins peuvent gérer tous les comptes sociaux
- Créateurs d'opportunités voient l'historique de leurs publications
- Policies strictes pour protéger les credentials

#### **Service Backend** (`services/admin/socialService.js`)

**Fonctionnalités**:
- ✅ CRUD complet pour les comptes sociaux
- ✅ Fonction `shareOpportunity()` (stub pour simulation)
- ✅ Récupération de l'historique des partages
- ✅ Gestion d'erreurs robuste

**Méthodes principales**:
```javascript
- getSocialAccounts()
- addSocialAccount(accountData)
- updateSocialAccount(id, updates)
- deleteSocialAccount(id)
- shareOpportunity(opportunity, accounts)
- getShareHistory(limit)
```

#### **Interface Admin** (`views/admin/AdminSocialView.vue`)

**Fonctionnalités**:
- 📊 Dashboard avec statistiques (comptes actifs, publications totales, en attente)
- 📝 CRUD complet des comptes sociaux
- 🔄 Activation/désactivation en un clic
- 📜 Historique des publications avec filtres
- 🎨 Interface moderne avec Vuetify
- 🔍 Recherche et tri des données

**Plateformes supportées**:
- Facebook
- Twitter
- LinkedIn
- Instagram

**Route**: `/admin/social`

---

## 📁 Fichiers Modifiés

### **Frontend**

1. **`peva/src/views/CreateOpportunityView.vue`**
   - Ajout validation dates (lignes 361-376, 861-898)
   - Gestion multi-fichiers déjà présente
   - Checkboxes Premium et Auto-share déjà présentes

2. **`peva/src/views/OpportunitiesView.vue`**
   - Badge Premium et style `.premium-card` (lignes 153-174, 919-927)
   - Tri intelligent Premium first (lignes 560-581)

3. **`peva/src/services/opportunitiesService.js`**
   - Mapping intelligent des montants (lignes 111-130)
   - Sauvegarde attachments et options Premium (lignes 132-137)

4. **`peva/src/router/index.js`**
   - Import `AdminSocialView` (ligne 44)
   - Route `/admin/social` (lignes 476-485)

### **Nouveaux Fichiers**

5. **`peva/src/services/admin/socialService.js`** ✨
   - Service complet pour gestion réseaux sociaux

6. **`peva/src/views/admin/AdminSocialView.vue`** ✨
   - Interface admin pour comptes sociaux et historique

### **Base de Données**

7. **`peva/supabase/migrations/add_social_and_premium_features.sql`** ✨
   - Migration complète Premium + Social

---

## 🚀 Instructions de Déploiement

### **1. Appliquer la Migration SQL**

**Via Supabase Dashboard**:
1. Connectez-vous à [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet PEVA
3. Allez dans **SQL Editor**
4. Ouvrez le fichier `peva/supabase/migrations/add_social_and_premium_features.sql`
5. Copiez tout le contenu
6. Collez dans l'éditeur SQL
7. Cliquez sur **Run** (ou `Ctrl+Enter`)
8. Vérifiez qu'il n'y a pas d'erreurs

**Vérification**:
```sql
-- Vérifier les nouvelles colonnes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pev_opportunities' 
AND column_name IN ('premium_starts_at', 'premium_ends_at');

-- Vérifier les nouvelles tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('pev_social_accounts', 'pev_social_posts');
```

### **2. Déployer le Frontend**

**Depuis le dossier `peva/`**:
```bash
cd c:\wamp64\www\peva_appweb\peva
git add .
git commit -m "feat: Premium opportunities + Social media sharing"
git push origin master
vercel --prod
```

### **3. Tester les Fonctionnalités**

**Création d'opportunité**:
1. Aller sur `/opportunities/create`
2. Remplir le formulaire
3. Tester validation des dates
4. Uploader plusieurs fichiers
5. Cocher "Promouvoir (Premium)"
6. Cocher "Partager sur réseaux sociaux"
7. Publier

**Vérification Premium**:
1. Aller sur `/opportunities`
2. Vérifier badge "À la une"
3. Vérifier style doré de la carte
4. Vérifier tri (Premium en premier)

**Admin Social**:
1. Se connecter en tant qu'admin
2. Aller sur `/admin/social`
3. Ajouter un compte social (simulation)
4. Vérifier l'historique des publications

---

## 🔄 Workflow Complet

### **Création d'Opportunité Premium**

```
1. Utilisateur crée opportunité
   ↓
2. Remplit formulaire (validation dates)
   ↓
3. Upload fichiers multiples
   ↓
4. Coche "Premium" + "Auto-share"
   ↓
5. Soumet (status: pending)
   ↓
6. Admin modère (/admin/moderation)
   ↓
7. Si approuvé:
   - Status → published
   - Si Premium: Affiché en premier
   - Si Auto-share: Partage simulé sur réseaux sociaux
   ↓
8. Historique enregistré dans pev_social_posts
```

---

## 📊 Impact & Métriques

### **Améliorations UX**
- ✅ Validation temps réel des dates
- ✅ Upload multi-fichiers intuitif
- ✅ Visibilité claire des opportunités Premium
- ✅ Tri intelligent par pertinence

### **Améliorations Techniques**
- ✅ Mapping de données robuste
- ✅ Gestion d'erreurs améliorée
- ✅ Architecture extensible pour réseaux sociaux
- ✅ RLS sécurisé pour nouvelles tables

### **Nouvelles Capacités**
- ✅ Monétisation via Premium
- ✅ Visibilité accrue des opportunités
- ✅ Distribution automatique sur réseaux sociaux
- ✅ Historique et analytics des publications

---

## 🔮 Évolutions Futures

### **Court Terme**
- [ ] Intégration réelle API Facebook Graph
- [ ] Intégration réelle API Twitter
- [ ] Intégration réelle API LinkedIn
- [ ] Système de paiement pour Premium
- [ ] Analytics détaillées des partages

### **Moyen Terme**
- [ ] Planification des publications
- [ ] A/B testing des messages sociaux
- [ ] Rapports d'engagement par plateforme
- [ ] Automatisation complète du workflow

### **Long Terme**
- [ ] IA pour optimisation des posts
- [ ] Ciblage géographique des partages
- [ ] Intégration Instagram Business API
- [ ] Dashboard analytics avancé

---

## 📞 Support

**Questions ou problèmes ?**
- Documentation: `INDEX_CODEBASE.md`
- Workflow: `docs/WORKFLOW-OPPORTUNITES.md`
- Tests: Lancer `npm run test:e2e`

---

## ✅ Checklist de Validation

- [x] Migration SQL créée
- [x] Validation dates implémentée
- [x] Multi-fichiers fonctionnel
- [x] Premium workflow complet
- [x] Service social créé
- [x] Interface admin créée
- [x] Route admin ajoutée
- [x] Styles Premium ajoutés
- [x] Tri Premium implémenté
- [ ] Migration SQL appliquée (À faire par l'utilisateur)
- [ ] Tests E2E mis à jour
- [ ] Déploiement Vercel effectué

---

**🎉 Fin du Changelog - Version 1.2.0**
