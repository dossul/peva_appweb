#!/usr/bin/env python3
"""
Script d'extraction des données PME/PMI depuis les fichiers Excel
Génère un JSON structuré prêt pour le seeder Supabase

Auteur: Cascade AI
Date: 6 février 2026
"""

import pandas as pd
import json
import re
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent

def clean_value(val):
    """Nettoie une valeur"""
    if pd.isna(val) or val == '-' or str(val).strip() == '':
        return None
    return str(val).strip()

def parse_odds(odd_string):
    """Parse les ODD contribués (ex: '1, 2, 8, 9, 12' -> [1, 2, 8, 9, 12])"""
    if not odd_string or pd.isna(odd_string):
        return []
    # Extraire tous les nombres
    numbers = re.findall(r'\d+', str(odd_string))
    return [int(n) for n in numbers if 1 <= int(n) <= 17]

def parse_number(val):
    """Parse un nombre depuis une chaîne (ex: '15,29t/an' -> 15.29)"""
    if not val or pd.isna(val) or val == '-':
        return None
    # Extraire le premier nombre (avec virgule ou point)
    match = re.search(r'([\d\s]+[,.]?\d*)', str(val).replace(' ', ''))
    if match:
        num_str = match.group(1).replace(',', '.').replace(' ', '')
        try:
            return float(num_str)
        except:
            return None
    return None

def extract_unit(val):
    """Extrait l'unité d'une valeur (ex: '15,29t/an' -> 't/an')"""
    if not val or pd.isna(val):
        return None
    match = re.search(r'[\d,.\s]+(.*)', str(val))
    if match:
        return match.group(1).strip()
    return None

def load_excel_data():
    """Charge et fusionne les données des 2 fichiers Excel"""
    
    companies = {}
    
    # Fichier 1: Fiche synthétique PME-PMI_Sonia.xlsx (données déchets)
    file1 = BASE_DIR / "Fiche synthétique PME-PMI_Sonia.xlsx"
    if file1.exists():
        print(f"Lecture de {file1.name}...")
        df1 = pd.read_excel(file1, sheet_name='Feuil1')
        df1.columns = [str(col).strip() for col in df1.columns]
        
        for _, row in df1.iterrows():
            name = clean_value(row.get('Noms des PME/PMI'))
            if not name:
                continue
                
            companies[name] = {
                'name': name,
                'waste_data': {
                    'solid_waste_annual': clean_value(row.get('Volume ou poids totale de déchets solides /an')),
                    'liquid_waste_annual': clean_value(row.get('Volume ou poids totale de déchets liquides/an')),
                    'composted_volume': clean_value(row.get('Volumes compostés ou méthanisées/an')),
                    'valorization_initiatives': clean_value(row.get('Initiative de valorisation des déchets'))
                }
            }
    
    # Fichier 2: Fiche synthétique PME-PMIs.xlsx (données complètes)
    file2 = BASE_DIR / "Fiche synthétique PME-PMIs.xlsx"
    if file2.exists():
        print(f"Lecture de {file2.name}...")
        
        # Feuille 2 contient les données structurées
        try:
            df2 = pd.read_excel(file2, sheet_name='Feuil2')
            df2.columns = [str(col).strip() for col in df2.columns]
            
            for _, row in df2.iterrows():
                name = clean_value(row.get('Noms des PME/PMI'))
                if not name:
                    continue
                
                if name not in companies:
                    companies[name] = {'name': name}
                
                # Données de base
                companies[name].update({
                    'main_activities': clean_value(row.get('Activités principales')),
                    'sdg_contributions': parse_odds(row.get('ODD contribués')),
                    'employee_count': parse_number(row.get("Nombre d'employés")),
                    'temporary_ratio': clean_value(row.get('% de temporaire/Nombre de temporaire'))
                })
        except Exception as e:
            print(f"  Erreur Feuil2: {e}")
        
        # Feuille 1 contient des données détaillées (format différent)
        try:
            df1_f2 = pd.read_excel(file2, sheet_name='Feuil1', header=None)
            # Cette feuille a un format plus complexe, on l'analyse différemment
            print(f"  Feuil1 contient {len(df1_f2)} lignes")
        except Exception as e:
            print(f"  Erreur Feuil1: {e}")
    
    return companies

def structure_for_seeder(companies):
    """Structure les données pour le seeder Supabase"""
    
    structured_companies = []
    
    for name, data in companies.items():
        company = {
            # Identité
            'name': data.get('name'),
            'slug': re.sub(r'[^a-z0-9]+', '-', data.get('name', '').lower()).strip('-'),
            'main_activities': data.get('main_activities'),
            'description': data.get('main_activities'),  # Par défaut
            
            # Localisation (à compléter par l'admin)
            'country': 'Burkina Faso',  # Défaut basé sur les données
            'region': None,
            'city': None,
            'address': None,
            'latitude': None,
            'longitude': None,
            
            # Secteur (à déterminer selon activités)
            'sector': determine_sector(data.get('main_activities', '')),
            
            # ODD
            'sdg_contributions': data.get('sdg_contributions', []),
            
            # Statut
            'status': 'draft',  # À valider par l'admin
            'is_verified': False,
            
            # Données annuelles (première année)
            'annual_data': {
                'year': 2024,  # Année de référence
                'employee_count': data.get('employee_count'),
                'temporary_ratio': data.get('temporary_ratio'),
                
                # Déchets
                'solid_waste': parse_waste_data(data.get('waste_data', {}).get('solid_waste_annual')),
                'liquid_waste': parse_waste_data(data.get('waste_data', {}).get('liquid_waste_annual')),
                'composted_volume': data.get('waste_data', {}).get('composted_volume'),
                'valorization_initiatives': data.get('waste_data', {}).get('valorization_initiatives'),
            }
        }
        
        structured_companies.append(company)
    
    return structured_companies

def determine_sector(activities):
    """Détermine le secteur basé sur les activités"""
    if not activities:
        return 'other'
    
    activities_lower = activities.lower()
    
    if any(word in activities_lower for word in ['énergie', 'solaire', 'électri', 'renouvelable']):
        return 'renewable_energy'
    if any(word in activities_lower for word in ['agro', 'alimentaire', 'transformation', 'karité', 'riz', 'mangue', 'fruit', 'légume']):
        return 'agriculture'
    if any(word in activities_lower for word in ['déchet', 'recyclage', 'valorisation', 'compost']):
        return 'waste_management'
    if any(word in activities_lower for word in ['eau', 'assainissement', 'toilette']):
        return 'water'
    if any(word in activities_lower for word in ['construction', 'brique', 'bâtiment', 'matériau']):
        return 'construction'
    if any(word in activities_lower for word in ['élevage', 'volaille', 'bétail']):
        return 'agriculture'
    
    return 'other'

def parse_waste_data(waste_string):
    """Parse les données de déchets"""
    if not waste_string:
        return None
    
    return {
        'value': parse_number(waste_string),
        'unit': extract_unit(waste_string),
        'raw': waste_string
    }

def main():
    print("=" * 60)
    print("EXTRACTION DES DONNÉES PME/PMI")
    print("=" * 60)
    
    # 1. Charger les données
    companies = load_excel_data()
    print(f"\n{len(companies)} entreprises chargées")
    
    # 2. Structurer pour le seeder
    structured = structure_for_seeder(companies)
    
    # 3. Créer le JSON final
    output = {
        'generated_at': datetime.now().isoformat(),
        'version': '1.0',
        'total_companies': len(structured),
        
        # Liste des entreprises pour le seeder
        'companies': structured,
        
        # Données de référence
        'reference_data': {
            'african_countries': sorted([
                "Afrique du Sud", "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso",
                "Burundi", "Cameroun", "Cap-Vert", "Centrafrique", "Comores", "Congo",
                "Côte d'Ivoire", "Djibouti", "Égypte", "Érythrée", "Eswatini", "Éthiopie",
                "Gabon", "Gambie", "Ghana", "Guinée", "Guinée équatoriale", "Guinée-Bissau",
                "Kenya", "Lesotho", "Liberia", "Libye", "Madagascar", "Malawi", "Mali",
                "Maroc", "Maurice", "Mauritanie", "Mozambique", "Namibie", "Niger",
                "Nigeria", "Ouganda", "RD Congo", "Rwanda", "Sao Tomé-et-Principe",
                "Sénégal", "Seychelles", "Sierra Leone", "Somalie", "Soudan", "Soudan du Sud",
                "Tanzanie", "Tchad", "Togo", "Tunisie", "Zambie", "Zimbabwe"
            ]),
            'sectors': [
                {"value": "renewable_energy", "label": "Énergies renouvelables", "icon": "mdi-solar-power"},
                {"value": "agriculture", "label": "Agriculture et agroalimentaire", "icon": "mdi-sprout"},
                {"value": "waste_management", "label": "Gestion des déchets", "icon": "mdi-recycle"},
                {"value": "water", "label": "Eau et assainissement", "icon": "mdi-water"},
                {"value": "construction", "label": "Construction durable", "icon": "mdi-home-city"},
                {"value": "transport", "label": "Transport et mobilité", "icon": "mdi-truck"},
                {"value": "industry", "label": "Industrie verte", "icon": "mdi-factory"},
                {"value": "services", "label": "Services environnementaux", "icon": "mdi-leaf"},
                {"value": "technology", "label": "Technologies vertes", "icon": "mdi-chip"},
                {"value": "finance", "label": "Finance verte", "icon": "mdi-bank"},
                {"value": "other", "label": "Autre", "icon": "mdi-dots-horizontal"}
            ],
            'sdg_list': [
                {"value": 1, "label": "Pas de pauvreté", "color": "#E5243B"},
                {"value": 2, "label": "Faim zéro", "color": "#DDA63A"},
                {"value": 3, "label": "Bonne santé et bien-être", "color": "#4C9F38"},
                {"value": 4, "label": "Éducation de qualité", "color": "#C5192D"},
                {"value": 5, "label": "Égalité entre les sexes", "color": "#FF3A21"},
                {"value": 6, "label": "Eau propre et assainissement", "color": "#26BDE2"},
                {"value": 7, "label": "Énergie propre et abordable", "color": "#FCC30B"},
                {"value": 8, "label": "Travail décent et croissance", "color": "#A21942"},
                {"value": 9, "label": "Industrie, innovation et infrastructure", "color": "#FD6925"},
                {"value": 10, "label": "Inégalités réduites", "color": "#DD1367"},
                {"value": 11, "label": "Villes et communautés durables", "color": "#FD9D24"},
                {"value": 12, "label": "Consommation et production responsables", "color": "#BF8B2E"},
                {"value": 13, "label": "Mesures relatives à la lutte contre les changements climatiques", "color": "#3F7E44"},
                {"value": 14, "label": "Vie aquatique", "color": "#0A97D9"},
                {"value": 15, "label": "Vie terrestre", "color": "#56C02B"},
                {"value": 16, "label": "Paix, justice et institutions efficaces", "color": "#00689D"},
                {"value": 17, "label": "Partenariats pour la réalisation des objectifs", "color": "#19486A"}
            ]
        },
        
        # Schéma de la table companies
        'database_schema': {
            'pev_companies': {
                'id': 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
                'name': 'varchar(255) NOT NULL UNIQUE',
                'slug': 'varchar(255) NOT NULL UNIQUE',
                'description': 'text',
                'main_activities': 'text',
                'sector': 'varchar(100)',
                'logo_url': 'text',
                'cover_image_url': 'text',
                'website': 'varchar(255)',
                'email': 'varchar(255)',
                'phone': 'varchar(50)',
                'country': 'varchar(100)',
                'region': 'varchar(100)',
                'city': 'varchar(100)',
                'address': 'text',
                'latitude': 'decimal(10,8)',
                'longitude': 'decimal(11,8)',
                'status': "varchar(50) DEFAULT 'draft'",
                'owner_id': 'uuid REFERENCES pev_profiles(id)',
                'created_by': 'uuid REFERENCES pev_profiles(id)',
                'claimed_by': 'uuid REFERENCES pev_profiles(id)',
                'claimed_at': 'timestamptz',
                'is_verified': 'boolean DEFAULT false',
                'sdg_contributions': "jsonb DEFAULT '[]'",
                'created_at': 'timestamptz DEFAULT now()',
                'updated_at': 'timestamptz DEFAULT now()'
            },
            'pev_company_annual_data': {
                'id': 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
                'company_id': 'uuid NOT NULL REFERENCES pev_companies(id) ON DELETE CASCADE',
                'year': 'integer NOT NULL',
                'employee_count': 'integer',
                'temporary_employee_count': 'integer',
                'temporary_employee_ratio': 'decimal(5,2)',
                'contractor_count': 'integer',
                'existing_policies': 'text',
                'coi_percentage': 'decimal(5,2)',
                'cod_percentage': 'decimal(5,2)',
                'local_purchases': 'text',
                'local_purchases_amount': 'decimal(15,2)',
                'water_consumption_m3': 'decimal(15,2)',
                'fuel_consumption_liters': 'decimal(15,2)',
                'electricity_consumption_kwh': 'decimal(15,2)',
                'solar_percentage': 'decimal(5,2)',
                'total_emissions': 'decimal(15,2)',
                'scope1_emissions': 'decimal(15,2)',
                'scope2_emissions': 'decimal(15,2)',
                'scope3_emissions': 'decimal(15,2)',
                'total_waste_kg': 'decimal(15,2)',
                'valorized_waste_kg': 'decimal(15,2)',
                'unsold_volume_kg': 'decimal(15,2)',
                'waste_valorization_initiatives': 'text',
                'submitted_by': 'uuid REFERENCES pev_profiles(id)',
                'verified_by': 'uuid REFERENCES pev_profiles(id)',
                'verified_at': 'timestamptz',
                'created_at': 'timestamptz DEFAULT now()',
                'updated_at': 'timestamptz DEFAULT now()',
                'UNIQUE': '(company_id, year)'
            },
            'pev_company_claims': {
                'id': 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
                'company_id': 'uuid NOT NULL REFERENCES pev_companies(id)',
                'user_id': 'uuid NOT NULL REFERENCES pev_profiles(id)',
                'status': "varchar(50) DEFAULT 'pending'",
                'justification': 'text NOT NULL',
                'documents': "jsonb DEFAULT '[]'",
                'admin_notes': 'text',
                'reviewed_by': 'uuid REFERENCES pev_profiles(id)',
                'reviewed_at': 'timestamptz',
                'created_at': 'timestamptz DEFAULT now()',
                'updated_at': 'timestamptz DEFAULT now()'
            },
            'pev_company_history': {
                'id': 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
                'company_id': 'uuid NOT NULL REFERENCES pev_companies(id)',
                'annual_data_id': 'uuid REFERENCES pev_company_annual_data(id)',
                'action': 'varchar(50) NOT NULL',
                'changed_by': 'uuid NOT NULL REFERENCES pev_profiles(id)',
                'changes': 'jsonb NOT NULL',
                'previous_values': 'jsonb',
                'created_at': 'timestamptz DEFAULT now()'
            }
        }
    }
    
    # 4. Sauvegarder
    output_dir = BASE_DIR / "scripts" / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / "companies_seeder_data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print(f"JSON GENERE: {output_file}")
    print(f"{'='*60}")
    print(f"Total entreprises: {len(structured)}")
    print(f"\nEntreprises par secteur:")
    sectors = {}
    for c in structured:
        s = c.get('sector', 'other')
        sectors[s] = sectors.get(s, 0) + 1
    for s, count in sorted(sectors.items(), key=lambda x: -x[1]):
        print(f"  - {s}: {count}")
    
    print(f"\nExemples d'entreprises:")
    for c in structured[:5]:
        print(f"  - {c['name']} ({c['sector']})")
        if c.get('sdg_contributions'):
            print(f"    ODD: {c['sdg_contributions']}")

if __name__ == "__main__":
    main()
