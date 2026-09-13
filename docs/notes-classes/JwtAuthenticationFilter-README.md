# JwtAuthenticationFilter

`JwtAuthenticationFilter` est un filtre Spring Security qui s'intègre dans la chaîne de filtres de sécurité de l'application.

## Rôle

Ce filtre a pour responsabilité de :

1.  **Intercepter les requêtes entrantes** : Il s'exécute une fois pour chaque requête grâce à `OncePerRequestFilter`.
2.  **Extraire le token JWT** : Il recherche l'en-tête `Authorization` et en extrait le token (en ignorant le préfixe "Bearer ").
3.  **Valider le token** : Il utilise `JwtUtil` pour valider le token et en extraire le nom d'utilisateur.
4.  **Charger les détails de l'utilisateur** : Si le token est valide, il utilise le `UserDetailsService` pour charger les informations de l'utilisateur (y compris les rôles/autorisations).
5.  **Configurer le contexte de sécurité** : Il crée un objet `UsernamePasswordAuthenticationToken` et le place dans le `SecurityContextHolder`. Cela a pour effet d'authentifier l'utilisateur pour la durée de la requête.

Si aucun token n'est présent ou si le token est invalide, le filtre passe simplement la main au filtre suivant dans la chaîne sans authentifier l'utilisateur.

## Intégration

Ce filtre est déclaré comme un `@Component` Spring et est injecté dans la configuration de sécurité (`SecurityConfig`) pour être ajouté à la chaîne de filtres avant le filtre d'autorisation principal de Spring.
