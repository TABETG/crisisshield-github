# Cours — Lot GitHub : DevSecOps avec GitHub Actions

**Ce que ce lot apporte :** la même chaîne de sécurité que sur GitLab, mais portée par GitHub Actions, plus trois choses que GitHub offre gratuitement aux dépôts publics et que GitLab facture : CodeQL, Dependabot, les alertes de sécurité.
**Tickets couverts :** EP01-US05 (chaîne), EP01-US06 (image), EP01-US09 (publication d'image), EP16-US06 (vulnérabilités continues), EP19-US03 (règles statiques).
**Durée :** 30 minutes de lecture.

---

# Chapitre 1 — Ce qui a été fait, en une phrase par fichier

| Fichier | Rôle | Ticket |
|---|---|---|
| `.github/workflows/ci.yml` | La chaîne : construire, tester, contrôler, publier | EP01-US05, US06, US09 |
| `.github/workflows/codeql.yml` | Analyse de flux de données par GitHub, chaque commit et chaque lundi | EP19 |
| `.github/dependabot.yml` | Pull requests automatiques de mise à jour des dépendances | EP16-US06 |
| `.github/PULL_REQUEST_TEMPLATE.md` | La liste de contrôle que chaque pull request doit remplir | EP17 |
| `.github/ISSUE_TEMPLATE/user-story.md` | Le format des stories, aligné sur le backlog | EP17 |
| `SECURITY.md` | Comment signaler une faille, ce qui est assumé | EP15 |
| `README.md` | Deux badges : l'état de la chaîne visible depuis la page d'accueil | — |

---

# Chapitre 2 — La chaîne `ci.yml`, job par job

## 2.1 La forme générale

Un fichier de workflow GitHub Actions a trois parties : **quand** (`on`), **avec quels droits** (`permissions`), **quoi** (`jobs`).

```yaml
on:
  push:         { branches: [master, main, develop] }
  pull_request: { branches: [master, main, develop] }
```

La chaîne tourne à chaque poussée et à chaque pull request. Une pull request non validée par la chaîne ne devrait jamais être fusionnée — c'est la protection de branche, voir chapitre 5.

## 2.2 Les permissions, au plus juste

```yaml
permissions:
  contents: read
  packages: write
  security-events: write
```

**Pourquoi c'est important.** Par défaut, le jeton d'une chaîne peut beaucoup. On le restreint à : lire le code, écrire des images dans le registre, écrire des résultats de sécurité. Rien d'autre. Si une action tierce est compromise, elle ne peut ni modifier le code ni créer de release.

**Question d'entretien :** « Pourquoi restreindre les permissions d'une chaîne CI ? »
Réponse : une chaîne CI est un système qui exécute du code tiers — les actions — avec un jeton. C'est une cible privilégiée d'attaque de la chaîne d'approvisionnement. Le moindre privilège s'applique aux robots comme aux humains.

## 2.3 Les sept jobs

Ils tournent **en parallèle**, sauf le dernier qui attend les autres. C'est une différence avec GitLab, où les étapes s'enchaînent : ici, tout démarre en même temps, et le temps total est celui du job le plus long.

| Job | Ce qu'il fait | Bloquant ? | Pourquoi ce choix |
|---|---|---|---|
| `backend` | `mvn test` puis `mvn package` — les 44 tests | oui | Un test rouge, c'est une propriété de sécurité cassée |
| `frontend` | `npm ci`, contrôle de typage, construction | oui | C'est ce job qui a échoué sur GitLab : 17 erreurs de typage que Docker ne voyait pas |
| `secrets` | Gitleaks sur **tout l'historique** | oui | Un secret retiré hier est encore dans Git ; `fetch-depth: 0` récupère tout |
| `dependencies` | Trivy, failles critiques dans les dépendances et la configuration | oui sur critique, information sur élevé | Bloquer sur tout, c'est bloquer sur du bruit ; bloquer sur critique, c'est bloquer sur ce qui compte |
| `sast` | Semgrep : OWASP, Java, TypeScript, plus les règles maison | **non**, `continue-on-error` | Le bruit initial n'est pas trié ; un contrôle qui bloque sur du bruit sera désactivé |
| `sbom` | Syft produit la nomenclature logicielle CycloneDX | produit un artefact | Le jour d'une faille publiée, la question « suis-je concerné » se répond en une recherche |
| `image` | Construit l'image, la pousse dans GHCR, l'analyse avec Trivy | oui | Étiquette = empreinte de commit, jamais `latest` |

## 2.4 Le détail qui compte : `ignore-unfixed: true`

Trivy ne bloque que sur les failles pour lesquelles **un correctif existe**. Une faille critique sans correctif disponible ne peut pas être corrigée par une mise à jour ; bloquer dessus paralyserait la chaîne sans possibilité d'action.

C'est une décision documentée, à savoir défendre : on bloque sur ce qu'on peut corriger, on suit le reste.

## 2.5 Le job `image` et GHCR

GHCR est le registre de conteneurs de GitHub. L'image du backend y est publiée à chaque poussée, sous `ghcr.io/tabetg/crisisshield-github/backend:<sha>`.

Trois points :
- L'authentification utilise le jeton de la chaîne, pas un secret que tu aurais créé. Zéro secret à gérer.
- L'image est **analysée après publication**. Ce n'est pas redondant avec l'analyse du dépôt : l'image contient aussi le système de base Alpine et le JRE, que Trivy sur le dépôt ne voit pas.
- `needs: [backend, frontend, secrets, dependencies]` : l'image n'est construite que si tout le reste est vert. Une image publiée est une image validée.

---

# Chapitre 3 — CodeQL, ce que Semgrep ne fait pas

Semgrep cherche des **motifs** : « un appel à `complete()` hors de `AssistantService` », « une chaîne qui ressemble à un mot de passe ». C'est rapide et précis pour ce qu'on lui décrit.

CodeQL suit des **flux de données** : il part d'une source non fiable — un paramètre HTTP — et regarde si elle atteint un puits dangereux — une requête SQL, une commande système, une réponse HTML — sans passer par une validation. Il trouve ce qu'on n'a pas su lui décrire.

**Les deux sont complémentaires**, et c'est la réponse attendue si on te demande pourquoi avoir les deux.

`queries: security-extended` active les requêtes de sécurité les plus larges, au prix de quelques faux positifs de plus. Sur un projet de cette taille c'est le bon réglage.

Le `schedule` du lundi est le point subtil : une faille publiée après ton dernier commit ne serait jamais détectée par une chaîne qui ne tourne qu'à la poussée. L'analyse planifiée comble ce trou.

Les résultats arrivent dans l'onglet **Security → Code scanning** du dépôt. C'est là qu'un recruteur curieux ira regarder.

---

# Chapitre 4 — Dependabot

Chaque semaine, Dependabot compare tes dépendances — Maven, npm, images Docker, actions GitHub — aux versions disponibles, et ouvre une pull request par mise à jour. La chaîne CI valide chaque pull request. Tu fusionnes ou tu refuses.

**Pourquoi quatre écosystèmes.** Une faille peut arriver par le pom, par `package.json`, par l'image de base du Dockerfile, ou par une action GitHub. Surveiller les deux premiers seulement laisse deux portes ouvertes.

**La limite à nommer.** Dependabot génère du volume : cinq pull requests par écosystème et par semaine au maximum, c'est le réglage choisi. Sans limite, on en reçoit trente et on cesse de les lire. C'est la fatigue d'alerte, appliquée aux dépendances.

---

# Chapitre 5 — Ce que tu dois faire toi-même sur GitHub

Ces réglages ne sont pas dans un fichier, ils se font dans l'interface. Fais-les maintenant, dans cet ordre.

**1. Protéger la branche principale**
Settings → Branches → Add rule → nom : `master`.
Coche : « Require a pull request before merging », « Require status checks to pass » et sélectionne les jobs `backend`, `frontend`, `secrets`, `dependencies`.
Résultat : personne, toi compris, ne peut pousser directement sur `master` sans que la chaîne soit verte.

**2. Activer les alertes**
Settings → Code security → active « Dependabot alerts », « Dependabot security updates » et « Secret scanning ».
Le secret scanning de GitHub est différent de Gitleaks : il connaît les formats de jetons de centaines de fournisseurs et peut les révoquer automatiquement chez certains.

**3. Créer les labels et un Project**
Issues → Labels : crée `story`, `securite`, `ia`, `crypto`, `devsecops`.
Projects → New project → Board. Colonnes : À faire, En cours, Fait.
Puis crée une issue par story du prochain lot, avec le modèle fourni. Le backlog devient visible, et ton avancement aussi.

**4. Renseigner la page du dépôt**
About (roue crantée à droite) : description en une phrase, sujets `spring-boot`, `devsecops`, `llm-security`, `pki`, `multi-tenant`.
C'est ce qu'un recruteur voit en premier.

---

# Chapitre 6 — GitLab et GitHub en parallèle : pourquoi

Tu as maintenant deux chaînes, une par plateforme, qui font la même chose.

**Ce n'est pas de la redondance inutile.** C'est une preuve de portabilité : ta sécurité ne dépend pas d'un fournisseur de CI. En mission, tu tomberas sur l'un ou l'autre, et tu sauras dire précisément ce qui diffère :

| | GitLab CI | GitHub Actions |
|---|---|---|
| Structure | étapes séquentielles | jobs parallèles, `needs` pour ordonner |
| Réutilisation | `include`, templates | actions du marché, `uses:` |
| Registre | GitLab Registry | GHCR |
| Analyse statique incluse | SAST GitLab, payant au-delà du gratuit | CodeQL, gratuit sur les dépôts publics |
| Cache | `cache:` par clé | `actions/cache` ou `cache:` dans setup-java / setup-node |

Le dépôt GitHub est la vitrine. Le dépôt GitLab reste ton dépôt de travail principal si tu le souhaites, ou disparaît : c'est ton choix, et il n'est pas urgent.

---

# Chapitre 7 — Simulation d'entretien

<details><summary>1. Décris ta chaîne CI.</summary>

Sept jobs en parallèle. Construction et tests backend, typage et construction front, détection de secrets sur tout l'historique, failles critiques dans les dépendances, analyse statique, nomenclature logicielle. Si tout est vert, l'image est construite, publiée dans le registre sous l'empreinte du commit, et analysée à son tour.

Les contrôles bloquants sont ceux qui ne font pas de bruit : secrets et failles critiques corrigeables. L'analyse statique est en information, le temps de trier les faux positifs.
</details>

<details><summary>2. Pourquoi Gitleaks sur tout l'historique et pas seulement le dernier commit ?</summary>

Parce qu'un secret commité puis retiré est toujours dans Git. Le retirer du dernier commit donne l'illusion de la sécurité alors qu'il est dans toutes les copies. La bonne réponse à un secret dans l'historique, c'est de le révoquer d'abord, le nettoyer ensuite.
</details>

<details><summary>3. Pourquoi Semgrep n'est-il pas bloquant ?</summary>

Parce qu'un contrôle qui bloque sur du bruit est désactivé à la première urgence, définitivement. Je le rends bloquant une fois les faux positifs classés. Gitleaks et Trivy critique, eux, sont bloquants dès le premier jour parce qu'ils ne font pas de bruit. C'est commenté dans le fichier : c'est une décision, pas un oubli.
</details>

<details><summary>4. Semgrep et CodeQL, pourquoi les deux ?</summary>

Semgrep cherche des motifs que je lui décris : mes règles d'architecture, les secrets en dur. CodeQL suit les flux de données d'une source non fiable vers un puits dangereux ; il trouve ce que je n'ai pas su décrire. L'un encode mes décisions, l'autre cherche mes oublis.
</details>

<details><summary>5. Pourquoi analyser l'image après l'avoir publiée, alors que tu as déjà analysé le dépôt ?</summary>

Le dépôt ne contient pas le système de base ni le JRE. L'image, si. Une faille dans Alpine ou dans le JRE n'apparaît que dans l'analyse de l'image. Et publier avant d'analyser permet d'analyser exactement ce qui sera déployé, pas une reconstruction.
</details>

<details><summary>6. Pourquoi restreindre les permissions de la chaîne ?</summary>

Une chaîne exécute des actions tierces avec un jeton. Si une action est compromise, ses dégâts sont bornés par les permissions du jeton. Lecture du code, écriture dans le registre, écriture des résultats de sécurité : rien d'autre. C'est le moindre privilège appliqué à un robot.
</details>

<details><summary>7. Qu'est-ce que `ignore-unfixed` et pourquoi l'as-tu activé ?</summary>

Trivy ignore les failles sans correctif disponible. Bloquer dessus paralyserait la chaîne sans qu'on puisse agir. On bloque sur ce qu'on peut corriger, on suit le reste dans les alertes. C'est un arbitrage entre sécurité et capacité à livrer, et il est documenté.
</details>

<details><summary>8. Comment protèges-tu la branche principale ?</summary>

Règle de protection : pull request obligatoire, chaîne verte obligatoire sur les jobs bloquants. Personne ne pousse directement, moi compris. Le code qui arrive sur la branche principale a toujours été construit, testé et contrôlé.
</details>

<details><summary>9. Dependabot ouvre trente pull requests. Que fais-tu ?</summary>

Je limite : cinq par écosystème et par semaine, c'est réglé dans le fichier. Et je regroupe les mises à jour mineures. Trente pull requests non lues, c'est de la fatigue d'alerte : la sécurité qui n'est pas lue n'existe pas.
</details>

<details><summary>10. Tu as deux chaînes CI, GitLab et GitHub. Ce n'est pas du gaspillage ?</summary>

C'est une preuve de portabilité : ma sécurité ne dépend pas d'un fournisseur. Et en mission, je tomberai sur l'un ou l'autre ; je sais précisément ce qui diffère — jobs parallèles contre étapes séquentielles, actions du marché contre templates, GHCR contre GitLab Registry.
</details>

---

# Ce que tu dois savoir refaire sans notes

- [ ] Nommer les sept jobs et dire lesquels bloquent, et pourquoi
- [ ] Expliquer `fetch-depth: 0` et la révocation avant nettoyage
- [ ] Expliquer la différence Semgrep contre CodeQL en deux phrases
- [ ] Justifier `ignore-unfixed`
- [ ] Justifier les permissions restreintes de la chaîne
- [ ] Faire la protection de branche de mémoire
