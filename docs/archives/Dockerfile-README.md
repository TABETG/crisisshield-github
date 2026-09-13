# README: Fichier `Dockerfile`

Ce fichier explique le rôle et l'utilité du `Dockerfile` pour l'application backend.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

Le `Dockerfile` est un script qui contient une série d'instructions pour construire une image Docker. Cette image est un package léger, autonome et exécutable qui contient tout le nécessaire pour exécuter une application : le code, un environnement d'exécution, des bibliothèques, des variables d'environnement et des fichiers de configuration.

Pour notre application Spring Boot, ce `Dockerfile` va :
1.  **Utiliser une image de base Java** : `eclipse-temurin:17-jdk-alpine` est une image légère de JDK 17 basée sur Alpine Linux, idéale pour les conteneurs.
2.  **Définir le répertoire de travail** : `/app` sera le dossier où notre application sera copiée et exécutée.
3.  **Copier le fichier JAR de l'application** : Après la compilation Maven, le fichier JAR exécutable (`CrisisShield-Backend-0.0.1-SNAPSHOT.jar`) est copié dans l'image.
4.  **Exposer le port** : Le port `8080` est exposé, car c'est le port par défaut sur lequel notre application Spring Boot écoute les requêtes.
5.  **Définir la commande de démarrage** : `java -jar CrisisShield-Backend.jar` est la commande qui sera exécutée lorsque le conteneur démarrera, lançant ainsi l'application Spring Boot.

L'utilisation de Docker permet d'assurer que l'application s'exécutera de manière identique quel que soit l'environnement hôte, facilitant le développement, les tests et le déploiement.

### 🧒 Explication pour un enfant

Imagine que le `Dockerfile` est comme une recette de cuisine très précise pour construire une petite boîte magique (un conteneur Docker).
-   La recette dit : "Prends une base de cuisine Java 17 légère."
-   Ensuite : "Mets tous les ingrédients de notre application (le code compilé) dans un sac appelé `/app`."
-   Puis : "Dis à la boîte que la porte d'entrée est le numéro 8080."
-   Et enfin : "Quand tu ouvres la boîte, lance l'application Java qui est dedans."

Grâce à cette recette, n'importe qui peut construire la même boîte magique, et l'application fonctionnera toujours de la même manière, peu importe où elle est ouverte !

---

## 🇬🇧 English

### 👔 Professional Explanation

The `Dockerfile` is a script that contains a series of instructions to build a Docker image. This image is a lightweight, standalone, executable package that includes everything needed to run an application: the code, a runtime, libraries, environment variables, and configuration files.

For our Spring Boot application, this `Dockerfile` will:
1.  **Use a Java base image**: `eclipse-temurin:17-jdk-alpine` is a lightweight JDK 17 image based on Alpine Linux, ideal for containers.
2.  **Define the working directory**: `/app` will be the folder where our application will be copied and executed.
3.  **Copy the application JAR file**: After Maven compilation, the executable JAR file (`CrisisShield-Backend-0.0.1-SNAPSHOT.jar`) is copied into the image.
4.  **Expose the port**: Port `8080` is exposed, as it's the default port our Spring Boot application listens on for requests.
5.  **Define the startup command**: `java -jar CrisisShield-Backend.jar` is the command that will be executed when the container starts, thus launching the Spring Boot application.

Using Docker ensures that the application will run identically regardless of the host environment, facilitating development, testing, and deployment.

### 🧒 Kid's Explanation

Imagine the `Dockerfile` is like a very precise cooking recipe for building a small magic box (a Docker container).
-   The recipe says: "Take a lightweight Java 17 cooking base."
-   Then: "Put all the ingredients of our application (the compiled code) into a bag called `/app`."
-   Next: "Tell the box that the entrance door is number 8080."
-   And finally: "When you open the box, launch the Java application inside."

Thanks to this recipe, anyone can build the same magic box, and the application will always work the same way, no matter where it's opened!

---

## 🇸🇦 العربية

### 👔 شرح احترافي

`Dockerfile` هو نص برمجي يحتوي على سلسلة من التعليمات لبناء صورة Docker. هذه الصورة هي حزمة خفيفة الوزن ومستقلة وقابلة للتنفيذ تحتوي على كل ما هو ضروري لتشغيل تطبيق: الكود، بيئة التشغيل، المكتبات، متغيرات البيئة، وملفات التكوين.

بالنسبة لتطبيق Spring Boot الخاص بنا، سيقوم هذا `Dockerfile` بما يلي:
1.  **استخدام صورة Java أساسية**: `eclipse-temurin:17-jdk-alpine` هي صورة JDK 17 خفيفة الوزن تعتمد على Alpine Linux، مثالية للحاويات.
2.  **تحديد دليل العمل**: `/app` سيكون المجلد الذي سيتم نسخ وتشغيل تطبيقنا فيه.
3.  **نسخ ملف JAR للتطبيق**: بعد تجميع Maven، يتم نسخ ملف JAR القابل للتنفيذ (`CrisisShield-Backend-0.0.1-SNAPSHOT.jar`) إلى الصورة.
4.  **كشف المنفذ**: يتم كشف المنفذ `8080`، لأنه المنفذ الافتراضي الذي يستمع عليه تطبيق Spring Boot الخاص بنا للطلبات.
5.  **تحديد أمر البدء**: `java -jar CrisisShield-Backend.jar` هو الأمر الذي سيتم تنفيذه عند بدء تشغيل الحاوية، وبالتالي تشغيل تطبيق Spring Boot.

يضمن استخدام Docker أن التطبيق سيعمل بشكل متطابق بغض النظر عن بيئة الاستضافة، مما يسهل التطوير والاختبار والنشر.

### 🧒 شرح لطفل

تخيل أن `Dockerfile` يشبه وصفة طعام دقيقة جدًا لبناء صندوق سحري صغير (حاوية Docker).
-   تقول الوصفة: "خذ قاعدة طهي Java 17 خفيفة الوزن."
-   ثم: "ضع جميع مكونات تطبيقنا (الكود المجمع) في حقيبة تسمى `/app`."
-   بعد ذلك: "أخبر الصندوق أن باب الدخول هو الرقم 8080."
-   وأخيرًا: "عندما تفتح الصندوق، قم بتشغيل تطبيق Java الموجود بداخله."

بفضل هذه الوصفة، يمكن لأي شخص بناء نفس الصندوق السحري، وسيعمل التطبيق دائمًا بنفس الطريقة، بغض النظر عن مكان فتحه!
