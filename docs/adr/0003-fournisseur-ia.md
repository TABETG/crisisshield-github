# ADR 0003 — Fournisseur du modele de langage

Date : 2026-09-12 — Statut : a decider (EP18-US02)

## Contexte
L'assistant a besoin d'un modele. Les donnees d'une crise sont sensibles (noms, astreintes, adresses).

## Options
1. Amazon Bedrock — le modele s'execute dans le compte AWS, dans la region choisie ; Guardrails natifs
2. Fournisseur externe (API) — plus de choix de modeles, donnees qui sortent du perimetre
3. Modele auto-heberge — controle total, cout d'exploitation et de competences eleve

## Criteres
- Les donnees quittent-elles le perimetre de l'organisation ?
- Cout par million de jetons
- Effort d'integration depuis Spring Boot
- Auditabilite des appels

## Decision
Non prise. Le fournisseur simule (`MockModelProvider`) permet de developper toute la chaine en attendant.

## A faire pour decider
- Chiffrer un mois d'usage sur les deux premieres options
- Verifier la politique de retention et d'entrainement de chaque fournisseur
