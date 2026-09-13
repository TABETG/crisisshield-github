# ADR 0002 — JWT maison sur LDAP maintenant, Keycloak ensuite

Date : 2026-09-12 — Statut : accepte

## Contexte
L'authentification actuelle : bind LDAP, puis jeton HS256 signe par un secret partage, plus MFA TOTP maison.

## Options
1. Garder le JWT maison — deja en place, controle total, mais secret partage et pas de federation
2. Passer a Keycloak tout de suite — OpenID Connect standard, federation LDAP, mais chantier de 8 points avant toute fonctionnalite

## Decision
Garder le JWT maison pour faire tourner le projet, avec deux corrections immediates :
- duree de vie du jeton ramenee a 15 minutes
- passage en signature asymetrique, cle dans KMS (EP02-US06)

Puis introduire Keycloak en federation LDAP (EP02-US07) une fois l'assistant IA demontrable.

## Raisons
- Un projet qui tourne vaut plus qu'une architecture ideale qui ne tourne pas
- La signature asymetrique est le vrai gain de securite ; Keycloak est un gain d'interoperabilite

## Consequences
- Le code JWT maison est une dette assumee, datee, avec son ticket de sortie
