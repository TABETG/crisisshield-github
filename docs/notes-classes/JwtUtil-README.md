# JwtUtil

`JwtUtil` est une classe composant de Spring responsable de la gestion des JSON Web Tokens (JWT) dans l'application.

## Rôle

Cette classe fournit des fonctionnalités essentielles pour la sécurité basée sur les tokens :

-   **Génération de tokens** : Crée un JWT signé pour un utilisateur authentifié.
-   **Validation de tokens** : Vérifie si un token est valide (non expiré et correctement signé) pour un utilisateur donné.
-   **Extraction d'informations** : Analyse un token pour en extraire des informations (claims), comme le nom d'utilisateur (sujet) et la date d'expiration.

## Configuration

La classe utilise des valeurs provenant du fichier `application.properties` pour configurer :

-   `jwt.secret` : La clé secrète utilisée pour signer les tokens. Cette clé doit être suffisamment complexe et gardée confidentielle.
-   `jwt.expiration` : La durée de validité d'un token en millisecondes.

## Méthodes principales

-   `generateToken(UserDetails userDetails)` : Génère un nouveau token JWT.
-   `validateToken(String token, UserDetails userDetails)` : Valide un token existant.
-   `extractUsername(String token)` : Extrait le nom d'utilisateur du token.
