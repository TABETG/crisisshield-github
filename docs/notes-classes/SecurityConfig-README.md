# SecurityConfig

`SecurityConfig` est une classe de configuration Spring (`@Configuration`) qui définit la manière dont la sécurité est gérée dans l'application.

## Rôle

Cette classe est au cœur de l'implémentation de Spring Security. Ses responsabilités sont :

-   **Activer la sécurité web** : L'annotation `@EnableWebSecurity` active le support de Spring Security pour une application web.
-   **Configurer la chaîne de filtres de sécurité** : La méthode `securityFilterChain` est l'endroit où la magie opère. Elle définit :
    -   La désactivation du CSRF (Cross-Site Request Forgery), une pratique courante pour les API RESTful sans état.
    -   Les règles d'autorisation (`authorizeHttpRequests`) :
        -   Elle autorise l'accès public (`permitAll`) au point de terminaison de connexion (`/api/auth/login`).
        -   Elle exige une authentification (`authenticated`) pour toutes les autres requêtes.
    -   La politique de gestion de session (`sessionManagement`) : Elle est définie sur `STATELESS` car nous utilisons des tokens JWT, ce qui signifie que le serveur ne maintient pas d'état de session pour l'utilisateur.
    -   L'ajout du `JwtAuthenticationFilter` : Elle insère notre filtre personnalisé dans la chaîne, avant le filtre standard `UsernamePasswordAuthenticationFilter`.
-   **Fournir des beans essentiels** :
    -   `passwordEncoder()`: Expose un bean `BCryptPasswordEncoder` que l'application peut utiliser pour hasher les mots de passe en toute sécurité.
    -   `authenticationManager()`: Expose le `AuthenticationManager` de Spring, qui est utilisé pour traiter les demandes d'authentification (par exemple, lors de la connexion).

## Personnalisation

Cette classe peut être facilement modifiée pour :

-   Autoriser l'accès à d'autres points de terminaison publics (par exemple, une page d'inscription).
-   Configurer des règles d'autorisation basées sur les rôles (par exemple, `hasRole('ADMIN')`).
-   Activer ou configurer d'autres fonctionnalités de Spring Security (CORS, etc.).
