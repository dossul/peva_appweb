#!/usr/bin/env python3
"""
Script d'analyse des fichiers Excel PME/PMI pour 2iE GreenHub
Génère une structure JSON cohérente pour la création des tables et formulaires CRUD

Auteur: Cascade AI
Date: 6 février 2026
"""

import pandas as pd
import json
import os
from datetime import datetime
from pathlib import Path

# Chemins des fichiers Excel
BASE_DIR = Path(__file__).parent.parent
EXCEL_FILES = [
    BASE_DIR / "Fiche synthétique PME-PMI_Sonia.xlsx",
    BASE_DIR / "Fiche synthétique PME-PMIs.xlsx"
]

def analyze_excel_structure(file_path):
    """Analyse la structure d'un fichier Excel"""
    print(f"\n{'='*60}")
    print(f"Analyse de: {file_path.name}")
    print('='*60)
    
    try:
        # Lire toutes les feuilles
        xl = pd.ExcelFile(file_path)
        sheets_data = {}
        
        for sheet_name in xl.sheet_names:
            print(f"\n📄 Feuille: {sheet_name}")
            df = pd.read_excel(xl, sheet_name=sheet_name)
            
            # Nettoyer les noms de colonnes
            df.columns = [str(col).strip() for col in df.columns]
            
            # Analyser les colonnes
            columns_info = []
            for col in df.columns:
                col_data = df[col]
                non_null = col_data.dropna()
                
                # Déterminer le type de données
                if len(non_null) == 0:
                    dtype = "empty"
                elif pd.api.types.is_numeric_dtype(non_null):
                    if all(non_null == non_null.astype(int)):
                        dtype = "integer"
                    else:
                        dtype = "float"
                elif pd.api.types.is_datetime64_any_dtype(non_null):
                    dtype = "datetime"
                else:
                    # Vérifier si c'est un texte long
                    max_len = non_null.astype(str).str.len().max() if len(non_null) > 0 else 0
                    if max_len > 255:
                        dtype = "text"
                    else:
                        dtype = "varchar"
                
                # Exemples de valeurs
                examples = non_null.head(3).tolist() if len(non_null) > 0 else []
                
                columns_info.append({
                    "name": col,
                    "type": dtype,
                    "non_null_count": len(non_null),
                    "total_count": len(df),
                    "fill_rate": f"{len(non_null)/len(df)*100:.1f}%" if len(df) > 0 else "0%",
                    "examples": [str(x)[:100] for x in examples]
                })
                
                print(f"  - {col}: {dtype} ({len(non_null)}/{len(df)} remplis)")
            
            sheets_data[sheet_name] = {
                "row_count": len(df),
                "column_count": len(df.columns),
                "columns": columns_info,
                "data_preview": df.head(5).to_dict(orient='records')
            }
        
        return sheets_data
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def extract_company_fields():
    """Extrait tous les champs uniques des fichiers Excel pour les entreprises"""
    
    all_columns = set()
    all_data = []
    
    for file_path in EXCEL_FILES:
        if file_path.exists():
            try:
                df = pd.read_excel(file_path)
                df.columns = [str(col).strip() for col in df.columns]
                all_columns.update(df.columns)
                
                # Convertir en liste de dictionnaires
                for _, row in df.iterrows():
                    company = {}
                    for col in df.columns:
                        val = row[col]
                        if pd.notna(val):
                            company[col] = str(val) if not isinstance(val, (int, float)) else val
                    if company:
                        all_data.append(company)
                        
            except Exception as e:
                print(f"Erreur lecture {file_path}: {e}")
    
    return list(all_columns), all_data

def map_excel_to_database_schema():
    """Mappe les colonnes Excel vers un schéma de base de données"""
    
    # Mapping des colonnes Excel vers les champs de base de données
    column_mapping = {
        # Identité de l'entreprise
        "Noms des PME/PMI": {"db_field": "name", "type": "varchar(255)", "required": True, "category": "identity"},
        "Activités principales": {"db_field": "main_activities", "type": "text", "required": True, "category": "identity"},
        "ODD contribués": {"db_field": "sdg_contributions", "type": "jsonb", "required": False, "category": "impact"},
        
        # Politiques et certifications
        "Politiques existantes": {"db_field": "existing_policies", "type": "text", "required": False, "category": "policies"},
        "%COI": {"db_field": "coi_percentage", "type": "decimal", "required": False, "category": "metrics"},
        "%COD": {"db_field": "cod_percentage", "type": "decimal", "required": False, "category": "metrics"},
        
        # Ressources humaines
        "Nombre d'employés": {"db_field": "employee_count", "type": "integer", "required": False, "category": "hr"},
        "% de temporaire/Nombre de temporaire": {"db_field": "temporary_employee_ratio", "type": "varchar(100)", "required": False, "category": "hr"},
        "Nombre de prestataires": {"db_field": "contractor_count", "type": "integer", "required": False, "category": "hr"},
        
        # Consommation et environnement
        "Achats locaux": {"db_field": "local_purchases", "type": "text", "required": False, "category": "consumption"},
        "M3 d'eau consommé": {"db_field": "water_consumption_m3", "type": "decimal", "required": False, "category": "consumption"},
        "L de carburant": {"db_field": "fuel_consumption_liters", "type": "decimal", "required": False, "category": "consumption"},
        "% Du solaire": {"db_field": "solar_percentage", "type": "decimal", "required": False, "category": "energy"},
        
        # Émissions
        "Émissions totales": {"db_field": "total_emissions", "type": "decimal", "required": False, "category": "emissions"},
        "Émissions scope 1": {"db_field": "scope1_emissions", "type": "decimal", "required": False, "category": "emissions"},
        "Émissions scope 2": {"db_field": "scope2_emissions", "type": "decimal", "required": False, "category": "emissions"},
        "Émissions scope 3": {"db_field": "scope3_emissions", "type": "decimal", "required": False, "category": "emissions"},
        
        # Déchets
        "Volume ou poids totale de déchets": {"db_field": "total_waste_volume", "type": "varchar(100)", "required": False, "category": "waste"},
        "Volume ou poids totale de déchets valorisés": {"db_field": "valorized_waste_volume", "type": "varchar(100)", "required": False, "category": "waste"},
        "Volumes invendues/an": {"db_field": "unsold_volume_yearly", "type": "varchar(100)", "required": False, "category": "waste"},
        "Initiative de valorisation des déchets": {"db_field": "waste_valorization_initiatives", "type": "text", "required": False, "category": "waste"},
    }
    
    return column_mapping

def generate_database_schema():
    """Génère le schéma de base de données complet"""
    
    schema = {
        "tables": {
            # Table principale des entreprises
            "pev_companies": {
                "description": "Informations de base des entreprises PME/PMI",
                "fields": {
                    "id": {"type": "uuid", "primary": True, "default": "gen_random_uuid()"},
                    "name": {"type": "varchar(255)", "required": True, "unique": True},
                    "slug": {"type": "varchar(255)", "required": True, "unique": True},
                    "description": {"type": "text", "required": False},
                    "main_activities": {"type": "text", "required": False},
                    "sector": {"type": "varchar(100)", "required": False},
                    "sub_sector": {"type": "varchar(100)", "required": False},
                    "logo_url": {"type": "text", "required": False},
                    "cover_image_url": {"type": "text", "required": False},
                    "website": {"type": "varchar(255)", "required": False},
                    "email": {"type": "varchar(255)", "required": False},
                    "phone": {"type": "varchar(50)", "required": False},
                    
                    # Localisation
                    "country": {"type": "varchar(100)", "required": False},
                    "region": {"type": "varchar(100)", "required": False},
                    "city": {"type": "varchar(100)", "required": False},
                    "address": {"type": "text", "required": False},
                    "latitude": {"type": "decimal(10,8)", "required": False},
                    "longitude": {"type": "decimal(11,8)", "required": False},
                    
                    # Statut et propriété
                    "status": {"type": "varchar(50)", "default": "'draft'", "enum": ["draft", "in_review", "published", "rejected"]},
                    "owner_id": {"type": "uuid", "references": "pev_profiles(id)", "required": False},
                    "created_by": {"type": "uuid", "references": "pev_profiles(id)", "required": True},
                    "claimed_by": {"type": "uuid", "references": "pev_profiles(id)", "required": False},
                    "claimed_at": {"type": "timestamptz", "required": False},
                    "is_verified": {"type": "boolean", "default": "false"},
                    
                    # ODD contribués (stocké en JSON)
                    "sdg_contributions": {"type": "jsonb", "default": "'[]'"},
                    
                    # Timestamps
                    "created_at": {"type": "timestamptz", "default": "now()"},
                    "updated_at": {"type": "timestamptz", "default": "now()"},
                }
            },
            
            # Table des données annuelles (historisation)
            "pev_company_annual_data": {
                "description": "Données annuelles des entreprises (historisation par année)",
                "fields": {
                    "id": {"type": "uuid", "primary": True, "default": "gen_random_uuid()"},
                    "company_id": {"type": "uuid", "references": "pev_companies(id)", "required": True},
                    "year": {"type": "integer", "required": True},
                    
                    # Ressources humaines
                    "employee_count": {"type": "integer", "required": False},
                    "temporary_employee_count": {"type": "integer", "required": False},
                    "temporary_employee_ratio": {"type": "decimal(5,2)", "required": False},
                    "contractor_count": {"type": "integer", "required": False},
                    
                    # Politiques et certifications
                    "existing_policies": {"type": "text", "required": False},
                    "coi_percentage": {"type": "decimal(5,2)", "required": False},
                    "cod_percentage": {"type": "decimal(5,2)", "required": False},
                    
                    # Consommation
                    "local_purchases": {"type": "text", "required": False},
                    "local_purchases_amount": {"type": "decimal(15,2)", "required": False},
                    "water_consumption_m3": {"type": "decimal(15,2)", "required": False},
                    "fuel_consumption_liters": {"type": "decimal(15,2)", "required": False},
                    "electricity_consumption_kwh": {"type": "decimal(15,2)", "required": False},
                    "solar_percentage": {"type": "decimal(5,2)", "required": False},
                    
                    # Émissions carbone
                    "total_emissions": {"type": "decimal(15,2)", "required": False, "unit": "tCO2e"},
                    "scope1_emissions": {"type": "decimal(15,2)", "required": False, "unit": "tCO2e"},
                    "scope2_emissions": {"type": "decimal(15,2)", "required": False, "unit": "tCO2e"},
                    "scope3_emissions": {"type": "decimal(15,2)", "required": False, "unit": "tCO2e"},
                    
                    # Déchets
                    "total_waste_kg": {"type": "decimal(15,2)", "required": False},
                    "valorized_waste_kg": {"type": "decimal(15,2)", "required": False},
                    "unsold_volume_kg": {"type": "decimal(15,2)", "required": False},
                    "waste_valorization_initiatives": {"type": "text", "required": False},
                    
                    # Chiffres d'affaires (optionnel)
                    "revenue": {"type": "decimal(15,2)", "required": False},
                    "revenue_currency": {"type": "varchar(3)", "default": "'XOF'"},
                    
                    # Métadonnées
                    "notes": {"type": "text", "required": False},
                    "data_source": {"type": "varchar(100)", "required": False},
                    "submitted_by": {"type": "uuid", "references": "pev_profiles(id)"},
                    "verified_by": {"type": "uuid", "references": "pev_profiles(id)"},
                    "verified_at": {"type": "timestamptz"},
                    
                    "created_at": {"type": "timestamptz", "default": "now()"},
                    "updated_at": {"type": "timestamptz", "default": "now()"},
                },
                "unique_constraint": ["company_id", "year"]
            },
            
            # Table des demandes de réclamation d'entreprise
            "pev_company_claims": {
                "description": "Demandes de réclamation de propriété d'une entreprise",
                "fields": {
                    "id": {"type": "uuid", "primary": True, "default": "gen_random_uuid()"},
                    "company_id": {"type": "uuid", "references": "pev_companies(id)", "required": True},
                    "user_id": {"type": "uuid", "references": "pev_profiles(id)", "required": True},
                    "status": {"type": "varchar(50)", "default": "'pending'", "enum": ["pending", "approved", "rejected"]},
                    "justification": {"type": "text", "required": True},
                    "documents": {"type": "jsonb", "default": "'[]'"},
                    "admin_notes": {"type": "text"},
                    "reviewed_by": {"type": "uuid", "references": "pev_profiles(id)"},
                    "reviewed_at": {"type": "timestamptz"},
                    "created_at": {"type": "timestamptz", "default": "now()"},
                    "updated_at": {"type": "timestamptz", "default": "now()"},
                },
                "unique_constraint": ["company_id", "user_id", "status"]
            },
            
            # Table d'historique des modifications
            "pev_company_history": {
                "description": "Historique des modifications des données entreprises",
                "fields": {
                    "id": {"type": "uuid", "primary": True, "default": "gen_random_uuid()"},
                    "company_id": {"type": "uuid", "references": "pev_companies(id)", "required": True},
                    "annual_data_id": {"type": "uuid", "references": "pev_company_annual_data(id)"},
                    "action": {"type": "varchar(50)", "required": True, "enum": ["create", "update", "delete", "claim", "transfer"]},
                    "changed_by": {"type": "uuid", "references": "pev_profiles(id)", "required": True},
                    "changes": {"type": "jsonb", "required": True},
                    "previous_values": {"type": "jsonb"},
                    "ip_address": {"type": "inet"},
                    "user_agent": {"type": "text"},
                    "created_at": {"type": "timestamptz", "default": "now()"},
                }
            }
        },
        
        "relationships": [
            {"from": "pev_company_annual_data", "to": "pev_companies", "type": "many-to-one", "field": "company_id"},
            {"from": "pev_company_claims", "to": "pev_companies", "type": "many-to-one", "field": "company_id"},
            {"from": "pev_company_claims", "to": "pev_profiles", "type": "many-to-one", "field": "user_id"},
            {"from": "pev_company_history", "to": "pev_companies", "type": "many-to-one", "field": "company_id"},
            {"from": "pev_companies", "to": "pev_profiles", "type": "many-to-one", "field": "owner_id"},
        ],
        
        "indexes": [
            {"table": "pev_companies", "columns": ["status"], "name": "idx_companies_status"},
            {"table": "pev_companies", "columns": ["country"], "name": "idx_companies_country"},
            {"table": "pev_companies", "columns": ["sector"], "name": "idx_companies_sector"},
            {"table": "pev_companies", "columns": ["latitude", "longitude"], "name": "idx_companies_location"},
            {"table": "pev_company_annual_data", "columns": ["company_id", "year"], "name": "idx_annual_data_company_year"},
            {"table": "pev_company_claims", "columns": ["status"], "name": "idx_claims_status"},
            {"table": "pev_company_history", "columns": ["company_id", "created_at"], "name": "idx_history_company_date"},
        ]
    }
    
    return schema

def generate_form_structure():
    """Génère la structure des formulaires CRUD"""
    
    forms = {
        "company_basic_info": {
            "title": "Informations de base",
            "description": "Identité et coordonnées de l'entreprise",
            "sections": [
                {
                    "title": "Identité",
                    "fields": [
                        {"name": "name", "label": "Nom de l'entreprise", "type": "text", "required": True, "placeholder": "Ex: FARAFINA Engineering"},
                        {"name": "main_activities", "label": "Activités principales", "type": "textarea", "required": True, "rows": 3},
                        {"name": "sector", "label": "Secteur d'activité", "type": "select", "options": "sectors"},
                        {"name": "description", "label": "Description", "type": "textarea", "rows": 5},
                    ]
                },
                {
                    "title": "Localisation",
                    "fields": [
                        {"name": "country", "label": "Pays", "type": "select", "options": "african_countries", "required": True},
                        {"name": "region", "label": "Région", "type": "text"},
                        {"name": "city", "label": "Ville", "type": "text", "required": True},
                        {"name": "address", "label": "Adresse complète", "type": "textarea", "rows": 2},
                        {"name": "latitude", "label": "Latitude", "type": "number", "step": "0.000001"},
                        {"name": "longitude", "label": "Longitude", "type": "number", "step": "0.000001"},
                    ]
                },
                {
                    "title": "Contact",
                    "fields": [
                        {"name": "email", "label": "Email", "type": "email"},
                        {"name": "phone", "label": "Téléphone", "type": "tel"},
                        {"name": "website", "label": "Site web", "type": "url"},
                    ]
                },
                {
                    "title": "Impact ODD",
                    "fields": [
                        {"name": "sdg_contributions", "label": "ODD contribués", "type": "multi-select", "options": "sdg_list"},
                    ]
                }
            ]
        },
        
        "company_annual_data": {
            "title": "Données annuelles",
            "description": "Données environnementales et sociales par année",
            "sections": [
                {
                    "title": "Période",
                    "fields": [
                        {"name": "year", "label": "Année", "type": "select", "options": "years", "required": True},
                    ]
                },
                {
                    "title": "Ressources humaines",
                    "fields": [
                        {"name": "employee_count", "label": "Nombre d'employés permanents", "type": "number", "min": 0},
                        {"name": "temporary_employee_count", "label": "Nombre d'employés temporaires", "type": "number", "min": 0},
                        {"name": "temporary_employee_ratio", "label": "% de temporaires", "type": "number", "min": 0, "max": 100, "suffix": "%"},
                        {"name": "contractor_count", "label": "Nombre de prestataires", "type": "number", "min": 0},
                    ]
                },
                {
                    "title": "Politiques et certifications",
                    "fields": [
                        {"name": "existing_policies", "label": "Politiques existantes", "type": "textarea", "rows": 3, "placeholder": "Ex: Politique environnementale, RSE..."},
                        {"name": "coi_percentage", "label": "% COI (Coefficient d'Intégration)", "type": "number", "min": 0, "max": 100, "suffix": "%"},
                        {"name": "cod_percentage", "label": "% COD", "type": "number", "min": 0, "max": 100, "suffix": "%"},
                    ]
                },
                {
                    "title": "Consommation",
                    "fields": [
                        {"name": "local_purchases", "label": "Description achats locaux", "type": "textarea", "rows": 2},
                        {"name": "local_purchases_amount", "label": "Montant achats locaux (FCFA)", "type": "number", "min": 0},
                        {"name": "water_consumption_m3", "label": "Consommation d'eau (m³)", "type": "number", "min": 0, "step": "0.01"},
                        {"name": "fuel_consumption_liters", "label": "Consommation carburant (L)", "type": "number", "min": 0, "step": "0.01"},
                        {"name": "electricity_consumption_kwh", "label": "Consommation électrique (kWh)", "type": "number", "min": 0, "step": "0.01"},
                        {"name": "solar_percentage", "label": "% énergie solaire", "type": "number", "min": 0, "max": 100, "suffix": "%"},
                    ]
                },
                {
                    "title": "Émissions carbone",
                    "fields": [
                        {"name": "total_emissions", "label": "Émissions totales (tCO2e)", "type": "number", "min": 0, "step": "0.01"},
                        {"name": "scope1_emissions", "label": "Scope 1 - Émissions directes (tCO2e)", "type": "number", "min": 0, "step": "0.01"},
                        {"name": "scope2_emissions", "label": "Scope 2 - Électricité (tCO2e)", "type": "number", "min": 0, "step": "0.01"},
                        {"name": "scope3_emissions", "label": "Scope 3 - Indirectes (tCO2e)", "type": "number", "min": 0, "step": "0.01"},
                    ]
                },
                {
                    "title": "Gestion des déchets",
                    "fields": [
                        {"name": "total_waste_kg", "label": "Volume total déchets (kg)", "type": "number", "min": 0, "step": "0.01"},
                        {"name": "valorized_waste_kg", "label": "Déchets valorisés (kg)", "type": "number", "min": 0, "step": "0.01"},
                        {"name": "unsold_volume_kg", "label": "Invendus (kg)", "type": "number", "min": 0, "step": "0.01"},
                        {"name": "waste_valorization_initiatives", "label": "Initiatives de valorisation", "type": "textarea", "rows": 3},
                    ]
                }
            ]
        },
        
        "company_claim": {
            "title": "Réclamer une entreprise",
            "description": "Demande de propriété d'une fiche entreprise",
            "sections": [
                {
                    "title": "Justification",
                    "fields": [
                        {"name": "justification", "label": "Justification de la demande", "type": "textarea", "required": True, "rows": 5, "placeholder": "Expliquez pourquoi vous êtes le représentant légitime de cette entreprise..."},
                        {"name": "documents", "label": "Documents justificatifs", "type": "file-upload", "accept": ".pdf,.jpg,.png", "multiple": True},
                    ]
                }
            ]
        }
    }
    
    return forms

def generate_reference_data():
    """Génère les données de référence (pays, secteurs, ODD)"""
    
    african_countries = [
        "Afrique du Sud", "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso",
        "Burundi", "Cameroun", "Cap-Vert", "Centrafrique", "Comores", "Congo",
        "Côte d'Ivoire", "Djibouti", "Égypte", "Érythrée", "Eswatini", "Éthiopie",
        "Gabon", "Gambie", "Ghana", "Guinée", "Guinée équatoriale", "Guinée-Bissau",
        "Kenya", "Lesotho", "Liberia", "Libye", "Madagascar", "Malawi", "Mali",
        "Maroc", "Maurice", "Mauritanie", "Mozambique", "Namibie", "Niger",
        "Nigeria", "Ouganda", "RD Congo", "Rwanda", "Sao Tomé-et-Principe",
        "Sénégal", "Seychelles", "Sierra Leone", "Somalie", "Soudan", "Soudan du Sud",
        "Tanzanie", "Tchad", "Togo", "Tunisie", "Zambie", "Zimbabwe"
    ]
    
    sectors = [
        {"value": "renewable_energy", "label": "Énergies renouvelables"},
        {"value": "agriculture", "label": "Agriculture et agroalimentaire"},
        {"value": "waste_management", "label": "Gestion des déchets"},
        {"value": "water", "label": "Eau et assainissement"},
        {"value": "construction", "label": "Construction durable"},
        {"value": "transport", "label": "Transport et mobilité"},
        {"value": "industry", "label": "Industrie verte"},
        {"value": "services", "label": "Services environnementaux"},
        {"value": "technology", "label": "Technologies vertes"},
        {"value": "finance", "label": "Finance verte"},
        {"value": "other", "label": "Autre"},
    ]
    
    sdg_list = [
        {"value": 1, "label": "ODD 1 - Pas de pauvreté", "icon": "🎯"},
        {"value": 2, "label": "ODD 2 - Faim zéro", "icon": "🌾"},
        {"value": 3, "label": "ODD 3 - Bonne santé", "icon": "❤️"},
        {"value": 4, "label": "ODD 4 - Éducation de qualité", "icon": "📚"},
        {"value": 5, "label": "ODD 5 - Égalité des sexes", "icon": "⚖️"},
        {"value": 6, "label": "ODD 6 - Eau propre", "icon": "💧"},
        {"value": 7, "label": "ODD 7 - Énergie propre", "icon": "⚡"},
        {"value": 8, "label": "ODD 8 - Travail décent", "icon": "💼"},
        {"value": 9, "label": "ODD 9 - Industrie et innovation", "icon": "🏭"},
        {"value": 10, "label": "ODD 10 - Inégalités réduites", "icon": "🤝"},
        {"value": 11, "label": "ODD 11 - Villes durables", "icon": "🏙️"},
        {"value": 12, "label": "ODD 12 - Consommation responsable", "icon": "♻️"},
        {"value": 13, "label": "ODD 13 - Action climatique", "icon": "🌍"},
        {"value": 14, "label": "ODD 14 - Vie aquatique", "icon": "🐟"},
        {"value": 15, "label": "ODD 15 - Vie terrestre", "icon": "🌳"},
        {"value": 16, "label": "ODD 16 - Paix et justice", "icon": "🕊️"},
        {"value": 17, "label": "ODD 17 - Partenariats", "icon": "🤲"},
    ]
    
    return {
        "african_countries": sorted(african_countries),  # Tri alphabétique
        "sectors": sectors,
        "sdg_list": sdg_list,
        "years": list(range(2020, 2031))  # 2020-2030
    }

def main():
    """Fonction principale"""
    print("🔍 Analyse des fichiers Excel PME/PMI")
    print("="*60)
    
    # 1. Analyser les fichiers Excel
    all_excel_data = {}
    for file_path in EXCEL_FILES:
        if file_path.exists():
            data = analyze_excel_structure(file_path)
            if data:
                all_excel_data[file_path.name] = data
        else:
            print(f"⚠️ Fichier non trouvé: {file_path}")
    
    # 2. Extraire les colonnes et données
    columns, companies = extract_company_fields()
    print(f"\n📊 {len(columns)} colonnes uniques trouvées")
    print(f"📊 {len(companies)} entreprises trouvées")
    
    # 3. Générer le schéma de base de données
    db_schema = generate_database_schema()
    
    # 4. Générer la structure des formulaires
    forms = generate_form_structure()
    
    # 5. Générer les données de référence
    reference_data = generate_reference_data()
    
    # 6. Créer le rapport complet
    report = {
        "generated_at": datetime.now().isoformat(),
        "excel_analysis": all_excel_data,
        "unique_columns": sorted(columns),
        "companies_count": len(companies),
        "database_schema": db_schema,
        "forms_structure": forms,
        "reference_data": reference_data,
        "column_mapping": map_excel_to_database_schema(),
        "sample_companies": companies[:5] if companies else []
    }
    
    # 7. Sauvegarder le rapport
    output_dir = BASE_DIR / "scripts" / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / "companies_analysis_report.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2, default=str)
    
    print(f"\n✅ Rapport sauvegardé: {output_file}")
    
    # 8. Afficher le résumé
    print("\n" + "="*60)
    print("📋 RÉSUMÉ DE L'ANALYSE")
    print("="*60)
    print(f"\n📁 Fichiers analysés: {len(all_excel_data)}")
    print(f"🏢 Entreprises trouvées: {len(companies)}")
    print(f"📊 Colonnes uniques: {len(columns)}")
    print(f"\n📦 Tables à créer/vérifier:")
    for table_name, table_info in db_schema["tables"].items():
        print(f"  - {table_name}: {len(table_info['fields'])} champs")
    print(f"\n📝 Formulaires définis: {len(forms)}")
    for form_name, form_info in forms.items():
        print(f"  - {form_name}: {form_info['title']}")
    
    return report

if __name__ == "__main__":
    report = main()
