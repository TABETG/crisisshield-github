# README: Fichier `docker-compose.yml`

Ce fichier explique le rôle et l'utilité du `docker-compose.yml` pour l'application.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

Le fichier `docker-compose.yml` est un outil essentiel pour définir et exécuter des applications Docker multi-conteneurs. Il utilise le format YAML pour configurer les services de l'application, les réseaux et les volumes. En utilisant `docker-compose up`, tous les services définis sont démarrés et connectés, permettant de lancer l'environnement complet de l'application avec une seule commande.

Dans notre cas, ce fichier définit deux services :

1.  **`backend`** :
    *   **`build: ./CrisisShield-Backend`** : Indique à Docker Compose de construire l'image Docker pour le backend en utilisant le `Dockerfile` situé dans le sous-répertoire `CrisisShield-Backend`.
    *   **`ports: "8080:8080"`** : Mappe le port `8080` du conteneur (où l'application Spring Boot écoute) au port `8080` de la machine hôte. Cela permet d'accéder au backend depuis l'extérieur du conteneur.
    *   **`environment`** : Définit les variables d'environnement nécessaires au backend, notamment les informations de connexion à la base de données PostgreSQL. Les variables `JWT_SECRET` et `JWT_EXPIRATION` sont également passées ici.
    *   **`depends_on: - db`** : Assure que le service `db` (la base de données) démarre avant le service `backend`.
    *   **`logging`**: Configure la gestion des logs pour le service backend.

2.  **`db`** :
    *   **`image: postgres:13-alpine`** : Utilise l'image officielle de PostgreSQL version 13 basée sur Alpine Linux, une version légère.
    *   **`ports: "5432:5432"`** : Mappe le port `5432` du conteneur (port par défaut de PostgreSQL) au port `5432` de la machine hôte.
    *   **`environment`** : Configure les variables d'environnement pour PostgreSQL, telles que le mot de passe de l'utilisateur `postgres` et le nom de la base de données.
    *   **`volumes: - db_data:/var/lib/postgresql/data`** : Crée un volume persistant nommé `db_data`. Ce volume est monté dans le répertoire où PostgreSQL stocke ses données à l'intérieur du conteneur. Cela garantit que les données de la base de données ne sont pas perdues lorsque le conteneur est arrêté ou supprimé.
    *   **`logging`**: Configure la gestion des logs pour le service de base de données.

Le bloc `volumes` en bas du fichier déclare le volume `db_data` pour qu'il soit géré par Docker.

Ce setup permet de lancer l'ensemble de l'application (backend + base de données) de manière isolée et reproductible.

### 🧒 Explication pour un enfant

Imagine que `docker-compose.yml` est comme une liste de courses et un plan de construction pour créer un petit village de boîtes magiques (conteneurs Docker) qui travaillent ensemble.
-   La liste dit : "Nous avons besoin de deux boîtes : une pour le 'cerveau' de l'application (le `backend`) et une pour le 'grand livre de souvenirs' (la `db`)."
-   Pour la boîte `backend` : "Construis-la avec la recette spéciale (`Dockerfile`) qui est dans le dossier `CrisisShield-Backend`. Ouvre la porte numéro 8080 pour qu'on puisse lui parler. Et dis-lui comment trouver le 'grand livre de souvenirs'."
-   Pour la boîte `db` : "Prends une boîte toute prête avec un 'grand livre de souvenirs' (PostgreSQL). Ouvre la porte numéro 5432. Dis-lui le mot de passe pour le livre. Et surtout, garde le 'grand livre de souvenirs' dans un endroit spécial (`db_data`) pour ne jamais perdre les histoires, même si on ferme la boîte !"

Avec ce plan, on peut construire tout le village d'un coup, et toutes les boîtes savent comment se parler pour que l'application fonctionne !

---

## 🇬🇧 English

### 👔 Professional Explanation

The `docker-compose.yml` file is an essential tool for defining and running multi-container Docker applications. It uses the YAML format to configure application services, networks, and volumes. By using `docker-compose up`, all defined services are started and connected, allowing the entire application environment to be launched with a single command.

In our case, this file defines two services:

1.  **`backend`**:
    *   **`build: ./CrisisShield-Backend`**: Instructs Docker Compose to build the Docker image for the backend using the `Dockerfile` located in the `CrisisShield-Backend` subdirectory.
    *   **`ports: "8080:8080"`**: Maps port `8080` of the container (where the Spring Boot application listens) to port `8080` of the host machine. This allows access to the backend from outside the container.
    *   **`environment`**: Defines the environment variables needed by the backend, including PostgreSQL database connection information. `JWT_SECRET` and `JWT_EXPIRATION` variables are also passed here.
    *   **`depends_on: - db`**: Ensures that the `db` service (the database) starts before the `backend` service.
    *   **`logging`**: Configures logging for the backend service.

2.  **`db`**:
    *   **`image: postgres:13-alpine`**: Uses the official PostgreSQL version 13 image based on Alpine Linux, a lightweight version.
    *   **`ports: "5432:5432"`**: Maps port `5432` of the container (default PostgreSQL port) to port `5432` of the host machine.
    *   **`environment`**: Configures environment variables for PostgreSQL, such as the `postgres` user's password and the database name.
    *   **`volumes: - db_data:/var/lib/postgresql/data`**: Creates a persistent volume named `db_data`. This volume is mounted into the directory where PostgreSQL stores its data inside the container. This ensures that database data is not lost when the container is stopped or removed.
    *   **`logging`**: Configures logging for the database service.

The `volumes` block at the bottom of the file declares the `db_data` volume to be managed by Docker.

This setup allows the entire application (backend + database) to be launched in an isolated and reproducible manner.

### 🧒 Kid's Explanation

Imagine `docker-compose.yml` is like a shopping list and a construction plan for creating a small village of magic boxes (Docker containers) that work together.
-   The list says: "We need two boxes: one for the application's 'brain' (the `backend`) and one for the 'big memory book' (the `db`)."
-   For the `backend` box: "Build it with the special recipe (`Dockerfile`) that's in the `CrisisShield-Backend` folder. Open door number 8080 so we can talk to it. And tell it how to find the 'big memory book'."
-   For the `db` box: "Take a ready-made box with a 'big memory book' (PostgreSQL). Open door number 5432. Tell it the password for the book. And most importantly, keep the 'big memory book' in a special place (`db_data`) so we never lose the stories, even if we close the box!"

With this plan, we can build the whole village at once, and all the boxes know how to talk to each other so the application works!

---

## 🇸🇦 العربية

### 👔 شرح احترافي

ملف `docker-compose.yml` هو أداة أساسية لتحديد وتشغيل تطبيقات Docker متعددة الحاويات. يستخدم تنسيق YAML لتكوين خدمات التطبيق والشبكات والأحجام. باستخدام `docker-compose up`، يتم بدء تشغيل جميع الخدمات المحددة وربطها، مما يسمح بتشغيل بيئة التطبيق الكاملة بأمر واحد.

في حالتنا، يحدد هذا الملف خدمتين:

1.  **`backend`**:
    *   **`build: ./CrisisShield-Backend`**: يوجه Docker Compose لبناء صورة Docker للواجهة الخلفية باستخدام `Dockerfile` الموجود في الدليل الفرعي `CrisisShield-Backend`.
    *   **`ports: "8080:8080"`**: يربط المنفذ `8080` للحاوية (حيث يستمع تطبيق Spring Boot) بالمنفذ `8080` للجهاز المضيف. يتيح ذلك الوصول إلى الواجهة الخلفية من خارج الحاوية.
    *   **`environment`**: يحدد متغيرات البيئة اللازمة للواجهة الخلفية، بما في ذلك معلومات الاتصال بقاعدة بيانات PostgreSQL. يتم تمرير متغيرات `JWT_SECRET` و `JWT_EXPIRATION` هنا أيضًا.
    *   **`depends_on: - db`**: يضمن بدء تشغيل خدمة `db` (قاعدة البيانات) قبل خدمة `backend`.
    *   **`logging`**: يقوم بتكوين تسجيل الدخول لخدمة الواجهة الخلفية.

2.  **`db`**:
    *   **`image: postgres:13-alpine`**: يستخدم الصورة الرسمية لـ PostgreSQL الإصدار 13 المستندة إلى Alpine Linux، وهي نسخة خفيفة الوزن.
    *   **`ports: "5432:5432"`**: يربط المنفذ `5432` للحاوية (المنفذ الافتراضي لـ PostgreSQL) بالمنفذ `5432` للجهاز المضيف.
    *   **`environment`**: يقوم بتكوين متغيرات البيئة لـ PostgreSQL، مثل كلمة مرور المستخدم `postgres` واسم قاعدة البيانات.
    *   **`volumes: - db_data:/var/lib/postgresql/data`**: ينشئ حجمًا دائمًا يسمى `db_data`. يتم تحميل هذا الحجم في الدليل حيث يخزن PostgreSQL بياناته داخل الحاوية. يضمن ذلك عدم فقدان بيانات قاعدة البيانات عند إيقاف الحاوية أو حذفها.
    *   **`logging`**: يقوم بتكوين تسجيل الدخول لخدمة قاعدة البيانات.

يعلن كتلة `volumes` في أسفل الملف عن حجم `db_data` ليتم إدارته بواسطة Docker.

يتيح هذا الإعداد تشغيل التطبيق بأكمله (الواجهة الخلفية + قاعدة البيانات) بطريقة معزولة وقابلة للتكرار.

### 🧒 شرح لطفل

تخيل أن `docker-compose.yml` يشبه قائمة تسوق وخطة بناء لإنشاء قرية صغيرة من الصناديق السحرية (حاويات Docker) التي تعمل معًا.
-   تقول القائمة: "نحتاج إلى صندوقين: واحد لـ 'عقل' التطبيق (`backend`) وواحد لـ 'كتاب الذاكرة الكبير' (`db`)."
-   لصندوق `backend`: "ابنه بالوصفة الخاصة (`Dockerfile`) الموجودة في المجلد `CrisisShield-Backend`. افتح الباب رقم 8080 حتى نتمكن من التحدث إليه. وأخبره كيف يجد 'كتاب الذاكرة الكبير'."
-   لصندوق `db`: "خذ صندوقًا جاهزًا به 'كتاب ذاكرة كبير' (PostgreSQL). افتح الباب رقم 5432. أخبره كلمة المرور للكتاب. والأهم من ذلك، احتفظ بـ 'كتاب الذاكرة الكبير' في مكان خاص (`db_data`) حتى لا نفقد القصص أبدًا، حتى لو أغلقنا الصندوق!"

باستخدام هذه الخطة، يمكننا بناء القرية بأكملها دفعة واحدة، وتعرف جميع الصناديق كيفية التحدث مع بعضها البعض حتى يعمل التطبيق!
