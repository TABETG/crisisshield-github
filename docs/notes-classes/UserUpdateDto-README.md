# README: Classe `UserUpdateDto`

Ce fichier explique le rôle et l'utilité de la classe `UserUpdateDto.java`.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

`UserUpdateDto` est un DTO (Data Transfer Object) utilisé pour encapsuler les données envoyées lors de la mise à jour d'un utilisateur existant via l'API. Il contient les champs `username`, `email`, `password` (optionnel), `roles` et `enabled`. Le mot de passe est optionnel car il n'est pas toujours nécessaire de le modifier lors d'une mise à jour d'autres informations. Ce DTO permet de contrôler précisément quelles informations peuvent être modifiées et assure une validation côté API avant que les données n'atteignent la couche de service. La méthode `toEntity()` crée une entité `User` temporaire avec les champs à mettre à jour, qui sera ensuite fusionnée avec l'entité existante par le service.

### 🧒 Explication pour un enfant

Imagine que `UserUpdateDto` est comme un petit mot que tu envoies au garde du château pour lui dire que tu veux changer quelque chose sur ta carte d'identité. Tu peux changer ton nom, ton email, tes "clés" (rôles) ou dire si ta carte doit être activée ou désactivée. Si tu ne veux pas changer ton mot de passe secret, tu n'as pas besoin de l'écrire sur le mot. Le garde prend ton mot et met à jour ta vraie carte d'identité.

---

## 🇬🇧 English

### 👔 Professional Explanation

`UserUpdateDto` is a DTO (Data Transfer Object) used to encapsulate data sent when updating an existing user via the API. It contains the `username`, `email`, `password` (optional), `roles`, and `enabled` fields. The password is optional because it's not always necessary to change it when updating other information. This DTO allows precise control over which information can be modified and ensures API-side validation before data reaches the service layer. The `toEntity()` method creates a temporary `User` entity with the fields to be updated, which will then be merged with the existing entity by the service.

### 🧒 Kid's Explanation

Imagine `UserUpdateDto` is like a small note you send to the castle guard to tell him you want to change something on your ID card. You can change your name, email, your "keys" (roles), or say whether your card should be enabled or disabled. If you don't want to change your secret password, you don't need to write it on the note. The guard takes your note and updates your real ID card.

---

## 🇸🇦 العربية

### 👔 شرح احترافي

`UserUpdateDto` هو كائن نقل بيانات (DTO) يستخدم لتغليف البيانات المرسلة عند تحديث مستخدم موجود عبر واجهة برمجة التطبيقات (API). يحتوي على حقول `username` و `email` و `password` (اختياري) و `roles` و `enabled`. كلمة المرور اختيارية لأنه ليس من الضروري دائمًا تغييرها عند تحديث معلومات أخرى. يتيح هذا الكائن التحكم الدقيق في المعلومات التي يمكن تعديلها ويضمن التحقق من صحة البيانات من جانب واجهة برمجة التطبيقات قبل وصولها إلى طبقة الخدمة. تنشئ الدالة `toEntity()` كيان `User` مؤقتًا بالحقول المراد تحديثها، والذي سيتم دمجه بعد ذلك مع الكيان الموجود بواسطة الخدمة.

### 🧒 شرح لطفل

تخيل أن `UserUpdateDto` يشبه ملاحظة صغيرة ترسلها إلى حارس القلعة لتخبره أنك تريد تغيير شيء ما في بطاقة هويتك. يمكنك تغيير اسمك، بريدك الإلكتروني، "مفاتيحك" (الأدوار)، أو تحديد ما إذا كان يجب تفعيل بطاقتك أو تعطيلها. إذا كنت لا ترغب في تغيير كلمة مرورك السرية، فلن تحتاج إلى كتابتها في الملاحظة. يأخذ الحارس ملاحظتك ويحدث بطاقة هويتك الحقيقية.
