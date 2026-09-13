# CrisisShield — pourquoi ça ne démarrait pas

Cinq causes, dont trois qui font planter le démarrage. Tu les cumulais toutes, donc corriger l'une ne servait à rien.

## Les trois qui font planter le démarrage

### 1. `application-ldap.yml` contenait `spring.config.activate.on-profile: ldap`

Un fichier déjà suffixé `-ldap` est *par construction* réservé au profil `ldap`. Y remettre `on-profile` est interdit : Spring Boot lève `InvalidConfigDataPropertyException` avant même de charger un seul bean.

**Correctif :** ligne retirée. Les valeurs viennent maintenant des variables d'environnement, avec un repli local.

### 2. Deux chaînes de sécurité « attrape-tout » dans le même profil

En profil `ldap`, `LdapSecurityConfig` **et** `SecurityConfigLdap` étaient actives. Chacune déclarait une `SecurityFilterChain` sans `securityMatcher`, donc qui matche toute requête. Spring Security 6 refuse :

> A filter chain that matches any request has already been configured

**Correctif :** `SecurityConfigLdap.java` supprimée. `LdapSecurityConfig` reste seule.

### 3. `data.sql` visait une table qui n'existe pas

Il insérait dans `users`, alors que l'entité `User` est mappée sur `app_user`. Sur PostgreSQL le script ne s'exécutait même pas (`spring.sql.init.mode` vaut `embedded` par défaut), mais sous H2 en test il plantait.

**Correctif :** `data.sql` supprimé, `spring.sql.init.mode=never`. L'amorçage passe uniquement par `DevDataInitializer`.

## Les deux qui empêchaient de se connecter une fois démarré

### 4. La route de connexion n'était pas publique

En profil `ldap`, `/api/auth/**` n'était pas dans la chaîne publique. Impossible d'obtenir un jeton sans déjà en avoir un.

**Correctif :** `/api/auth/**` ajouté au `securityMatcher` de la chaîne publique.

### 5. Aucun compte en base pour l'utilisateur LDAP, et l'amorçage désactivé

Après le bind LDAP, `CustomLdapUserDetailsContextMapper` cherche en base un utilisateur avec `mail = user@springframework.org`. Il n'existait pas. Et `DevDataInitializer` exigeait `app.dev-data.enabled=true`, que rien ne positionnait.

**Correctif :** compte `user` ajouté à l'amorçage, `APP_DEV_DATA_ENABLED=true` dans `docker-compose.yml`.

## Trois défauts corrigés au passage

- Les variables `LDAP_*` de `docker-compose.yml` n'étaient **jamais lues** : `LdapProps` lit `app.ldap.*`, pas `ldap.*`. Le yml les mappe désormais.
- Le filtre de groupes était `(memberUid={0})` alors que `bootstrap.ldif` crée des `groupOfNames` : l'attribut est `member`. Aucun rôle n'était donc remonté.
- `JwtAuthenticationFilter` et `TenantFilter` sont des `@Component` : Spring Boot les enregistrait **aussi** comme filtres de servlet, en plus de la chaîne de sécurité. Chaque filtre tournait deux fois par requête. Désactivé via `FilterRegistrationBean`.

## Ce que je n'ai pas pu faire

Je n'ai pas Maven ni d'accès à Maven Central dans mon environnement : **je n'ai pas compilé**. Les modifications sont chirurgicales et j'en suis confiant, mais c'est toi qui valides.

## Procédure de vérification, dans l'ordre

```bash
# 1. Appliquer : copier les fichiers livrés par-dessus le projet, supprimer les trois de A-SUPPRIMER.txt

# 2. Compiler à froid, sans Docker, pour voir les vraies erreurs
cd CrisisShield-Backend
./mvnw -q clean package -DskipTests

# 3. Repartir de zéro côté volumes (l'ancien LDAP a pu être mal initialisé)
cd ..
docker compose down -v
docker compose up --build

# 4. Vérifier le démarrage
curl -s http://localhost:8080/actuator/health

# 5. Se connecter (bind LDAP puis JWT)
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"password"}'

# 6. Appeler une route protégée avec le jeton obtenu
curl -s http://localhost:8080/api/users -H "Authorization: Bearer <jeton>"
```

Si l'étape 2 échoue, envoie-moi la sortie complète de Maven, pas un résumé.

## Ce qui reste à nettoyer (pas bloquant)

- Trois classes JWT pour un seul besoin : `JwtUtil`, `JwtService`, `JwtTokenProvider`. Garde `JwtUtil`, migre `LdapController` dessus, supprime les deux autres.
- `logging.level.org.springframework.beans.factory=DEBUG` a été retiré : c'était un vestige de ta chasse au cycle, il noyait les vrais messages.
- `local.txt` (590 Ko) et `security_bundle.txt` sont des exports de code : à sortir du dépôt.
- Le dossier `Backlog/` contient sept versions du même backlog. Garde-en une.
