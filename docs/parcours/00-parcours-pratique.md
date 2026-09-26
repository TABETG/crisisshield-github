# Parcours pratique v3 — tout le cours, appliqué à CrisisShield

**Ce qui change par rapport à la v2.** Deux nouveaux cours : **IA agentique** (10 TP) et **Keycloak et IAM** (9 TP). Ils ne s'ajoutent pas en fin de liste : ils modifient l'ordre, parce qu'ils touchent deux fondations du projet — **l'identité** et **l'assistant**.

**Le principe ne change pas :** un TP est un ticket, chaque ticket fait avancer CrisisShield, rien n'est fait deux fois.

---

# Chapitre 0 — Où tu en es au 25 septembre

Vérifié directement sur ton dépôt GitHub, branche `develop`, dernier commit `33a54ab` du 13 septembre.

## 0.1 Ce qui est fait, et poussé

Avant le parcours, trois lots de remise en état, tous en ligne :

| Lot | Ce qu'il a apporté | TP du cours couverts |
|---|---|---|
| Remise en route | cinq causes de non-démarrage corrigées, architecture propre, le projet tourne sous Docker pour la première fois (13 septembre) | DevOps 08, 09 |
| Lot 1 sécurité | jetons RS256 et JWKS, 10 tests négatifs, isolation multi-organisation prouvée, identifiant de corrélation, assistant avec filtrage d'injection, masquage des données personnelles, limitation de débit — 29 tests | DevOps 41 et 54, en partie |
| Lot GitHub | chaîne GitHub Actions en 7 jobs, CodeQL, Dependabot, modèles de PR et de story, `SECURITY.md`, `scripts/demo.sh` | DevOps 12 ; 10, 13, 37, 40 en partie |

**Bilan :** 3 TP terminés, 6 commencés. Et surtout une démonstration qui marche : clé publique, connexion LDAP, courriel masqué, injection refusée.

## 0.2 Ce qui est livré mais pas encore appliqué

| Livraison | Ce qu'elle contient | Où elle est |
|---|---|---|
| **Lot 2** | Flyway, deux rôles PostgreSQL, secrets hors dépôt, crochet Gitleaks, `CODEOWNERS`, `CONTRIBUTING.md` | `crisisshield-lot2.zip` |
| Parcours v3 | ce document et le cours du lot 2 | `crisisshield-parcours-v3.zip` |

Sur GitHub, `ddl-auto` est toujours à `update` et il n'y a ni `.env.example` ni migration : **le lot 2 n'est pas appliqué**. C'est la prochaine action, et la seule.

## 0.3 Trois points ouverts sur le dépôt

| Point | État | Action |
|---|---|---|
| CodeQL Java en échec | non résolu depuis le 13 septembre | m'envoyer les dernières lignes du job `analyze`, ou passer CodeQL en « configuration par défaut » dans les réglages |
| 18 pull requests Dependabot | en attente | voir 0.4 |
| Commits signés, branches protégées | non faits | tickets L2-07 et L2-08 du lot 2 |

## 0.4 Les pull requests Dependabot : quoi fusionner

Dependabot propose aussi des **montées de version majeure**. Les fusionner à l'aveugle casserait le projet.

| Pull request | Décision | Raison |
|---|---|---|
| actions GitHub (checkout, setup-node, upload-artifact, login, trivy, gitleaks) | fusionner une par une, chaîne verte | aucun risque sur le code |
| `bcpkix` 1.85 | fusionner | correctif mineur |
| `spring-boot-starter-parent` **4.1.1** | **fermer** | version majeure : chantier à part entière, pas une mise à jour |
| image `maven … temurin-26`, `eclipse-temurin-24-jre` | **fermer** | le projet est en Java 21, version à support long ; 24 et 26 ne le sont pas |
| `jjwt` 0.13 | **fermer** | `JwtUtil` est retiré au lot 6, remplacé par Keycloak |
| `vite` 8, `eslint-plugin-react-hooks` 7, groupe npm | **attendre le lot 7** | versions majeures du front, à faire quand on reprend le front |
| `axios`, `globals` | fusionner si la chaîne est verte | mineures |

Au lot 3, on configure Dependabot pour ignorer les versions majeures : elles deviendront des tickets planifiés, pas des surprises.

---

# Chapitre 1 — Les deux décisions qui changent l'ordre

## 1.1 Keycloak arrive avant le front, pas après

Aujourd'hui, l'identité de CrisisShield est maison : bind LDAP, puis un jeton RS256 signé par `JwtUtil`. L'ADR 0002 l'assumait comme une dette temporaire, en attendant Keycloak.

Si on branche le front React sur cette authentification maison, puis qu'on passe à Keycloak, **on écrit deux fois la connexion du front**. C'est exactement le double travail à éviter.

Donc : Keycloak d'abord, le front ensuite, directement sur les bons flux (code avec PKCE, derrière un BFF). Le `JwtUtil` maison est retiré à ce moment-là. Rien n'est perdu : ce que tu as appris sur RS256, JWKS, audience et confusion d'algorithme est exactement ce que Keycloak fait — tu sauras l'auditer au lieu de le subir.

L'OpenLDAP existant n'est pas jeté non plus : Keycloak le fédère en lecture seule (Keycloak, TP 5). Ton travail d'EP02-US05 devient une fédération d'annuaire, ce qui est le cas réel en entreprise.

## 1.2 L'IA devient une phase entière, placée tôt

L'IA agentique est ton différenciateur de marché. Elle ne peut pas attendre la fin d'un parcours de six mois.

Mais elle a deux prérequis : un **métier réel** (on ne trie pas des incidents qui n'existent pas) et de l'**observabilité** (on n'évalue pas un agent qu'on ne peut pas tracer). D'où sa place : juste après ces deux phases.

Le code du lot 1 — `PromptGuard`, `PiiMasker`, `RateLimiter`, l'interface `ModelProvider` — est conservé. Spring AI se branche **derrière** `ModelProvider` ; le fournisseur simulé disparaît, les garde-fous restent devant. Aucune ligne refaite.

---

# Chapitre 2 — Les huit phases

| Phase | Lots | Ce qu'on construit | Cours |
|---|---|---|---|
| 1. Fondations | 2 à 4 | base aux normes, secrets, image signée, qualité, releases | DevOps 0 à 2 |
| 2. Le métier et l'identité | 5 à 8 | modules métier, Keycloak, front branché, authentification forte | Microservices, Keycloak, React |
| 3. Voir | 9 à 10 | métriques, tableaux de bord, journaux, traces, SLO | Monitoring, DevOps 6 |
| 4. L'IA | 11 à 14 | tri, outils, MCP, RAG, agent, évaluations, test d'intrusion | IA agentique, DevOps 54 |
| 5. Distribuer | 15 à 17 | Kafka, saga, résilience, passerelle, autorisation fine, service extrait | Microservices, Keycloak |
| 6. Déployer | 18 à 21 | Terraform, Kubernetes, GitOps, AWS | DevOps 3 à 5, Cloud |
| 7. Fiabiliser | 22 à 24 | game day, PRA, PKI, mTLS, SLSA, audit, conformité | DevOps 7 et 8, Java PKI, Keycloak |
| 8. Leadership | 25 et suite | DORA, gouvernance, plateforme, landing zone | DevOps 9 |

**Pourquoi cet ordre, en une phrase par phase :** on ne sécurise pas un dépôt sale (1), on n'observe pas un produit vide (2), on ne débogue pas sans voir (3), l'IA a besoin des trois (4), on ne distribue qu'un monolithe compris (5), on ne déploie qu'une architecture stable (6), on ne fiabilise que ce qui tourne (7), on ne gouverne que ce qu'on mesure (8).

---

# Chapitre 3 — Les lots, un par un

## Phase 1 — Fondations

| Lot | TP | Contenu | État |
|---|---|---|---|
| 2 | DevOps 05, 06, 38 | Flyway, deux rôles PostgreSQL, secrets hors dépôt, gouvernance du dépôt | **livré** |
| 3 | DevOps 10 | image signée Cosign, nomenclature attachée, vérification | |
| 4 | DevOps 13, 14 | tests d'intégration Testcontainers, quality gate, releases automatiques | |

## Phase 2 — Le métier et l'identité

| Lot | TP | Contenu |
|---|---|---|
| 5 | Microservices 1, 2 | event storming ; modules `incidents`, `alertes`, `equipes`, `notifications` en Spring Modulith ; règles de dépendance vérifiées en CI ; migrations V2 à V5 |
| 6 | Keycloak 1, 2, 5 | Keycloak en Compose, royaume `crisis` **en Terraform** (ta première infrastructure en code), fédération de l'OpenLDAP existant ; retrait du `JwtUtil` maison |
| 7 | Keycloak 3, 4 ; React 4 à 6 | connexion du front par BFF (code et PKCE, jetons invisibles dans le navigateur) ; API en serveurs de ressources avec audience et rôles ; le front charge les vrais incidents |
| 8 | Keycloak 6 ; React 7 à 9 | passkeys pour les coordinateurs, authentification renforcée pour « clore une crise » ; formulaire, filtres, quality gate front ; fin de `mockData.ts` |

**À la fin de la phase 2 :** une vraie application. On se connecte par Keycloak, on crée un incident, il est en base, visible par la seule bonne organisation.

## Phase 3 — Voir

| Lot | TP | Contenu |
|---|---|---|
| 9 | Monitoring 1 à 5 ; DevOps 33 | Prometheus, Micrometer, métriques RED et métier, PromQL, Grafana en code |
| 10 | Monitoring 9 à 13 ; DevOps 32, 34, 35 | journaux vers Loki, collecteur OpenTelemetry, traces, SLO et alertes, sondes, supervision de la supervision ; événements de connexion Keycloak dans Loki |

## Phase 4 — L'IA

| Lot | TP | Contenu |
|---|---|---|
| 11 | IA 1, 2, 7 | tri des incidents P1 / P2 / P3, prompt versionné et validé, Spring AI derrière `ModelProvider` ; décision de l'ADR 0003 sur le fournisseur |
| 12 | IA 3, 4 | assistant de cellule de crise : outils en lecture seule, un outil d'écriture sous confirmation humaine ; **serveur MCP de CrisisShield** |
| 13 | IA 5, 6, 8 | RAG sur les runbooks dans pgvector, filtré par organisation ; agent de diagnostic encadré ; évaluations bloquantes en CI, traces et tableau de bord IA |
| 14 | IA 9, 10 ; DevOps 54 | test d'intrusion de l'assistant, rapport OWASP LLM avant/après ; passerelle IA vitrine ; dépôt outillé pour un assistant de code |

**À la fin de la phase 4 :** ta démonstration la plus vendable. Un assistant qui trie, cherche, propose — et qu'on ne peut pas détourner, preuves à l'appui.

## Phase 5 — Distribuer

| Lot | TP | Contenu |
|---|---|---|
| 15 | Microservices 3, 4, 5 ; DevOps 46 | Kafka, notifications pilotées par événements, consommateur idempotent, saga, outbox |
| 16 | Microservices 6 à 9 ; Keycloak 7 | résilience, panne provoquée, passerelle d'API ; sécurité entre services, échange de jeton ; autorisation par préfecture avec OPA et OpenFGA |
| 17 | Microservices 10 à 13 | traces de bout en bout, contrats consommateur, déploiement autonome ; **extraction du service Notifications**, en Kotlin si tu le souhaites |

## Phase 6 — Déployer

| Lot | TP | Contenu |
|---|---|---|
| 18 | DevOps 16, 17, 19 | Terraform et Ansible contre LocalStack, détection de dérive ; le royaume Keycloak du lot 6 rejoint cette organisation |
| 19 | DevOps 25, 26, 28 ; Monitoring 7 | cluster kind, manifestes, chart Helm, kube-prometheus-stack |
| 20 | DevOps 29, 31, 39 | GitOps ArgoCD, autoscaling, cluster durci |
| 21 | Cloud 1 à 9 ; DevOps 20, 21, 23 | compte AWS verrouillé, VPC, identités sans clé, CrisisShield en Terraform, FinOps |

## Phase 7 — Fiabiliser et sécuriser en profondeur

| Lot | TP | Contenu |
|---|---|---|
| 22 | DevOps 35, 36, 43, 44 ; Keycloak 8 | budget d'erreur, game day, résilience prouvée, PRA exécuté ; Keycloak de production, rotation de clé sans interruption |
| 23 | Java PKI 1 à 9 ; DevOps 41 | PKI trois niveaux, keystores, HTTPS puis mTLS, service de signature, validateur |
| 24 | DevOps 37, 40, 42 ; Java PKI 10 ; Keycloak 9 | programme AppSec, SLSA niveau 3, dossier de conformité, fiche eIDAS, audit complet du royaume |

## Phase 8 — Leadership

| Lot | TP | Contenu |
|---|---|---|
| 25 et suite | DevOps 15, 27, 30, 45, 47 à 52 ; Cloud 10 | blue/green, base en haute disponibilité, mesh, performance, DBA, plateforme interne, landing zone, gouvernance, DORA, revue Well-Architected |

## Récapitulatif de tous les lots

| Lot | Phase | Titre | État |
|---|---|---|---|
| — | avant | Remise en route, lot 1 sécurité, lot GitHub | **fait** |
| 2 | 1 | Fondations saines : base, secrets, dépôt | **livré, à appliquer** |
| 3 | 1 | Image signée et nomenclature | à faire |
| 4 | 1 | Tests d'intégration, quality gate, releases | à faire |
| 5 | 2 | Monolithe modulaire, modules métier | à faire |
| 6 | 2 | Keycloak, royaume en Terraform, fédération LDAP | à faire |
| 7 | 2 | Front branché par BFF, API en serveurs de ressources | à faire |
| 8 | 2 | Passkeys, authentification renforcée, fin des données simulées | à faire |
| 9 | 3 | Métriques et tableaux de bord | à faire |
| 10 | 3 | Journaux, traces, SLO | à faire |
| 11 | 4 | Tri des incidents par IA, Spring AI | à faire |
| 12 | 4 | Outils, confirmation humaine, serveur MCP | à faire |
| 13 | 4 | RAG, agent de diagnostic, évaluations | à faire |
| 14 | 4 | Test d'intrusion IA, passerelle vitrine | à faire |
| 15 | 5 | Kafka, saga, outbox | à faire |
| 16 | 5 | Résilience, passerelle d'API, autorisation fine | à faire |
| 17 | 5 | Contrats, extraction du service Notifications | à faire |
| 18 | 6 | Terraform et Ansible en local | à faire |
| 19 | 6 | Kubernetes : kind, manifestes, Helm | à faire |
| 20 | 6 | GitOps, autoscaling, cluster durci | à faire |
| 21 | 6 | AWS en Terraform, FinOps | à faire |
| 22 | 7 | Game day, PRA, Keycloak de production | à faire |
| 23 | 7 | PKI, mTLS, service de signature | à faire |
| 24 | 7 | AppSec, SLSA, conformité, audits | à faire |
| 25+ | 8 | Leadership et plateforme | à faire |

---

# Chapitre 4 — Ce qu'on ne fait pas

| Cours ou TP | Raison |
|---|---|
| Angular, Vue | un second front, donc refaire le même travail |
| Struts, Hibernate, JSP ; Data platform | absents du produit ; à lire si une mission l'exige |
| React 1 à 3 | déjà en place |
| Keycloak 3 : la partie Angular | adaptée au front React |
| Keycloak 4 : le service Node | remplacé par le service Notifications, qui vérifie les jetons selon les mêmes règles |
| DevOps 07, 11, 18, 22, 24, 50, 53 | sans code, ou fictif et remplacé par un vrai équivalent |
| Java PKI 11, 13 ; Monitoring 6, 8 | couverts par les cours de lot ; ELK remplacé par Loki |
| Savoir-être | pas de code : une page par semaine, en parallèle |

---

# Chapitre 5 — Comment réussir à tout construire

Vingt-quatre lots, c'est long. Voici ce qui fait la différence entre les parcours qu'on termine et ceux qu'on abandonne au lot 7.

## 5.1 Le rythme réaliste

| Situation | Rythme | Durée des 24 lots |
|---|---|---|
| Sans mission | un lot par semaine, 8 à 10 heures | 6 mois |
| En mission à temps plein | un lot toutes les deux semaines, 5 heures par semaine | 11 à 12 mois |

Choisis le rythme qui tient **quand tout va mal**, pas celui qui tient quand tout va bien. Un rythme tenu vaut mieux qu'un rythme ambitieux abandonné.

## 5.2 Les cinq règles

1. **Un seul lot ouvert à la fois.** Jamais le lot suivant tant que le précédent n'est pas commité, prouvé et expliqué.
2. **Terminé veut dire : ça tourne, c'est prouvé, tu l'expliques.** Un lot dont tu ne peux pas raconter le pourquoi en trois minutes n'est pas terminé.
3. **Bloqué plus de trente minutes : tu m'envoies la sortie.** Pas deux heures seul sur une erreur de configuration. L'apprentissage est dans la compréhension, pas dans l'acharnement.
4. **Un jalon par phase.** À la fin de chaque phase, tu enregistres la démo de cinq minutes. C'est ta motivation et ta vitrine en même temps.
5. **Une semaine ratée n'est pas une raison d'en rater deux.** Tu reprends au lot en cours, sans culpabilité et sans rattrapage double.

## 5.3 Tu es vendable à chaque phase

| Après la phase | Ce que tu montres |
|---|---|
| 1 | un dépôt propre, signé, sans secret, chaîne verte |
| 2 | une vraie application, connexion Keycloak, multi-organisation |
| 3 | un tableau de bord Grafana en direct, une trace de bout en bout |
| 4 | un assistant IA qui trie et cherche, et qu'on ne peut pas détourner |
| 5 | une architecture événementielle, un service extrait sans interruption |
| 6 | un déploiement GitOps sur Kubernetes et AWS, facture affichée |
| 7 | un game day, un PRA exécuté, une PKI, un audit Keycloak |

**Pour les missions d'octobre :** la phase 2 est la priorité absolue, la phase 4 la plus différenciante. Une vraie application avec Keycloak et un assistant sécurisé vaut plus en entretien que tout le reste réuni.

## 5.4 Les coûts à prévoir

| Poste | Quand | Coût |
|---|---|---|
| API d'un modèle de langage | phase 4 | 5 à 15 € pour toute la phase, clé dans `.env` |
| AWS | lot 21 | 10 à 30 € le mois du lot, alerte de budget à 30 € avant la première ligne |
| Tout le reste | toujours | 0 € : Docker, kind, LocalStack, GitHub |

---

# Chapitre 6 — La boucle, à chaque lot

1. **Je livre** le code en zip, le cours du lot en HTML, le suivi des tickets à jour.
2. **Tu appliques** sur `develop` et tu produis les preuves.
3. **Tu m'expliques** le lot en trois minutes.
4. **On passe au suivant.**

Le lot 2 est livré. C'est le seul lot ouvert. Termine-le.
