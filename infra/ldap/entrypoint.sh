#!/bin/bash
set -e

# Exécute l'entrypoint original de l'image osixia/openldap en arrière-plan
# Cela démarre le serveur slapd et effectue les initialisations de base
/container/tool/run &

# Attendre que le serveur LDAP soit prêt et accepte les connexions
echo "Waiting for OpenLDAP server to be ready..."
until ldapsearch -x -H ldap://localhost:389 -b "dc=springframework,dc=org" -s base > /dev/null 2>&1; do
  echo "OpenLDAP not yet ready, retrying in 1 second..."
  sleep 1
done
echo "OpenLDAP server is ready."

# Importer le fichier LDIF personnalisé
echo "Importing custom bootstrap.ldif..."
ldapadd -x -H ldap://localhost:389 -D "cn=admin,dc=springframework,dc=org" -w admin -f /opt/bootstrap.ldif
echo "Custom bootstrap.ldif imported successfully."

# Garder le conteneur en vie en attendant la fin de l'entrypoint original
wait $!
