# README: Classe `LdapController`

Ce fichier explique le rôle et l'utilité de la classe `LdapController.java`.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

`LdapController` est un contrôleur REST (`@RestController`) qui expose un point de terminaison spécifique pour l'authentification des utilisateurs via un annuaire LDAP (Lightweight Directory Access Protocol) ou Active Directory. Ce contrôleur est conçu pour être actif uniquement lorsque le profil Spring `ldap` est activé, permettant ainsi une gestion flexible des méthodes d'authentification.

**Rôle :**

Le rôle principal de ce contrôleur est de servir de passerelle pour les requêtes d'authentification LDAP. Lorsqu'un utilisateur tente de se connecter via LDAP, ce contrôleur intercepte la requête, délègue l'authentification à Spring Security (qui utilise la configuration `LdapSecurityConfig`), et en cas de succès, génère un JSON Web Token (JWT) pour l'utilisateur. Ce JWT peut ensuite être utilisé pour accéder aux ressources sécurisées de l'application.

**Points de terminaison :**

-   **`POST /api/ldap/login`** :
    *   **Objectif** : Authentifier un utilisateur en utilisant ses identifiants LDAP et lui fournir un JWT sécurisé.
    *   **Corps de la requête** : Un objet JSON (`LoginRequest`) contenant le `username` (généralement l'UID ou le sAMAccountName de l'utilisateur dans LDAP) et le `password`.
    *   **Processus** :
        1.  Le contrôleur reçoit la requête de connexion.
        2.  Il utilise l'`AuthenticationManager` de Spring Security pour tenter d'authentifier les identifiants. Grâce à la configuration `LdapSecurityConfig`, l'`AuthenticationManager` délègue cette tâche au `LdapAuthenticationProvider`, qui communique avec le serveur LDAP.
        3.  Si l'authentification LDAP réussit, le `CustomLdapUserDetailsContextMapper` (configuré dans `LdapSecurityConfig`) mappe les informations de l'utilisateur LDAP à notre entité `User` interne (qui implémente `UserDetails`).
        4.  Le contrôleur récupère cet objet `UserDetails` et utilise `JwtUtil` pour générer un JWT.
        5.  Il renvoie une réponse HTTP 200 (OK) avec le JWT dans le corps de la réponse (encapsulé dans un DTO `LoginResponse`).
    *   **Réponse en cas d'échec** : Si l'authentification échoue (identifiants incorrects, problème de connexion LDAP, etc.), l'`AuthenticationManager` lèvera une exception, et Spring Security renverra une réponse HTTP 401 (Unauthorized) par défaut.

**Dépendances :**

-   `AuthenticationManager` : Le composant central de Spring Security pour le traitement des demandes d'authentification.
-   `JwtUtil` : Utilisé pour générer le token JWT après une authentification réussie.
-   `UserDetailsService` : Bien qu'il ne soit pas directement utilisé pour l'authentification dans ce contrôleur (c'est l'`AuthenticationManager` qui s'en charge), il est injecté pour s'assurer que le `CustomLdapUserDetailsContextMapper` a accès au `UserDetailsService` local si une logique de synchronisation ou de provisionnement d'utilisateurs est mise en place.

### 🧒 Explication pour un enfant

Imagine que `LdapController` est la "porte d'entrée spéciale" du château pour les gens qui viennent d'un autre village appelé "LDAP".
-   Quand quelqu'un du village LDAP veut entrer, il va à cette porte `/api/ldap/login` et donne son nom et son mot de passe secrets.
-   Le gardien de cette porte (`LdapController`) ne vérifie pas lui-même. Il envoie le nom et le mot de passe à un "super-gardien" (`AuthenticationManager`) qui sait parler aux gardiens du village LDAP.
-   Si les gardiens du village LDAP disent "Oui, cette personne est bien de chez nous et son mot de passe est bon !", alors le super-gardien renvoie une "carte magique" (`JWT`) à la personne.
-   Avec cette carte magique, la personne peut ensuite se promener dans le château et ouvrir les portes qui lui sont autorisées.

---

## 🇬🇧 English

### 👔 Professional Explanation

`LdapController` is a REST controller (`@RestController`) that exposes a specific endpoint for authenticating users via an LDAP (Lightweight Directory Access Protocol) or Active Directory. This controller is designed to be active only when the `ldap` Spring profile is enabled, allowing for flexible management of authentication methods.

**Role:**

The primary role of this controller is to serve as a gateway for LDAP authentication requests. When a user attempts to log in via LDAP, this controller intercepts the request, delegates authentication to Spring Security (which uses the `LdapSecurityConfig` configuration), and upon successful authentication, generates a JSON Web Token (JWT) for the user. This JWT can then be used to access the application's secured resources.

**Endpoints:**

-   **`POST /api/ldap/login`**:
    *   **Purpose**: Authenticate a user using their LDAP credentials and provide them with a secure JWT.
    *   **Request Body**: A JSON object (`LoginRequest`) containing the `username` (typically the user's UID or sAMAccountName in LDAP) and `password`.
    *   **Process**:
        1.  The controller receives the login request.
        2.  It uses Spring Security's `AuthenticationManager` to attempt to authenticate the credentials. Thanks to the `LdapSecurityConfig` configuration, the `AuthenticationManager` delegates this task to the `LdapAuthenticationProvider`, which communicates with the LDAP server.
        3.  If LDAP authentication is successful, the `CustomLdapUserDetailsContextMapper` (configured in `LdapSecurityConfig`) maps the LDAP user information to our internal `User` entity (which implements `UserDetails`).
        4.  The controller retrieves this `UserDetails` object and uses `JwtUtil` to generate a JWT.
        5.  It returns an HTTP 200 (OK) response with the JWT in the response body (encapsulated in a `LoginResponse` DTO).
    *   **Failure Response**: If authentication fails (incorrect credentials, user not found, LDAP connection issue, etc.), the `AuthenticationManager` will throw an `AuthenticationException`, and Spring Security will return an HTTP 401 (Unauthorized) response by default.

**Dependencies:**

-   `AuthenticationManager`: The central component of Spring Security for processing authentication requests.
-   `JwtUtil`: Used to generate the JWT after successful authentication.
-   `UserDetailsService`: Although not directly used for authentication in this controller (the `AuthenticationManager` handles it), it is injected to ensure that the `CustomLdapUserDetailsContextMapper` has access to the local `UserDetailsService` if any user synchronization or provisioning logic is in place.

### 🧒 Kid's Explanation

Imagine `LdapController` is the "special entrance gate" to the castle for people coming from another village called "LDAP".
-   When someone from the LDAP village wants to enter, they go to this gate `/api/ldap/login` and give their secret name and password.
-   The guard at this gate (`LdapController`) doesn't check it himself. He sends the name and password to a "super-guard" (`AuthenticationManager`) who knows how to talk to the guards of the LDAP village.
-   If the LDAP village guards say "Yes, this person is indeed from our village and their password is correct!", then the super-guard sends a "magic card" (`JWT`) back to the person.
-   With this magic card, the person can then walk around the castle and open the doors they are allowed to.

---

## 🇸🇦 العربية

### 👔 شرح احترافي

`LdapController` هو متحكم REST (`@RestController`) يكشف عن نقطة نهاية محددة لمصادقة المستخدمين عبر دليل LDAP (بروتوكول الوصول الخفيف للدلائل) أو Active Directory. تم تصميم هذا المتحكم ليكون نشطًا فقط عند تمكين ملف تعريف Spring `ldap`، مما يسمح بإدارة مرنة لطرق المصادقة.

**الدور:**

الدور الأساسي لهذا المتحكم هو العمل كبوابة لطلبات مصادقة LDAP. عندما يحاول مستخدم تسجيل الدخول عبر LDAP، يعترض هذا المتحكم الطلب، ويفوض المصادقة إلى Spring Security (الذي يستخدم تكوين `LdapSecurityConfig`)، وعند المصادقة الناجحة، يولد JSON Web Token (JWT) للمستخدم. يمكن بعد ذلك استخدام هذا JWT للوصول إلى الموارد المؤمنة للتطبيق.

**نقاط النهاية:**

-   **`POST /api/ldap/login`**:
    *   **الهدف**: مصادقة مستخدم باستخدام بيانات اعتماد LDAP الخاصة به وتزويده بـ JWT آمن.
    *   **جسم الطلب**: كائن JSON (`LoginRequest`) يحتوي على `username` (عادةً UID المستخدم أو sAMAccountName في LDAP) و `password`.
    *   **العملية**:
        1.  يتلقى المتحكم طلب تسجيل الدخول.
        2.  يستخدم `AuthenticationManager` الخاص بـ Spring Security لمحاولة مصادقة بيانات الاعتماد. بفضل تكوين `LdapSecurityConfig`، يفوض `AuthenticationManager` هذه المهمة إلى `LdapAuthenticationProvider`، الذي يتصل بخادم LDAP.
        3.  إذا نجحت مصادقة LDAP، يقوم `CustomLdapUserDetailsContextMapper` (المكون في `LdapSecurityConfig`) بربط معلومات مستخدم LDAP بكيان `User` الداخلي الخاص بنا (الذي ينفذ `UserDetails`).
        4.  يسترد المتحكم كائن `UserDetails` هذا ويستخدم `JwtUtil` لإنشاء JWT.
        5.  يعيد استجابة HTTP 200 (موافق) مع JWT في جسم الاستجابة (مغلف في DTO `LoginResponse`).
    *   **استجابة الفشل**: إذا فشلت المصادقة (بيانات اعتماد غير صحيحة، مستخدم غير موجود، مشكلة اتصال LDAP، إلخ)، سيقوم `AuthenticationManager` بإلقاء `AuthenticationException`، وسيعيد Spring Security استجابة HTTP 401 (غير مصرح به) افتراضيًا.

**التبعيات:**

-   `AuthenticationManager`: المكون المركزي لـ Spring Security لمعالجة طلبات المصادقة.
-   `JwtUtil`: يستخدم لإنشاء JWT بعد المصادقة الناجحة.
-   `UserDetailsService`: على الرغم من أنه لا يستخدم مباشرة للمصادقة في هذا المتحكم (يتعامل `AuthenticationManager` معها)، إلا أنه يتم حقنه لضمان وصول `CustomLdapUserDetailsContextMapper` إلى `UserDetailsService` المحلي إذا تم تطبيق أي منطق لمزامنة المستخدم أو توفيره.
