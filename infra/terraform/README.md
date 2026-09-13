# Infrastructure AWS — EP01-US08 (a faire)

Perimetre prevu, dans cet ordre :

1. `network` — VPC, sous-reseaux prives, points de terminaison VPC pour KMS et Secrets Manager
2. `identity` — fournisseur OIDC GitLab, role assume par la chaine CI sans cle statique
3. `registry` — ECR avec analyse d'images et etiquettes immuables
4. `kms` — cle asymetrique de signature des jetons (EP02-US06) et cle racine de l'autorite de certification (EP09-US06)
5. `secrets` — Secrets Manager, rotation
6. `cluster` — EKS, chiffrement du magasin de configuration par KMS

Critere de fin : `terraform destroy` puis `terraform apply` reconstruit un environnement fonctionnel.

Garde-fou budget : alerte AWS Budgets a 30 EUR avant la premiere ligne. Ne jamais provisionner CloudHSM (environ 1 400 USD/mois).
