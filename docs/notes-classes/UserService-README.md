# README: Classe `UserService`

Ce fichier explique le rôle et l'utilité de la classe `UserService.java`.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

`UserService` est la couche de service de l'application responsable de la logique métier liée à la gestion des utilisateurs. Elle agit comme un intermédiaire entre le contrôleur (API) et le dépôt de données (UserRepository), garantissant que les règles métier sont appliquées et que les opérations sont effectuées de manière sécurisée.

**Fonctionnalités clés :**

-   **Gestion CRUD des utilisateurs** : Fournit des méthodes pour créer, lire, mettre à jour et supprimer des utilisateurs.
-   **Intégration Spring Security** : Implémente l'interface `UserDetailsService`, permettant à Spring Security de charger les détails de l'utilisateur (y compris les rôles et le statut d'activation) lors de l'authentification.
-   **Hachage des mots de passe** : Utilise `PasswordEncoder` pour hacher les mots de passe avant de les stocker, garantissant ainsi leur sécurité.
-   **Journalisation (Logging)** : Enregistre les actions importantes de gestion des utilisateurs (création, mise à jour, suppression, tentatives de connexion) pour des raisons d'audit et de traçabilité. Le nom de l'utilisateur authentifié effectuant l'action est également enregistré.
-   **Gestion du statut d'activation** : Vérifie le statut `enabled` de l'utilisateur lors de la connexion et lors des mises à jour, permettant la désactivation des comptes.
-   **Séparation des préoccupations** : Ne gère pas directement les requêtes HTTP ni la persistance des données, mais délègue ces tâches aux couches `api` et `infrastructure` respectivement.

### 🧒 Explication pour un enfant

Imagine que `UserService` est le chef de l'équipe qui s'occupe de toutes les personnes dans le château.
-   Quand quelqu'un veut s'inscrire, le chef `UserService` s'assure que tout est en ordre, il cache bien le mot de passe secret pour que personne ne le voie, et il note tout dans un grand livre (les logs).
-   Si quelqu'un veut changer sa carte d'identité, le chef `UserService` vérifie ce qui doit être changé et le fait.
-   Si quelqu'un essaie d'entrer, le chef `UserService` regarde sa carte pour voir s'il a le droit d'entrer et si sa carte est toujours active.
-   Le chef `UserService` ne parle pas directement aux visiteurs (ça, c'est le travail du garde `UserController`), et il ne range pas les cartes lui-même (ça, c'est le travail du coffre-fort `UserRepository`). Il donne juste les ordres et s'assure que tout est fait correctement.

---

## 🇬🇧 English

### 👔 Professional Explanation

`UserService` is the application's service layer responsible for business logic related to user management. It acts as an intermediary between the controller (API) and the data repository (UserRepository), ensuring that business rules are applied and operations are performed securely.

**Key Features:**

-   **User CRUD Management**: Provides methods to create, read, update, and delete users.
-   **Spring Security Integration**: Implements the `UserDetailsService` interface, allowing Spring Security to load user details (including roles and enabled status) during authentication.
-   **Password Hashing**: Uses `PasswordEncoder` to hash passwords before storing them, ensuring their security.
-   **Logging**: Records important user management actions (creation, update, deletion, login attempts) for auditing and traceability purposes. The name of the authenticated user performing the action is also logged.
-   **Enabled Status Management**: Checks the user's `enabled` status during login and updates, allowing for account deactivation.
-   **Separation of Concerns**: Does not directly handle HTTP requests or data persistence, but delegates these tasks to the `api` and `infrastructure` layers respectively.

### 🧒 Kid's Explanation

Imagine `UserService` is the team leader who takes care of all the people in the castle.
-   When someone wants to sign up, the `UserService` leader makes sure everything is in order, he hides the secret password so no one sees it, and he writes everything down in a big book (the logs).
-   If someone wants to change their ID card, the `UserService` leader checks what needs to be changed and does it.
-   If someone tries to enter, the `UserService` leader looks at their card to see if they are allowed in and if their card is still active.
-   The `UserService` leader doesn't talk directly to visitors (that's the `UserController` guard's job), and he doesn't store the cards himself (that's the `UserRepository` vault's job). He just gives orders and makes sure everything is done correctly.

---

## 🇸🇦 العربية

### 👔 شرح احترافي

`UserService` هي طبقة الخدمة في التطبيق المسؤولة عن منطق الأعمال المتعلق بإدارة المستخدمين. تعمل كوسيط بين المتحكم (API) ومستودع البيانات (UserRepository)، مما يضمن تطبيق قواعد العمل وتنفيذ العمليات بشكل آمن.

**الميزات الرئيسية:**

-   **إدارة CRUD للمستخدمين**: توفر طرقًا لإنشاء المستخدمين وقراءتهم وتحديثهم وحذفهم.
-   **تكامل Spring Security**: تنفذ واجهة `UserDetailsService`، مما يسمح لـ Spring Security بتحميل تفاصيل المستخدم (بما في ذلك الأدوار وحالة التمكين) أثناء المصادقة.
-   **تشفير كلمات المرور**: تستخدم `PasswordEncoder` لتشفير كلمات المرور قبل تخزينها، مما يضمن أمانها.
-   **التسجيل (Logging)**: تسجل إجراءات إدارة المستخدمين الهامة (الإنشاء والتحديث والحذف ومحاولات تسجيل الدخول) لأغراض التدقيق والتتبع. يتم أيضًا تسجيل اسم المستخدم المصادق الذي يقوم بالإجراء.
-   **إدارة حالة التمكين**: تتحقق من حالة `enabled` للمستخدم أثناء تسجيل الدخول والتحديثات، مما يسمح بتعطيل الحسابات.
-   **فصل الاهتمامات**: لا تتعامل مباشرة مع طلبات HTTP أو استمرارية البيانات، ولكنها تفوض هذه المهام إلى طبقات `api` و `infrastructure` على التوالي.

### 🧒 شرح لطفل

تخيل أن `UserService` هو قائد الفريق الذي يهتم بجميع الأشخاص في القلعة.
-   عندما يريد شخص ما التسجيل، يتأكد قائد `UserService` من أن كل شيء على ما يرام، ويخفي كلمة المرور السرية جيدًا حتى لا يراها أحد، ويسجل كل شيء في كتاب كبير (السجلات).
-   إذا أراد شخص ما تغيير بطاقة هويته، يتحقق قائد `UserService` مما يجب تغييره ويقوم بذلك.
-   إذا حاول شخص ما الدخول، ينظر قائد `UserService` إلى بطاقته ليرى ما إذا كان مسموحًا له بالدخول وما إذا كانت بطاقته لا تزال نشطة.
-   لا يتحدث قائد `UserService` مباشرة إلى الزوار (هذه مهمة حارس `UserController`)، ولا يقوم بتخزين البطاقات بنفسه (هذه مهمة خزنة `UserRepository`). إنه فقط يعطي الأوامر ويتأكد من أن كل شيء يتم بشكل صحيح.
