# README: Classe `User`

Ce fichier explique le rôle et l'utilité de la classe `User.java`.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

La classe `User` est l'entité centrale représentant un utilisateur dans notre domaine métier. Elle implémente l'interface `UserDetails` de Spring Security, ce qui en fait un objet directement utilisable par le framework pour les processus d'authentification et d'autorisation.

-   **Attributs** : Elle contient les informations de base (`id`, `username`, `email`, `password`) ainsi qu'un ensemble de `Role` (`Set<Role>`). L'utilisation d'un `Set` garantit qu'un utilisateur ne peut pas avoir deux fois le même rôle.
-   **Intégration Spring Security** : En implémentant des méthodes comme `getAuthorities()` (qui retourne les rôles), `getUsername()`, et `getPassword()`, nous permettons à Spring Security de comprendre la structure de notre utilisateur sans configuration complexe. Les méthodes booléennes (`isAccountNonLocked`, etc.) offrent des points d'extension pour des fonctionnalités de sécurité avancées (comptes expirés, verrouillés, etc.).
-   **Domaine** : En tant qu'entité du domaine, elle est indépendante des couches d'infrastructure. Elle représente le concept métier d'un utilisateur, avec ses propriétés et ses règles intrinsèques.

### 🧒 Explication pour un enfant

La classe `User` est la carte d'identité de chaque personne qui veut entrer dans notre château (l'application).
-   Sur la carte, il y a ton nom (`username`), ton adresse e-mail (`email`), et un mot de passe secret (`password`) que seul toi connais.
-   Il y a aussi une section spéciale pour les "clés" que tu possèdes (`roles`). Tu peux avoir la clé du roi (`ROLE_ADMIN`), celle du chevalier (`ROLE_OPS`), ou juste celle du scribe (`ROLE_AUDITOR`).
-   Quand tu te présentes à la porte du château, le garde (Spring Security) regarde ta carte d'identité pour vérifier qui tu es et quelles clés tu as, pour savoir dans quelles salles tu as le droit d'entrer.

---

## 🇬🇧 English

### 👔 Professional Explanation

The `User` class is the central entity representing a user in our business domain. It implements the `UserDetails` interface from Spring Security, making it an object that the framework can directly use for authentication and authorization processes.

-   **Attributes**: It contains basic information (`id`, `username`, `email`, `password`) as well as a set of `Role` (`Set<Role>`). Using a `Set` ensures that a user cannot have the same role twice.
-   **Spring Security Integration**: By implementing methods like `getAuthorities()` (which returns the roles), `getUsername()`, and `getPassword()`, we allow Spring Security to understand our user structure without complex configuration. The boolean methods (`isAccountNonLocked`, etc.) provide extension points for advanced security features (expired accounts, locked accounts, etc.).
-   **Domain**: As a domain entity, it is independent of the infrastructure layers. It represents the business concept of a user, with its intrinsic properties and rules.

### 🧒 Kid's Explanation

The `User` class is the ID card for everyone who wants to enter our castle (the application).
-   On the card, there's your name (`username`), your email address (`email`), and a secret password (`password`) that only you know.
-   There's also a special section for the "keys" you own (`roles`). You might have the king's key (`ROLE_ADMIN`), the knight's key (`ROLE_OPS`), or just the scribe's key (`ROLE_AUDITOR`).
-   When you show up at the castle gate, the guard (Spring Security) looks at your ID card to check who you are and which keys you have, to know which rooms you are allowed to enter.

---

## 🇸🇦 العربية

### 👔 شرح احترافي

فئة `User` هي الكيان المركزي الذي يمثل مستخدمًا في مجال عملنا. تقوم بتطبيق واجهة `UserDetails` من Spring Security، مما يجعلها كائنًا يمكن للإطار استخدامه مباشرة في عمليات المصادقة والترخيص.

-   **السمات**: تحتوي على المعلومات الأساسية (`id`, `username`, `email`, `password`) بالإضافة إلى مجموعة من الأدوار (`Set<Role>`). استخدام `Set` يضمن أن المستخدم لا يمكن أن يكون له نفس الدور مرتين.
-   **تكامل Spring Security**: من خلال تنفيذ أساليب مثل `getAuthorities()` (التي تعيد الأدوار)، `getUsername()`، و `getPassword()`، نسمح لـ Spring Security بفهم بنية المستخدم لدينا دون تكوين معقد. توفر الأساليب المنطقية (`isAccountNonLocked`، إلخ) نقاط امتداد لميزات الأمان المتقدمة (حسابات منتهية الصلاحية، مقفلة، إلخ).
-   **المجال**: ككيان في المجال، فإنه مستقل عن طبقات البنية التحتية. إنه يمثل المفهوم التجاري للمستخدم، بخصائصه وقواعده الجوهرية.

### 🧒 شرح لطفل

فئة `User` هي بطاقة الهوية لكل شخص يريد دخول قلعتنا (التطبيق).
-   على البطاقة، يوجد اسمك (`username`)، عنوان بريدك الإلكتروني (`email`)، وكلمة مرور سرية (`password`) لا يعرفها أحد غيرك.
-   هناك أيضًا قسم خاص لـ "المفاتيح" التي تمتلكها (`roles`). قد يكون لديك مفتاح الملك (`ROLE_ADMIN`)، أو مفتاح الفارس (`ROLE_OPS`)، أو فقط مفتاح الكاتب (`ROLE_AUDITOR`).
-   عندما تصل إلى بوابة القلعة، ينظر الحارس (Spring Security) إلى بطاقة هويتك للتحقق من هويتك والمفاتيح التي لديك، لمعرفة الغرف المسموح لك بدخولها.
