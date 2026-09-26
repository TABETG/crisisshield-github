#!/usr/bin/env bash
# L2-04 : restauration d'une sauvegarde. ECRASE les donnees actuelles.
# Usage : bash scripts/restauration.sh sauvegardes/crisisshield-AAAAMMJJ-HHMMSS.dump
set -e
cd "$(dirname "$0")/.."
[ -f "$1" ] || { echo "Fichier introuvable : $1"; exit 1; }
set -a; [ -f .env ] && . ./.env; set +a
echo "Restauration de $1 dans ${POSTGRES_DB} — les donnees actuelles seront remplacees. Ctrl-C pour annuler, 5 s..."
sleep 5
docker compose exec -T db pg_restore -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" --clean --if-exists --no-owner < "$1"
echo "Restauration terminee. Redemarre le backend : docker compose restart backend"
