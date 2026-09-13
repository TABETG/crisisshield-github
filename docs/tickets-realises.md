# Journal des tickets realises

## Etape 0 — premier demarrage (13 septembre 2026)

Le projet a demarre pour la premiere fois : `docker compose up --build` monte les cinq conteneurs
(PostgreSQL, OpenLDAP, phpLDAPadmin, backend, front) et le backend passe en `Healthy`.
Les cinq causes de non-demarrage sont documentees dans `docs/archives/diagnostic-demarrage-2026-09.md`.
Verification : les quatre commandes du README renvoient le resultat attendu.

---

# Tickets realises — lot 1 (13 septembre 2026)

Sept tickets, 44 tests. Chaque ticket est verifiable par `mvn test` — dans Docker :
`MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd)/backend:/app" -v crisisshield-m2:/root/.m2 -w /app maven:3.9.9-eclipse-temurin-21 mvn -q test`.

| Ticket | Ce qui a ete fait | Preuve |
|---|---|---|
| **EP02-US06** Signature asymetrique | `JwtUtil` passe de HS256 (secret partage) a RS256. Emetteur et audience imposes. Cle publique exposee sur `/.well-known/jwks.json`. Le secret `JWT_SECRET` a disparu de `docker-compose.yml`. | `JwtUtilTest`, `curl localhost:8080/.well-known/jwks.json` |
| **EP02-US09** Tests negatifs sur les jetons | 10 cas : expire, autre cle, mauvaise audience, mauvais emetteur, `alg=none`, confusion d'algorithme, charge utile alteree, chaine absurde. | `JwtUtilTest` |
| **EP03-US05** Tests d'isolation | Deux organisations, filtre actif : on ne voit que la sienne, meme par identifiant. Sans filtre : tout est visible, ce qui prouve que le filtre est la seule barriere. | `TenantIsolationTest` |
| **EP10-US05** Identifiant de correlation | `CorrelationIdFilter` : repris de l'en-tete `X-Correlation-Id` ou genere, propage dans chaque ligne de journal, renvoye dans la reponse. | `curl -i` : l'en-tete est present ; les journaux affichent `[<id>]` |
| **EP18-US03** Filtrage d'injection | 14 motifs, francais et anglais, robustes aux accents et a la casse. Banc d'essai de 30 charges : 20 malveillantes, 10 legitimes. Detection mesuree, zero faux positif exige. | `PromptGuardBenchTest` (le rapport s'affiche dans la sortie du test) |
| **EP18-US04** Masquage des donnees personnelles | `PiiMasker` : courriel, telephone, IBAN, NIR remplaces par des marqueurs stables, restaures dans la reponse. Le fournisseur ne voit jamais la valeur. Limite documentee : les noms de personnes attendent un detecteur d'entites (version 2). | `PiiMaskerTest`, `AssistantServiceTest` |
| **EP18-US06** Limitation de debit | Seau a jetons par utilisateur, 20 requetes puis rechargement 20/minute, reponse 429 avec `Retry-After`. Limite documentee : en memoire, donc par instance ; Redis des le passage a plusieurs instances. | `RateLimiterTest`, `AssistantServiceTest` |

## Verifie en conditions reelles (13 septembre 2026)

| Commande | Resultat obtenu |
|---|---|
| `GET /.well-known/jwks.json` | cle RSA, `kid 18519ceaa9557535` |
| `POST /api/auth/login` (bind LDAP `user`) | jeton `eyJ...` signe RS256 |
| `POST /api/assistant/ask` avec un courriel | `"maskedEntities":1`, courriel absent du prompt envoye, present dans la reponse |
| `POST /api/assistant/ask` avec une injection | `"code":"REFUSED_GUARD"`, aucun appel au modele |

## Ce que ces sept tickets changent dans le discours

Avant : « j'ai un JWT et du LDAP ».
Apres : « mes jetons sont signes en asymetrique avec JWKS, j'ai des tests negatifs sur les attaques connues, l'isolation multi-locataire est prouvee par test, et mon assistant IA ne voit jamais une donnee personnelle ni ne repond a une injection ».

Ce sont exactement les cinq questions du chapitre 9 du cours.

## Prochain lot propose

1. **EP18-US05** Moindre capacite : outils explicites (`lire_plan`, `lister_crises`) au lieu d'un acces libre
2. **EP18-US02** Fournisseur Bedrock derriere `ModelProvider`, decision dans l'ADR 0003
3. **EP09-US09** Secrets : cles JWT depuis fichiers PEM montes, plus de generation au demarrage
4. **EP08-US04** Journaux chaines : premiere table d'audit avec empreinte de l'entree precedente

---

# Jalon — premier demarrage (13 septembre 2026)

`docker compose up --build` : cinq conteneurs en bonne sante, `Started CrisisShieldBackendApplication in 22.6 seconds`.
Verification par `scripts/demo.sh` : cle JWKS exposee, jeton obtenu par bind LDAP, courriel masque (`maskedEntities: 1`),
injection refusee (`REFUSED_GUARD`). C'est la premiere fois que ce projet, commence en decembre 2025, tourne.

---

# Tickets realises — lot GitHub (13 septembre 2026)

| Ticket | Ce qui a ete fait | Preuve |
|---|---|---|
| **EP01-US05** Chaine CI (GitHub) | `.github/workflows/ci.yml` : 7 jobs paralleles, secrets et failles critiques bloquants, Semgrep en information | onglet Actions, badge dans le README |
| **EP01-US06 / US09** Image | construite, publiee dans GHCR sous l'empreinte du commit, analysee apres publication | onglet Packages |
| **EP16-US06** Vulnerabilites continues | Dependabot sur Maven, npm, Docker, actions ; CodeQL chaque lundi | onglets Security et Pull requests |
| **EP17** Gouvernance | modele de pull request avec liste de controle securite, modele de story, `SECURITY.md` | tout nouveau ticket ou PR |

Cours : `docs/github/cours-github-devsecops.html`. Reglages a faire a la main sur GitHub : chapitre 5 du cours.
