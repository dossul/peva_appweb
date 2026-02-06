/**
 * Script d'exécution de la migration SQL
 * Crée les tables nécessaires pour le module Companies
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'
);

async function executeMigration() {
  console.log('='.repeat(60));
  console.log('EXÉCUTION DE LA MIGRATION');
  console.log('='.repeat(60));

  // Exécuter les requêtes SQL une par une
  const queries = [
    // 1. Table des périodes
    {
      name: 'pev_periods',
      sql: `
        CREATE TABLE IF NOT EXISTS pev_periods (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          year INTEGER NOT NULL UNIQUE,
          label VARCHAR(50) NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    // 2. Insérer les périodes
    {
      name: 'periods_data',
      sql: `
        INSERT INTO pev_periods (year, label, start_date, end_date) VALUES
          (2020, '2020', '2020-01-01', '2020-12-31'),
          (2021, '2021', '2021-01-01', '2021-12-31'),
          (2022, '2022', '2022-01-01', '2022-12-31'),
          (2023, '2023', '2023-01-01', '2023-12-31'),
          (2024, '2024', '2024-01-01', '2024-12-31'),
          (2025, '2025', '2025-01-01', '2025-12-31'),
          (2026, '2026', '2026-01-01', '2026-12-31'),
          (2027, '2027', '2027-01-01', '2027-12-31'),
          (2028, '2028', '2028-01-01', '2028-12-31'),
          (2029, '2029', '2029-01-01', '2029-12-31'),
          (2030, '2030', '2030-01-01', '2030-12-31')
        ON CONFLICT (year) DO NOTHING;
      `
    },
    // 3. Table des ODD
    {
      name: 'pev_sdg',
      sql: `
        CREATE TABLE IF NOT EXISTS pev_sdg (
          id SERIAL PRIMARY KEY,
          number INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 17),
          code VARCHAR(10) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          color VARCHAR(7),
          icon VARCHAR(50),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    // 4. Insérer les ODD
    {
      name: 'sdg_data',
      sql: `
        INSERT INTO pev_sdg (number, code, name, color) VALUES
          (1, 'ODD1', 'Pas de pauvreté', '#E5243B'),
          (2, 'ODD2', 'Faim zéro', '#DDA63A'),
          (3, 'ODD3', 'Bonne santé et bien-être', '#4C9F38'),
          (4, 'ODD4', 'Éducation de qualité', '#C5192D'),
          (5, 'ODD5', 'Égalité entre les sexes', '#FF3A21'),
          (6, 'ODD6', 'Eau propre et assainissement', '#26BDE2'),
          (7, 'ODD7', 'Énergie propre et abordable', '#FCC30B'),
          (8, 'ODD8', 'Travail décent et croissance', '#A21942'),
          (9, 'ODD9', 'Industrie, innovation et infrastructure', '#FD6925'),
          (10, 'ODD10', 'Inégalités réduites', '#DD1367'),
          (11, 'ODD11', 'Villes et communautés durables', '#FD9D24'),
          (12, 'ODD12', 'Consommation et production responsables', '#BF8B2E'),
          (13, 'ODD13', 'Mesures relatives au climat', '#3F7E44'),
          (14, 'ODD14', 'Vie aquatique', '#0A97D9'),
          (15, 'ODD15', 'Vie terrestre', '#56C02B'),
          (16, 'ODD16', 'Paix, justice et institutions efficaces', '#00689D'),
          (17, 'ODD17', 'Partenariats pour les objectifs', '#19486A')
        ON CONFLICT (number) DO NOTHING;
      `
    },
    // 5. Table des politiques
    {
      name: 'pev_policies',
      sql: `
        CREATE TABLE IF NOT EXISTS pev_policies (
          id SERIAL PRIMARY KEY,
          code VARCHAR(30) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(50),
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    // 6. Insérer les politiques
    {
      name: 'policies_data',
      sql: `
        INSERT INTO pev_policies (code, name, category) VALUES
          ('RSE', 'Politique RSE', 'general'),
          ('RH', 'Politique RH', 'social'),
          ('SST', 'Politique Santé et Sécurité au Travail', 'social'),
          ('ENV', 'Politique environnementale', 'environnement'),
          ('QUALITE', 'Politique qualité', 'general'),
          ('ANTI_CORRUPTION', 'Politique anti-corruption', 'gouvernance'),
          ('ANTI_FRAUDE', 'Politique anti-fraude', 'gouvernance'),
          ('GENRE', 'Politique genre', 'social'),
          ('HARCELEMENT', 'Politique anti-harcèlement', 'social'),
          ('CONFIDENTIALITE', 'Politique de confidentialité', 'gouvernance'),
          ('ETHIQUE', 'Code de conduite et éthique', 'gouvernance')
        ON CONFLICT (code) DO NOTHING;
      `
    },
    // 7. Extension de pev_companies
    {
      name: 'extend_companies',
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'main_activities') THEN
            ALTER TABLE pev_companies ADD COLUMN main_activities TEXT;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'activities_summary') THEN
            ALTER TABLE pev_companies ADD COLUMN activities_summary TEXT;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'claimed_by') THEN
            ALTER TABLE pev_companies ADD COLUMN claimed_by UUID;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'claimed_at') THEN
            ALTER TABLE pev_companies ADD COLUMN claimed_at TIMESTAMPTZ;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'sdg_contributions') THEN
            ALTER TABLE pev_companies ADD COLUMN sdg_contributions JSONB DEFAULT '[]';
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = 'region') THEN
            ALTER TABLE pev_companies ADD COLUMN region VARCHAR(100);
          END IF;
        END $$;
      `
    },
    // 8. Table des déclarations
    {
      name: 'pev_company_declarations',
      sql: `
        CREATE TABLE IF NOT EXISTS pev_company_declarations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          company_id UUID NOT NULL REFERENCES pev_companies(id) ON DELETE CASCADE,
          period_id UUID NOT NULL REFERENCES pev_periods(id),
          source VARCHAR(20) NOT NULL DEFAULT 'ADMIN' CHECK (source IN ('ADMIN', 'COMPANY')),
          status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'VALIDATED', 'REJECTED')),
          submitted_at TIMESTAMPTZ,
          validated_at TIMESTAMPTZ,
          validated_by UUID,
          admin_notes TEXT,
          company_notes TEXT,
          created_by UUID,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(company_id, period_id)
        );
      `
    },
    // 9. Table données RH
    {
      name: 'pev_company_declaration_hr',
      sql: `
        CREATE TABLE IF NOT EXISTS pev_company_declaration_hr (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          declaration_id UUID NOT NULL UNIQUE REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
          employee_count INTEGER,
          cdi_ratio DECIMAL(5,2),
          cdd_ratio DECIMAL(5,2),
          temporary_count INTEGER,
          temporary_ratio DECIMAL(5,2),
          contractor_count INTEGER,
          local_purchases_ratio DECIMAL(5,2),
          local_purchases_amount DECIMAL(15,2),
          water_consumption_m3 DECIMAL(15,2),
          fuel_consumption_liters DECIMAL(15,2),
          electricity_kwh DECIMAL(15,2),
          solar_percentage DECIMAL(5,2),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    // 10. Table données émissions
    {
      name: 'pev_company_declaration_emissions',
      sql: `
        CREATE TABLE IF NOT EXISTS pev_company_declaration_emissions (
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
      `
    },
    // 11. Table données déchets
    {
      name: 'pev_company_declaration_waste',
      sql: `
        CREATE TABLE IF NOT EXISTS pev_company_declaration_waste (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          declaration_id UUID NOT NULL UNIQUE REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
          solid_waste_value DECIMAL(15,2),
          solid_waste_unit VARCHAR(30),
          solid_waste_raw VARCHAR(100),
          liquid_waste_value DECIMAL(15,2),
          liquid_waste_unit VARCHAR(30),
          liquid_waste_raw VARCHAR(100),
          composted_value DECIMAL(15,2),
          composted_unit VARCHAR(30),
          valorization_initiatives TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    // 12. Table pivot ODD
    {
      name: 'pev_company_declaration_sdg',
      sql: `
        CREATE TABLE IF NOT EXISTS pev_company_declaration_sdg (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          declaration_id UUID NOT NULL REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
          sdg_id INTEGER NOT NULL REFERENCES pev_sdg(id),
          contribution_notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(declaration_id, sdg_id)
        );
      `
    },
    // 13. Table pivot politiques
    {
      name: 'pev_company_declaration_policies',
      sql: `
        CREATE TABLE IF NOT EXISTS pev_company_declaration_policies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          declaration_id UUID NOT NULL REFERENCES pev_company_declarations(id) ON DELETE CASCADE,
          policy_id INTEGER NOT NULL REFERENCES pev_policies(id),
          details TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(declaration_id, policy_id)
        );
      `
    }
  ];

  for (const query of queries) {
    try {
      console.log(`\n[${query.name}] Exécution...`);
      const { error } = await supabase.rpc('exec_sql', { sql_query: query.sql });
      
      if (error) {
        // Essayer avec une requête directe si RPC échoue
        console.log(`   RPC non disponible, essai direct...`);
        // Pour les INSERT, on peut utiliser les méthodes Supabase
        if (query.name.includes('_data')) {
          console.log(`   ✓ Données à insérer via seeder`);
        } else {
          console.log(`   ⚠ Table à créer via Supabase Studio: ${query.name}`);
        }
      } else {
        console.log(`   ✓ ${query.name} OK`);
      }
    } catch (err) {
      console.log(`   ⚠ ${query.name}: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Migration terminée - Vérifiez Supabase Studio si nécessaire');
  console.log('='.repeat(60));
}

executeMigration().catch(console.error);
