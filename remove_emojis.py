#!/usr/bin/env python3
"""
Script pour supprimer tous les emojis d'un projet sauf ✅ et ❌
Usage: python3 remove_emojis.py
"""

import re
import os
from pathlib import Path
from typing import Set, List, Tuple

# Emojis à CONSERVER (ne seront pas supprimés)
KEEP_EMOJIS = {'✅', '❌'}

# Extensions de fichiers à traiter
FILE_EXTENSIONS = ['.ts', '.js', '.vue', '.md', '.json', '.tsx', '.jsx']

# Dossiers à exclure
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', 'build', '.next', '__pycache__', 'venv'}


def find_emojis_in_text(text: str) -> Set[str]:
    """Trouve tous les emojis dans un texte."""
    # Pattern pour détecter les emojis Unicode
    emoji_pattern = re.compile(
        r'[\U0001F000-\U0001FFFF]|'  # Emojis modernes
        r'[\u2600-\u27BF]|'          # Symboles et emojis classiques
        r'[\u2300-\u23FF]|'          # Symboles techniques (montres, sabliers, etc.)
        r'[\u2B50]|'                 # Étoile
        r'[\u203C-\u2049]'           # Ponctuation emoji (‼️, ⁉️)
    )
    return set(emoji_pattern.findall(text))


def remove_emojis_from_text(text: str) -> str:
    """Supprime tous les emojis sauf ceux dans KEEP_EMOJIS."""
    def replace_emoji(match):
        emoji = match.group(0)
        # Garder l'emoji s'il est dans la liste des emojis à conserver
        if emoji in KEEP_EMOJIS:
            return emoji
        # Sinon le supprimer (remplacer par chaine vide)
        return ''
    
    # Pattern pour tous les emojis
    emoji_pattern = re.compile(
        r'[\U0001F000-\U0001FFFF]|'
        r'[\u2600-\u27BF]|'
        r'[\u2300-\u23FF]|'
        r'[\u2B50]|'
        r'[\u203C-\u2049]'
    )
    
    return emoji_pattern.sub(replace_emoji, text)


def process_file(file_path: Path, dry_run: bool = False) -> Tuple[bool, int]:
    """
    Traite un fichier et supprime les emojis.
    Retourne (modifié: bool, nombre_emojis_supprimés: int)
    """
    try:
        # Lire le fichier
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        # Compter les emojis avant suppression
        all_emojis = find_emojis_in_text(original_content)
        emojis_to_remove = all_emojis - KEEP_EMOJIS
        
        if not emojis_to_remove:
            return False, 0
        
        if dry_run:
            return True, len(emojis_to_remove)

        # Supprimer les emojis
        new_content = remove_emojis_from_text(original_content)
        
        # Écrire le fichier modifié
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True, len(emojis_to_remove)
    
    except Exception as e:
        print(f"❌ Erreur lors du traitement de {file_path}: {e}")
        return False, 0


def main():
    """Fonction principale."""
    import argparse
    parser = argparse.ArgumentParser(description='Supprime les emojis des fichiers du projet.')
    parser.add_argument('path', nargs='?', default='.', help='Dossier ou fichier à traiter')
    parser.add_argument('--dry-run', action='store_true', help='Simule la suppression sans modifier les fichiers')
    args = parser.parse_args()

    print("="*70)
    print("🧹 SUPPRESSION DES EMOJIS DU PROJET")
    print("="*70)
    print(f"📁 Cible: {args.path}")
    print(f"🔧 Mode: {'SIMULATION (Dry Run)' if args.dry_run else 'ÉCRITURE'}")
    print(f"✅ Emojis conservés: {', '.join(KEEP_EMOJIS)}")
    print(f"📁 Extensions traitées: {', '.join(FILE_EXTENSIONS)}")
    print(f"🚫 Dossiers exclus: {', '.join(EXCLUDE_DIRS)}")
    print("\n" + "="*70)
    
    # Statistiques
    total_files_scanned = 0
    total_files_modified = 0
    total_emojis_removed = 0
    files_with_emojis: List[Tuple[str, int]] = []
    
    target_path = Path(args.path)
    
    # Déterminer les fichiers à traiter
    # Parcourir tous les fichiers du projet
    root_dir = target_path # Use the provided path as root
    
    for file_path in root_dir.rglob('*'):
        # Vérifier si c'est un fichier
        if not file_path.is_file():
            continue
            
        # Vérifier si le fichier est dans un dossier exclu
        if any(excl in file_path.parts for excl in EXCLUDE_DIRS):
            continue
            
        # Ignorer le script lui-même
        if file_path.name == Path(__file__).name: # Use Path(__file__).name for robustness
            continue
        
        total_files_scanned += 1
        
        # Traiter le fichier
        modified, emoji_count = process_file(file_path, dry_run=args.dry_run)
        
        if modified:
            total_files_modified += 1
            total_emojis_removed += emoji_count
            files_with_emojis.append((str(file_path), emoji_count))
            action = "détecté(s) (simulation)" if args.dry_run else "supprimé(s)"
            print(f"✅ {file_path} - {emoji_count} emoji(s) {action}")
    
    # Afficher le résumé
    print("\n" + "="*70)
    print("📊 RÉSUMÉ")
    print("="*70)
    print(f"📂 Fichiers scannés: {total_files_scanned}")
    print(f"✏️  Fichiers {'à modifier' if args.dry_run else 'modifiés'}: {total_files_modified}")
    print(f"🗑️  Emojis {'à supprimer' if args.dry_run else 'supprimés'}: {total_emojis_removed}")
    print("\n" + "="*70)
    
    if files_with_emojis:
        print("\n📋 DÉTAILS DES FICHIERS CONCERNÉS:")
        print("-"*70)
        for file_path, count in files_with_emojis:
            print(f"  • {file_path}: {count} emoji(s)")
    
    print("\n✅ Traitement terminé!\n")


if __name__ == '__main__':
    main()
