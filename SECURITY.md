# Politique de securite

CrisisShield est un projet de formation et de demonstration. Il n'est pas en production.

## Signaler une vulnerabilite

Ouvrez une issue privee via l'onglet « Security » du depot (Security Advisories), ou contactez le mainteneur directement.
Merci de ne pas ouvrir d'issue publique pour une faille exploitable.

## Perimetre

- Authentification LDAP, jetons RS256, MFA TOTP
- Isolation multi-locataire par filtre Hibernate
- Assistant IA : filtrage d'injection, masquage des donnees personnelles, limitation de debit

## Ce qui est connu et assume

Voir `docs/securite/modele-de-menace.md`, section « Risques acceptes ».
