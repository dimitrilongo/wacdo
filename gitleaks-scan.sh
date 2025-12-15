#!/bin/bash

# Script pour scanner les secrets avec Gitleaks

echo "🔍 Scan des secrets avec Gitleaks..."

# Vérifier si gitleaks est installé
if ! command -v gitleaks &> /dev/null; then
    echo "❌ Gitleaks n'est pas installé."
    echo "Installation (macOS): brew install gitleaks"
    echo "Ou téléchargez depuis: https://github.com/gitleaks/gitleaks/releases"
    exit 1
fi

# Scanner le repository
echo "Scan du repository complet..."
gitleaks detect --config .gitleaks.toml --verbose

# Sauvegarder le rapport
echo ""
echo "Génération du rapport JSON..."
gitleaks detect --config .gitleaks.toml --report-path gitleaks-report.json --report-format json

if [ $? -eq 0 ]; then
    echo "✅ Aucun secret détecté!"
else
    echo "⚠️  Secrets détectés! Consultez gitleaks-report.json"
    echo "Assurez-vous que ces fichiers sont dans .gitignore:"
    echo "  - backend/.env"
    echo "  - frontend/.env.local"
fi
