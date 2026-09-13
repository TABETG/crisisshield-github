# Backlog CrisisShield enrichi

**Ce document ajoute 58 user stories aux 17 épics existants et crée deux épics nouveaux.** Les stories d'origine ne sont pas reprises ici : elles restent valides telles quelles. Chaque ajout porte ses points d'effort, sa techno et son critère d'acceptation.

**Fil conducteur :** CrisisShield devient une plateforme de gestion de crise dont chaque brique est démontrable en sécurité — identité, chiffrement, traçabilité, IA — et dont les preuves ont une valeur juridique grâce à eIDAS.

---

# EP01 — Foundation & Architecture

**EP01-US05 — Chaîne CI/CD avec portail qualité — 5 SP**
En tant que développeur, je veux qu'aucune fusion ne soit possible sans analyse statique, analyse des dépendances et détection de secrets, afin que les défauts de sécurité soient bloqués avant la revue humaine.
Techno : GitLab CI, Semgrep, Trivy, Gitleaks, Checkov. Critère : une dépendance vulnérable injectée volontairement fait échouer la chaîne.

**EP01-US06 — Image Docker durcie — 3 SP**
En tant que développeur, je veux une image multi-étapes, sans utilisateur racine ni shell, étiquetée par empreinte de commit, afin qu'un conteneur compromis ne donne rien d'exploitable.
Techno : Dockerfile multi-étapes, image distroless ou Alpine minimale. Critère : `latest` interdit, `whoami` dans le conteneur ne renvoie pas root.

**EP01-US07 — Kubernetes local et chart Helm — 5 SP**
En tant que développeur, je veux déployer CrisisShield sur un cluster Kubernetes local avec un chart Helm paramétré, afin que l'environnement de développement soit identique à la cible de production.
Techno : kind, Helm, contextes de sécurité. Critère : conteneur en lecture seule, capacités retirées, sondes de vivacité et de disponibilité distinctes.

**EP01-US08 — Infrastructure AWS en code — 8 SP**
En tant que DevOps, je veux décrire l'intégralité de l'infrastructure de staging en Terraform, afin de pouvoir la détruire et la reconstruire sans intervention manuelle.
Techno : Terraform, VPC, EKS, ECR, KMS, Secrets Manager, fédération OIDC GitLab vers AWS sans clé statique. Critère : `terraform destroy` puis `apply` reconstruit un environnement fonctionnel.

**EP01-US09 — Signature des images et nomenclature logicielle — 5 SP**
En tant que responsable sécurité, je veux que chaque image soit signée et accompagnée de sa nomenclature, et que le cluster refuse toute image non signée, afin de garantir la provenance de ce qui tourne en production.
Techno : Cosign, Syft, CycloneDX, Kyverno. Critère : une image non signée est rejetée à l'admission.

---

# EP02 — Identity & Access Management

**EP02-US06 — Signature asymétrique des jetons — 5 SP**
En tant que responsable sécurité, je veux que les jetons soient signés en RS256 ou ES256 avec une clé privée qui ne quitte jamais le module matériel, et que la clé publique soit exposée en JWKS, afin qu'aucun service ne puisse forger un jeton même s'il est compromis.
Techno : jjwt, AWS KMS ou SoftHSM via PKCS#11. Critère : le secret partagé HS256 n'existe plus nulle part.

**EP02-US07 — Keycloak en fédération LDAP — 8 SP**
En tant qu'architecte, je veux placer Keycloak devant l'annuaire LDAP et faire porter OpenID Connect par Keycloak, afin de sortir le JWT maison du code applicatif et d'ouvrir la porte à Azure AD et aux fournisseurs externes.
Techno : Keycloak, fédération utilisateurs LDAP, export du realm versionné. Critère : la connexion LDAP existante fonctionne à l'identique via Keycloak.

**EP02-US08 — Comptes de service et moindre privilège — 3 SP**
En tant que responsable sécurité, je veux une identité distincte par service appelant, avec le strict minimum de portées, afin qu'un incident sur un service soit attribuable et révocable sans toucher aux autres.
Techno : flux d'identifiants client OAuth 2.0. Critère : aucun compte technique partagé.

**EP02-US09 — Tests négatifs sur les jetons — 3 SP**
En tant que développeur, je veux une suite de tests qui vérifie le rejet des jetons expirés, à signature invalide, à audience étrangère et à algorithme falsifié, afin que la validation ne régresse jamais.
Techno : JUnit, MockMvc. Critère : cinq tests négatifs verts, dont algorithme `none` et confusion d'algorithme.

**EP02-US10 — Identité de niveau substantiel eIDAS — 8 SP**
En tant que responsable de crise d'un organisme public, je veux pouvoir m'authentifier avec une identité électronique de niveau substantiel, afin que les décisions prises en cellule de crise soient imputables à une personne identifiée avec un niveau de garantie réglementaire.
Techno : OpenID Connect vers un fournisseur d'identité eIDAS (ProConnect ou équivalent), niveau substantiel. Critère : l'assurance de niveau est présente dans le jeton et vérifiée.

---

# EP03 — Organisations & Multi-Tenant

**EP03-US05 — Tests d'isolation automatisés — 5 SP**
En tant que responsable sécurité, je veux une suite de tests qui tente systématiquement d'accéder aux ressources d'une autre organisation, afin de prouver que le filtre par organisation ne laisse rien passer.
Techno : tests d'intégration, deux organisations de test, référence directe non contrôlée à un objet. Critère : chaque point d'accès a son test d'isolation, tous verts.

**EP03-US06 — Chiffrement par organisation — 8 SP**
En tant que responsable sécurité, je veux une clé de chiffrement distincte par organisation, gérée par le service de gestion de clés, afin que la compromission d'une clé n'expose qu'un seul client et que la révocation d'un client soit une destruction de clé.
Techno : chiffrement par enveloppe, clé de données AES-GCM, clé maîtresse par organisation dans KMS. Critère : les données d'une organisation sont illisibles avec la clé d'une autre.

**EP03-US07 — Isolation des conversations IA — 3 SP**
En tant qu'utilisateur, je veux que l'assistant IA n'ait accès qu'aux plans et crises de mon organisation, afin qu'aucune information d'un autre client ne puisse être restituée.
Techno : réutilisation du filtre Hibernate `orgFilter` sur la couche de récupération. Critère : test d'isolation dédié à la récupération de contexte.

---

# EP04 — Crisis Knowledge Base

**EP04-US06 — Indexation vectorielle des plans — 8 SP**
En tant que responsable sécurité, je veux que les plans publiés soient découpés et indexés sous forme de vecteurs, afin que l'assistant puisse les retrouver par similarité et non seulement par mot-clé.
Techno : pgvector dans PostgreSQL, embeddings via la passerelle IA, index par organisation. Critère : une question en langage naturel retrouve le bon passage du bon plan.

**EP04-US07 — Assistant de rédaction de plan — 5 SP**
En tant que responsable sécurité, je veux être aidé par l'assistant pour rédiger et compléter un plan à partir de modèles et de plans existants, afin de produire des procédures plus complètes en moins de temps.
Techno : passerelle IA, récupération augmentée sur les plans de l'organisation. Critère : la suggestion cite le passage source et reste modifiable.

**EP04-US08 — Cachet des versions publiées — 5 SP**
En tant qu'auditeur, je veux que chaque version publiée d'un plan porte un cachet électronique de l'organisation et un horodatage, afin de prouver qu'elle n'a pas été altérée depuis sa publication.
Techno : signature via clé dans le module matériel, horodatage RFC 3161. Critère : la vérification échoue dès qu'un caractère du plan change.

---

# EP05 — Crisis Execution & War Room

**EP05-US06 — Copilote de crise — 8 SP**
En tant que responsable de crise, je veux que l'assistant me propose les prochaines actions à partir du plan activé et des événements déjà survenus, afin de ne rien oublier sous pression.
Techno : récupération augmentée sur le plan actif et la chronologie, passerelle IA. Critère : chaque suggestion référence l'étape du plan dont elle découle ; aucune action n'est exécutée sans validation humaine.

**EP05-US07 — Synthèse automatique de la chronologie — 5 SP**
En tant que responsable de crise, je veux une synthèse rédigée de la chronologie à tout moment, afin de communiquer rapidement avec la direction sans reconstituer les événements à la main.
Techno : passerelle IA, masquage des données personnelles avant envoi. Critère : la synthèse ne contient aucune donnée personnelle non masquée dans le prompt.

**EP05-US08 — Rapport de crise à valeur probante — 8 SP**
En tant que responsable de crise, je veux que le rapport de clôture soit signé électroniquement et horodaté selon eIDAS, afin qu'il puisse servir de preuve devant un assureur, un régulateur ou un tribunal.
Techno : signature électronique avancée ou qualifiée (PAdES), horodatage qualifié RFC 3161, prestataire de confiance qualifié ou module matériel interne. Critère : le rapport est vérifiable par un outil tiers standard.

---

# EP06 — Notifications & Alertes

**EP06-US05 — Webhooks signés et anti-rejeu — 3 SP**
En tant qu'administrateur, je veux que chaque webhook sortant soit signé et horodaté, afin que le système destinataire puisse en vérifier l'origine et rejeter une réémission.
Techno : signature HMAC dans l'en-tête, horodatage, fenêtre de validité courte. Critère : un webhook rejoué hors fenêtre est rejeté.

**EP06-US06 — Courriels authentifiés — 3 SP**
En tant que destinataire, je veux que les alertes par courriel soient authentifiables, afin de ne pas confondre une alerte réelle avec une tentative d'hameçonnage en pleine crise.
Techno : DKIM, DMARC, SPF, optionnellement S/MIME. Critère : le courriel passe DMARC en politique stricte.

---

# EP07 — Degraded Mode & Emergency Kits

**EP07-US04 — Chiffrement des kits par enveloppe — 8 SP**
En tant que responsable sécurité, je veux que chaque kit soit chiffré avec une clé de données unique, elle-même chiffrée par une clé maîtresse dans le module matériel, afin qu'un kit volé soit inexploitable et qu'un kit puisse être révoqué sans rechiffrer les autres.
Techno : AES-256-GCM, clé maîtresse dans KMS ou SoftHSM via PKCS#11, Bouncy Castle. Critère : la clé maîtresse ne quitte jamais le module ; la révocation d'un kit est une destruction de sa clé de données enveloppée.

**EP07-US05 — Ouverture hors ligne par quorum — 5 SP**
En tant que responsable de crise, je veux qu'un kit puisse être ouvert hors ligne par plusieurs personnes ensemble et jamais par une seule, afin d'éviter qu'un individu isolé accède aux informations les plus sensibles.
Techno : partage de secret de Shamir, seuil m parmi n. Critère : deux parts sur trois ouvrent le kit, une seule ne l'ouvre pas.

---

# EP08 — Audit & Traceability

**EP08-US04 — Chaînage cryptographique des journaux — 8 SP**
En tant que responsable sécurité, je veux que chaque entrée d'audit contienne l'empreinte de la précédente, et que la chaîne soit ancrée périodiquement par un horodatage signé, afin que toute suppression ou modification soit détectable.
Techno : chaîne d'empreintes SHA-256, ancrage horodaté RFC 3161, vérification à la demande. Critère : la suppression d'une seule ligne casse la vérification.

**EP08-US05 — Journalisation des appels IA — 3 SP**
En tant qu'auditeur, je veux que chaque appel à l'assistant soit tracé avec l'utilisateur, l'organisation, le modèle, le verdict des filtres, le coût et la latence, afin de pouvoir répondre à « qui a demandé quoi à l'IA ».
Techno : journalisation structurée, identifiant de corrélation. Critère : le contenu brut du prompt n'est jamais journalisé par défaut ; un mode d'audit tracé peut l'activer.

**EP08-US06 — Export de preuves signé — 5 SP**
En tant qu'auditeur, je veux que l'export du journal d'audit soit signé et horodaté, afin qu'il puisse être remis à un tiers comme élément de preuve opposable.
Techno : signature électronique avancée sur l'export, horodatage qualifié. Critère : le fichier exporté est vérifiable hors de CrisisShield.

---

# EP09 — Security & Cryptography

**EP09-US06 — Autorité de certification interne — 8 SP**
En tant que responsable sécurité, je veux une autorité racine hors ligne et une autorité intermédiaire en ligne, afin d'émettre les certificats des services sans jamais exposer la racine.
Techno : step-ca, clé racine dans KMS, intermédiaire signant au quotidien. Critère : la racine n'est utilisée que pour signer l'intermédiaire ; contraintes de base et usages de clé corrects dans chaque certificat.

**EP09-US07 — TLS mutuel entre composants — 5 SP**
En tant que responsable sécurité, je veux que le backend, l'annuaire et la base de données s'authentifient mutuellement par certificat, afin qu'un composant non autorisé soit rejeté au niveau du transport.
Techno : TLS mutuel, autorisation par identité de certificat. Critère : un client sans certificat valide est refusé avant toute requête applicative.

**EP09-US08 — Rotation automatique des certificats — 5 SP**
En tant qu'exploitant, je veux que les certificats de service vivent moins de trois jours et se renouvellent sans coupure, afin que l'expiration ne soit jamais un incident et que la révocation devienne inutile.
Techno : cert-manager raccordé à l'intermédiaire. Critère : un renouvellement observé sans erreur ni redémarrage.

**EP09-US09 — Gestion centralisée des secrets — 5 SP**
En tant que développeur, je veux qu'aucun secret ne figure dans le dépôt, l'image ou les journaux, et que la rotation soit possible sans redémarrage, afin de réduire à zéro la surface d'exposition des identifiants.
Techno : AWS Secrets Manager ou HashiCorp Vault, injection au démarrage. Critère : une recherche du secret dans le dépôt, l'image et les journaux ne renvoie rien.

**EP09-US10 — Cachet électronique d'organisation eIDAS — 8 SP**
En tant que responsable conformité, je veux que CrisisShield puisse apposer un cachet électronique au nom de l'organisation sur les documents qu'elle produit, afin que ces documents aient une valeur juridique reconnue dans l'Union européenne.
Techno : certificat de cachet électronique qualifié ou avancé, module matériel qualifié ou prestataire de services de confiance, formats CAdES et PAdES. Critère : le cachet est vérifiable avec l'outil de référence de la Commission européenne.

**EP09-US11 — Inventaire cryptographique et agilité — 3 SP**
En tant que responsable sécurité, je veux un inventaire de tous les algorithmes, tailles de clé et usages en production, afin de préparer la migration vers les algorithmes post-quantiques quand elle sera exigée.
Techno : nomenclature cryptographique, revue trimestrielle. Critère : aucun algorithme n'est codé en dur ; chaque usage est paramétré.

---

# EP10 — Observability & SRE

**EP10-US06 — Traçage distribué — 5 SP**
En tant qu'exploitant, je veux suivre une requête segment par segment à travers l'authentification, le métier et l'appel IA, afin d'identifier en secondes le composant qui ralentit.
Techno : OpenTelemetry, Jaeger, conventions sémantiques pour l'IA générative. Critère : les erreurs sont toujours tracées, le trafic nominal est échantillonné.

**EP10-US07 — Détection de comportements anormaux — 5 SP**
En tant qu'exploitant sécurité, je veux être alerté sur les pics d'échecs d'authentification, les volumes d'appels IA anormaux et les accès hors horaires, afin d'intervenir avant l'incident.
Techno : Prometheus, Alertmanager, seuils calibrés sur données réelles. Critère : chaque alerte a un mode opératoire ; une simulation d'abus déclenche l'alerte attendue.

**EP10-US08 — Tableau de bord de coût IA — 3 SP**
En tant qu'administrateur d'organisation, je veux voir la consommation et le coût de l'assistant pour mon organisation, afin de piloter mon budget.
Techno : Grafana, métriques par organisation. Critère : le coût du mois est lisible en un coup d'œil et cohérent avec la facture du fournisseur.

---

# EP12 — Platform Administration

**EP12-US04 — Politique IA par organisation — 5 SP**
En tant qu'administrateur plateforme, je veux définir par organisation le modèle autorisé, le quota, le masquage obligatoire et la conservation des journaux IA, afin d'adapter le niveau de contrôle au secteur du client.
Techno : configuration par organisation, appliquée par la passerelle. Critère : une organisation en mode strict ne peut pas contourner le masquage.

---

# EP15 — Défense & Secteurs réglementés

**EP15-US03 — Correspondance réglementaire étendue — 5 SP**
En tant que responsable conformité, je veux relier chaque fonctionnalité de sécurité aux exigences de NIS2, ISO 27001, SecNumCloud et eIDAS, afin de démontrer la couverture sans reconstruire l'analyse à chaque audit.
Techno : matrice de conformité versionnée. Critère : chaque exigence pointe vers une story et une preuve.

**EP15-US04 — Journal de conformité IA — 5 SP**
En tant que responsable conformité, je veux documenter l'usage de l'IA selon les obligations de transparence et de journalisation du règlement européen sur l'intelligence artificielle, afin d'être prêt pour un contrôle.
Techno : registre des usages IA, information des utilisateurs, conservation des journaux. Critère : chaque fonctionnalité IA est décrite avec sa finalité, ses données et son niveau de supervision humaine.

---

# EP16 — MCO / Exploitation

**EP16-US06 — Gestion continue des vulnérabilités — 3 SP**
En tant qu'exploitant sécurité, je veux que les images et dépendances soient réanalysées chaque nuit, avec un mécanisme de dérogation tracé et daté, afin qu'une faille publiée après le déploiement soit détectée sans attendre la prochaine livraison.
Techno : Trivy planifié, nomenclature logicielle. Critère : une faille critique publiée sur une dépendance en production remonte en moins de 24 heures.

**EP16-US07 — Réponse à incident incluant l'IA — 3 SP**
En tant qu'exploitant, je veux des scénarios de réponse couvrant la fuite de données par prompt, la compromission d'une clé et l'abus interne de l'assistant, afin de savoir quoi faire avant que ça n'arrive.
Techno : mode opératoire par scénario, exercice sur table. Critère : chaque scénario a été joué au moins une fois.

---

# EP17 — Governance

**EP17-US05 — Modèle de menace vivant — 3 SP**
En tant que responsable sécurité, je veux un modèle de menace couvrant l'application et l'assistant IA, revu à chaque trimestre et à chaque changement d'architecture, afin que les risques acceptés restent des décisions et non des oublis.
Techno : STRIDE, référentiel OWASP pour les modèles de langage. Critère : chaque risque accepté a un porteur nommé.

**EP17-US06 — Registres de décision d'architecture — 2 SP**
En tant que Tech Lead, je veux consigner chaque décision structurante avec les options écartées et leurs raisons, afin que l'équipe ne rejoue pas les mêmes débats et qu'un nouvel arrivant comprenne le pourquoi.
Techno : fichiers versionnés dans le dépôt. Critère : les décisions Bedrock contre fournisseur externe, JWT maison contre Keycloak, et module matériel contre service géré sont documentées.

---

# EP18 — Assistant IA sécurisé (nouvel épic)

**Objectif :** offrir un assistant fondé sur les plans et crises de l'organisation, sans jamais laisser sortir une donnée ni laisser une injection produire un effet.

**EP18-US01 — Passerelle IA unique — 5 SP**
En tant qu'architecte, je veux que tout appel à un modèle passe par un point d'accès unique du backend, et qu'aucun autre chemin réseau vers un fournisseur ne soit possible, afin que les contrôles soient obligatoires et non recommandés.
Techno : module Spring Boot `/api/assistant`, politiques réseau Kubernetes. Critère : depuis un autre conteneur, aucune sortie vers le fournisseur n'aboutit.

**EP18-US02 — Abstraction du fournisseur et décision documentée — 5 SP**
En tant qu'architecte, je veux une interface unique derrière laquelle Bedrock ou un fournisseur externe peuvent être branchés, et un registre de décision qui justifie le choix, afin de changer de modèle en modifiant une seule classe.
Techno : interface `ModelProvider`, implémentation Bedrock, implémentation simulée pour les tests, flux continu dès le départ. Critère : le test d'intégration passe avec le fournisseur simulé.

**EP18-US03 — Filtrage d'injection de prompt — 8 SP**
En tant que responsable sécurité, je veux une défense en couches contre l'injection directe et indirecte, mesurée sur un banc d'essai de trente charges utiles, afin de connaître le taux réel de détection et d'assumer ce qui passe encore.
Techno : séparation stricte système et utilisateur, règles sur motifs connus, classifieur. Critère : taux de détection chiffré, liste documentée des contournements non couverts.

**EP18-US04 — Masquage des données personnelles — 8 SP**
En tant que délégué à la protection des données, je veux que noms, courriels, téléphones, numéros d'astreinte et identifiants internes soient remplacés par des marqueurs stables avant tout envoi au modèle, puis restaurés dans la réponse, afin que le fournisseur ne voie jamais une donnée réelle.
Techno : Presidio, reconnaisseurs personnalisés pour les formats de l'organisation. Critère : six types de données neutralisés ; dégradation de la qualité des réponses mesurée et acceptée.

**EP18-US05 — Principe de moindre capacité — 5 SP**
En tant qu'architecte, je veux que le modèle n'ait aucun accès direct aux données et n'agisse qu'à travers des outils au périmètre étroit validés côté serveur, avec confirmation humaine pour toute action irréversible, afin qu'une injection réussie reste sans conséquence.
Techno : outils explicites, autorisation par outil, confirmation dans l'interface. Critère : une injection qui demande la suppression d'un plan n'aboutit à rien.

**EP18-US06 — Limitation de débit et plafond de coût — 3 SP**
En tant qu'administrateur, je veux un seau à jetons par utilisateur et par organisation, un plafond quotidien, et une coupure globale sur dépassement du budget, afin qu'aucune boucle ni aucun abus ne produise de facture surprise.
Techno : Bucket4j, Redis pour l'état partagé. Critère : mille requêtes en boucle sont coupées proprement avec un code 429.

**EP18-US07 — Contrôle de sortie — 3 SP**
En tant que responsable sécurité, je veux que la réponse du modèle soit traitée comme une donnée hostile, jamais interprétée ni insérée telle quelle, et que le prompt système ne puisse jamais être restitué, afin de fermer les attaques par la sortie.
Techno : échappement systématique, détection de fuite du prompt système. Critère : une réponse contenant du code ou une balise est affichée en texte brut.

**EP18-US08 — Récupération augmentée sécurisée — 8 SP**
En tant que responsable sécurité, je veux que la récupération de contexte soit filtrée par organisation avant la recherche vectorielle, et que tout document récupéré soit traité comme une source possible d'injection indirecte, afin que ni la confidentialité ni l'intégrité ne dépendent du modèle.
Techno : pgvector avec filtre de tenant dans la requête, délimitation stricte des documents dans le prompt. Critère : un document contenant une instruction cachée ne modifie pas le comportement de l'assistant.

**EP18-US09 — Provenance des réponses IA — 5 SP**
En tant qu'auditeur, je veux que chaque réponse de l'assistant porte une attestation signée indiquant le modèle, sa version, les documents sources et l'empreinte de la réponse, afin de pouvoir prouver a posteriori ce que l'IA a produit et à partir de quoi.
Techno : attestation JSON signée avec la clé du module matériel. Critère : la vérification échoue si la réponse ou ses sources sont modifiées.

**EP18-US10 — Serveur MCP CrisisShield — 8 SP**
En tant qu'architecte, je veux exposer les capacités de CrisisShield à un agent via un serveur MCP avec des outils explicites, des hooks d'autorisation avant chaque appel et une journalisation intégrale, afin d'intégrer proprement des agents externes sans leur donner un accès direct à la base.
Techno : SDK MCP, outils `lire_plan`, `lister_crises`, `proposer_tache`, hooks de cycle de vie. Critère : un appel d'outil sans autorisation est refusé et tracé.

---

# EP19 — Sécurité applicative continue (nouvel épic)

**Objectif :** transformer la sécurité applicative en pratique quotidienne mesurée, non en audit annuel.

**EP19-US01 — Analyse dynamique authentifiée — 5 SP**
En tant que responsable sécurité, je veux une analyse dynamique lancée sur une instance éphémère avec un jeton valide, comparée à la référence précédente, afin de détecter les régressions de sécurité en fonctionnement réel.
Techno : OWASP ZAP dans la chaîne. Critère : seules les nouveautés alertent ; l'analyse couvre les routes protégées.

**EP19-US02 — Tests d'intrusion automatisés ciblés — 5 SP**
En tant que responsable sécurité, je veux des scénarios d'attaque rejoués à chaque livraison — accès inter-organisations, falsification de jeton, contournement d'autorisation, injection de prompt — afin que les failles déjà corrigées ne réapparaissent jamais.
Techno : suite de tests dédiée, données de deux organisations. Critère : chaque faille historique a son test de non-régression.

**EP19-US03 — Règles d'analyse statique propres au projet — 3 SP**
En tant que Tech Lead, je veux traduire les décisions d'architecture en règles automatiquement vérifiées — interdiction d'appel direct au fournisseur, interdiction de requête sans filtre de tenant — afin que l'architecture tienne quand je ne suis pas en revue.
Techno : règles Semgrep maison. Critère : trois règles au moins, chacune détectant une violation réelle.

**EP19-US04 — Référentiel de vérification ASVS — 3 SP**
En tant que responsable sécurité, je veux évaluer CrisisShield contre le niveau 2 du référentiel OWASP ASVS et suivre l'écart, afin d'avoir une mesure objective de la maturité et un plan d'amélioration.
Techno : grille ASVS versionnée. Critère : chaque exigence de niveau 2 est notée couverte, partielle ou absente, avec la story associée.

---

# Ordre recommandé

1. **Faire tourner l'existant** — les correctifs livrés, EP02-US05 terminé
2. **EP03-US05** — tests d'isolation, avant tout le reste : c'est la base de confiance
3. **EP01-US05, US06** — chaîne CI/CD et image durcie : tout ce qui suit passera par là
4. **EP18-US01 à US07** — l'assistant IA, cœur du projet vitrine
5. **EP02-US06, EP09-US06 à US09** — signature asymétrique, autorité de certification, TLS mutuel : ta PKI
6. **EP07-US04, EP08-US04, EP05-US08** — les trois usages cryptographiques concrets : kits, journaux, rapport eIDAS
7. **EP18-US08 à US10** — récupération augmentée, provenance, MCP
8. Le reste

# Les cinq stories qui te vendent

**EP18-US03** (injection), **EP18-US04** (masquage), **EP09-US06** (autorité de certification), **EP05-US08** (rapport eIDAS), **EP08-US04** (journaux chaînés).

Ce sont celles qu'on te demandera de détailler. Sur elles, vise vingt minutes d'explication sans notes.
