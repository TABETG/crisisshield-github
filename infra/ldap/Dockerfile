FROM osixia/openldap:1.5.0

# On copie le LDIF dans le dossier "custom" (import auto au 1er démarrage)
COPY bootstrap.ldif /container/service/slapd/assets/config/bootstrap/ldif/custom/50-users.ldif

# Fix droits + EOL (important sur Windows)
RUN chmod 644 /container/service/slapd/assets/config/bootstrap/ldif/custom/50-users.ldif \
 && sed -i 's/\r$//' /container/service/slapd/assets/config/bootstrap/ldif/custom/50-users.ldif \
 && chown 911:911 /container/service/slapd/assets/config/bootstrap/ldif/custom/50-users.ldif
