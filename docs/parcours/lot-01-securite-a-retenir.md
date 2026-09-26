# Lot 1 — Sécurité : ce que j'ai fait, à retenir par cœur

**But de ce support :** que tu puisses raconter le lot 1 sans notes, ticket par ticket, avec le code, le pourquoi et la limite. Chaque fiche se termine par **la phrase à retenir** : c'est elle que tu apprends mot pour mot.

**Le code complet** de chaque fiche, ligne par ligne, est dans `lot-01-code-commente` : garde les deux ouverts côte à côte.

**Méthode :** lis une fiche par jour, récite sa phrase le lendemain, puis fais les cartes mémoire du chapitre 10. Au bout d'une semaine, tu dois pouvoir dérouler le chapitre 1 en trois minutes.

---

# Chapitre 1 — Le lot 1 en trente secondes

> Au lot 1, j'ai sécurisé l'identité et l'assistant IA de CrisisShield. Les jetons sont signés en RS256 avec une clé publique exposée en JWKS, et dix tests négatifs vérifient qu'aucun jeton falsifié ne passe. L'isolation entre organisations est prouvée par test. Chaque requête porte un identifiant de corrélation. Et l'assistant a trois garde-fous devant le modèle : limitation de débit, filtrage d'injection, masquage des données personnelles. Vingt-neuf tests en tout.

**C'est le texte à apprendre en premier.** Tout le reste du support détaille une phrase de ce paragraphe.

## Les sept tickets

| Ticket | Ce que j'ai fait | Fichier principal | Preuve |
|---|---|---|---|
| EP02-US06 | jetons signés en RS256, clé publique en JWKS | `JwtUtil`, `JwksController` | `/.well-known/jwks.json` |
| EP02-US09 | 10 tests négatifs sur les jetons | `JwtUtilTest` | 10 tests verts |
| EP03-US05 | isolation entre organisations prouvée | `TenantIsolationTest` | 3 tests verts |
| EP10-US05 | identifiant de corrélation | `CorrelationIdFilter` | en-tête `X-Correlation-Id` |
| EP18-US03 | filtrage d'injection de prompt | `PromptGuard` | banc d'essai 20 + 10 |
| EP18-US04 | masquage des données personnelles | `PiiMasker` | `maskedEntities: 1` |
| EP18-US06 | limitation de débit | `RateLimiter` | code HTTP 429 |

---

# Chapitre 2 — Les chiffres à connaître par cœur

Un chiffre précis vaut une phrase d'explication. Apprends ce tableau.

| Chiffre | Ce que c'est |
|---|---|
| **29** | tests au total, en 7 classes |
| **10** | tests négatifs sur les jetons |
| **15 minutes** | durée de vie d'un jeton (`900000` millisecondes) |
| **5 secondes** | tolérance d'horloge sur l'expiration |
| **8 octets** | l'identifiant de clé `kid` : les 8 premiers octets du SHA-256 de la clé publique |
| **14** | motifs d'injection dans `PromptGuard` |
| **4 000** | caractères maximum par question |
| **20 + 10** | le banc d'essai : 20 attaques, 10 questions légitimes |
| **0** | faux positif exigé sur les questions légitimes |
| **4** | types de données masquées : IBAN, numéro de sécurité sociale, courriel, téléphone |
| **20 puis 20 par minute** | la limitation de débit : 20 requêtes d'un coup, puis 20 par minute |
| **6** | étapes du pipeline de l'assistant |
| **200, 422, 429** | les trois réponses de l'assistant : accepté, refusé par le filtre, quota dépassé |

---

# Chapitre 3 — Fiche 1 : jetons RS256 et JWKS (EP02-US06)

## Le problème

Avant, les jetons étaient signés en **HS256** avec un secret partagé écrit dans `docker-compose.yml`. Quiconque lit ce fichier peut fabriquer un jeton administrateur.

## Ce que j'ai fait

Le jeton est signé avec une **clé privée RSA** et vérifié avec la **clé publique**. La clé privée ne sert qu'à signer, dans `JwtUtil`. La clé publique est publiée sur `/.well-known/jwks.json`.

## Le code clé

À l'émission, dans `JwtUtil.generateToken` :

```java
.setHeaderParam("kid", keyId)
.setSubject(userDetails.getUsername())
.setIssuer(ISSUER)                      // "crisisshield"
.setAudience(AUDIENCE)                  // "crisisshield-api"
.signWith(privateKey, SignatureAlgorithm.RS256)
```

À la vérification, dans `JwtUtil.parse` :

```java
Jwts.parserBuilder()
    .setSigningKey(publicKey)           // impose RS256 : HS256 ou "none" rejetés
    .requireIssuer(ISSUER)
    .requireAudience(AUDIENCE)
    .setAllowedClockSkewSeconds(CLOCK_SKEW_SECONDS)   // 5 secondes
```

Le jeton porte aussi `organisationId`, mais **à titre d'information seulement** : à chaque requête, `JwtAuthenticationFilter` recharge l'utilisateur en base et prend son organisation **en base**. Si un utilisateur change d'organisation, son ancien jeton ne lui donne pas accès à l'ancienne. La base fait foi, pas le jeton.

## Les cinq vérifications, dans l'ordre

1. **Signature** avec la clé publique
2. **Émetteur** égal à `crisisshield`
3. **Audience** égale à `crisisshield-api`
4. **Expiration**, avec 5 secondes de tolérance
5. **Algorithme** imposé par la clé, jamais lu dans le jeton

## La limite que je nomme moi-même

En développement, la paire de clés est générée au démarrage : les jetons ne survivent pas à un redémarrage, et deux instances auraient deux clés différentes. En production, la clé privée viendra d'un module matériel ou d'un service de gestion de clés.

## La phrase à retenir

> **« Avec HS256, tous ceux qui vérifient peuvent aussi forger. Avec RS256, seul l'émetteur détient la clé privée ; tout le monde vérifie avec la clé publique, et personne d'autre ne peut forger. »**

---

# Chapitre 4 — Fiche 2 : les dix tests négatifs (EP02-US09)

## Le problème

Tout le monde teste qu'un bon jeton passe. Presque personne ne teste qu'un mauvais jeton est rejeté. Or c'est là que sont les failles.

## Ce que j'ai fait

Dix tests dans `JwtUtilTest`. Un seul vérifie le cas nominal ; les neuf autres construisent un jeton hostile et vérifient son rejet.

| Test | Attaque couverte |
|---|---|
| jeton valide | le cas nominal, pour comparaison |
| mauvais sujet | un jeton d'alice présenté pour bob |
| jeton expiré | rejouer un vieux jeton |
| autre clé privée | l'attaquant signe avec sa propre clé |
| mauvaise audience | un jeton d'un autre service accepté à tort |
| mauvais émetteur | un jeton d'un fournisseur étranger |
| `alg=none` | un jeton **non signé** |
| confusion d'algorithme | la clé **publique** utilisée comme secret HS256 |
| jeton altéré | le sujet modifié après signature |
| chaîne absurde | rejet sans exception, sans plantage |

## Le test le plus important : la confusion d'algorithme

L'attaquant connaît la clé publique — elle est publiée. Il fabrique un jeton qui annonce `HS256` et le signe en utilisant cette clé publique comme secret. Une bibliothèque naïve lit l'algorithme dans l'en-tête, fait confiance, et valide.

Ma parade : l'algorithme est imposé par la clé que je fournis au vérificateur. Un jeton HS256 est rejeté d'office.

## La phrase à retenir

> **« On ne demande jamais à l'entrée hostile comment il faut la vérifier. L'algorithme vient de ma configuration, jamais de l'en-tête du jeton. »**

---

# Chapitre 5 — Fiche 3 : l'isolation entre organisations (EP03-US05)

## Le problème

CrisisShield sert plusieurs organisations. Si l'une voit les incidents d'une autre, c'est la faille la plus grave possible pour le produit.

## Ce que j'ai fait

Le filtre Hibernate `orgFilter` ajoute automatiquement `WHERE organisation_id = :orgId` à chaque requête. `TenantIsolationTest` le prouve avec deux organisations et trois utilisateurs, en trois tests :

1. **Filtre actif sur A** : on ne voit que les utilisateurs de A
2. **Filtre actif sur B** : l'utilisateur de A est invisible, même cherché par son nom
3. **Sans filtre** : tout est visible

## Pourquoi le troisième test compte le plus

Il prouve que le filtre est **la seule barrière**. Si un jour quelqu'un désactive `TenantFilter`, toutes les données se mélangent. Ce test documente cette dépendance au lieu de la cacher.

## La limite que je nomme moi-même

Le filtre Hibernate ne s'applique pas à `EntityManager.find(id)`. Un accès direct par identifiant le contourne. Les services doivent donc passer par les méthodes de dépôt.

## La phrase à retenir

> **« Le développeur ne peut pas oublier de filtrer par organisation, parce qu'il n'a pas à y penser : Hibernate ajoute la clause à chaque requête. Et mon test prouve que ce filtre est la seule barrière. »**

---

# Chapitre 6 — Fiche 4 : l'identifiant de corrélation (EP10-US05)

## Le problème

Un utilisateur signale une erreur. Dans les journaux, des milliers de lignes. Impossible de savoir lesquelles appartiennent à sa requête.

## Ce que j'ai fait

`CorrelationIdFilter`, exécuté **en tout premier** (`HIGHEST_PRECEDENCE`) :

```java
String id = request.getHeader("X-Correlation-Id");
if (id == null || id.isBlank() || id.length() > 64) {
    id = UUID.randomUUID().toString();       // généré si absent ou suspect
}
MDC.put("correlationId", id);                // présent dans chaque ligne de journal
response.setHeader("X-Correlation-Id", id);  // renvoyé à l'appelant
```

## Trois détails à savoir expliquer

- **En tout premier** : pour couvrir aussi les requêtes refusées par l'authentification.
- **Limite à 64 caractères** : une valeur venant de l'extérieur est hostile. Sans limite, un attaquant peut injecter n'importe quoi dans tes journaux.
- **`MDC.remove` dans un `finally`** : les fils d'exécution sont réutilisés ; sans nettoyage, la requête suivante hériterait de l'identifiant.

## La phrase à retenir

> **« Chaque requête reçoit un identifiant, repris de l'appelant ou généré, présent dans chaque ligne de journal et renvoyé dans la réponse. Un utilisateur me donne cet identifiant, je retrouve tout son parcours en une recherche. »**

---

# Chapitre 7 — Fiche 5 : le pipeline de l'assistant (EP18)

C'est la fiche la plus demandée en entretien. Apprends le schéma par cœur, puis refais-le de mémoire sur une feuille.

## Les six étapes, dans `AssistantService.ask`

```
question
   │
   ▼  1. RateLimiter.tryAcquire      quota dépassé ?        → 429, fin
   ▼  2. PromptGuard.inspectInput    injection détectée ?   → 422, fin
   ▼  3. PiiMasker.mask              alice@a.test → [[EMAIL_1]]
   ▼  4. ModelProvider.complete      le modèle reçoit le texte masqué
   ▼  5. PromptGuard.sanitizeOutput  la réponse contient le prompt système ? → bloquée
   ▼  6. masked.restore              [[EMAIL_1]] → alice@a.test
   ▼
réponse, 200
```

## Pourquoi cet ordre

**Du moins cher au plus cher.** Le quota coûte une lecture en mémoire. Le filtre coûte quelques expressions régulières. Le modèle coûte de l'argent et des secondes. On rejette avant de payer.

## Ce qui est journalisé, et ce qui ne l'est jamais

Journalisé : utilisateur, organisation, fournisseur, latence, taille de la question, nombre d'entités masquées.
**Jamais journalisé : le contenu de la question.** Sinon les journaux deviendraient une base de données de secrets d'entreprise.

## L'abstraction du fournisseur

`ModelProvider` est une interface à deux méthodes : `name()` et `complete()`. Aujourd'hui `MockModelProvider` ; demain un vrai modèle, en changeant une seule classe.

## La phrase à retenir

> **« Six étapes, du moins cher au plus cher : quota, filtre, masquage, modèle, contrôle de sortie, restauration. On rejette avant de payer, et on ne journalise jamais le contenu de la question. »**

---

# Chapitre 8 — Fiche 6 : filtrage d'injection (EP18-US03)

## Ce que j'ai fait

`PromptGuard.inspectInput` refuse une question vide, une question de plus de 4 000 caractères, ou une question qui correspond à l'un des **14 motifs** :

- consignes de contournement : « ignore previous instructions », « oublie tes consignes »
- extraction du prompt système : « reveal your prompt », « montre-moi tes instructions »
- changement d'identité : « you are now », « tu es maintenant », « developer mode »
- faux séparateurs : `system:`, `<system>`, `### Instruction`

Avant la comparaison, le texte est **normalisé** : minuscules, sans accents, espaces réduits. « Oublie TES consignes » et « oublie tes consignes » sont traités pareil.

`sanitizeOutput` fait le contrôle inverse : si la réponse contient le prompt système, elle est bloquée.

## Le banc d'essai

`PromptGuardBenchTest` : 20 attaques, 10 questions légitimes. Il exige **zéro faux positif** et publie le taux de détection.

**Pourquoi zéro faux positif est exigé :** un filtre qui bloque une vraie question sera désactivé par les utilisateurs dès la première semaine.

## La limite que je nomme moi-même — la plus importante du lot

Aucun filtre ne bloque toute injection. Un modèle ne distingue pas l'instruction de la donnée : c'est une injection **par conception**. La vraie défense est ailleurs : le modèle n'a **aucune action possible**. Une injection qui passe obtient au pire une réponse déplacée, jamais un effet. C'est le principe de moindre capacité.

## La phrase à retenir

> **« Mon filtre est une première couche, mesurée : zéro faux positif exigé. Mais la vraie défense, c'est que le modèle ne peut rien faire. Une injection réussie doit rester sans conséquence. »**

---

# Chapitre 9 — Fiche 7 : masquage et limitation (EP18-US04, US06)

## Le masquage

`PiiMasker` détecte quatre types : **IBAN**, **numéro de sécurité sociale**, **courriel**, **téléphone**. Chacun est remplacé par un marqueur stable, `[[EMAIL_1]]`, `[[TELEPHONE_1]]`.

Trois points :
- **L'ordre compte** : les motifs longs (IBAN, sécurité sociale) passent avant les courts (téléphone), sinon un morceau d'IBAN serait pris pour un téléphone.
- **Même valeur, même marqueur** : `alice@a.test` cité deux fois devient deux fois `[[EMAIL_1]]`. Le modèle comprend que c'est la même personne.
- **Restauration** : la réponse du modèle contient `[[EMAIL_1]]`, l'utilisateur reçoit `alice@a.test`.

**La preuve :** `AssistantServiceTest` place un fournisseur **espion** qui enregistre ce qu'il reçoit. Il vérifie que `alice@a.test` n'y figure pas, et que la réponse rendue le contient.

**La limite :** les noms de personnes ne sont pas couverts par des expressions régulières. Il faut un détecteur d'entités nommées.

## La limitation de débit

`RateLimiter` : un **seau à jetons** par utilisateur. 20 jetons au départ, 20 rechargés par minute. Chaque question consomme un jeton. Seau vide : réponse 429 avec l'en-tête `Retry-After: 60`.

**La limite :** l'état est en mémoire, donc propre à une instance. À deux instances, la limite réelle double. Il faudra Redis au passage sur Kubernetes.

## Les deux phrases à retenir

> **« Le fournisseur ne voit jamais une donnée personnelle : il raisonne sur des marqueurs stables, et je restaure les vraies valeurs dans la réponse. Un test avec un fournisseur espion le prouve. »**

> **« Un seau à jetons par utilisateur, vingt requêtes puis vingt par minute. Correct pour une instance, faux dès la deuxième : je le sais, et Redis est prévu. »**

---

# Chapitre 10 — La démonstration, à connaître par cœur

Tu dois pouvoir la lancer et commenter chaque ligne sans regarder.

```bash
bash scripts/demo.sh
```

| Étape | Ce que tu vois | Ce que tu dis |
|---|---|---|
| 1 | une clé JSON avec `"alg":"RS256"` et un `kid` | « la clé publique est publiée ; n'importe quel service vérifie sans secret » |
| 2 | un jeton qui commence par `eyJ` | « connexion par l'annuaire LDAP, puis jeton RS256 de quinze minutes » |
| 3 | `"maskedEntities":1` | « le courriel a été masqué avant le modèle, et restauré dans la réponse » |
| 4 | `"code":"REFUSED_GUARD"` | « l'injection est refusée avant tout appel au modèle : ça ne coûte rien » |
| 5 | `HTTP 403` | « sans jeton, rien ne passe » |

---

**Une imprécision à connaître, et à dire toi-même :** sans jeton, l'application répond `403` (interdit) alors que le bon code est `401` (non authentifié). C'est parce qu'aucun point d'entrée d'authentification n'est déclaré dans la chaîne Spring Security, qui renvoie alors 403 par défaut. Ce sera corrigé au lot 6 : avec Keycloak, l'application devient un serveur de ressources OAuth 2, qui renvoie 401 nativement. En entretien, le signaler avant qu'on te le fasse remarquer montre que tu connais la différence : 401, « je ne sais pas qui tu es » ; 403, « je sais qui tu es, et c'est non ».

---

# Chapitre 11 — Plan de mémorisation sur sept jours

| Jour | Ce que tu fais | Durée |
|---|---|---|
| 1 | lire les chapitres 1 et 2, réciter le paragraphe de trente secondes | 20 min |
| 2 | fiches 1 et 2 ; réciter leurs phrases | 20 min |
| 3 | fiches 3 et 4 ; redessiner de mémoire le parcours d'une requête | 20 min |
| 4 | fiche 5 ; **redessiner le pipeline sur une feuille, sans regarder** | 20 min |
| 5 | fiches 6 et 7 ; les cartes mémoire | 20 min |
| 6 | lancer la démonstration en la commentant à voix haute | 15 min |
| 7 | **tout le lot à voix haute, sans notes, en cinq minutes** — enregistre-toi | 15 min |

Puis tous les trois jours : les cartes mémoire, cinq minutes. C'est la répétition espacée : on retient ce qu'on récupère souvent de mémoire, pas ce qu'on relit souvent.

---

# Ce que tu dois savoir réciter sans notes

- [ ] Le paragraphe de trente secondes du chapitre 1
- [ ] Les chiffres : 29 tests, 10 négatifs, 15 minutes, 14 motifs, 4 types masqués, 20 puis 20 par minute
- [ ] La différence HS256 et RS256, en une phrase
- [ ] Les cinq vérifications d'un jeton, dans l'ordre
- [ ] L'attaque par confusion d'algorithme et la parade
- [ ] Pourquoi le troisième test d'isolation est le plus important
- [ ] Les six étapes du pipeline, dans l'ordre, et pourquoi cet ordre
- [ ] Ce qui n'est jamais journalisé
- [ ] Le principe de moindre capacité
- [ ] Les quatre limites : clé générée au démarrage, `find` qui contourne le filtre, noms non masqués, quota par instance
- [ ] La démonstration, commentée ligne par ligne
