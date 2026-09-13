#!/bin/bash

# ==============================================================================
# Script de Test d'Intégration Simplifié pour CrisisShield
#
# OBJECTIF :
# 1. Construire et démarrer l'environnement Docker de manière visible.
# 2. Lancer les tests d'API essentiels.
# 3. Laisser les conteneurs tourner pour inspection.
#
# USAGE :
#   ./run_full_test.sh
# ==============================================================================

# Arrête le script si une commande échoue
set -e

# --- Configuration ---
BACKEND_URL="http://localhost:8080"
LDAP_LOGIN_URL="$BACKEND_URL/api/ldap/login"
USERS_API_URL="$BACKEND_URL/api/users"
LDAP_USER="ldapuser"
LDAP_PASSWORD="password"
USER_SHOULD_SEE="dbuser_ldap"
USER_SHOULD_NOT_SEE="user_nova"

# --- Fonctions d'affichage ---
info() {
    echo "🚀 [INFO] $1"
}

success() {
    echo "✅ [SUCCESS] $1"
}

fail() {
    echo "❌ [FAIL] $1"
    # En cas d'échec, on laisse les conteneurs tourner pour le débogage
    info "Le script a échoué. Les conteneurs sont laissés en cours d'exécution pour inspection."
    info "Pour nettoyer, exécutez manuellement : docker compose down -v"
    exit 1
}

# --- Début du Script ---

info "Démarrage du test d'intégration..."

# 1. Nettoyage de l'environnement précédent
info "Nettoyage de l'environnement Docker précédent (docker compose down -v)..."
docker compose down -v --remove-orphans

# 2. Construction de l'image du backend (sans cache)
info "Construction de l'image du backend (build --no-cache)..."
# La sortie du build s'affiche directement dans la console.
docker compose build --no-cache backend

# 3. Démarrage de tous les services en arrière-plan
info "Démarrage de tous les conteneurs (up -d)..."
docker compose up -d

info "Les conteneurs sont en cours de démarrage. Vous pouvez les voir dans Docker Desktop ou IntelliJ."
info "Pour suivre les logs en direct, ouvrez un nouveau terminal et exécutez : docker compose logs -f"

# 4. Attente que le backend soit prêt
info "Attente que le backend soit prêt (max 60s)..."
WAIT_COUNT=0
# On attend que l'API des utilisateurs (protégée) renvoie un 401, signe que Spring Security est actif.
until [ "$(curl -s -o /dev/null -w '%{http_code}' $USERS_API_URL)" -eq 401 ]; do
    if [ $WAIT_COUNT -ge 60 ]; then
        fail "Le backend n'a pas démarré après 60 secondes. Vérifiez les logs avec 'docker compose logs backend'."
    fi
    printf '.'
    sleep 1
    WAIT_COUNT=$((WAIT_COUNT+1))
done
echo # Nouvelle ligne
success "Le backend est prêt et répond !"

# 5. Exécution des tests d'API
info "--- DÉBUT DES TESTS D'API ---"

# Test 1: Authentification LDAP réussie
info "Test 1: Authentification LDAP avec des identifiants valides..."
RESPONSE=$(curl -s -X POST $LDAP_LOGIN_URL \
    -H "Content-Type: application/json" \
    -d "{\"username\": \"$LDAP_USER\", \"password\": \"$LDAP_PASSWORD\"}")

TOKEN=$(echo "$RESPONSE" | jq -r '.accessToken')
if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    fail "L'extraction du token JWT a échoué. Réponse reçue : $RESPONSE"
fi
success "Authentification réussie et token JWT récupéré."

# Test 2: Vérification du filtrage par tenant
info "Test 2: Vérification du filtrage par tenant sur /api/users..."
API_RESPONSE=$(curl -s -X GET $USERS_API_URL -H "Authorization: Bearer $TOKEN")

if ! echo "$API_RESPONSE" | jq -e ".[] | select(.username == \"$USER_SHOULD_SEE\")" > /dev/null; then
    fail "L'utilisateur attendu '$USER_SHOULD_SEE' n'a pas été trouvé."
fi
success "L'utilisateur attendu '$USER_SHOULD_SEE' est bien visible."

if echo "$API_RESPONSE" | jq -e ".[] | select(.username == \"$USER_SHOULD_NOT_SEE\")" > /dev/null; then
    fail "FUITE DE DONNÉES ! L'utilisateur non autorisé '$USER_SHOULD_NOT_SEE' est visible."
fi
success "L'utilisateur non autorisé '$USER_SHOULD_NOT_SEE' est bien masqué. Cloisonnement OK."

# Test 3: Authentification LDAP échouée
info "Test 3: Authentification LDAP avec des identifiants invalides..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST $LDAP_LOGIN_URL \
    -H "Content-Type: application/json" \
    -d "{\"username\": \"$LDAP_USER\", \"password\": \"wrongpassword\"}")

if [ "$HTTP_STATUS" -ne 401 ]; then
    fail "Un statut 401 était attendu pour des identifiants invalides, mais j'ai reçu $HTTP_STATUS."
fi
success "Le serveur a bien retourné un statut 401 pour des identifiants invalides."

info "--- FIN DES TESTS D'API ---"

# 6. Fin du script
echo
success "🎉 Tous les tests ont été passés avec succès !"
info "Les conteneurs sont toujours en cours d'exécution pour que vous puissiez les inspecter."
info "Pour arrêter et nettoyer l'environnement, exécutez : docker compose down -v"
echo
