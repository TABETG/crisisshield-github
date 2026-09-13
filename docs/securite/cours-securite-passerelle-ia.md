# Cours — Sécurité d'une passerelle IA d'entreprise

**Public :** développeur expérimenté qui passe à la sécurité applicative.
**Durée de lecture :** environ 1 h 30. À relire avant chaque épic.
**Objectif :** comprendre le *pourquoi* avant d'écrire le *comment*. Tout ce qui suit sera mis en pratique dans le backlog.

---

# Chapitre 1 — Pourquoi une passerelle, et contre quoi

## 1.1 Le problème que tu résous

Une entreprise qui met un modèle de langage à disposition de ses salariés est confrontée à quatre risques simultanés :

| Risque | Manifestation concrète |
|---|---|
| Fuite de données | Un salarié colle un contrat client dans le prompt. Il part chez un tiers, hors de ton contrôle. |
| Perte de traçabilité | Six mois plus tard, impossible de savoir qui a envoyé quoi. Aucun audit possible. |
| Dérive de coût | Une boucle mal écrite consomme le budget annuel en une nuit. |
| Détournement du modèle | Une entrée utilisateur retourne les instructions du système et contourne les garde-fous. |

Un accès direct au fournisseur ne permet de traiter aucun des quatre. La passerelle est le **point de contrôle unique** qui les rend traitables.

## 1.2 Le principe d'architecture sous-jacent

C'est un **mandataire de médiation de politique** (policy enforcement proxy). Le motif est ancien : il est le même qu'une passerelle d'interfaces de programmation, un pare-feu applicatif ou un mandataire de base de données.

La règle générale, que tu dois savoir énoncer :

> Quand une ressource est sensible, partagée et externe, on ne sécurise pas chaque appelant. On interpose un point de passage obligatoire, et on rend tout autre chemin impossible.

La deuxième moitié de la phrase est la plus importante. Une passerelle qu'on peut contourner ne sert à rien. C'est pourquoi le ticket INF-2, les politiques réseau, n'est pas un détail d'infrastructure : c'est ce qui rend ta passerelle **obligatoire** plutôt que **recommandée**.

## 1.3 Ce que la passerelle ne fait pas

À savoir énoncer spontanément, c'est un marqueur de maturité :

- Elle ne protège pas contre un salarié qui utilise le modèle grand public sur son téléphone. C'est un sujet de politique interne, pas de technique.
- Elle ne rend pas le modèle fiable. Les erreurs factuelles du modèle ne sont pas un problème de sécurité.
- Elle ne supprime pas l'injection de prompt. Elle en réduit la probabilité et surtout l'impact.

---

# Chapitre 2 — Modélisation des menaces

## 2.1 La démarche

Modéliser une menace, c'est répondre à quatre questions, dans l'ordre :

1. Sur quoi je travaille ? — le diagramme de flux de données
2. Qu'est-ce qui peut mal tourner ? — STRIDE
3. Qu'est-ce que je fais ? — les mitigations
4. Est-ce que j'ai bien fait ? — la vérification

La plupart des équipes sautent la première question et se perdent. Le diagramme n'est pas de la décoration : sans frontières de confiance dessinées, on ne sait pas où appliquer les contrôles.

## 2.2 La frontière de confiance

Une **frontière de confiance** est un endroit où le niveau de confiance dans les données change.

Dans ton projet il y en a trois :

```
[Poste utilisateur]  --FRONTIÈRE 1-->  [Passerelle]  --FRONTIÈRE 2-->  [Fournisseur externe]
                                            |
                                       FRONTIÈRE 3
                                            v
                                   [Services internes]
```

Règle : **toute donnée qui franchit une frontière entrante est hostile jusqu'à preuve du contraire.**

Le piège propre aux systèmes d'IA : la réponse du modèle franchit la frontière 2 en sens inverse, et elle est donc elle aussi hostile. Beaucoup de développeurs traitent la sortie du modèle comme une donnée de confiance. C'est l'origine de la majorité des failles réelles.

## 2.3 STRIDE

Six catégories, à appliquer à chaque flux du diagramme :

| Lettre | Menace | Exemple dans ton projet | Propriété violée |
|---|---|---|---|
| **S** | Usurpation d'identité | Un jeton falsifié se fait passer pour un administrateur | Authentification |
| **T** | Altération | Modification du prompt système en transit | Intégrité |
| **R** | Répudiation | « Ce n'est pas moi qui ai envoyé ce prompt » | Non-répudiation |
| **I** | Divulgation | Données personnelles envoyées au fournisseur | Confidentialité |
| **D** | Déni de service | Saturation du quota par un seul utilisateur | Disponibilité |
| **E** | Élévation de privilège | Un utilisateur standard atteint un modèle réservé | Autorisation |

Chaque lettre correspond à un contrôle : authentification, intégrité, journalisation, chiffrement, limitation de débit, autorisation. C'est exactement la liste de tes épics. Ce n'est pas un hasard : le backlog est dérivé de STRIDE.

## 2.4 Le risque résiduel

Tu ne traiteras jamais tout. Le risque résiduel accepté n'est pas un aveu de faiblesse, c'est le signe d'une analyse aboutie.

Un risque résiduel bien formulé comporte quatre éléments : la menace, la raison de ne pas la traiter, la mesure de compensation, et le nom de la personne qui l'accepte.

> *Exemple.* « L'exfiltration de données par injection indirecte via un document fourni n'est pas bloquée de façon fiable. Coût de traitement disproportionné à ce stade. Compensation : journalisation intégrale et alerte sur volume de sortie anormal. Accepté par [responsable]. »

---

# Chapitre 3 — Identité, authentification, autorisation

Tu connais déjà Keycloak et les jetons. Ce chapitre ne réexplique pas les bases, il cible les endroits où les gens expérimentés se trompent.

## 3.1 Les trois questions à ne jamais confondre

| Question | Nom | Mécanisme |
|---|---|---|
| Qui es-tu ? | Authentification | OpenID Connect, jeton d'identité |
| Qu'as-tu le droit de faire ? | Autorisation | OAuth 2.0, jeton d'accès, portées |
| Qu'as-tu fait ? | Traçabilité | Journalisation |

**OAuth 2.0 est un protocole d'autorisation déléguée, pas d'authentification.** OpenID Connect est la couche d'authentification construite par-dessus. Confondre les deux est l'erreur la plus fréquente, et elle est souvent posée en entretien.

## 3.2 Jeton d'identité contre jeton d'accès

- Le **jeton d'identité** est destiné au client. Il dit qui est l'utilisateur. Son audience est le client.
- Le **jeton d'accès** est destiné au service. Il dit ce que le porteur peut faire. Son audience est le service.

**L'erreur classique :** envoyer le jeton d'identité à l'interface de programmation comme jeton d'accès. Ça fonctionne — la signature est valide — et c'est une faille : l'audience n'est pas la bonne, et le service accepte un jeton qui ne lui était pas destiné.

D'où la règle : **valider systématiquement l'audience.** Une signature valide ne signifie pas que le jeton t'était destiné.

## 3.3 Les cinq validations obligatoires d'un jeton

1. **Signature** — avec la clé publique correspondant à l'identifiant de clé annoncé
2. **Émetteur** — exactement celui que tu attends, comparaison stricte de chaîne
3. **Audience** — ton service doit y figurer
4. **Expiration** — avec une tolérance d'horloge de quelques secondes, jamais plusieurs minutes
5. **Algorithme** — imposé par ta configuration, jamais lu depuis l'en-tête du jeton

Le point 5 est le plus subtil. Deux attaques historiques :

- **Algorithme `none`** : le jeton annonce qu'il n'est pas signé, et les implémentations naïves l'acceptent.
- **Confusion d'algorithme** : le jeton annonce un algorithme symétrique, et la bibliothèque utilise la clé publique RSA comme secret partagé. Or la clé publique est publique — l'attaquant peut donc forger un jeton valide.

Dans les deux cas, la faille vient de ce que le vérificateur fait confiance à l'en-tête fourni par l'attaquant. **On ne demande jamais à l'attaquant comment vérifier son propre jeton.**

## 3.4 Le problème de la révocation

Un jeton signé est valide jusqu'à son expiration. Il n'existe aucun moyen de l'annuler, parce que la vérification est locale et hors ligne. C'est le prix du sans-état.

Trois réponses, à connaître avec leurs compromis :

| Approche | Avantage | Coût |
|---|---|---|
| Durée de vie courte | Simple, sans état | Fenêtre de vulnérabilité résiduelle |
| Introspection à chaque appel | Révocation immédiate | Latence, dépendance forte à Keycloak |
| Liste de révocation en cache | Compromis | Complexité, cohérence à gérer |

Pour ta passerelle : durée de vie courte, cinq à quinze minutes. Savoir expliquer pourquoi tu n'as pas choisi l'introspection — dépendance et latence sur le chemin critique — vaut mieux que de citer la solution « la plus sécurisée ».

## 3.5 Point de décision et point d'application

Vocabulaire d'architecture à maîtriser :

- Le **point de décision** évalue la politique et répond oui ou non.
- Le **point d'application** applique cette réponse.

Les séparer permet de faire évoluer la politique sans toucher au code, et de la tester isolément. Les confondre disperse les contrôles dans tout le code, et c'est ainsi qu'on finit par en oublier un.

---

# Chapitre 4 — Cryptographie appliquée et infrastructure à clés publiques

C'est le chapitre le plus dense, et celui où ton avantage concurrentiel se construit. Peu de développeurs, même seniors, maîtrisent réellement cette matière.

## 4.1 Les trois usages à ne pas mélanger

| Usage | Garantit | Mécanisme |
|---|---|---|
| Chiffrement | Confidentialité | Symétrique ou asymétrique |
| Signature | Intégrité et origine | Asymétrique |
| Empreinte | Intégrité seule | Fonction de hachage |

Une clé sert à **un seul** usage. Une clé de signature ne chiffre pas, une clé de chiffrement ne signe pas. Cette séparation figure dans les extensions du certificat, et c'est un point d'audit.

## 4.2 Anatomie d'un certificat X.509

Un certificat est une **affirmation signée** : une autorité déclare que telle clé publique appartient à telle identité.

Les champs qui comptent :

- **Sujet** — l'identité certifiée
- **Émetteur** — qui l'affirme
- **Clé publique** — l'objet de l'affirmation
- **Validité** — les dates de début et de fin
- **Nom alternatif du sujet** — les noms réellement vérifiés par les clients modernes. Le nom commun est obsolète depuis longtemps ; s'appuyer dessus est une erreur fréquente.
- **Contraintes de base** — indique si le certificat peut signer d'autres certificats. Sans ce garde-fou, n'importe quel certificat de service pourrait émettre des certificats.
- **Usage de la clé et usage étendu** — à quoi la clé a le droit de servir

## 4.3 La chaîne de confiance

```
Racine (hors ligne, autosignée)
   └── Intermédiaire (en ligne, signe au quotidien)
          └── Certificat de service (courte durée)
```

Pourquoi cette structure, question posée systématiquement :

- La clé racine est le secret ultime. Si elle est compromise, **toute** l'infrastructure s'effondre et il faut redistribuer la racine à tous les clients. On la garde donc hors ligne, protégée matériellement, et on ne l'utilise que quelques fois par an.
- L'intermédiaire travaille au quotidien. Si elle est compromise, on la révoque et on en émet une nouvelle. La racine reste valide, les clients ne bougent pas.

Une racine qui signe directement les certificats de service est le signe immédiat d'une conception amateur.

## 4.4 Révocation : le point faible historique

Trois approches :

| Mécanisme | Principe | Faiblesse |
|---|---|---|
| Liste de révocation | Fichier des certificats révoqués | Volumineuse, mise à jour différée |
| Vérification en ligne | Interrogation de l'autorité | Latence, fuite de confidentialité, disponibilité critique |
| **Durée de vie courte** | Le certificat expire seul | Aucune, si la rotation est fiable |

La troisième est l'approche moderne, et c'est celle de ton ticket INF-4. La formule à retenir :

> Le renouvellement fréquent est une révocation par expiration. Si le certificat vit vingt-quatre heures, la fenêtre d'exploitation d'une clé volée est de vingt-quatre heures au maximum, sans aucune infrastructure de révocation à maintenir.

## 4.5 TLS et TLS mutuel

Le protocole TLS standard n'authentifie que le serveur. Le client vérifie que le serveur présente un certificat valide pour le nom demandé.

En **TLS mutuel**, le serveur exige en retour un certificat du client. Le résultat est fondamental :

> L'identité du service est établie **avant** la première requête applicative. Un appelant non autorisé est rejeté au niveau du transport, sans jamais atteindre ton code.

C'est une défense structurellement plus forte qu'un jeton, parce qu'elle ne dépend d'aucune ligne de ton application.

Attention à la distinction que beaucoup ratent : présenter un certificat valide est de l'**authentification**. Décider que ce porteur a le droit d'appeler ce point d'accès reste de l'**autorisation**, et c'est à toi de l'implémenter. Un TLS mutuel sans contrôle d'autorisation signifie que tout service du maillage peut appeler tous les autres.

## 4.6 Module matériel de sécurité et service de gestion de clés

Le principe fondateur, en une phrase :

> **La clé privée ne sort jamais du module. On ne lui envoie pas la clé pour signer, on lui envoie la donnée, et il renvoie la signature.**

Conséquences pratiques :

- La compromission du serveur applicatif ne donne pas la clé, elle donne seulement la capacité de signer **tant que l'accès dure**.
- Toutes les opérations sont journalisées côté module.
- La révocation d'un accès est immédiate et n'exige pas de changer la clé.

**PKCS#11** est l'interface normalisée d'accès à ces modules. Même code, que tu parles à un module matériel physique, à SoftHSM en développement ou à un service géré.

**AWS KMS** est un service de gestion de clés adossé à du matériel certifié. Pour ton projet : les clés asymétriques de KMS signent tes certificats d'autorité, la clé privée n'existe nulle part ailleurs, et chaque signature laisse une trace dans le journal d'audit du nuage.

**Pourquoi pas CloudHSM ?** Environ 1,90 dollar de l'heure. Le compromis coût contre besoin réel est une décision d'architecte, et c'est celle que tu documenteras dans ton registre de décision.

---

# Chapitre 5 — Sécurité des modèles de langage

C'est le domaine le plus récent, donc le moins bien maîtrisé par tes concurrents sur le marché. C'est là que ta rareté se joue.

## 5.1 Pourquoi un modèle de langage est structurellement vulnérable

Une application classique sépare le code et les données. Une requête paramétrée est sûre parce que le moteur sait ce qui est instruction et ce qui est donnée.

**Un modèle de langage ne fait pas cette distinction.** Instructions système et entrée utilisateur arrivent dans la même fenêtre de contexte, sous la même forme : du texte.

> C'est une injection par conception, pas par défaut d'implémentation.

Cette phrase, comprise et énoncée correctement, te place immédiatement au-dessus de la moyenne des candidats.

## 5.2 Injection directe et injection indirecte

**Directe** : l'utilisateur écrit lui-même l'instruction malveillante. Détectable par filtrage, avec un taux correct.

**Indirecte** : l'instruction est cachée dans un contenu que le système va lire — un document, une page web, un courriel, un ticket. L'utilisateur peut être totalement innocent.

L'injection indirecte est bien plus grave, pour trois raisons : la victime ne voit rien, la charge utile est dissimulée dans un flux légitime, et le filtrage d'entrée utilisateur ne la voit pas passer.

## 5.3 Pourquoi le filtrage ne suffira jamais

Filtrer, c'est chercher à distinguer une instruction malveillante d'un texte légitime. Or, en langue naturelle, la même phrase peut être l'une ou l'autre selon le contexte. Il n'existe pas de frontière décidable.

Chaque filtre est contournable par reformulation, encodage, changement de langue, découpage, ou détour narratif. Tu améliores le taux de détection, tu ne l'amènes jamais à cent pour cent.

## 5.4 Le principe de moindre capacité

C'est **la** bonne réponse architecturale, et celle qui te distinguera.

> Puisqu'on ne peut pas garantir ce qu'on **dit** au modèle, on limite ce qu'il **peut faire**.

Concrètement :

- Le modèle n'a aucun accès direct à une base de données ou à une interface de programmation.
- Chaque action est médiatisée par un outil au périmètre étroit, validé côté serveur.
- Toute action irréversible ou sensible exige une confirmation humaine.
- La sortie du modèle est traitée comme une donnée hostile : jamais interprétée comme du code, ni insérée telle quelle dans une page ou une requête.

Formulation à retenir : **une injection de prompt réussie doit rester sans conséquence.**

## 5.5 Les risques du référentiel OWASP pour les modèles de langage

Les six qui concernent directement ta passerelle :

| Risque | Ce que ça veut dire | Ton ticket |
|---|---|---|
| Injection de prompt | Détournement des instructions | AI-1 |
| Divulgation d'information sensible | Fuite de données vers le fournisseur | AI-2 |
| Traitement non sûr de la sortie | La réponse est exécutée ou insérée sans contrôle | AI-1 |
| Autonomie excessive | Le modèle a plus de pouvoir que nécessaire | IAM-3 |
| Consommation illimitée | Coût et déni de service | AI-4 |
| Fuite du prompt système | Révélation des instructions et des règles internes | AI-1 |

## 5.6 Le cas particulier des données personnelles

Deux exigences qui se contredisent : protéger les données, et conserver une réponse utile.

Le masquage par marqueurs stables résout la tension : chaque entité détectée est remplacée par un marqueur cohérent au sein d'une même session, puis restaurée dans la réponse. Le modèle raisonne sur la structure sans jamais voir la donnée réelle.

La limite à connaître et à documenter : la **réidentification par recoupement**. Un texte peut rester identifiant même sans nom, par combinaison d'éléments contextuels. Aucun masquage ne l'élimine complètement.

---

# Chapitre 6 — DevSecOps

## 6.1 Ce que le terme signifie réellement

Pas « ajouter des outils de sécurité dans la chaîne ». Cela signifie :

> Déplacer la détection au plus près du moment où le défaut est introduit, et la rendre automatique.

La justification est économique : plus un défaut est détecté tard, plus il coûte cher à corriger. Un défaut trouvé à l'écriture coûte quelques minutes ; en production, il coûte un incident, une correction urgente et une perte de confiance.

## 6.2 Les familles d'analyse

| Famille | Quand | Voit | Ne voit pas |
|---|---|---|---|
| Statique | À l'écriture | Le code source, les motifs dangereux | Le comportement réel, la configuration |
| Composition | À la construction | Les vulnérabilités connues des dépendances | Les failles de ton propre code |
| Dynamique | À l'exécution | Le comportement réel, la configuration | Le code non atteint par les tests |
| Secrets | Au commit | Les identifiants en clair | Ce qui est déjà dans l'historique |

Aucune ne remplace les autres. Elles couvrent des angles morts distincts, et c'est la raison pour laquelle on les cumule.

## 6.3 Le faux positif est le vrai sujet

Une chaîne qui remonte quatre cents alertes dont trente comptent produit un effet unique : l'équipe cesse de les lire.

La compétence de terrain n'est pas de brancher les outils. C'est de :

1. Calibrer les règles sur ton contexte réel
2. Classer les faux positifs de façon durable, jamais les ignorer silencieusement
3. Bloquer uniquement sur ce qui le mérite vraiment
4. Prévoir une dérogation tracée pour les urgences

Sans le point 4, le premier incident de production fera désactiver l'ensemble des contrôles, définitivement.

## 6.4 Chaîne d'approvisionnement logicielle

Ton application est faite à quatre-vingt-dix pour cent de code que tu n'as pas écrit. La question devient : **d'où vient ce que je déploie, et puis-je le prouver ?**

Trois artefacts :

- La **nomenclature logicielle** liste tout ce que contient ton livrable. Sans elle, une alerte sur une bibliothèque te laisse sans réponse à « suis-je concerné ? ».
- La **signature** prouve l'origine de l'artefact.
- L'**attestation** prouve un fait à son sujet : il a été construit par cette chaîne, à partir de ce commit, avec ces contrôles passés.

La distinction signature contre attestation est exactement le genre de nuance qu'on teste en entretien pour un poste senior.

---

# Chapitre 7 — Sécurité des conteneurs et de Kubernetes

## 7.1 Ce qu'est réellement un conteneur

Ce n'est pas une machine virtuelle. C'est un processus du noyau hôte, isolé par des espaces de noms et limité par des groupes de contrôle. **Le noyau est partagé.**

Conséquence directe : une faille d'évasion du noyau donne accès à l'hôte, et donc à tous les autres conteneurs. C'est pourquoi retirer les privilèges n'est pas une précaution optionnelle.

## 7.2 Les quatre contrôles qui comptent

1. **Sans utilisateur racine** — si le processus n'est pas racine, une évasion vaut beaucoup moins.
2. **Système de fichiers racine en lecture seule** — l'attaquant ne peut pas déposer ses outils.
3. **Capacités Linux retirées** — par défaut un conteneur en reçoit plusieurs dizaines dont il n'utilise aucune.
4. **Élévation de privilège interdite** — bloque le passage par les binaires à bit setuid.

## 7.3 Les secrets Kubernetes ne sont pas chiffrés

Ils sont encodés en base64, ce qui n'est pas du chiffrement. Sans chiffrement au repos activé sur le magasin de configuration du cluster, un accès à ce magasin donne tous les secrets en clair.

C'est une idée fausse extrêmement répandue. La corriger correctement en entretien est un signal fort.

## 7.4 Le refus par défaut

Réseau comme droits : **on n'ouvre que ce qui est nécessaire, on ferme tout le reste par défaut.**

Sans politique de refus par défaut, tous les modules d'un espace de noms peuvent se joindre entre eux et sortir sur Internet. Le déplacement latéral après compromission d'un seul composant devient trivial.

Et le piège pratique : une politique réseau n'est appliquée que si le greffon réseau du cluster la supporte. Sinon, elle est acceptée sans effet. D'où la règle : **une politique non vérifiée est une politique inexistante.**

## 7.5 Le contrôle d'admission

C'est le moment où le cluster peut refuser une ressource avant sa création. C'est le seul endroit où une règle devient réellement contraignante plutôt que recommandée.

Passer de « nous recommandons de ne pas exécuter en racine » à « le cluster refuse les modules en racine » est le saut de maturité qu'on attend d'un Tech Lead.

---

# Chapitre 8 — Observabilité et réponse à incident

## 8.1 Les trois piliers, et ce qu'ils servent

| Pilier | Répond à | Coût |
|---|---|---|
| Métriques | Est-ce que ça va mal ? | Faible |
| Traces | Où exactement ? | Moyen |
| Journaux | Que s'est-il passé précisément ? | Élevé |

L'ordre d'investigation est toujours le même : métrique, puis trace, puis journal. Commencer par les journaux, c'est chercher une aiguille sans savoir dans quelle botte.

## 8.2 Jamais la moyenne

Une latence moyenne de 200 millisecondes peut recouvrir quatre-vingt-quinze pour cent des appels à 50 millisecondes et cinq pour cent à 3 secondes. La moyenne masque exactement la population que tu cherches.

Raisonne en centiles : le cinquantième pour le ressenti courant, le quatre-vingt-quinzième et le quatre-vingt-dix-neuvième pour les cas dégradés.

## 8.3 La fatigue d'alerte

Une alerte qui se déclenche sans exiger d'action sera ignorée, puis désactivée. Trois règles :

1. Toute alerte exige une action humaine, sinon c'est une métrique.
2. Toute alerte porte un mode opératoire.
3. Une alerte bruyante se corrige dans la semaine, ou se supprime.

## 8.4 Les phases de la réponse à incident

**Préparation, détection, confinement, éradication, rétablissement, retour d'expérience.**

Deux points de vigilance :

- **Confiner avant d'éradiquer.** L'instinct pousse à corriger tout de suite. On arrête d'abord l'hémorragie.
- **Le retour d'expérience se fait sans recherche de faute.** Une culture qui cherche un coupable obtient des incidents dissimulés, et perd toute capacité d'apprentissage.

---

# Chapitre 9 — La posture Tech Lead

## 9.1 La différence, en une phrase

> Un développeur confirmé choisit une solution. Un Tech Lead explique pourquoi il a écarté les autres.

## 9.2 Le registre de décision d'architecture

Un document court, par décision structurante :

- **Contexte** — le problème, les contraintes
- **Options** — celles réellement envisagées
- **Décision** — celle retenue
- **Raison** — pourquoi elle, pourquoi pas les autres
- **Conséquences** — ce que ça coûte, y compris le négatif

C'est ce qui empêche l'équipe de rejouer le même débat dans six mois, et c'est un artefact que peu de candidats savent produire.

## 9.3 Ce qui ne s'improvise pas en entretien

Prépare une réponse solide à ces cinq questions. Elles tombent presque toujours :

1. Quel est le risque que tu as décidé de **ne pas** traiter, et pourquoi ?
2. Quelle est la limite de ta solution de filtrage d'injection ?
3. Pourquoi une autorité intermédiaire plutôt qu'une racine qui signe directement ?
4. Comment tu arbitres entre sécurité et adoption par les utilisateurs ?
5. Qu'est-ce qui casserait si ta passerelle tombait ?

La cinquième est la plus révélatrice. Un point de contrôle unique est aussi un point de défaillance unique. Avoir pensé au mode dégradé — refuser tout, ou laisser passer sans contrôle — et savoir défendre son choix, c'est exactement le niveau attendu.

---

# Ce que tu dois savoir refaire sans notes

Avant d'attaquer la technique, vérifie que tu peux expliquer à voix haute, pendant trois minutes chacun :

- [ ] La différence entre OAuth 2.0 et OpenID Connect
- [ ] Les cinq validations d'un jeton et l'attaque par confusion d'algorithme
- [ ] Pourquoi la racine d'une autorité de certification reste hors ligne
- [ ] Pourquoi des certificats à durée de vie courte remplacent la révocation
- [ ] Pourquoi l'injection de prompt est structurelle et non corrigeable
- [ ] Ce qu'est le principe de moindre capacité
- [ ] Pourquoi les secrets Kubernetes ne sont pas chiffrés par défaut
- [ ] Pourquoi on raisonne en centiles et jamais en moyenne

Si un point résiste, reviens dessus avant le ticket correspondant. Le construire sans le comprendre produit une démonstration qui s'effondre à la première question.

---

# Chapitre 10 — Simulation d'entretien

Vingt-cinq questions réellement posées pour des postes de Tech Lead sécurité. Formule ta réponse à voix haute **avant** d'ouvrir la correction. Lire la réponse sans avoir tenté la sienne ne produit aucun apprentissage.

Le format attendu à l'oral : une phrase de réponse directe, puis la nuance, puis un exemple concret. Jamais l'inverse.

## Identité et accès

<details><summary>1. Quelle est la différence entre OAuth 2.0 et OpenID Connect ?</summary>

OAuth 2.0 est un protocole d'autorisation déléguée : il permet à une application d'agir sur une ressource au nom d'un utilisateur, sans jamais dire qui est cet utilisateur. OpenID Connect est la couche d'identité construite au-dessus : elle ajoute le jeton d'identité, qui répond à la question « qui ».

La conséquence pratique : utiliser OAuth 2.0 seul pour authentifier est une erreur de conception courante, parce que le jeton d'accès ne garantit rien sur l'identité du porteur.
</details>

<details><summary>2. Un jeton a une signature valide. Est-ce suffisant pour l'accepter ?</summary>

Non. La signature prouve seulement que le jeton a été émis par une autorité que je connais. Il me faut encore vérifier l'émetteur, l'audience, l'expiration, et imposer l'algorithme depuis ma configuration.

Le cas concret : un jeton d'identité destiné au client possède une signature parfaitement valide, mais son audience n'est pas mon service. L'accepter, c'est accepter un jeton qui ne m'était pas destiné.
</details>

<details><summary>3. Explique l'attaque par confusion d'algorithme.</summary>

Le vérificateur lit l'algorithme dans l'en-tête du jeton, donc dans une donnée fournie par l'attaquant. Si le jeton annonce un algorithme symétrique, une bibliothèque naïve utilise la clé publique RSA comme secret partagé. Or cette clé est publique : l'attaquant peut donc forger un jeton que le service acceptera.

La leçon générale dépasse les jetons : on ne demande jamais à l'entrée hostile comment il faut la vérifier.
</details>

<details><summary>4. Comment révoques-tu un jeton déjà émis ?</summary>

On ne le révoque pas. C'est le prix du sans-état : la vérification est locale, donc l'émetteur n'est plus consulté.

Trois réponses possibles : durée de vie courte, introspection à chaque appel, ou liste de révocation en cache. J'ai retenu la durée de vie courte, entre cinq et quinze minutes, parce que l'introspection place Keycloak sur le chemin critique de chaque requête — latence ajoutée et dépendance forte.
</details>

<details><summary>5. Pourquoi séparer point de décision et point d'application ?</summary>

Pour que la politique d'autorisation soit évaluée à un seul endroit, testable isolément et modifiable sans toucher au code applicatif.

Le symptôme du contraire : des contrôles dispersés dans quinze contrôleurs. Le jour où la règle change, on en oublie un, et c'est celui-là qui devient la faille.
</details>

## Cryptographie et infrastructure à clés publiques

<details><summary>6. Pourquoi une autorité intermédiaire plutôt qu'une racine qui signe directement ?</summary>

Parce que la compromission de la racine est irréparable : il faut redistribuer le nouveau magasin de confiance à tous les clients. La racine reste donc hors ligne et ne sert que quelques fois par an.

L'intermédiaire, elle, travaille au quotidien. Compromise, elle se révoque et se remplace sans que le magasin de confiance des clients ne bouge.
</details>

<details><summary>7. Comment gères-tu la révocation de certificats ?</summary>

Je ne la gère pas, je l'évite. Les certificats de service vivent vingt-quatre à soixante-douze heures et sont renouvelés automatiquement.

Un renouvellement fréquent est une révocation par expiration : la fenêtre d'exploitation d'une clé volée est bornée par la durée de vie, sans avoir à maintenir une liste de révocation ni un service de vérification en ligne qui deviendrait lui-même critique.
</details>

<details><summary>8. Qu'est-ce qu'un module matériel de sécurité apporte qu'un fichier de clé n'apporte pas ?</summary>

La clé privée ne sort jamais du module. On ne lui envoie pas la clé, on lui envoie la donnée à signer et il renvoie la signature.

Conséquence : la compromission du serveur applicatif ne donne pas la clé, elle donne seulement la capacité de signer pendant la durée de l'accès. Cet accès se coupe immédiatement, sans changer la clé ni réémettre les certificats.
</details>

<details><summary>9. TLS mutuel ou jeton : lequel est le plus fort, et pourquoi ?</summary>

Le TLS mutuel, parce que l'identité est établie au niveau du transport, avant que la moindre ligne de mon code ne s'exécute. Un appelant non autorisé est rejeté pendant la négociation.

Mais attention : présenter un certificat valide relève de l'authentification. Décider que ce porteur a le droit d'appeler ce point d'accès reste de l'autorisation, et cela reste à ma charge. Un maillage en TLS mutuel sans autorisation signifie que tout service peut appeler tous les autres.
</details>

<details><summary>10. Pourquoi ne pas utiliser la même clé pour chiffrer et pour signer ?</summary>

Parce que ce sont deux propriétés différentes — confidentialité d'un côté, intégrité et origine de l'autre — et que leurs cycles de vie divergent. Une clé de chiffrement doit être conservée pour déchiffrer l'ancien ; une clé de signature doit pouvoir être détruite.

La séparation est inscrite dans les extensions d'usage du certificat, et c'est un point vérifié en audit.
</details>

## Sécurité des modèles de langage

<details><summary>11. Comment bloques-tu l'injection de prompt ?</summary>

Je ne la bloque pas complètement, et personne ne le peut. Un modèle de langage ne distingue pas l'instruction de la donnée : elles arrivent dans la même fenêtre de contexte, sous la même forme. C'est une injection par conception, pas un défaut d'implémentation.

Je réduis la probabilité par filtrage en couches, et surtout je réduis l'impact par le principe de moindre capacité : le modèle n'a aucune action sensible directe, chaque outil a un périmètre étroit validé côté serveur, et toute action irréversible exige une confirmation humaine. L'objectif n'est pas qu'aucune injection ne réussisse, c'est qu'une injection réussie reste sans conséquence.
</details>

<details><summary>12. Quelle est la différence entre injection directe et indirecte, et laquelle t'inquiète le plus ?</summary>

Directe, l'utilisateur écrit lui-même l'instruction malveillante. Indirecte, elle est dissimulée dans un contenu que le système va lire : un document, une page, un ticket.

L'indirecte m'inquiète davantage, pour trois raisons : l'utilisateur est innocent, la charge utile voyage dans un flux légitime, et le filtrage de l'entrée utilisateur ne la voit jamais passer.
</details>

<details><summary>13. La réponse du modèle est-elle une donnée de confiance ?</summary>

Non, et c'est l'erreur la plus répandue. La réponse franchit une frontière de confiance en provenance d'un système externe influençable par l'entrée.

Elle ne doit donc jamais être interprétée comme du code, insérée telle quelle dans une page, ni utilisée pour construire une requête. C'est l'origine de la majorité des failles réelles observées sur ces systèmes.
</details>

<details><summary>14. Comment protèges-tu les données personnelles sans détruire la qualité des réponses ?</summary>

Masquage par marqueurs stables : chaque entité détectée est remplacée par un marqueur cohérent au sein de la session, puis restaurée dans la réponse rendue à l'utilisateur. Le modèle raisonne sur la structure sans voir la donnée réelle.

Je mesure la dégradation induite, parce qu'une sécurité qui rend l'outil inutilisable sera contournée, pas adoptée. Et je documente la limite : la réidentification par recoupement reste possible, aucun masquage ne l'élimine.
</details>

<details><summary>15. Qu'est-ce que l'autonomie excessive ?</summary>

C'est donner au modèle plus de pouvoir que la tâche n'en exige : accès direct à une base, droit d'écriture là où la lecture suffirait, outils au périmètre trop large.

C'est le risque qui transforme une injection anodine en incident réel. La mitigation n'est pas un filtre, c'est une réduction de périmètre.
</details>

## DevSecOps et chaîne de livraison

<details><summary>16. Ta chaîne remonte quatre cents alertes. Que fais-tu ?</summary>

Je ne les corrige pas, je les trie. Quatre cents alertes non triées produisent un seul effet : l'équipe cesse de les lire.

Je calibre les règles sur le contexte réel, je classe les faux positifs de façon durable plutôt que de les ignorer, je ne bloque que sur ce qui le mérite, et je prévois une dérogation tracée et nominative. Sans cette soupape, la première urgence de production fera désactiver l'ensemble des contrôles, définitivement.
</details>

<details><summary>17. Quelle est la différence entre une signature et une attestation ?</summary>

La signature prouve l'origine de l'artefact : il vient bien de moi et n'a pas été modifié.

L'attestation prouve un fait à son sujet : il a été construit par cette chaîne, à partir de ce commit, avec ces contrôles passés. La signature répond à « qui », l'attestation répond à « comment ».
</details>

<details><summary>18. À quoi sert vraiment une nomenclature logicielle ?</summary>

À répondre à une seule question, mais la plus urgente : quand une faille critique est publiée sur une bibliothèque, suis-je concerné, et où ?

Sans elle, la réponse prend des jours d'inventaire manuel. Avec elle, elle prend une requête.
</details>

<details><summary>19. Pourquoi cumuler analyse statique, dynamique et de composition ?</summary>

Parce que leurs angles morts ne se recouvrent pas. La statique voit le code mais pas la configuration ni le comportement réel. La dynamique voit le comportement mais seulement sur les chemins effectivement empruntés. La composition voit les failles connues des dépendances mais rien de mon propre code.

Aucune ne remplace les autres, et prétendre le contraire est un raccourci commercial.
</details>

## Conteneurs, infrastructure, exploitation

<details><summary>20. Les secrets Kubernetes sont-ils chiffrés ?</summary>

Non, encodés en base64, ce qui n'est pas du chiffrement. Sans chiffrement au repos explicitement activé sur le magasin de configuration du cluster, un accès à ce magasin donne tous les secrets en clair.

C'est une idée fausse très répandue, et elle conduit à des architectures où l'on croit protéger ce qu'on expose.
</details>

<details><summary>21. Pourquoi un conteneur sans privilège change-t-il quelque chose ?</summary>

Parce qu'un conteneur n'est pas une machine virtuelle : c'est un processus isolé par des espaces de noms, sur un noyau partagé. Une évasion donne accès à l'hôte, donc à tous les autres conteneurs.

Exécuter sans utilisateur racine, avec un système de fichiers en lecture seule et sans capacité Linux superflue, ne supprime pas le risque d'évasion, mais réduit fortement ce que l'attaquant peut en faire.
</details>

<details><summary>22. Tu écris une politique réseau. Comment sais-tu qu'elle s'applique ?</summary>

Je la teste, depuis un conteneur temporaire, en vérifiant que les flux non autorisés échouent réellement.

C'est nécessaire parce qu'une politique réseau n'est appliquée que si le greffon réseau du cluster la prend en charge. Sinon elle est acceptée sans effet, et l'on croit protégé un espace de noms entièrement ouvert.
</details>

<details><summary>23. Pourquoi raisonner en centiles plutôt qu'en moyenne ?</summary>

Parce que la moyenne masque précisément la population qui m'intéresse. Deux cents millisecondes de moyenne peuvent recouvrir quatre-vingt-quinze pour cent des appels à cinquante millisecondes et cinq pour cent à trois secondes.

Ces cinq pour cent sont mes utilisateurs mécontents, et ils sont invisibles dans la moyenne.
</details>

## Posture et architecture

<details><summary>24. Qu'est-ce qui casse si ta passerelle tombe ?</summary>

Tout. Un point de contrôle unique est aussi un point de défaillance unique, et c'est le prix assumé de la médiation.

J'ai donc choisi le mode dégradé explicitement : refus de service plutôt que passage sans contrôle. Une passerelle qui laisse passer en cas de panne annule sa propre raison d'être. Je compense par de la redondance, des sondes correctement réglées et un objectif de disponibilité affiché.
</details>

<details><summary>25. Quel risque as-tu décidé de ne pas traiter ?</summary>

L'exfiltration par injection indirecte via un document fourni. Le coût d'un traitement fiable est disproportionné au regard du risque à ce stade.

Compensation : journalisation intégrale et alerte sur volume de sortie anormal. Risque accepté et signé par le responsable désigné.

C'est la question la plus révélatrice de la série. Un modèle de menace sans risque accepté est un modèle de menace que personne n'a vraiment terminé.
</details>

---

# Glossaire français et anglais

La documentation technique et les entretiens en contexte international emploient les termes anglais. Tu dois tenir les deux.

| Français | Anglais | À retenir |
|---|---|---|
| Autorité de certification | Certificate Authority | Émet et signe les certificats |
| Chaîne de confiance | Chain of trust | Racine, intermédiaire, feuille |
| Nom alternatif du sujet | Subject Alternative Name | Le champ réellement vérifié ; le nom commun est obsolète |
| Contraintes de base | Basic Constraints | Autorise ou non la signature d'autres certificats |
| Liste de révocation | Certificate Revocation List | Approche historique, lourde |
| Vérification en ligne | OCSP | Latence et fuite de confidentialité |
| Durée de vie courte | Short-lived certificates | L'approche moderne |
| TLS mutuel | mutual TLS | Le serveur exige aussi un certificat client |
| Confidentialité persistante | Forward secrecy | Une clé compromise ne déchiffre pas le passé |
| Module matériel de sécurité | Hardware Security Module | La clé ne sort jamais |
| Service de gestion de clés | Key Management Service | Version gérée, adossée au matériel |
| Empreinte | Hash / digest | Intégrité seule |
| Jeton d'accès | Access token | Ce que je peux faire |
| Jeton d'identité | ID token | Qui je suis |
| Portée | Scope | Périmètre demandé |
| Revendication | Claim | Champ du jeton |
| Audience | Audience | À qui le jeton est destiné |
| Émetteur | Issuer | Qui l'a émis |
| Tolérance d'horloge | Clock skew | Quelques secondes, jamais plus |
| Point de décision | Policy Decision Point | Évalue la politique |
| Point d'application | Policy Enforcement Point | Applique la décision |
| Moindre privilège | Least privilege | Le strict nécessaire |
| Moindre capacité | Least agency | Limiter ce que le modèle peut faire |
| Injection de prompt | Prompt injection | Directe ou indirecte |
| Fenêtre de contexte | Context window | Instructions et données mélangées |
| Masquage | Redaction | Remplacement par marqueurs |
| Réidentification | Re-identification | Par recoupement, jamais éliminée |
| Frontière de confiance | Trust boundary | Le niveau de confiance y change |
| Modélisation de menaces | Threat modeling | STRIDE sur un diagramme de flux |
| Risque résiduel | Residual risk | Accepté, compensé, signé |
| Analyse statique | SAST | Le code |
| Analyse dynamique | DAST | Le comportement |
| Analyse de composition | SCA | Les dépendances |
| Nomenclature logicielle | SBOM | Ce que contient le livrable |
| Chaîne d'approvisionnement | Supply chain | D'où vient ce que je déploie |
| Attestation | Attestation | Un fait prouvé sur l'artefact |
| Portail qualité | Quality gate | Le point de blocage |
| Dérogation | Waiver / exception | Tracée, nominative, datée |
| Contrôle d'admission | Admission control | Le cluster refuse avant création |
| Refus par défaut | Default deny | Tout est fermé, on ouvre au cas par cas |
| Espace de noms | Namespace | Isolation logique |
| Contexte de sécurité | Security context | Privilèges du conteneur |
| Déplacement latéral | Lateral movement | De proche en proche après compromission |
| Seau à jetons | Token bucket | Limitation de débit |
| Disjoncteur | Circuit breaker | Coupe pour protéger |
| Centile | Percentile | Jamais la moyenne |
| Fatigue d'alerte | Alert fatigue | L'alerte ignorée puis désactivée |
| Mode opératoire | Runbook | Quoi faire quand ça sonne |
| Retour d'expérience | Post-mortem | Sans recherche de faute |
| Registre de décision | Architecture Decision Record | Pourquoi on a écarté les autres options |
