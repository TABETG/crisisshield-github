# README: Classe `Role`

Ce fichier explique le rôle et l'utilité de la classe `Role.java`.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

`Role.java` est une énumération qui définit de manière stricte et sécurisée les différents niveaux d'autorisation dans l'application. En implémentant l'interface `GrantedAuthority` de Spring Security, elle s'intègre directement avec le framework de sécurité. Chaque constante (`ROLE_ADMIN`, `ROLE_OPS`, `ROLE_AUDITOR`) représente une "autorité" qui peut être utilisée pour contrôler l'accès aux points de terminaison de l'API et aux méthodes de service. L'utilisation d'une énumération prévient les erreurs de saisie (par exemple, "ADMIN" vs "admin") et centralise la gestion des permissions en un seul endroit.

### 🧒 Explication pour un enfant

Imagine que l'application est un grand château. Tout le monde ne peut pas aller partout. La classe `Role` est comme un trousseau de clés spéciales.
-   `ROLE_ADMIN` 👑 : C'est la clé du roi, elle ouvre toutes les portes ! Il peut tout voir et tout changer.
-   `ROLE_OPS` ⚔️ : C'est la clé des chevaliers, elle ouvre les portes des salles d'entraînement et des remparts pour accomplir leurs missions.
-   `ROLE_AUDITOR` 📜 : C'est la clé du scribe, elle permet seulement de lire les grands livres d'histoire du château pour vérifier que tout s'est bien passé, mais sans rien pouvoir modifier.

Chaque personne reçoit une clé qui correspond à son travail dans le château.

---

## 🇬🇧 English

### 👔 Professional Explanation

`Role.java` is an enumeration that strictly and securely defines the different authorization levels within the application. By implementing Spring Security's `GrantedAuthority` interface, it integrates directly with the security framework. Each constant (`ROLE_ADMIN`, `ROLE_OPS`, `ROLE_AUDITOR`) represents an "authority" that can be used to control access to API endpoints and service methods. Using an enum prevents typos (e.g., "ADMIN" vs. "admin") and centralizes permission management in a single location.

### 🧒 Kid's Explanation

Imagine the application is a big castle. Not everyone can go everywhere. The `Role` class is like a set of special keys.
-   `ROLE_ADMIN` 👑: This is the king's key; it opens all the doors! They can see and change everything.
-   `ROLE_OPS` ⚔️: This is the knights' key; it opens the doors to the training rooms and ramparts to carry out their missions.
-   `ROLE_AUDITOR` 📜: This is the scribe's key; it only lets you read the castle's great history books to check that everything went well, but you can't change anything.

Each person gets a key that matches their job in the castle.

---

## 🇸🇦 العربية

### 👔 شرح احترافي

`Role.java` هو تعداد (enum) يحدد بشكل صارم وآمن مستويات التفويض المختلفة داخل التطبيق. من خلال تطبيق واجهة `GrantedAuthority` من Spring Security، فإنه يتكامل مباشرة مع إطار العمل الأمني. يمثل كل ثابت (`ROLE_ADMIN`, `ROLE_OPS`, `ROLE_AUDITOR`) "صلاحية" يمكن استخدامها للتحكم في الوصول إلى نقاط نهاية الواجهة البرمجية (API) ومメソッドات الخدمة. استخدام التعداد يمنع الأخطاء الإملائية (مثل "ADMIN" مقابل "admin") ويجعل إدارة الأذونات مركزية في مكان واحد.

### 🧒 شرح لطفل

تخيل أن التطبيق عبارة عن قلعة كبيرة. لا يمكن للجميع الذهاب إلى كل مكان. فئة `Role` تشبه مجموعة من المفاتيح الخاصة.
-   `ROLE_ADMIN` 👑: هذا هو مفتاح الملك، يفتح كل الأبواب! يمكنه رؤية كل شيء وتغيير كل شيء.
-   `ROLE_OPS` ⚔️: هذا هو مفتاح الفرسان، يفتح أبواب غرف التدريب والأسوار لتنفيذ مهامهم.
-   `ROLE_AUDITOR` 📜: هذا هو مفتاح الكاتب، يسمح لك فقط بقراءة كتب تاريخ القلعة العظيمة للتحقق من أن كل شيء سار على ما يرام، ولكن لا يمكنك تغيير أي شيء.

كل شخص يحصل على مفتاح يناسب وظيفته في القلعة.
