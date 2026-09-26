# Contribuer a CrisisShield

## Premiere fois sur ce depot

```bash
cp .env.example .env            # puis remplir les valeurs
git config core.hooksPath .githooks   # crochet Gitleaks : un secret ne part jamais
docker compose up --build
```

## Branches

- `develop` : branche de travail. Tout commit passe par elle.
- `master` : branche stable. Protegee : pull request obligatoire, chaine verte obligatoire, revue du proprietaire.
- Une branche par ticket si le travail depasse une journee : `l2-01-flyway`, `l3-04-cosign`...

## Commits

- Signes (SSH ou GPG) : le badge « Verified » prouve que le commit vient bien de toi.
- Message : `type: sujet` — `feat`, `fix`, `ci`, `docs`, `chore`, `test`.
- Un ticket par commit quand c'est possible.

## Base de donnees

- Le schema ne se modifie que par une migration Flyway : `backend/src/main/resources/db/migration/V<n>__<sujet>.sql`.
- Une migration appliquee ne se modifie jamais. On en ecrit une nouvelle.
- Hibernate est en `validate` : si l'application refuse de demarrer apres un changement d'entite, c'est qu'il manque la migration.

## Secrets

- Jamais dans le code, jamais dans `docker-compose.yml`, jamais dans un commit.
- Localement : `.env` (ignore par Git). Les variables sont documentees dans `.env.example`.
- Le crochet `pre-commit` et le job `secrets` de la chaine sont la pour rattraper l'oubli.

## Avant d'ouvrir une pull request

Le modele de pull request contient la liste de controle. Elle n'est pas decorative.
