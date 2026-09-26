# Cours — CrisisShield, ce qui est construit et pourquoi

**Objectif :** que tu puisses expliquer chaque brique de ton projet en entretien, avec le *pourquoi* derrière chaque choix, et sans notes.
**Durée :** 45 minutes de lecture, puis 25 questions à travailler à voix haute.
**Règle :** tout ce qui est écrit ici existe dans le code. Ce qui n'existe pas encore est dit clairement en fin de document. Un recruteur te fera plus confiance sur un périmètre honnête que sur un périmètre gonflé.

---

# Chapitre 1 — Le projet en trente secondes

> CrisisShield est une plateforme de gestion de crise cyber, multi-organisations, avec un assistant IA. Chaque organisation ne voit que ses données, l'identité vient de l'annuaire d'entreprise, les jetons sont signés en asymétrique, et l'assistant ne laisse jamais sortir une donnée personnelle ni ne répond à une injection de prompt. Tout tourne dans Docker, la chaîne CI bloque sur les failles critiques.

C'est ton pitch. Chaque phrase renvoie à un chapitre de ce cours. Et `scripts/demo.sh` le prouve en deux minutes : clé publique, connexion LDAP, courriel masqué, injection refusée. Lance-le devant l'interlocuteur plutôt que de le raconter. Si on te demande « c'est-à-dire ? » sur l'une d'elles, tu dois pouvoir descendre d'un niveau.

## 1.1 Pourquoi ce projet est pertinent pour un poste DevSecOps

Parce qu'il n'est pas un exercice de sécurité abstrait. C'est une application métier réelle — des plans de crise, des cellules de crise — sur laquelle chaque contrôle de sécurité a une **raison métier** : un plan contient des astreintes et des numéros, une crise engage la responsabilité juridique, deux clients ne doivent jamais se voir.

En entretien, relie toujours le contrôle à ce qu'il protège. « J'ai mis du TLS mutuel » est une phrase de développeur. « Un plan de crise contient les numéros d'astreinte de la direction, donc rien ne circule en clair entre mes services » est une phrase de Tech Lead.

---

# Chapitre 2 — L'architecture

## 2.1 Les briques

| Brique | Rôle | Techno | Où |
|---|---|---|---|
| Backend | API, sécurité, métier, assistant | Spring Boot 3.2, Java 21 | `backend/` |
| Front | Interface utilisateur | React 18, TypeScript, Vite | `frontend/` |
| Base | Données des organisations | PostgreSQL 16 | conteneur `db` |
| Annuaire | Identités de l'entreprise | OpenLDAP | `infra/ldap/` |
| Orchestration | Tout démarre en une commande | Docker Compose | `docker-compose.yml` |
| Cible de production | Déploiement durci | Kubernetes, Helm | `infra/kubernetes/` |
| Chaîne de livraison | Construction, tests, contrôles de sécurité | GitLab CI | `.gitlab-ci.yml` |

## 2.2 L'organisation du backend

```
api/             contrôleurs REST et objets de transfert
application/     services métier (UserService)
domain/          entités, dépôts, règles multi-locataire
infrastructure/  sécurité, filtres, annuaire
assistant/       la passerelle IA
config/          amorçage des données de développement
```

**Pourquoi cette séparation.** Le domaine ne dépend de rien. L'infrastructure dépend du domaine. L'API dépend des deux. Cela permet de tester le domaine sans Spring, et de remplacer l'infrastructure — LDAP par Keycloak, PostgreSQL par autre chose — sans toucher au métier.

**Question d'entretien probable :** « Pourquoi pas une architecture hexagonale complète avec des ports et adaptateurs ? »
Réponse : parce que le projet n'a pas encore la taille qui le justifie. Les couches sont là ; les interfaces de port viendront quand un second adaptateur existera réellement. Ajouter de l'abstraction avant le besoin est une dette, pas un investissement.

---

# Chapitre 3 — Le parcours d'une requête

C'est le chapitre à connaître par cœur. Un recruteur te demandera « que se passe-t-il quand un utilisateur appelle ton API ? » et attendra la chaîne complète.

## 3.1 La connexion

```
POST /api/auth/login  {username, password}
        │
        ▼
AuthController ──► AuthenticationManager (LdapSecurityConfig)
        │                    │
        │                    ▼
        │           bind LDAP : uid=user,ou=people,dc=springframework,dc=org
        │                    │  succès
        │                    ▼
        │           CustomLdapUserDetailsContextMapper
        │           lit l'attribut mail, cherche l'utilisateur en base par email
        │                    │
        ▼                    ▼
JwtUtil.generateToken(user)  ──►  jeton RS256, 15 minutes, avec organisationId
        │
        ▼
{ accessToken: "eyJ..." }
```

Trois points à savoir dire :

1. **Le mot de passe n'est jamais comparé par l'application.** C'est l'annuaire qui le vérifie, via un bind. L'application ne stocke pas le mot de passe LDAP.
2. **L'utilisateur doit exister des deux côtés** : dans l'annuaire pour l'authentification, en base pour le rattachement à une organisation et les rôles. C'est le rôle de `CustomLdapUserDetailsContextMapper`. L'utilisateur `user` de développement est créé en base au démarrage précisément pour cela.
3. **La MFA est optionnelle par utilisateur** : si `mfaEnabled` est vrai, le code TOTP est vérifié avant l'émission du jeton (`MfaController`, `TotpConfig`).

## 3.2 Une requête protégée

```
GET /api/users   Authorization: Bearer eyJ...
        │
        ▼
CorrelationIdFilter        pose X-Correlation-Id, le met dans les journaux
        │
        ▼
Chaîne de sécurité 2 (LdapSecurityConfig.apiProtectedChain)
        │
        ▼
JwtAuthenticationFilter    extrait le jeton, vérifie signature / émetteur / audience / expiration
        │                  charge l'utilisateur, construit TenantAuthentication(user, organisationId)
        ▼
TenantFilter               lit organisationId, active le filtre Hibernate orgFilter
        │
        ▼
UserController             @PreAuthorize ROLE_ADMIN, appelle UserService
        │
        ▼
UserRepository.findAll()   Hibernate ajoute WHERE organisation_id = :orgId à la requête
```

**La phrase clé :** le contrôleur ne sait pas qu'il est multi-locataire. Il appelle `findAll()`. C'est Hibernate, via le filtre activé par `TenantFilter`, qui restreint à l'organisation. Le développeur ne peut pas oublier de filtrer, parce qu'il n'a pas à y penser.

---

# Chapitre 4 — L'identité et les jetons

## 4.1 Pourquoi RS256 plutôt que HS256

Avant le lot 1, le projet signait en HS256 : un secret partagé, présent dans `docker-compose.yml`. Quiconque lit ce secret peut forger un jeton administrateur.

Maintenant, `JwtUtil` signe avec une clé privée RSA et vérifie avec la clé publique. La clé privée n'existe qu'à un endroit. La clé publique est publiée sur `/.well-known/jwks.json`.

**Conséquence à énoncer :** n'importe quel service interne peut vérifier un jeton CrisisShield sans détenir le moindre secret. Et la compromission d'un service vérificateur ne permet pas de forger.

**Limite à énoncer aussi :** en développement, la paire est générée au démarrage, donc les jetons ne survivent pas à un redémarrage. En production, la clé privée viendra de KMS ou d'un HSM — c'est l'épic EP09. Dire la limite avant qu'on te la pointe est un marqueur de séniorité.

## 4.2 Les cinq vérifications

`JwtUtil.parse` impose, dans l'ordre : signature avec la clé publique, émetteur `crisisshield`, audience `crisisshield-api`, expiration avec 5 secondes de tolérance, et l'algorithme déduit de la clé — jamais lu dans l'en-tête du jeton.

Ce dernier point est celui qu'on te fera expliquer. Voir la question 8 du chapitre 9.

## 4.3 Les tests négatifs

`JwtUtilTest` contient dix cas. Ce n'est pas du remplissage : chacun correspond à une attaque documentée.

| Test | Attaque couverte |
|---|---|
| jeton expiré | rejeu d'un vieux jeton |
| autre clé privée | forge avec une clé de l'attaquant |
| mauvaise audience | jeton d'un autre service accepté à tort |
| mauvais émetteur | jeton d'un fournisseur d'identité étranger |
| `alg=none` | jeton non signé accepté par une bibliothèque naïve |
| confusion d'algorithme | clé publique utilisée comme secret HMAC |
| charge utile altérée | modification du sujet après signature |

## 4.4 Pourquoi deux chaînes de sécurité

`LdapSecurityConfig` en déclare deux. La première, prioritaire, ne couvre que les routes publiques : connexion, JWKS, santé. La seconde couvre tout le reste et porte le filtre JWT.

**Pourquoi pas une seule avec des `permitAll` ?** Parce que le filtre JWT tournerait aussi sur les routes publiques et lèverait des exceptions sur les requêtes sans jeton. Deux chaînes, c'est deux périmètres réellement distincts.

**L'erreur historique du projet :** il y avait *trois* configurations de sécurité, dont deux actives en même temps sur le profil `ldap`, chacune déclarant une chaîne attrape-tout. Spring Security refusait de démarrer. C'est l'une des cinq causes qui empêchaient le projet de tourner pendant neuf mois. Raconter cette erreur en entretien est une bonne chose : elle montre que tu sais lire un message de démarrage Spring et en tirer la conclusion.

---

# Chapitre 5 — Le multi-locataire

## 5.1 Le mécanisme

Trois pièces :

- `package-info.java` déclare le filtre Hibernate `orgFilter` avec un paramètre `orgId`.
- Chaque entité multi-locataire porte `@Filter(name = "orgFilter", condition = "organisation_id = :orgId")`.
- `TenantFilter`, exécuté après l'authentification, active le filtre sur la session avec l'organisation du jeton.

Dès lors, **toute requête HQL ou Spring Data** sur ces entités est automatiquement restreinte. `findAll()`, `findByUsername()`, tout.

## 5.2 La limite, à connaître absolument

Le filtre Hibernate s'applique aux requêtes, **pas à `EntityManager.find(id)`**. Un accès direct par identifiant contourne le filtre. C'est documenté par Hibernate et c'est une question classique.

Réponse attendue : les services métier passent toujours par les méthodes de dépôt, jamais par `find` direct ; et une règle Semgrep (EP19-US03) peut interdire `entityManager.find` en dehors d'une liste blanche.

## 5.3 La preuve

`TenantIsolationTest` fait trois choses : filtre actif sur A, on ne voit que A ; filtre actif sur B, l'utilisateur de A est invisible même par son nom ; **sans filtre, tout est visible**.

Le troisième test est le plus important. Il prouve que le filtre est **la seule barrière**. Si un jour quelqu'un désactive `TenantFilter`, ce test ne le détectera pas, mais il documente que la sécurité dépend entièrement de lui. Un auditeur appréciera cette honnêteté.

---

# Chapitre 6 — L'assistant IA

## 6.1 Le principe

Un seul point d'entrée, `POST /api/assistant/ask`, protégé par la chaîne 2. Aucun autre chemin vers un modèle. `AssistantService` est **la** passerelle.

## 6.2 Le pipeline, dans l'ordre

```
question
   │
   ▼  1. RateLimiter          seau à jetons par utilisateur, 20 requêtes puis 20/min  → 429 si dépassé
   │
   ▼  2. PromptGuard          14 motifs d'injection, français et anglais               → 422 si détecté
   │
   ▼  3. PiiMasker            courriel, téléphone, IBAN, NIR → marqueurs [[EMAIL_1]]
   │
   ▼  4. ModelProvider        appel du modèle avec le texte masqué
   │
   ▼  5. PromptGuard.sanitize la réponse est hostile : refus si elle contient le prompt système
   │
   ▼  6. PiiMasker.restore    les marqueurs redeviennent les valeurs réelles
   │
   ▼  réponse
```

**Pourquoi cet ordre.** Du moins cher au plus cher. La limitation de débit coûte une lecture en mémoire ; le filtrage coûte quelques expressions régulières ; l'appel au modèle coûte de l'argent et des secondes. On rejette avant de payer.

## 6.3 Ce que le fournisseur ne voit jamais

Le test `AssistantServiceTest.masquageDeBoutEnBout` place un fournisseur espion qui enregistre ce qu'il reçoit. Il vérifie que `alice@a.test` n'y figure pas, que `[[EMAIL_1]]` y figure, et que la réponse rendue à l'utilisateur contient bien `alice@a.test`.

C'est le test à citer en entretien. Il prouve la propriété centrale en une trentaine de lignes.

## 6.4 L'honnêteté sur le filtrage

`PromptGuardBenchTest` mesure : 20 charges malveillantes, 10 questions légitimes. Il exige zéro faux positif et publie le taux de détection.

**Ce que tu dois dire :** ce filtre ne bloque pas toute injection, et aucun filtre ne le peut. La vraie défense est ailleurs : le modèle n'a **aucune action possible**. Il ne lit pas la base, il ne modifie rien. Une injection qui passe le filtre obtient au pire une réponse déplacée, jamais un effet. C'est le principe de moindre capacité, et c'est la réponse qui distingue un candidat sérieux.

## 6.5 L'abstraction du fournisseur

`ModelProvider` est une interface à deux méthodes. `MockModelProvider` est l'implémentation active. Le jour où Bedrock est choisi, on écrit une classe, on change une propriété, rien d'autre ne bouge.

Le choix lui-même n'est pas fait, et c'est documenté dans `docs/adr/0003-fournisseur-ia.md` avec les critères. Un registre de décision « non prise, voici pourquoi et voici comment on décidera » vaut mieux qu'une décision prise sans critères.

---

# Chapitre 7 — DevSecOps

## 7.1 L'image

Le `Dockerfile` du backend est en deux étapes : Maven construit, puis un JRE Alpine exécute. L'image finale ne contient ni Maven, ni le code source, ni un shell utilisable. Le processus tourne sous l'utilisateur `crisisshield`, pas `root`.

**Pourquoi.** Un conteneur compromis avec `root` et un shell permet d'installer des outils et de tenter une évasion. Sans l'un ni l'autre, l'attaquant est dans une boîte vide.

## 7.2 La chaîne

`.gitlab-ci.yml` enchaîne : construction, tests, puis quatre contrôles de sécurité.

| Contrôle | Outil | Bloquant ? |
|---|---|---|
| Secrets dans le code | Gitleaks | oui |
| Failles des dépendances | Trivy, critique | oui |
| Analyse statique | Semgrep, OWASP + règles maison | pas encore — le bruit initial se trie d'abord |
| Nomenclature logicielle | Syft, CycloneDX | produit un artefact |

**Pourquoi Semgrep n'est pas bloquant.** Parce qu'un contrôle qui bloque sur du bruit sera désactivé à la première urgence, définitivement. On le rend bloquant une fois les faux positifs classés. C'est une décision, pas un oubli, et elle est commentée dans le fichier.

## 7.3 Les règles maison

`.semgrep.yml` contient deux règles qui traduisent des décisions d'architecture en vérifications automatiques : interdiction d'appeler un `ModelProvider` hors de `AssistantService`, interdiction de secret en dur.

**Pourquoi c'est important.** Une décision d'architecture défendue en revue de code tient tant que l'architecte est là. Une décision encodée en règle tient toute seule.

## 7.4 Kubernetes

Le chart Helm applique au conteneur : pas de racine, système de fichiers en lecture seule, toutes les capacités Linux retirées, pas d'élévation de privilège, sondes de vivacité et de disponibilité distinctes. La politique réseau refuse tout par défaut et n'ouvre que la résolution de noms, la base et l'annuaire.

Tout cela est écrit et cohérent, mais **pas encore déployé** sur un cluster. Voir le chapitre 8.

---

# Chapitre 8 — Ce qui n'est pas fait

À dire spontanément. Un périmètre honnête inspire confiance ; un périmètre gonflé se démonte en trois questions.

- **Le métier n'existe pas côté backend.** Plans, crises, war room, kits : le front les affiche avec des données simulées. Le backend n'a que les utilisateurs et les organisations.
- **L'assistant tourne sur un fournisseur simulé.** Le pipeline de sécurité est complet ; le modèle derrière est faux.
- **Kubernetes et Terraform sont écrits, pas exécutés.** Le chart est cohérent, le plan AWS est un document.
- **La clé JWT est générée au démarrage.** Pas encore de KMS ni de fichier de clé monté.
- **La PKI interne n'existe pas encore.** Bouncy Castle est dans le `pom`, `CertificateRecord` attend son service. Tout l'épic EP09 est devant toi.
- **29 tests, tous unitaires ou d'intégration légère.** Aucun test de bout en bout automatisé par HTTP — la démonstration du chapitre 8 bis le fait à la main.

Ce sont exactement les tickets du backlog enrichi. Quand on te demande « et ensuite ? », tu as la réponse.

---

# Chapitre 8 bis — La démonstration de deux minutes

Ces quatre commandes ont été exécutées le 13 septembre 2026 contre le projet en marche. Elles sont dans le README. Apprends-les : c'est ce que tu montres quand on te dit « fais-nous voir ».

| Commande | Ce qu'elle prouve | Résultat obtenu |
|---|---|---|
| `curl /.well-known/jwks.json` | La clé publique est publiée ; n'importe quel service peut vérifier un jeton sans secret | une clé RSA avec son `kid` |
| `curl -X POST /api/auth/login` | Le bind LDAP fonctionne, le jeton est émis en RS256 | `eyJraWQiOi...` |
| `curl -X POST /api/assistant/ask` avec un courriel | Le masquage fonctionne de bout en bout | `"maskedEntities":1` |
| `curl -X POST /api/assistant/ask` avec une injection | Le filtrage refuse avant tout appel au modèle | `"code":"REFUSED_GUARD"` |

**Comment la présenter.** Ne lance pas les quatre d'un coup. Annonce chacune, lance-la, commente le résultat en une phrase. La troisième est la plus forte : montre le `[mock]` dans la réponse — le fournisseur a vu `[[EMAIL_1]]`, jamais `alice@a.test` — et dis que le test `AssistantServiceTest` le prouve en continu.

**Ce que la démo ne montre pas, à dire avant qu'on te le demande :** le modèle est simulé. Le pipeline de sécurité est réel, le cerveau derrière ne l'est pas encore.

---

# Chapitre 9 — Simulation d'entretien

Formule ta réponse à voix haute avant d'ouvrir. Format attendu : une phrase directe, la nuance, un exemple.

<details><summary>1. Décris-moi ton projet en trente secondes.</summary>

Le pitch du chapitre 1, mot pour mot. Entraîne-toi jusqu'à ce qu'il sorte sans hésitation. Puis, sans qu'on te le demande, propose de descendre sur la brique qui intéresse l'interlocuteur : « je peux détailler l'identité, le multi-locataire ou l'assistant, selon ce qui vous parle ».
</details>

<details><summary>2. Que se passe-t-il quand un utilisateur se connecte ?</summary>

Le mot de passe part à l'annuaire LDAP par un bind ; l'application ne le voit jamais. Si le bind réussit, je retrouve l'utilisateur en base par son courriel pour connaître son organisation et ses rôles. Si la MFA est active, je vérifie le code TOTP. Puis j'émets un jeton RS256 de quinze minutes qui porte l'identifiant d'organisation.

Le point que j'ajoute : l'utilisateur doit exister des deux côtés, annuaire et base. C'est une contrainte de conception assumée, et c'est ce que remplacera Keycloak en fédération plus tard.
</details>

<details><summary>3. Et quand il appelle une route protégée ?</summary>

Le filtre JWT vérifie signature, émetteur, audience et expiration, puis construit une authentification qui porte l'organisation. Un second filtre active le filtre Hibernate sur cette organisation. Le contrôleur vérifie le rôle et appelle le service, qui appelle le dépôt. Hibernate ajoute la clause d'organisation à la requête sans que personne ne l'écrive.

La phrase qui compte : le développeur ne peut pas oublier de filtrer, parce qu'il n'a pas à y penser.
</details>

<details><summary>4. Comment garantis-tu qu'un client ne voit pas les données d'un autre ?</summary>

Par un filtre Hibernate activé à chaque requête à partir de l'organisation du jeton, et par un test qui le prouve dans les deux sens.

La limite que je nomme moi-même : le filtre ne s'applique pas à l'accès direct par identifiant. Les services passent par les dépôts, et une règle statique peut interdire le contournement. Et mon troisième test montre que sans le filtre tout est visible : c'est la seule barrière, et je le sais.
</details>

<details><summary>5. Pourquoi RS256 et pas HS256 ?</summary>

HS256, c'est un secret partagé entre l'émetteur et tous les vérificateurs. Chacun d'eux peut donc forger. RS256 sépare : une clé privée qui signe, une clé publique qui vérifie. Les vérificateurs ne peuvent rien forger, et la clé publique peut être publiée.

Dans mon projet elle l'est, sur un point d'accès JWKS standard. Et le secret partagé a disparu du fichier Compose, ce qui était un vrai problème avant.
</details>

<details><summary>6. Où est ta clé privée ?</summary>

Aujourd'hui, générée au démarrage, en mémoire, jamais écrite. C'est correct pour le développement et faux pour la production : les jetons ne survivent pas à un redémarrage, et deux instances auraient deux clés.

La cible, c'est KMS ou un HSM : la clé ne sort jamais, on lui envoie la donnée à signer. C'est mon épic EP09, et c'est la prochaine étape.
</details>

<details><summary>7. Comment révoques-tu un jeton ?</summary>

Je ne le fais pas. Un jeton signé est valide jusqu'à expiration, c'est le prix de la vérification sans état. Ma réponse est la durée courte : quinze minutes. La fenêtre d'exploitation d'un jeton volé est bornée.

Si le besoin de révocation immédiate arrivait, j'ajouterais une liste de révocation en cache, en acceptant la dépendance qu'elle crée. Je ne le fais pas par défaut parce que ce besoin n'est pas exprimé.
</details>

<details><summary>8. Explique l'attaque par confusion d'algorithme.</summary>

Le jeton annonce son algorithme dans l'en-tête. Une bibliothèque naïve lit cet en-tête et l'applique. L'attaquant annonce HS256 et signe avec la clé publique RSA — qui est publique, donc qu'il possède. Le vérificateur utilise cette même clé publique comme secret HMAC : la signature est valide.

Ma parade : l'algorithme est imposé par la clé que je fournis au vérificateur, jamais lu dans le jeton. Et j'ai un test qui construit précisément ce jeton et vérifie son rejet.

La leçon générale : on ne demande jamais à l'entrée hostile comment il faut la vérifier.
</details>

<details><summary>9. Pourquoi deux chaînes de sécurité Spring ?</summary>

Une chaîne pour les routes publiques sans filtre JWT, une pour tout le reste avec. Deux périmètres réellement distincts, pas un seul avec des exceptions.

Et j'ai appris à mes dépens qu'on ne déclare jamais deux chaînes attrape-tout dans le même profil : Spring Security refuse de démarrer, avec un message très explicite que je sais maintenant lire.
</details>

<details><summary>10. Comment ton assistant IA protège-t-il les données ?</summary>

Avant tout envoi au modèle, un masqueur remplace courriels, téléphones, IBAN et numéros de sécurité sociale par des marqueurs stables. Le modèle raisonne sur `[[EMAIL_1]]`, jamais sur la valeur. La valeur est restaurée dans la réponse rendue à l'utilisateur.

J'ai un test avec un fournisseur espion qui prouve que la valeur ne lui parvient jamais. Et je nomme ma limite : les noms de personnes ne sont pas couverts par des expressions régulières ; il faut un détecteur d'entités, prévu en version 2.
</details>

<details><summary>11. Et contre l'injection de prompt ?</summary>

Une première couche de filtrage, mesurée : un banc d'essai de trente charges, avec le taux de détection publié et zéro faux positif exigé.

Mais je ne vends pas ce filtre comme la défense. L'injection est structurelle : un modèle ne distingue pas l'instruction de la donnée. La vraie protection, c'est que mon modèle n'a aucune action possible. Une injection qui passe obtient une réponse déplacée, jamais un effet. C'est le principe de moindre capacité.
</details>

<details><summary>12. Pourquoi ta limitation de débit est-elle en mémoire ? Ce n'est pas faux ?</summary>

C'est correct pour une instance et faux dès la deuxième : chaque instance aurait son propre compteur, la limite serait multipliée. Je le sais, c'est écrit dans le code, et le ticket prévoit Redis pour le passage sur Kubernetes.

Je préfère une version simple, juste et documentée dans sa limite, à une dépendance Redis ajoutée avant d'en avoir besoin.
</details>

<details><summary>13. Pourquoi Semgrep n'est-il pas bloquant dans ta chaîne ?</summary>

Parce qu'un contrôle qui bloque sur du bruit sera désactivé à la première urgence de production, et jamais réactivé. Je le rends bloquant une fois les faux positifs classés. Gitleaks et Trivy critique, eux, sont bloquants dès le premier jour parce qu'ils ne font pas de bruit.

C'est une décision commentée dans le fichier, pas un oubli.
</details>

<details><summary>14. À quoi servent tes règles Semgrep maison ?</summary>

À encoder des décisions d'architecture : personne n'appelle un fournisseur de modèle hors de la passerelle, personne ne met un secret en dur. Une règle tient toute seule ; une décision défendue en revue tient tant que je suis là.
</details>

<details><summary>15. Pourquoi ton conteneur n'est-il pas root ?</summary>

Un conteneur est un processus sur le noyau de l'hôte, pas une machine virtuelle. Une évasion depuis un processus root donne l'hôte. Depuis un utilisateur sans privilège, avec un système de fichiers en lecture seule et sans capacités, l'attaquant est dans une boîte vide. Mon Dockerfile et mon chart Helm appliquent les deux.
</details>

<details><summary>16. Ton chart Helm a une politique réseau. Comment sais-tu qu'elle s'applique ?</summary>

Je ne le sais pas encore : le chart n'a pas été déployé. Et quand il le sera, je le testerai depuis un conteneur temporaire, parce qu'une politique réseau n'est appliquée que si le greffon réseau du cluster la prend en charge. Sinon elle est acceptée sans effet.

Je préfère vous dire qu'elle n'est pas testée plutôt que de vous laisser croire qu'elle protège.
</details>

<details><summary>17. Qu'est-ce que l'identifiant de corrélation et pourquoi ?</summary>

Un identifiant unique par requête, repris de l'appelant s'il en fournit un, propagé dans chaque ligne de journal et renvoyé dans la réponse. Quand un utilisateur signale un problème, je retrouve tout le parcours de sa requête en une recherche, à travers tous les composants.

Il est posé par un filtre de servlet en tout premier, pour couvrir aussi les requêtes refusées par l'authentification.
</details>

<details><summary>18. Ton projet ne tournait pas pendant neuf mois. Pourquoi, et comment as-tu débloqué ?</summary>

Cinq causes cumulées, dont trois qui plantaient avant le premier bean : une propriété interdite dans un fichier de profil, deux chaînes de sécurité attrape-tout, un script SQL sur une table inexistante. Puis deux qui empêchaient la connexion. Corriger l'une ne changeait rien, ce qui rendait le diagnostic difficile.

Ce que j'en retiens : lire le premier message d'erreur, pas le dernier, et ne jamais accumuler des correctifs sans vérifier lequel a un effet. Il a démarré le 13 septembre 2026, et la démonstration en quatre commandes date de ce jour-là.
</details>

<details><summary>19. Pourquoi Spring Boot et pas Quarkus ?</summary>

Parce que le projet existait déjà en Spring Boot et qu'une migration coûterait un mois sans apporter une fonctionnalité. Spring Security est la référence des offres que je vise. Quarkus reste un sujet de veille. C'est documenté dans un registre de décision d'architecture.
</details>

<details><summary>20. Qu'est-ce qu'un registre de décision d'architecture et à quoi ça te sert ?</summary>

Un document court par décision structurante : contexte, options envisagées, décision, raisons, conséquences. Il empêche l'équipe de rejouer le même débat dans six mois et permet à un nouvel arrivant de comprendre le pourquoi.

J'en ai trois : conserver Spring Boot, JWT maison puis Keycloak, fournisseur IA non encore choisi. Le troisième est le plus utile : une décision non prise avec ses critères vaut mieux qu'une décision prise sans.
</details>

<details><summary>21. Quel est le risque que tu as décidé de ne pas traiter ?</summary>

L'exfiltration par injection indirecte sophistiquée — encodage, découpage sur plusieurs tours. Le coût d'un traitement fiable est disproportionné à ce stade. Compensation : journalisation intégrale des appels et alerte sur volume de sortie anormal. C'est dans mon modèle de menace, avec un porteur à nommer.
</details>

<details><summary>22. Que casse-t-il si ta base tombe ?</summary>

Tout. Le backend refuse de démarrer sans elle, et c'est voulu : une application qui démarrerait en mode dégradé sans base laisserait passer des requêtes sans contrôle d'organisation. Je préfère le refus de service au passage sans contrôle.

Ce qui manque, et que je nomme : pas encore de réplique ni de sauvegarde testée. C'est l'épic EP16.
</details>

<details><summary>23. Tu as 29 tests. Qu'est-ce qu'ils prouvent, et qu'est-ce qu'ils ne prouvent pas ?</summary>

Ils prouvent les propriétés de sécurité unité par unité : les jetons invalides sont rejetés, l'isolation fonctionne, le fournisseur ne voit pas les données, l'injection est filtrée, le quota est respecté.

Ils ne prouvent pas que l'ensemble fonctionne de bout en bout par HTTP, ni que la configuration Docker est correcte. Un test d'intégration complet avec conteneurs est la suite logique.
</details>

<details><summary>24. Qu'est-ce que tu ferais différemment ?</summary>

Je ne laisserais pas trois configurations de sécurité coexister ; je commencerais par un seul profil qui tourne avant d'en ajouter un second. Et je mettrais les tests d'isolation dès le premier jour du multi-locataire, pas neuf mois après.
</details>

<details><summary>25. Et la suite ?</summary>

Dans l'ordre : brancher Bedrock derrière l'interface existante ; monter l'autorité de certification interne et le TLS mutuel entre services ; chiffrer les kits d'urgence par enveloppe avec la clé dans le module matériel ; chaîner les journaux d'audit cryptographiquement ; signer le rapport de crise selon eIDAS.

Chaque brique cryptographique a un usage métier concret. C'est ça que je veux montrer : pas que je sais faire du PKCS#11, mais que j'ai rendu un rapport de crise opposable.
</details>

---

# Ce que tu dois savoir refaire sans notes

- [ ] Le pitch de trente secondes
- [ ] Le parcours complet d'une requête, de la connexion au `WHERE organisation_id`
- [ ] Pourquoi RS256, et où est la clé privée aujourd'hui et demain
- [ ] La confusion d'algorithme et la parade
- [ ] Le filtre Hibernate, sa limite sur l'accès par identifiant, et le test qui montre qu'il est la seule barrière
- [ ] Le pipeline de l'assistant en six étapes, et pourquoi dans cet ordre
- [ ] Le principe de moindre capacité, en une phrase
- [ ] Les cinq causes de non-démarrage
- [ ] La liste de ce qui n'est pas fait, dite spontanément

Si un point résiste, ouvre le fichier correspondant et relis-le. Pas ce cours : le code. C'est lui qu'on te demandera d'expliquer.
