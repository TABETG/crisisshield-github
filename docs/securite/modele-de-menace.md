# Modele de menace — CrisisShield et son assistant IA

Statut : brouillon a completer (ticket GATE-1 / EP17-US05). Duree cible : une demi-journee.

## 1. Diagramme de flux de donnees

```
[Poste utilisateur] --F1--> [Backend Spring Boot] --F2--> [Fournisseur du modele]
                                    |
                                   F3
                                    v
                    [PostgreSQL]  [OpenLDAP]  [Journaux]
```

Frontieres de confiance :
- F1 : le poste utilisateur est hostile jusqu'a authentification
- F2 : le fournisseur est externe ; ce qui y part est perdu, ce qui en revient est hostile
- F3 : les services internes se font confiance — a remplacer par du TLS mutuel (EP09-US07)

## 2. Menaces STRIDE — huit retenues

| # | Categorie | Menace | Probabilite | Impact | Mitigation | Ticket |
|---|---|---|---|---|---|---|
| 1 | Divulgation | Un plan de crise contenant des noms et astreintes part chez le fournisseur | Haute | Haut | Masquage avant envoi | EP18-US04 |
| 2 | Elevation | Un utilisateur d'une organisation lit les crises d'une autre | Moyenne | Critique | Filtre par organisation + tests d'isolation | EP03-US05 |
| 3 | Alteration | Injection indirecte via un document de plan modifie le comportement de l'assistant | Moyenne | Haut | Moindre capacite, delimitation des documents | EP18-US05, US08 |
| 4 | Usurpation | Jeton forge par confusion d'algorithme | Faible | Critique | Signature asymetrique, tests negatifs | EP02-US06, US09 |
| 5 | Deni de service | Boucle d'appels a l'assistant epuise le budget | Haute | Moyen | Seau a jetons, plafond, disjoncteur | EP18-US06 |
| 6 | Repudiation | « Ce n'est pas moi qui ai cloture la crise » | Moyenne | Haut | Journaux chaines, rapport signe | EP08-US04, EP05-US08 |
| 7 | Divulgation | Kit d'urgence copie sur une cle USB perdue | Moyenne | Critique | Chiffrement par enveloppe, quorum | EP07-US04, US05 |
| 8 | Divulgation | Fuite du prompt systeme et des regles internes | Haute | Faible | Controle de sortie | EP18-US07 |

## 3. Risques acceptes

| Menace | Raison de ne pas traiter maintenant | Compensation | Porteur |
|---|---|---|---|
| Exfiltration par injection indirecte sophistiquee (encodage, multi-tours) | Cout disproportionne a ce stade | Journalisation integrale, alerte sur volume de sortie | *a nommer* |
| Compromission du poste utilisateur | Hors perimetre de l'application | MFA, jetons courts | *a nommer* |

## 4. Ce qui reste a faire dans ce document
- Valider les cotations avec un second regard
- Nommer les porteurs des risques acceptes
- Revoir a chaque changement d'architecture, au minimum chaque trimestre
