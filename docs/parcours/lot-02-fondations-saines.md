# Lot 2 — Fondations saines : base, secrets, dépôt

**TP couverts :** TP06 (PostgreSQL aux normes), TP38 partie locale (zéro secret statique), TP05 (dépôt propre et protégé).
**Chapitres du cours mobilisés :** 6.1 Bases relationnelles, 9.3 Variables et surcharges Compose, 11.4 Secrets dans la CI, 5.5 Sécuriser le dépôt, 15.4 La base de données dans les déploiements.
**Durée :** 40 minutes de lecture. Puis les vérifications du chapitre 6, à faire toi-même.

---

# Chapitre 1 — Ce qu'on a fait, en une ligne par ticket

| Ticket | Ce qui change | Fichiers |
|---|---|---|
| L2-01 | Le schéma est décrit par une migration SQL versionnée, appliquée par Flyway | `pom.xml`, `db/migration/V1__schema_initial.sql` |
| L2-02 | Hibernate ne touche plus au schéma, il le vérifie et refuse de démarrer s'il dévie | `application.properties` |
| L2-03 | Deux rôles PostgreSQL : l'application lit et écrit, seul Flyway peut modifier le schéma | `infra/postgres/init/01-roles.sh`, `application.properties`, `docker-compose.yml` |
| L2-04 | Sauvegarde et restauration scriptées | `scripts/sauvegarde.sh`, `scripts/restauration.sh` |
| L2-05 | Plus un seul secret dans `docker-compose.yml` : tout vient de `.env`, ignoré par Git | `docker-compose.yml`, `.env.example`, `.gitignore` |
| L2-06 | Un commit contenant un secret est refusé sur ton poste, avant de partir | `.githooks/pre-commit` |
| L2-07 | Branches protégées — à faire dans l'interface GitHub | chapitre 6 |
| L2-08 | Commits signés — à faire sur ton poste | chapitre 6 |
| L2-09 | Qui relit quoi, comment contribuer | `.github/CODEOWNERS`, `CONTRIBUTING.md` |

---

# Chapitre 2 — La base : pourquoi Flyway, et pourquoi `validate`

## 2.1 La mauvaise façon, celle qu'on vient de quitter

```properties
spring.jpa.hibernate.ddl-auto=update
```

Au démarrage, Hibernate compare les entités Java au schéma de la base et **modifie la base tout seul** pour les faire correspondre. Ça marche en développement. En production, c'est une des causes de perte de données les plus classiques :

- Tu renommes un champ `mfaSecret` en `totpSecret`. Hibernate ne sait pas que c'est un renommage : il ajoute une colonne `totp_secret` vide. L'ancienne reste là, orpheline. Les secrets MFA de tous les utilisateurs sont perdus pour l'application.
- Personne ne relit ce que Hibernate a décidé de faire. Il n'y a pas de fichier à mettre en pull request.
- Impossible de savoir dans quel état est le schéma d'un environnement donné. Il est ce que la dernière version démarrée en a fait.

Le cours le dit au chapitre 15.4 : la base de données est la partie d'un déploiement qu'on ne peut pas remettre en arrière par un simple redéploiement. C'est donc celle qu'on contrôle le plus strictement.

## 2.2 La bonne façon : des migrations versionnées

Un fichier SQL par changement, numéroté, dans `backend/src/main/resources/db/migration/` :

```
V1__schema_initial.sql       ce lot
V2__ajout_table_plan.sql     quand on créera les plans de crise
V3__index_recherche.sql      ...
```

Flyway, au démarrage, lit la table `flyway_schema_history`, voit quelles migrations sont déjà passées, et applique **uniquement** les nouvelles, dans l'ordre. Chaque migration est un fichier relu en pull request, tracé dans Git, appliqué à l'identique sur tous les environnements.

**La règle que tu dois savoir énoncer :** une migration appliquée ne se modifie jamais. Flyway stocke son empreinte ; si le fichier change après application, Flyway refuse de démarrer. Pour corriger une migration, on en écrit une nouvelle qui corrige.

## 2.3 `validate` : Hibernate devient un contrôleur

```properties
spring.jpa.hibernate.ddl-auto=validate
```

Hibernate compare toujours les entités au schéma, mais il ne modifie plus rien : si ça ne correspond pas, **l'application refuse de démarrer**, avec un message précis (« colonne `x` manquante dans la table `y` »).

C'est exactement ce qu'on veut. Un développeur qui ajoute un champ à une entité et oublie la migration le saura au premier démarrage, pas en production.

## 2.4 Ce que contient `V1__schema_initial.sql`

Le schéma qu'Hibernate générait, réécrit à la main, avec des noms de contraintes lisibles (`uk_app_user_email` plutôt que `uk_1j9d9a06i600gd43uu3km82jw`). Quatre tables : `organisation`, `app_user`, `user_roles`, `certificate_inventory`. Trois index sur les clés étrangères — Hibernate ne les créait pas, PostgreSQL n'indexe pas les clés étrangères automatiquement, et sans index chaque filtre par organisation est un parcours complet de table.

Le contrôle `check (role in ('ROLE_ADMIN', 'ROLE_OPS', 'ROLE_AUDITOR'))` : la base refuse un rôle inconnu, même si l'application a un bogue.

## 2.5 Attention au volume existant

Ta base actuelle a été créée par Hibernate en `update`. Elle contient les tables mais pas `flyway_schema_history`. Flyway va refuser : « schéma non vide sans historique ». C'est une **protection**, pas un bogue : il ne prend jamais le risque de rejouer un `create table` sur une base qu'il ne connaît pas.

En développement, on repart de zéro : `docker compose down -v`. En production, on ferait un `baseline` : on dit à Flyway « le schéma actuel correspond à V1, commence à V2 ». Sache le dire, c'est une question d'entretien.

---

# Chapitre 3 — Deux rôles PostgreSQL : moindre privilège appliqué à la base

## 3.1 La mauvaise façon

Un seul utilisateur, `crisisshield_user`, propriétaire de la base, utilisé par l'application. Il peut tout : `DROP TABLE`, `ALTER`, `TRUNCATE`. Une injection SQL, ou un simple bogue, peut supprimer une table.

## 3.2 La bonne façon

| Rôle | Utilisé par | Peut | Ne peut pas |
|---|---|---|---|
| `crisisshield_owner` | Flyway, sauvegardes | tout | — |
| `crisisshield_app` | l'application | `SELECT`, `INSERT`, `UPDATE`, `DELETE` | créer, modifier ou supprimer une table |

L'application, même compromise, ne peut pas détruire le schéma. Elle peut détruire des données — c'est le rôle des sauvegardes (L2-04) — mais la structure survit.

## 3.3 Comment c'est câblé

`infra/postgres/init/01-roles.sh` est monté dans `/docker-entrypoint-initdb.d/` : l'image PostgreSQL l'exécute **une seule fois**, à la création du volume. Il crée le rôle applicatif et fixe les **droits par défaut** : toute table que le propriétaire créera plus tard sera automatiquement lisible et modifiable par l'application. C'est nécessaire parce qu'au moment où le script tourne, Flyway n'a pas encore créé les tables.

Côté Spring, deux configurations distinctes :

```properties
spring.datasource.username=${DB_APP_USER}      # l'application
spring.flyway.user=${DB_OWNER_USER}            # les migrations
```

**Question d'entretien :** « Pourquoi `ALTER DEFAULT PRIVILEGES` et pas `GRANT ... ON ALL TABLES` ? »
Parce que `GRANT ON ALL TABLES` ne couvre que les tables qui existent à l'instant du `GRANT`. Les tables de V2, V3 n'en bénéficieraient pas. `ALTER DEFAULT PRIVILEGES` s'applique aux tables futures.

---

# Chapitre 4 — Les secrets : hors du dépôt, sans exception

## 4.1 La mauvaise façon

```yaml
POSTGRES_PASSWORD: crisisshield_password
```

Dans `docker-compose.yml`, donc dans Git, donc dans l'historique pour toujours, donc sur GitHub public. « C'est un mot de passe de développement » n'est pas une défense : l'habitude est la même, et le jour où quelqu'un copie ce fichier pour la recette, le mot de passe de recette est dans Git.

## 4.2 La bonne façon

```yaml
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD manquant dans .env}
```

Compose lit `.env` dans le dossier courant. `.env` est dans `.gitignore`. `.env.example` est commité, sans valeurs, pour documenter ce qu'il faut remplir.

La syntaxe `${VAR:?message}` est le détail qui compte : si la variable manque, Compose **refuse de démarrer** avec ton message, au lieu de lancer PostgreSQL avec un mot de passe vide. Un échec bruyant vaut mieux qu'un succès silencieux et dangereux.

## 4.3 Le crochet Gitleaks

`.githooks/pre-commit` lance Gitleaks dans Docker sur les fichiers indexés, à chaque `git commit`. Un secret détecté = commit refusé. C'est la première ligne ; le job `secrets` de la chaîne CI est la seconde.

Activation, une fois par clone : `git config core.hooksPath .githooks`. Git ne versionne pas `.git/hooks/`, c'est pourquoi on utilise un dossier du dépôt et cette configuration.

**Ce que ça ne fait pas :** un secret déjà commité hier n'est pas détecté par le crochet, seulement par la chaîne (`fetch-depth: 0`). Et la seule réponse correcte à un secret dans l'historique reste : révoquer d'abord, nettoyer ensuite.

---

# Chapitre 5 — Le dépôt : ce qu'un recruteur voit en premier

`CODEOWNERS` : GitHub demande automatiquement ta revue sur les fichiers listés. Aujourd'hui tu es seul ; le jour où quelqu'un contribue, la sécurité et les migrations passent obligatoirement par toi.

`CONTRIBUTING.md` : les règles du dépôt en une page. C'est le document qu'on lit avant d'ouvrir le code, et il dit tout de la maturité d'un projet : branches, commits signés, migrations, secrets.

---

# Chapitre 6 — Ce que tu fais toi-même, dans l'ordre

## 6.1 Appliquer le lot et vérifier

```bash
cd /c/FORMATION/crisisshield-github
/c/Windows/System32/tar.exe -xf crisisshield-lot2.zip && rm crisisshield-lot2.zip
git config core.hooksPath .githooks
docker compose down -v          # repart de zero : le volume actuel n'a pas d'historique Flyway
docker compose up --build
```

Dans les journaux du backend, cherche :

```
Successfully applied 1 migration to schema "public", now at version v1
```

Puis `bash scripts/demo.sh` doit toujours passer.

## 6.2 Prouver que le rôle applicatif ne peut pas détruire

```bash
docker compose exec db psql -U crisisshield_app -d crisisshield_db -c "DROP TABLE app_user;"
```

Attendu : `ERROR: must be owner of table app_user`. C'est la preuve à montrer.

## 6.3 Prouver que `validate` protège

Ajoute un champ `private String telephone;` dans `User.java`, reconstruis. Le backend doit **refuser de démarrer** avec « Schema-validation: missing column [telephone] ». Retire le champ. Tu viens de voir ce que `update` aurait fait en silence.

## 6.4 Sauvegarde et restauration, une fois

```bash
bash scripts/sauvegarde.sh
bash scripts/restauration.sh sauvegardes/crisisshield-*.dump
```

Une sauvegarde jamais restaurée est une hypothèse, pas une sauvegarde.

## 6.5 Commits signés (L2-08)

```bash
ssh-keygen -t ed25519 -C "signature-github" -f ~/.ssh/signature
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/signature.pub
git config --global commit.gpgsign true
cat ~/.ssh/signature.pub
```

Puis GitHub → Settings → SSH and GPG keys → New SSH key → type **Signing Key** → colle la clé. Ton prochain commit affichera « Verified ».

## 6.6 Protection de branches (L2-07)

Settings → Branches → Add branch ruleset, pour `master` puis `develop` : « Require a pull request before merging », « Require status checks to pass » avec `backend`, `frontend`, `secrets`, `dependencies`.

---

# Chapitre 7 — Simulation d'entretien

<details><summary>1. Pourquoi `ddl-auto=update` est-il interdit en production ?</summary>

Parce qu'Hibernate modifie le schéma sans relecture, à partir de ce qu'il déduit des entités. Un champ renommé devient une colonne ajoutée et une colonne orpheline : les données sont perdues pour l'application. Et personne ne sait dans quel état est le schéma d'un environnement.

Ma réponse : des migrations versionnées relues en pull request, et Hibernate en `validate` pour refuser de démarrer si le schéma dévie.
</details>

<details><summary>2. Une migration a une erreur. Tu la corriges ?</summary>

Jamais si elle a été appliquée quelque part : Flyway vérifie l'empreinte et refuserait de démarrer. J'écris une nouvelle migration qui corrige. Si elle n'a été appliquée nulle part — même pas sur mon poste — je peux la modifier, mais la règle simple est : on n'y touche pas.
</details>

<details><summary>3. Tu arrives sur une base existante sans Flyway. Comment tu fais ?</summary>

Baseline : je dis à Flyway que l'état actuel correspond à une version donnée, il crée sa table d'historique, et les migrations suivantes partent de là. Je n'essaie jamais de rejouer le schéma existant.
</details>

<details><summary>4. Pourquoi deux rôles PostgreSQL ?</summary>

Moindre privilège. L'application n'a besoin que de lire et écrire des lignes ; elle n'a jamais besoin de créer ou supprimer une table. Avec un rôle sans droit sur le schéma, une injection SQL ou un bogue ne peut pas détruire la structure. Le rôle propriétaire est réservé aux migrations et aux sauvegardes.
</details>

<details><summary>5. Le mot de passe de développement dans Compose, c'est grave ?</summary>

Ce n'est pas le mot de passe qui est grave, c'est l'habitude. Le fichier sera copié pour la recette, puis la production. Je sors toutes les valeurs dans `.env`, ignoré par Git, et Compose refuse de démarrer si une manque. Un crochet Gitleaks refuse le commit qui en contiendrait une.
</details>

<details><summary>6. Qu'est-ce qu'un commit signé prouve, et ne prouve pas ?</summary>

Il prouve que le commit a été créé par le détenteur de la clé privée. Il ne prouve pas que le code est bon, ni que la clé n'a pas été volée. C'est une garantie d'origine, pas de qualité. Elle compte pour la chaîne d'approvisionnement : on sait de qui vient chaque changement.
</details>

<details><summary>7. Pourquoi des index sur les clés étrangères ?</summary>

PostgreSQL n'en crée pas automatiquement, contrairement à ce que beaucoup croient. Sans index sur `organisation_id`, chaque requête filtrée par organisation parcourt toute la table. Avec le filtre multi-locataire actif sur chaque requête, c'est l'index le plus utilisé de l'application.
</details>

---

# Ce que tu dois savoir refaire sans notes

- [ ] Expliquer ce que `ddl-auto=update` détruit, avec l'exemple du champ renommé
- [ ] Énoncer la règle : une migration appliquée ne se modifie jamais
- [ ] Expliquer `baseline` pour une base existante
- [ ] Justifier les deux rôles PostgreSQL et `ALTER DEFAULT PRIVILEGES`
- [ ] Expliquer `${VAR:?message}` et pourquoi l'échec bruyant est préférable
- [ ] Dire ce qu'un commit signé prouve et ne prouve pas
