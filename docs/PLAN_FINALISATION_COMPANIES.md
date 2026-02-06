# Plan de Finalisation - Module Companies PEVA

**Dernière mise à jour: 6 février 2026**

## ✅ IMPLÉMENTATION TERMINÉE

### Fichiers créés:
- `scripts/sql/001_create_company_tables.sql` - Schéma SQL complet
- `peva/src/services/claimService.js` - Service de réclamation d'entreprise
- `peva/src/views/MyCompaniesView.vue` - Vue "Mes entreprises"
- `peva/src/views/CompanyAdminView.vue` - Vue administration entreprise
- `peva/seed_companies.cjs` - Seeder pour importer les 20 entreprises

### Fonctionnalités implémentées:
1. **Système de Claims** - Réclamation d'entreprise avec modération admin
2. **Multi-entreprises** - Un utilisateur peut gérer plusieurs entreprises
3. **Gestion complète** - Fiche, logo, déclarations ESG, émissions, déchets
4. **Bouton Réclamer** - Ajouté sur la carte MapView
5. **Email de confirmation** - Envoyé lors de l'approbation/rejet

---

## 1. Analyse de l'Existant

### 1.1 Table `pev_companies` - Structure Actuelle

```sql
-- 24 colonnes identifiées dans le codebase
id              -- UUID PK
owner_id        -- FK -> pev_profiles
name            -- varchar
slug            -- varchar unique
description     -- text
mission         -- text
industry        -- varchar (secteur)
size            -- varchar (tpme, pme, moyenne, grande)
founded_year    -- integer
headquarters    -- varchar
country         -- varchar
city            -- varchar
logo_url        -- text
cover_image_url -- text
website         -- varchar
email           -- varchar
phone           -- varchar
activity_sector -- varchar
employees       -- integer
latitude        -- decimal
longitude       -- decimal
is_verified     -- boolean
status          -- varchar (draft, in_review, published, rejected)
created_at      -- timestamptz
updated_at      -- timestamptz
```

### 1.2 Tables Connexes Existantes

| Table | État | Description |
|-------|------|-------------|
| `pev_companies` | ✅ Existe (vide) | Référentiel entreprises |
| `pev_company_members` | ✅ Existe (vide) | Membres/équipe |
| `pev_company_join_requests` | ⚠️ Référencée dans code | Demandes d'adhésion |
| `pev_company_rse_reports` | ⚠️ Référencée dans code | Rapports RSE |
| `pev_profiles` | ✅ Existe (7 lignes) | Utilisateurs |
| `pev_sectors` | ✅ Existe (17 lignes) | Secteurs d'activité |

### 1.3 Tables MANQUANTES pour le Schéma Relationnel

| Table Proposée | Équivalent Existant | Action |
|----------------|---------------------|--------|
| `periode` | ❌ N'existe pas | À créer |
| `campagne_reporting` | ❌ N'existe pas | À créer (optionnel) |
| `declaration` | ❌ N'existe pas | À créer |
| `declaration_rh` | ❌ N'existe pas | À créer |
| `declaration_emissions` | ❌ N'existe pas | À créer |
| `declaration_dechets` | ❌ N'existe pas | À créer |
| `odd` | ❌ N'existe pas | À créer (référentiel) |
| `politique` | ❌ N'existe pas | À créer (référentiel) |

### 1.4 Services Existants

| Service | Fichier | Fonctionnalités |
|---------|---------|-----------------|
| `companyService` | `src/services/companyService.js` | CRUD entreprise, join requests, membres |
| `companyManagementService` | `src/services/admin/companyManagementService.js` | Admin: vérification, stats, export |
| `rseService` | `src/services/rseService.js` | Rapports RSE |

### 1.5 Vues Existantes

| Vue | Fichier | État |
|-----|---------|------|
| `CompanyManagementView` | `src/views/CompanyManagementView.vue` | Profil + onglets RSE/équipe/paramètres |
| `CompanySearchJoin` | `src/components/company/CompanySearchJoin.vue` | Recherche et demande d'adhésion |
| `AdminCompaniesManager` | `src/components/admin/AdminCompaniesManager.vue` | Gestion admin |

---

## 2. Schéma Relationnel Proposé vs Existant

### 2.1 Mapping Conceptuel

```
SCHÉMA PROPOSÉ                    EXISTANT PEVA
─────────────────────────────────────────────────
entreprise                   →    pev_companies ✅
periode                      →    À CRÉER
campagne_reporting           →    À CRÉER (optionnel)
declaration                  →    pev_company_declarations (À CRÉER)
declaration_rh               →    pev_company_declaration_rh (À CRÉER)
declaration_emissions        →    pev_company_declaration_emissions (À CRÉER)
declaration_dechets          →    pev_company_declaration_waste (À CRÉER)
odd                          →    pev_sdg (À CRÉER - référentiel ODD)
politique                    →    pev_policies (À CRÉER - référentiel politiques)
utilisateur                  →    pev_profiles ✅ (existe avec rôles)
```

### 2.2 Adaptation au Contexte PEVA

Le schéma proposé est excellent. Voici les adaptations recommandées:

1. **Préfixe `pev_`** pour toutes les tables (convention existante)
2. **Utiliser `pev_profiles`** au lieu de créer `utilisateur`
3. **Intégrer avec `pev_sectors`** existant
4. **Conserver les colonnes de `pev_companies`** et étendre

---

## 3. Plan de Migration SQL

### Phase 1: Tables de Référentiel (Prérequis)

```sql
-- 1.1 Table des périodes
CREATE TABLE pev_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('ANNUEL', 'TRIMESTRIEL', 'MENSUEL')),
  year INTEGER NOT NULL,
  month INTEGER CHECK (month BETWEEN 1 AND 12),
  quarter INTEGER CHECK (quarter BETWEEN 1 AND 4),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  label VARCHAR(50) NOT NULL, -- ex: "2025", "2025-T1", "2025-05"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(type, year, month, quarter)
);

-- 1.2 Table des ODD (Objectifs de Développement Durable)
CREATE TABLE pev_sdg (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE, -- ex: "ODD1", "ODD2"
  number INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 17),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7), -- hex color
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Table des politiques RSE
CREATE TABLE pev_policies (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE, -- ex: "RSE", "SST", "ENV"
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- ex: "social", "environnement", "gouvernance"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 Campagnes de reporting (optionnel mais recommandé)
CREATE TABLE pev_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  period_id UUID REFERENCES pev_periods(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'OPEN', 'CLOSED')),
  description TEXT,
  created_by UUID REFERENCES pev_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Phase 2: Extension de `pev_companies`

```sql
-- 2.1 Ajouter les colonnes manquantes à pev_companies
ALTER TABLE pev_companies ADD COLUMN IF NOT EXISTS main_activities TEXT;
ALTER TABLE pev_companies ADD COLUMN IF NOT EXISTS date_creation DATE;
ALTER TABLE pev_companies ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE pev_companies ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES pev_profiles(id);
ALTER TABLE pev_companies ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;
ALTER TABLE pev_companies ADD COLUMN IF NOT EXISTS sdg_contributions JSONB DEFAULT '[]';
```

### Phase 3: Tables de Déclarations

```sql
-- 3.1 Table pivot centrale des déclarations
CREATE TABLE pev_company_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES pev_companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES pev_periods(id),
  campaign_id UUID REFERENCES pev_campaigns(id),
  source VARCHAR(20) NOT NULL CHECK (source IN ('ADMIN', 'COMPANY')),
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'VALIDATED', 'REJECTED')),
  submitted_at TIMESTAMPTZ,
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES pev_profiles(id),
  admin_notes TEXT,
  company_notes TEXT,
  created_by UUID REFERENCES pev_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, period_id) -- Une seule déclaration par entreprise par période
);

-- 3.2 Données RH par déclaration
CREATE TABLE pev_company_declaration_hr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL UNIQUE REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  employee_count INTEGER,
  cdi_ratio DECIMAL(5,2), -- % CDI
  cdd_ratio DECIMAL(5,2), -- % CDD
  temporary_count INTEGER,
  temporary_ratio DECIMAL(5,2),
  contractor_count INTEGER,
  local_purchases_ratio DECIMAL(5,2),
  local_purchases_amount DECIMAL(15,2),
  water_consumption_m3 DECIMAL(15,2),
  fuel_consumption_liters DECIMAL(15,2),
  solar_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Données émissions par déclaration
CREATE TABLE pev_company_declaration_emissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL UNIQUE REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  total_emissions DECIMAL(15,2),
  scope1_emissions DECIMAL(15,2),
  scope2_emissions DECIMAL(15,2),
  scope3_emissions DECIMAL(15,2),
  unit VARCHAR(20) DEFAULT 'tCO2e',
  methodology TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Données déchets par déclaration
CREATE TABLE pev_company_declaration_waste (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL UNIQUE REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  solid_waste_value DECIMAL(15,2),
  solid_waste_unit VARCHAR(20), -- t/an, kg/mois, etc.
  liquid_waste_value DECIMAL(15,2),
  liquid_waste_unit VARCHAR(20),
  composted_value DECIMAL(15,2),
  composted_unit VARCHAR(20),
  valorization_initiatives TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 Pivot déclaration <-> ODD
CREATE TABLE pev_company_declaration_sdg (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  sdg_id INTEGER NOT NULL REFERENCES pev_sdg(id),
  contribution_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(declaration_id, sdg_id)
);

-- 3.6 Pivot déclaration <-> Politiques
CREATE TABLE pev_company_declaration_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  policy_id INTEGER NOT NULL REFERENCES pev_policies(id),
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(declaration_id, policy_id)
);
```

### Phase 4: Historique et Audit

```sql
-- 4.1 Historique des modifications
CREATE TABLE pev_company_declaration_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  declaration_id UUID NOT NULL REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'submitted', 'validated', 'rejected'
  changed_by UUID NOT NULL REFERENCES pev_profiles(id),
  changes JSONB NOT NULL,
  previous_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Phase 5: RLS Policies

```sql
-- 5.1 Policies pour pev_company_declarations
ALTER TABLE pev_company_declarations ENABLE ROW LEVEL SECURITY;

-- Admins voient tout
CREATE POLICY "Admins can do everything on declarations" ON pev_company_declarations
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM pev_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Entreprises voient leurs propres déclarations
CREATE POLICY "Companies can view own declarations" ON pev_company_declarations
  FOR SELECT TO authenticated
  USING (
    company_id IN (
      SELECT id FROM pev_companies WHERE owner_id = auth.uid()
      UNION
      SELECT company_id FROM pev_company_members WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

-- Entreprises peuvent créer/modifier leurs brouillons
CREATE POLICY "Companies can manage own draft declarations" ON pev_company_declarations
  FOR ALL TO authenticated
  USING (
    status = 'DRAFT' AND
    company_id IN (
      SELECT id FROM pev_companies WHERE owner_id = auth.uid()
      UNION
      SELECT company_id FROM pev_company_members WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );
```

---

## 4. Plan d'Implémentation Backend (Services)

### 4.1 Nouveaux Services à Créer

```
src/services/
├── declarationService.js       # CRUD déclarations
├── periodService.js            # Gestion des périodes
├── campaignService.js          # Gestion des campagnes (optionnel)
├── sdgService.js               # Référentiel ODD
├── policyService.js            # Référentiel politiques
└── admin/
    └── declarationAdminService.js  # Admin: validation, stats
```

### 4.2 Structure du `declarationService.js`

```javascript
export const declarationService = {
  // === CRUD Déclarations ===
  async createDeclaration(companyId, periodId, source = 'COMPANY'),
  async getDeclaration(declarationId),
  async getDeclarationsByCompany(companyId, filters = {}),
  async getDeclarationsByPeriod(periodId, filters = {}),
  async updateDeclaration(declarationId, data),
  async deleteDeclaration(declarationId),
  
  // === Workflow ===
  async submitDeclaration(declarationId),
  async validateDeclaration(declarationId, adminId, notes),
  async rejectDeclaration(declarationId, adminId, reason),
  
  // === Données spécifiques ===
  async saveHRData(declarationId, hrData),
  async saveEmissionsData(declarationId, emissionsData),
  async saveWasteData(declarationId, wasteData),
  async saveSdgContributions(declarationId, sdgIds),
  async savePolicies(declarationId, policyIds),
  
  // === Historique ===
  async getDeclarationHistory(declarationId),
  
  // === Stats ===
  async getCompanyEvolution(companyId, startYear, endYear),
  async getEmissionsTrend(companyId),
}
```

---

## 5. Plan d'Implémentation Frontend (Vues)

### 5.1 Nouvelles Vues/Composants

```
src/views/
├── CompanyDeclarationsView.vue     # Liste des déclarations d'une entreprise
├── DeclarationFormView.vue         # Formulaire de déclaration (multi-étapes)
└── admin/
    ├── AdminDeclarationsView.vue   # Toutes les déclarations (validation)
    └── AdminCampaignsView.vue      # Gestion des campagnes

src/components/declarations/
├── DeclarationCard.vue             # Card résumé déclaration
├── DeclarationStatusBadge.vue      # Badge statut
├── HRDataForm.vue                  # Formulaire données RH
├── EmissionsDataForm.vue           # Formulaire émissions
├── WasteDataForm.vue               # Formulaire déchets
├── SdgSelector.vue                 # Sélecteur ODD
├── PolicySelector.vue              # Sélecteur politiques
└── DeclarationTimeline.vue         # Timeline historique
```

### 5.2 Modification de `CompanyManagementView.vue`

Ajouter un nouvel onglet "Déclarations ESG":

```vue
<v-tab value="declarations">
  <v-icon start>mdi-file-document-edit</v-icon>
  Déclarations ESG
  <v-chip size="small" class="ml-2">Données annuelles</v-chip>
</v-tab>
```

---

## 6. Seeder Initial

### 6.1 Script de Seeding des Référentiels

```javascript
// scripts/seed_referentials.js

// ODD (17 objectifs)
const sdgData = [
  { number: 1, code: 'ODD1', name: 'Pas de pauvreté', color: '#E5243B' },
  { number: 2, code: 'ODD2', name: 'Faim zéro', color: '#DDA63A' },
  // ... (17 ODD complets)
];

// Politiques RSE
const policiesData = [
  { code: 'RSE', name: 'Politique RSE', category: 'general' },
  { code: 'RH', name: 'Politique RH', category: 'social' },
  { code: 'SST', name: 'Politique SST', category: 'social' },
  { code: 'ENV', name: 'Politique environnementale', category: 'environnement' },
  { code: 'QUALITE', name: 'Politique qualité', category: 'general' },
  { code: 'ANTI_CORRUPTION', name: 'Politique anti-corruption', category: 'gouvernance' },
  { code: 'GENRE', name: 'Politique genre', category: 'social' },
  { code: 'HARCELEMENT', name: 'Politique anti-harcèlement', category: 'social' },
];

// Périodes (2020-2030)
const periodsData = [];
for (let year = 2020; year <= 2030; year++) {
  periodsData.push({
    type: 'ANNUEL',
    year,
    start_date: `${year}-01-01`,
    end_date: `${year}-12-31`,
    label: `${year}`
  });
}
```

### 6.2 Script de Seeding des 20 Entreprises

Utiliser le JSON unifié (`docs/jspn_unifier.md`) pour:
1. Créer les 20 entreprises dans `pev_companies`
2. Créer une déclaration 2024 pour chaque entreprise (source: ADMIN)
3. Remplir les données RH, émissions, déchets depuis le JSON

---

## 7. Workflow Utilisateur Final

### 7.1 Côté Admin

1. **Créer une campagne** de reporting (ex: "Collecte ESG 2025")
2. **Pré-remplir les données** des entreprises (optionnel)
3. **Valider/Rejeter** les déclarations soumises
4. **Consulter les statistiques** par période/ODD/secteur

### 7.2 Côté Entreprise

1. **Réclamer** son entreprise (claim) si pas propriétaire
2. **Créer une déclaration** pour une période
3. **Remplir les données** (RH, émissions, déchets, ODD, politiques)
4. **Soumettre** pour validation
5. **Consulter l'historique** des déclarations validées

### 7.3 Affichage sur la Carte

- Afficher les entreprises `status = 'published'`
- Popup avec données de la **dernière déclaration validée**
- Filtres par ODD, secteur, pays

---

## 8. Checklist de Validation

Avant implémentation, valider:

- [ ] Schéma SQL approuvé
- [ ] Services à créer listés et validés
- [ ] Vues à créer/modifier listées et validées
- [ ] Workflow admin/entreprise compris et validé
- [ ] Priorité des phases définie

---

## 9. Estimation des Efforts

| Phase | Estimation | Priorité |
|-------|------------|----------|
| Phase 1: Tables référentiel | 2h | Haute |
| Phase 2: Extension pev_companies | 30min | Haute |
| Phase 3: Tables déclarations | 2h | Haute |
| Phase 4: RLS Policies | 1h | Haute |
| Phase 5: Seeder référentiels | 1h | Haute |
| Phase 6: Seeder 20 entreprises | 2h | Moyenne |
| Phase 7: Services backend | 4h | Haute |
| Phase 8: Vues frontend | 6h | Moyenne |
| Phase 9: Tests et ajustements | 2h | Haute |

**Total estimé: ~20h de développement**

---

## 10. Questions en Suspens

1. **Campagnes obligatoires?** - Peut-on déclarer sans campagne active?
2. **Validation multi-niveaux?** - Un seul admin valide ou workflow d'approbation?
3. **Notifications?** - Email lors de changement de statut?
4. **Export?** - Format d'export des données (CSV, Excel, PDF)?
5. **Comparaison inter-entreprises?** - Benchmarking anonymisé?

---

**En attente de votre validation avant implémentation.**
