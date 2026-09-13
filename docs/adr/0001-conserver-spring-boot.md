# ADR 0001 — Conserver Spring Boot plutot que migrer vers Quarkus

Date : 2026-09-12 — Statut : accepte

## Contexte
Le backend existe en Spring Boot 3.2 depuis decembre 2025. Quarkus etait envisage pour le projet vitrine.

## Options
1. Migrer vers Quarkus — plus rare sur le marche, demarrage plus rapide
2. Conserver Spring Boot — code existant, ecosysteme securite le plus documente

## Decision
Conserver Spring Boot. Passer a Java 21.

## Raisons
- Une migration couterait environ un mois sans apporter de fonctionnalite
- Spring Security est la reference des offres visees
- Le backlog securite s'applique a l'identique sur les deux cadres

## Consequences
- Aucune. Quarkus reste un sujet de veille, pas un chantier.
