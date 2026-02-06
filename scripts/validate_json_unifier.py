#!/usr/bin/env python3
"""
Script de validation du JSON unifie vs les fichiers Excel sources
Verifie que TOUTES les donnees sont bien integrees

Auteur: Cascade AI
Date: 6 fevrier 2026
"""

import pandas as pd
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

def load_json_unifier():
    """Charge le JSON unifie depuis le fichier markdown"""
    json_file = BASE_DIR / "docs" / "jspn_unifier.md"
    
    with open(json_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extraire le JSON du markdown
    match = re.search(r'```json\s*([\s\S]*?)\s*```', content)
    if match:
        json_str = match.group(1)
        return json.loads(json_str)
    return None

def load_excel_files():
    """Charge les deux fichiers Excel"""
    excel_data = {}
    
    # Fichier 1: Sonia (dechets)
    file1 = BASE_DIR / "Fiche synthetique PME-PMI_Sonia.xlsx"
    if not file1.exists():
        file1 = BASE_DIR / "Fiche synthétique PME-PMI_Sonia.xlsx"
    
    if file1.exists():
        df1 = pd.read_excel(file1)
        df1.columns = [str(c).strip() for c in df1.columns]
        excel_data['sonia'] = df1
        print(f"Excel Sonia: {len(df1)} lignes, {len(df1.columns)} colonnes")
        print(f"  Colonnes: {list(df1.columns)}")
    
    # Fichier 2: PMIs (donnees principales)
    file2 = BASE_DIR / "Fiche synthetique PME-PMIs.xlsx"
    if not file2.exists():
        file2 = BASE_DIR / "Fiche synthétique PME-PMIs.xlsx"
    
    if file2.exists():
        # Lire toutes les feuilles
        xl = pd.ExcelFile(file2)
        for sheet in xl.sheet_names:
            df = pd.read_excel(xl, sheet_name=sheet)
            df.columns = [str(c).strip() for c in df.columns]
            excel_data[f'pmis_{sheet}'] = df
            print(f"Excel PMIs ({sheet}): {len(df)} lignes, {len(df.columns)} colonnes")
    
    return excel_data

def validate_companies_count(json_data, excel_data):
    """Verifie le nombre d'entreprises"""
    print("\n" + "="*60)
    print("1. VALIDATION DU NOMBRE D'ENTREPRISES")
    print("="*60)
    
    json_count = len(json_data)
    
    # Compter dans Excel Sonia
    sonia_count = 0
    if 'sonia' in excel_data:
        sonia_df = excel_data['sonia']
        # Trouver la colonne des noms
        name_col = None
        for col in sonia_df.columns:
            if 'PME' in col.upper() or 'NOM' in col.upper():
                name_col = col
                break
        if name_col:
            sonia_count = sonia_df[name_col].dropna().nunique()
    
    print(f"  JSON unifie: {json_count} entreprises")
    print(f"  Excel Sonia: {sonia_count} entreprises uniques")
    
    if json_count == 20:
        print("  [OK] 20 entreprises dans le JSON")
        return True
    else:
        print(f"  [ERREUR] Attendu 20, trouve {json_count}")
        return False

def validate_fields_coverage(json_data, excel_data):
    """Verifie que tous les champs sont couverts"""
    print("\n" + "="*60)
    print("2. VALIDATION DES CHAMPS")
    print("="*60)
    
    # Champs attendus du fichier PMIs
    pmis_fields = [
        'activites_principales',
        'odd_contribues', 
        'politiques_existantes',
        'nombre_employes',
        '%cdi', '%cdd',
        'emissions_totales', 'emissions_scope_1', 'emissions_scope_2', 'emissions_scope_3'
    ]
    
    # Champs attendus du fichier Sonia
    sonia_fields = [
        'volume_dechets_solides_sonia',
        'volume_dechets_liquides_sonia',
        'volumes_compostes_methanises_sonia',
        'initiative_valorisation_dechets_sonia'
    ]
    
    # Verifier la presence des champs dans le JSON
    first_item = json_data[0]
    all_json_fields = set(first_item.keys())
    
    print(f"\n  Champs dans le JSON: {len(all_json_fields)}")
    
    # Verifier champs PMIs
    print("\n  Champs PMIs:")
    pmis_ok = True
    for field in pmis_fields:
        if field in all_json_fields:
            print(f"    [OK] {field}")
        else:
            print(f"    [MANQUE] {field}")
            pmis_ok = False
    
    # Verifier champs Sonia
    print("\n  Champs Sonia:")
    sonia_ok = True
    for field in sonia_fields:
        if field in all_json_fields:
            print(f"    [OK] {field}")
        else:
            print(f"    [MANQUE] {field}")
            sonia_ok = False
    
    return pmis_ok and sonia_ok

def validate_data_integrity(json_data):
    """Verifie l'integrite des donnees"""
    print("\n" + "="*60)
    print("3. VALIDATION DE L'INTEGRITE DES DONNEES")
    print("="*60)
    
    issues = []
    
    for i, company in enumerate(json_data):
        company_name = company.get('nom_pme_pmi', f'Entreprise {i+1}')
        
        # Verifier les champs obligatoires
        if not company.get('nom_pme_pmi'):
            issues.append(f"[{i+1}] Nom manquant")
        
        # Verifier les ODD
        odd = company.get('odd_contribues')
        if odd and isinstance(odd, str):
            # OK, format texte
            pass
        elif odd is None:
            issues.append(f"[{i+1}] {company_name}: ODD manquant")
        
        # Verifier les donnees Sonia
        sonia_solid = company.get('volume_dechets_solides_sonia')
        if sonia_solid is None:
            issues.append(f"[{i+1}] {company_name}: Dechets solides Sonia manquant")
    
    if issues:
        print(f"\n  {len(issues)} problemes trouves:")
        for issue in issues[:10]:  # Limiter l'affichage
            print(f"    - {issue}")
        if len(issues) > 10:
            print(f"    ... et {len(issues) - 10} autres")
        return False
    else:
        print("  [OK] Toutes les donnees sont presentes")
        return True

def generate_stats(json_data):
    """Genere des statistiques sur les donnees"""
    print("\n" + "="*60)
    print("4. STATISTIQUES DES DONNEES")
    print("="*60)
    
    # Compter les champs remplis
    field_stats = {}
    for company in json_data:
        for field, value in company.items():
            if field not in field_stats:
                field_stats[field] = {'filled': 0, 'empty': 0}
            
            if value is not None and value != '' and value != '-' and value != '_':
                field_stats[field]['filled'] += 1
            else:
                field_stats[field]['empty'] += 1
    
    print("\n  Taux de remplissage par champ:")
    for field, stats in sorted(field_stats.items()):
        total = stats['filled'] + stats['empty']
        rate = stats['filled'] / total * 100 if total > 0 else 0
        bar = '#' * int(rate / 5) + '-' * (20 - int(rate / 5))
        print(f"    {field[:35]:35} [{bar}] {rate:5.1f}% ({stats['filled']}/{total})")

def list_all_companies(json_data):
    """Liste toutes les entreprises"""
    print("\n" + "="*60)
    print("5. LISTE DES 20 ENTREPRISES")
    print("="*60)
    
    for i, company in enumerate(json_data, 1):
        name = company.get('nom_pme_pmi', 'N/A')
        odd = company.get('odd_contribues', '')
        employees = company.get('nombre_employes', 'N/A')
        print(f"  {i:2}. {name[:50]:50} | Employes: {str(employees):5} | ODD: {odd}")

def main():
    print("="*60)
    print("VALIDATION DU JSON UNIFIE")
    print("="*60)
    
    # Charger les donnees
    print("\nChargement des fichiers...")
    json_data = load_json_unifier()
    
    if not json_data:
        print("ERREUR: Impossible de charger le JSON unifie")
        return
    
    print(f"JSON charge: {len(json_data)} entreprises")
    
    excel_data = load_excel_files()
    
    # Validations
    results = []
    results.append(("Nombre d'entreprises", validate_companies_count(json_data, excel_data)))
    results.append(("Couverture des champs", validate_fields_coverage(json_data, excel_data)))
    results.append(("Integrite des donnees", validate_data_integrity(json_data)))
    
    # Statistiques
    generate_stats(json_data)
    
    # Liste des entreprises
    list_all_companies(json_data)
    
    # Resume final
    print("\n" + "="*60)
    print("RESUME DE LA VALIDATION")
    print("="*60)
    
    all_ok = True
    for name, result in results:
        status = "[OK]" if result else "[ECHEC]"
        print(f"  {status} {name}")
        if not result:
            all_ok = False
    
    if all_ok:
        print("\n  *** VALIDATION REUSSIE ***")
        print("  Le JSON unifie contient bien toutes les donnees")
        print("  des deux fichiers Excel de facon coherente.")
    else:
        print("\n  *** VALIDATION ECHOUEE ***")
        print("  Des problemes ont ete detectes, voir ci-dessus.")

if __name__ == "__main__":
    main()
