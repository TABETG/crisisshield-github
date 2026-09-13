# CrisisShield

Plateforme de gestion de crise cyber, multi-organisations, avec assistant IA securise.

## Arborescence

```
backend/     Spring Boot 3.2, Java 21 — API, securite, multi-locataire, assistant IA
frontend/    React 18, TypeScript, Vite
infra/
  ldap/        OpenLDAP de developpement (image, LDIF)
  kubernetes/  kind + chart Helm durci
  terraform/   AWS (a faire, EP01-US08)
docs/
  backlog/     backlog enrichi (61 stories) + backlog d'origine
  adr/         registres de decision d'architecture
  securite/    modele de menace, cours, dictionnaire PKI
  notes-classes/ notes de conception par classe
scripts/     outils
```

## Demarrage

```bash
docker compose up --build
```

- API : http://localhost:8080 — sante : http://localhost:8080/actuator/health — cles : http://localhost:8080/.well-known/jwks.json
- Front : http://localhost:5173
- Annuaire : http://localhost:8081 (phpLDAPadmin)

Comptes crees au premier demarrage : `admin`, `user` (miroir LDAP), `opsuser`, `mfauser` — mot de passe `password`.

## Se connecter et interroger l'assistant

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"password"}' | sed 's/.*"accessToken":"\([^"]*\)".*/\1/')

curl -s -X POST http://localhost:8080/api/assistant/ask \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"question":"Quelle est la premiere etape du plan ransomware ?"}'
```

## Compiler sans Docker

```bash
cd backend && ./mvnw clean package -DskipTests
```

## Ou en est le projet

Voir `docs/backlog/backlog-crisisshield-enrichi.html` — ordre recommande en fin de document.
Etat au 13 septembre 2026 : LDAP corrige, RS256 + JWKS, tests d'isolation, assistant avec filtrage, masquage et limitation. Detail : `docs/tickets-realises.md`.
