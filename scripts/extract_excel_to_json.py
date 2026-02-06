#!/usr/bin/env python3
"""
Script d'extraction COMPLETE des fichiers Excel vers JSON structuré
Chaque fichier Excel génère son propre JSON AVANT consolidation

Auteur: Cascade AI
Date: 6 février 2026
"""

import pandas as pd
import json
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent
OUTPUT_DIR = BASE_DIR / "scripts" / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def clean_value(val):
    """Nettoie une valeur"""
    if pd.isna(val):
        return None
    val_str = str(val).strip()
    if val_str in ['-', '', 'nan', 'NaN', 'None']:
        return None
    return val_str

def extract_excel_file(file_path, output_name):
    """Extrait TOUTES les données d'un fichier Excel vers JSON"""
    print(f"\n{'='*60}")
    print(f"EXTRACTION: {file_path.name}")
    print(f"{'='*60}")
    
    if not file_path.exists():
        print(f"  ERREUR: Fichier non trouve!")
        return None
    
    xl = pd.ExcelFile(file_path)
    result = {
        "source_file": file_path.name,
        "extracted_at": datetime.now().isoformat(),
        "sheets": {}
    }
    
    for sheet_name in xl.sheet_names:
        print(f"\n  Feuille: {sheet_name}")
        
        # Lire la feuille
        df = pd.read_excel(xl, sheet_name=sheet_name, header=None)
        
        # Trouver la ligne d'en-tête (première ligne avec plusieurs valeurs non vides)
        header_row = 0
        for i in range(min(5, len(df))):
            non_empty = df.iloc[i].dropna()
            if len(non_empty) >= 3:
                header_row = i
                break
        
        # Relire avec l'en-tête correct
        df = pd.read_excel(xl, sheet_name=sheet_name, header=header_row)
        df.columns = [str(col).strip() for col in df.columns]
        
        print(f"    Lignes: {len(df)}")
        print(f"    Colonnes: {len(df.columns)}")
        print(f"    En-tetes: {list(df.columns)[:5]}...")
        
        # Extraire les colonnes avec leurs metadonnees
        columns_meta = []
        for col in df.columns:
            col_data = df[col].dropna()
            columns_meta.append({
                "name": col,
                "non_null_count": len(col_data),
                "total_count": len(df),
                "fill_rate_percent": round(len(col_data) / len(df) * 100, 1) if len(df) > 0 else 0,
                "sample_values": [clean_value(v) for v in col_data.head(3).tolist()]
            })
        
        # Extraire TOUTES les lignes de donnees
        rows_data = []
        for idx, row in df.iterrows():
            row_dict = {}
            for col in df.columns:
                val = clean_value(row[col])
                if val is not None:
                    row_dict[col] = val
            if row_dict:  # Ignorer les lignes vides
                rows_data.append(row_dict)
        
        result["sheets"][sheet_name] = {
            "row_count": len(rows_data),
            "column_count": len(df.columns),
            "columns": columns_meta,
            "data": rows_data
        }
        
        print(f"    Lignes extraites: {len(rows_data)}")
    
    # Sauvegarder le JSON
    output_file = OUTPUT_DIR / f"{output_name}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n  JSON genere: {output_file}")
    return result

def main():
    print("="*60)
    print("EXTRACTION COMPLETE DES FICHIERS EXCEL")
    print("="*60)
    
    # Liste des fichiers a traiter
    excel_files = [
        {
            "path": BASE_DIR / "Fiche synthetique PME-PMI_Sonia.xlsx",
            "output": "excel_1_sonia_raw"
        },
        {
            "path": BASE_DIR / "Fiche synthetique PME-PMIs.xlsx",
            "output": "excel_2_pmis_raw"
        }
    ]
    
    # Corriger les accents dans les noms de fichiers
    for item in excel_files:
        # Essayer avec accents
        path_with_accent = BASE_DIR / item["path"].name.replace("synthetique", "synthétique")
        if path_with_accent.exists():
            item["path"] = path_with_accent
    
    all_results = {}
    
    for item in excel_files:
        result = extract_excel_file(item["path"], item["output"])
        if result:
            all_results[item["output"]] = result
    
    # Afficher le resume
    print("\n" + "="*60)
    print("RESUME DE L'EXTRACTION")
    print("="*60)
    
    total_rows = 0
    for name, data in all_results.items():
        print(f"\n{name}:")
        for sheet_name, sheet_data in data.get("sheets", {}).items():
            rows = sheet_data.get("row_count", 0)
            cols = sheet_data.get("column_count", 0)
            print(f"  - {sheet_name}: {rows} lignes, {cols} colonnes")
            total_rows += rows
    
    print(f"\nTOTAL: {total_rows} lignes de donnees extraites")
    print(f"\nFichiers JSON generes dans: {OUTPUT_DIR}")
    
    # Lister les fichiers generes
    print("\nFichiers generes:")
    for f in OUTPUT_DIR.glob("excel_*.json"):
        size = f.stat().st_size
        print(f"  - {f.name} ({size:,} bytes)")

if __name__ == "__main__":
    main()
