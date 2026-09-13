# README: Classe `TenantFilter`

Ce fichier explique le rôle et l'utilité de la classe `TenantFilter.java`.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

`TenantFilter` est un filtre de servlet (`jakarta.servlet.Filter`) qui joue un rôle crucial dans la mise en œuvre de notre stratégie de multi-tenant. Son objectif est d'activer et de paramétrer un filtre Hibernate pour chaque requête HTTP entrante.

**Fonctionnement :**

1.  **Interception de Requête** : En tant que filtre, il s'exécute pour chaque requête qui arrive à l'application.
2.  **Récupération de l'Utilisateur Authentifié** : Il accède au `SecurityContextHolder` de Spring Security pour obtenir les informations de l'utilisateur actuellement authentifié.
3.  **Extraction de l'ID de l'Organisation** : Si un utilisateur est authentifié (et est une instance de notre classe `User`), le filtre extrait l'ID de son organisation.
4.  **Activation du Filtre Hibernate** : Il utilise l'`EntityManager` pour obtenir la session Hibernate sous-jacente et active un filtre Hibernate nommé `organisationFilter`. Il passe l'ID de l'organisation de l'utilisateur comme paramètre à ce filtre.

Le filtre Hibernate `organisationFilter` (qui sera défini au niveau des entités) ajoutera alors automatiquement une clause `WHERE organisation_id = :organisationId` à toutes les requêtes SQL, garantissant ainsi que seules les données appartenant à l'organisation de l'utilisateur sont retournées.

Cette approche est puissante car elle est transparente pour la couche de service et de dépôt, qui n'ont pas besoin de se soucier du filtrage par tenant.

### 🧒 Explication pour un enfant

Imagine que `TenantFilter` est un "contrôleur de passeport" très intelligent à l'entrée de chaque attraction de notre parc.
-   Quand tu arrives à une attraction (une requête HTTP), le contrôleur regarde ton passeport (ton authentification).
-   Il voit de quelle "famille" (organisation) tu fais partie.
-   Il met alors des "lunettes magiques" spéciales (le filtre Hibernate) sur les yeux de l'opérateur de l'attraction.
-   Ces lunettes magiques font que l'opérateur ne peut voir et interagir qu'avec les choses qui appartiennent à ta famille.

Grâce à ce contrôleur de passeport, on est sûr que tu ne monteras jamais dans le manège de la famille voisine par erreur !

---

## 🇬🇧 English

### 👔 Professional Explanation

`TenantFilter` is a servlet filter (`jakarta.servlet.Filter`) that plays a crucial role in implementing our multi-tenant strategy. Its purpose is to enable and parameterize a Hibernate filter for each incoming HTTP request.

**How it works:**

1.  **Request Interception**: As a filter, it runs for every request that comes into the application.
2.  **Retrieving the Authenticated User**: It accesses Spring Security's `SecurityContextHolder` to get the details of the currently authenticated user.
3.  **Extracting the Organisation ID**: If a user is authenticated (and is an instance of our `User` class), the filter extracts their organisation's ID.
4.  **Enabling the Hibernate Filter**: It uses the `EntityManager` to get the underlying Hibernate session and enables a Hibernate filter named `organisationFilter`. It passes the user's organisation ID as a parameter to this filter.

The `organisationFilter` Hibernate filter (which will be defined at the entity level) will then automatically add a `WHERE organisation_id = :organisationId` clause to all SQL queries, ensuring that only data belonging to the user's organisation is returned.

This approach is powerful because it is transparent to the service and repository layers, which do not need to worry about tenant filtering.

### 🧒 Kid's Explanation

Imagine `TenantFilter` is a very smart "passport checker" at the entrance of every ride in our park.
-   When you arrive at a ride (an HTTP request), the checker looks at your passport (your authentication).
-   It sees which "family" (organisation) you belong to.
-   It then puts special "magic glasses" (the Hibernate filter) on the ride operator's eyes.
-   These magic glasses make it so the operator can only see and interact with things that belong to your family.

Thanks to this passport checker, we're sure you'll never accidentally get on the wrong family's ride!
