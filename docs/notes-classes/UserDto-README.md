# README: Classe `UserDto`

Ce fichier explique le rôle et l'utilité de la classe `UserDto.java`.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

`UserDto` (Data Transfer Object) est une classe record utilisée pour représenter les données d'un utilisateur lors de leur transfert depuis le backend vers le frontend ou d'autres services. Son rôle principal est de découpler l'entité `User` du domaine de l'API, garantissant ainsi que seules les informations pertinentes et non sensibles sont exposées. Notamment, le mot de passe de l'utilisateur n'est jamais inclus dans ce DTO, ce qui renforce la sécurité. Il inclut l'ID, le nom d'utilisateur, l'email, les rôles (sous forme de chaînes de caractères) et le statut d'activation (`enabled`). La méthode statique `fromEntity` facilite la conversion d'une entité `User` en `UserDto`.

### 🧒 Explication pour un enfant

Imagine que `UserDto` est comme une carte d'identité simplifiée pour les utilisateurs. Quand quelqu'un demande des informations sur un utilisateur, on ne lui donne pas tous les secrets (comme le mot de passe). On lui donne juste ce qui est utile et sans danger : son nom, son email, ses "clés" (rôles) et si sa carte est toujours valide (`enabled`). C'est pour protéger les informations secrètes !

---

## 🇬🇧 English

### 👔 Professional Explanation

`UserDto` (Data Transfer Object) is a record class used to represent user data when transferred from the backend to the frontend or other services. Its primary role is to decouple the domain `User` entity from the API, ensuring that only relevant and non-sensitive information is exposed. Notably, the user's password is never included in this DTO, which enhances security. It includes the ID, username, email, roles (as strings), and the enabled status. The static `fromEntity` method facilitates the conversion of a `User` entity to a `UserDto`.

### 🧒 Kid's Explanation

Imagine `UserDto` is like a simplified ID card for users. When someone asks for information about a user, we don't give them all the secrets (like the password). We just give them what's useful and safe: their name, email, their "keys" (roles), and if their card is still valid (`enabled`). This is to protect secret information!

---

## 🇸🇦 العربية

### 👔 شرح احترافي

`UserDto` (كائن نقل البيانات) هو فئة سجل تُستخدم لتمثيل بيانات المستخدم عند نقلها من الواجهة الخلفية إلى الواجهة الأمامية أو الخدمات الأخرى. دورها الأساسي هو فصل كيان `User` الخاص بالمجال عن واجهة برمجة التطبيقات (API)، مما يضمن عرض المعلومات ذات الصلة وغير الحساسة فقط. على وجه الخصوص، لا يتم تضمين كلمة مرور المستخدم أبدًا في هذا الكائن، مما يعزز الأمان. يتضمن المعرف، اسم المستخدم، البريد الإلكتروني، الأدوار (كسلاسل نصية)، وحالة التمكين (`enabled`). تسهل الدالة الثابتة `fromEntity` تحويل كيان `User` إلى `UserDto`.

### 🧒 شرح لطفل

تخيل أن `UserDto` يشبه بطاقة هوية مبسطة للمستخدمين. عندما يطلب شخص ما معلومات عن مستخدم، لا نعطيه كل الأسرار (مثل كلمة المرور). نعطيه فقط ما هو مفيد وآمن: اسمه، بريده الإلكتروني، "مفاتيحه" (الأدوار)، وما إذا كانت بطاقته لا تزال صالحة (`enabled`). هذا لحماية المعلومات السرية!
