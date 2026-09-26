#!/usr/bin/env bash
# L2-04 : sauvegarde logique de la base, format compresse pg_dump, dans ./sauvegardes/
# Usage : bash scripts/sauvegarde.sh
set -e
cd "$(dirname "$0")/.."
set -a; [ -f .env ] && . ./.env; set +a
mkdir -p sauvegardes
fichier="sauvegardes/crisisshield-$(date +%Y%m%d-%H%M%S).dump"
docker compose exec -T db pg_dump -U "${POSTGRES_USER}" -Fc "${POSTGRES_DB}" > "$fichier"
echo "Sauvegarde : $fichier ($(du -h "$fichier" | cut -f1))"
