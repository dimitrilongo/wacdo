#!/bin/bash

# Script de test pour l'API d'authentification
echo "=== Test de l'API d'authentification ==="

BASE_URL="http://127.0.0.1:8000/api"

echo "1. Test d'inscription d'un nouvel utilisateur..."
REGISTER_RESPONSE=$(curl -s -X POST ${BASE_URL}/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "Utilisateur",
    "email": "test@example.com",
    "mot_de_passe": "password123",
    "mot_de_passe_confirmation": "password123",
    "date_embauche": "2025-01-01",
    "is_admin": false
  }')

echo "Réponse inscription:"
echo $REGISTER_RESPONSE | jq . 2>/dev/null || echo $REGISTER_RESPONSE
echo ""

echo "2. Test de connexion avec un utilisateur existant..."
LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@wacdo.com",
    "mot_de_passe": "password123"
  }')

echo "Réponse connexion:"
echo $LOGIN_RESPONSE | jq . 2>/dev/null || echo $LOGIN_RESPONSE
echo ""

# Extraire le token (si jq est disponible)
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "3. Test d'accès aux informations utilisateur avec token..."
    ME_RESPONSE=$(curl -s -X GET ${BASE_URL}/me \
      -H "Authorization: Bearer ${TOKEN}")

    echo "Réponse /me:"
    echo $ME_RESPONSE | jq . 2>/dev/null || echo $ME_RESPONSE
    echo ""

    echo "4. Test de déconnexion..."
    LOGOUT_RESPONSE=$(curl -s -X POST ${BASE_URL}/logout \
      -H "Authorization: Bearer ${TOKEN}")

    echo "Réponse déconnexion:"
    echo $LOGOUT_RESPONSE | jq . 2>/dev/null || echo $LOGOUT_RESPONSE
else
    echo "Token non récupéré, impossible de tester les endpoints protégés"
fi

echo ""
echo "=== Fin des tests ==="
