# README: Classe `MfaDisableRequest`

Ce fichier explique le rôle et l'utilité de la classe `MfaDisableRequest.java`.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

`MfaDisableRequest` est un DTO (Data Transfer Object) utilisé pour encapsuler les données envoyées par le client lorsqu'il souhaite désactiver l'authentification multi-facteurs (MFA) pour son compte. Pour des raisons de sécurité, la désactivation du MFA nécessite généralement une confirmation. Ce DTO contient le `code` TOTP actuel de l'utilisateur, qui doit être vérifié par le serveur avant de procéder à la désactivation. Cela empêche une désactivation non autorisée du MFA si l'accès au compte principal est compromis.

### 🧒 Explication pour un enfant

Imagine que `MfaDisableRequest` est comme un message que tu envoies à l'application pour lui dire : "Je veux enlever ma super serrure". Mais pour être sûr que c'est bien toi qui demandes, l'application te demande de lui donner le petit code à 6 chiffres que ton application d'authentification te montre en ce moment. Si le code est bon, l'application enlève la super serrure.

---

## 🇬🇧 English

### 👔 Professional Explanation

`MfaDisableRequest` is a DTO (Data Transfer Object) used to encapsulate data sent by the client when they wish to disable Multi-Factor Authentication (MFA) for their account. For security reasons, disabling MFA typically requires confirmation. This DTO contains the user's current TOTP `code`, which must be verified by the server before proceeding with the deactivation. This prevents unauthorized MFA deactivation if the primary account access is compromised.

### 🧒 Kid's Explanation

Imagine `MfaDisableRequest` is like a message you send to the app to tell it: "I want to remove my super lock." But to make sure it's really you asking, the app asks you to provide the small 6-digit code that your authenticator app is currently showing you. If the code is correct, the app removes the super lock.

---

## 🇸🇦 العربية

### 👔 شرح احترافي

`MfaDisableRequest` هو كائن نقل بيانات (DTO) يستخدم لتغليف البيانات المرسلة من العميل عندما يرغب في تعطيل المصادقة متعددة العوامل (MFA) لحسابه. لأسباب أمنية، يتطلب تعطيل MFA عادة تأكيدًا. يحتوي هذا الكائن على `code` TOTP الحالي للمستخدم، والذي يجب التحقق منه بواسطة الخادم قبل المتابعة في عملية التعطيل. هذا يمنع تعطيل MFA غير المصرح به إذا تم اختراق الوصول الأساسي للحساب.

### 🧒 شرح لطفل

تخيل أن `MfaDisableRequest` يشبه رسالة ترسلها إلى التطبيق لتقول له: "أريد إزالة قفلي الفائق". ولكن للتأكد من أنك أنت من يطلب ذلك، يطلب منك التطبيق تقديم الرمز الصغير المكون من 6 أرقام الذي يظهره لك تطبيق المصادقة الخاص بك حاليًا. إذا كان الرمز صحيحًا، يقوم التطبيق بإزالة القفل الفائق.
