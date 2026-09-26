#!/usr/bin/env bash
# L2-03 : execute une seule fois par l'image postgres, a la creation du volume.
# Cree le role applicatif : il lit et ecrit les donnees, mais ne possede aucune table.
# Le role proprietaire (POSTGRES_USER) est reserve aux migrations Flyway.
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-SQL
    CREATE ROLE ${DB_APP_USER} LOGIN PASSWORD '${DB_APP_PASSWORD}';
    GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO ${DB_APP_USER};
    GRANT USAGE ON SCHEMA public TO ${DB_APP_USER};
    -- les tables n'existent pas encore (Flyway les creera) : on fixe les droits par defaut
    ALTER DEFAULT PRIVILEGES FOR ROLE ${POSTGRES_USER} IN SCHEMA public
        GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${DB_APP_USER};
    ALTER DEFAULT PRIVILEGES FOR ROLE ${POSTGRES_USER} IN SCHEMA public
        GRANT USAGE, SELECT ON SEQUENCES TO ${DB_APP_USER};
SQL
echo ">>> Role applicatif ${DB_APP_USER} cree : lecture/ecriture des donnees, aucun droit sur le schema."
