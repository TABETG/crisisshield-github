# AuthController

`AuthController` est un contrôleur REST (`@RestController`) qui expose les points de terminaison liés à l'authentification.

## Rôle

Ce contrôleur est la porte d'entrée de l'application pour les utilisateurs qui souhaitent s'authentifier. Sa principale responsabilité est de gérer le processus de connexion.

## Points de terminaison

### POST /api/auth/login

-   **Objectif** : Authentifier un utilisateur et lui fournir un token JWT.
-   **Corps de la requête** : Un objet JSON contenant le `username` and `password` de l'utilisateur (représenté par la classe `LoginRequest`).
-   **Processus** :
    1.  Le contrôleur reçoit la requête de connexion.
    2.  Il utilise l'`AuthenticationManager` de Spring Security pour authentifier les informations d'identification. L'`AuthenticationManager` utilisera à son tour le `UserDetailsService` et le `PasswordEncoder` configurés pour vérifier que le nom d'utilisateur existe et que le mot de passe est correct.
    3.  Si l'authentification réussit, le contrôleur charge les `UserDetails` complets via le `UserService`.
    4.  Il utilise `JwtUtil` pour générer un token JWT basé sur les détails de l'utilisateur.
    5.  Il renvoie une réponse HTTP 200 (OK) avec le token JWT dans le corps de la réponse (encapsulé dans un DTO `LoginResponse`).
-   **Réponse en cas d'échec** : Si l'authentification échoue (par exemple, mot de passe incorrect), l'`AuthenticationManager` lèvera une exception, et Spring Security renverra une réponse HTTP 401 (Unauthorized) ou 403 (Forbidden) par défaut.

## Dépendances

-   `AuthenticationManager` : Le composant central de Spring Security pour le traitement des demandes d'authentification.
-   `UserService` : Utilisé pour récupérer les détails de l'utilisateur après une authentification réussie.
-   `JwtUtil` : Utilisé pour générer le token JWT.
