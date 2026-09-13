# README: Classe `Organisation`

Ce fichier explique le rôle et l'utilité de la classe `Organisation.java`.

---

## 🇫🇷 Français

### 👔 Explication Professionnelle

La classe `Organisation` est une entité JPA qui représente un "tenant" dans notre application multi-tenant. Elle est au cœur de la stratégie de cloisonnement des données, garantissant que les informations d'une organisation restent isolées des autres.

**Rôle et Fonctionnalités :**

-   **Entité de Tenant** : Chaque instance de cette classe représente une organisation cliente distincte (par exemple, une entreprise, une filiale, etc.).
-   **Isolation des Données** : C'est le point de rattachement pour toutes les autres entités critiques du système (utilisateurs, plans de crise, etc.). En liant chaque ressource à une `Organisation`, nous pouvons mettre en place des filtres de sécurité qui garantissent qu'un utilisateur ne peut accéder qu'aux données de sa propre organisation.
-   **Persistance** : Annotée avec `@Entity` et `@Table`, elle est mappée à une table `organisation` dans la base de données.
-   **Identifiant Unique** : Chaque organisation a un `id` unique (UUID), qui sert de clé primaire et de "tenant ID" dans tout le système.
-   **Nom Unique** : Le `name` de l'organisation est également unique pour éviter les doublons et faciliter l'identification.

Cette entité est fondamentale pour construire une application SaaS sécurisée et scalable, où les données de chaque client sont strictement séparées.

### 🧒 Explication pour un enfant

Imagine que notre application est un grand immeuble avec plein d'appartements. La classe `Organisation` est comme un "appartement".
-   Chaque famille (chaque client) a son propre appartement (`Organisation`) avec un numéro unique sur la porte (`id`).
-   Tout ce qui appartient à une famille (ses meubles, ses jouets, ses secrets) est rangé *uniquement* dans son appartement. On ne mélange jamais les affaires des voisins !
-   Quand quelqu'un veut entrer dans un appartement, on vérifie qu'il a bien la clé de cet appartement.

La classe `Organisation` est donc la "boîte" qui contient toutes les données d'un client pour s'assurer que personne d'autre ne puisse y toucher.

---

## 🇬🇧 English

### 👔 Professional Explanation

The `Organisation` class is a JPA entity that represents a "tenant" in our multi-tenant application. It is central to the data partitioning strategy, ensuring that one organization's information remains isolated from others.

**Role and Features:**

-   **Tenant Entity**: Each instance of this class represents a distinct client organization (e.g., a company, a subsidiary, etc.).
-   **Data Isolation**: It serves as the attachment point for all other critical entities in the system (users, crisis plans, etc.). By linking each resource to an `Organisation`, we can implement security filters that ensure a user can only access their own organization's data.
-   **Persistence**: Annotated with `@Entity` and `@Table`, it is mapped to an `organisation` table in the database.
-   **Unique Identifier**: Each organization has a unique `id` (UUID), which serves as the primary key and "tenant ID" throughout the system.
-   **Unique Name**: The `name` of the organization is also unique to prevent duplicates and facilitate identification.

This entity is fundamental to building a secure and scalable SaaS application where each customer's data is strictly separated.

### 🧒 Kid's Explanation

Imagine our application is a large apartment building. The `Organisation` class is like an "apartment".
-   Each family (each customer) has its own apartment (`Organisation`) with a unique number on the door (`id`).
-   Everything that belongs to a family (their furniture, toys, secrets) is kept *only* in their apartment. We never mix the neighbors' belongings!
-   When someone wants to enter an apartment, we check that they have the key for that specific apartment.

So, the `Organisation` class is the "box" that holds all of a customer's data to ensure that no one else can touch it.
