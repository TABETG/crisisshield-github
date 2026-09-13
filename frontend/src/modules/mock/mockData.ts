export const USE_MOCK_DATA = true as const;

/* =============================================================================
   CRISISSHIELD - COHERENT DEMO STORY
   =============================================================================

   Main tenant: HexaBank (French retail bank, NIS2/ISO 22301)
   Secondary tenant: NovaCloud (Cloud/SaaS provider)

   Timeline:
   - Early 2025: HexaBank adopts CrisisShield
   - 12 Oct 2025: Datacenter outage (CLOSED)
   - 30 Nov 2025: Ransomware attack (IN PROGRESS)

============================================================================= */

/* -------------------------------------------------------------------------- */
/* 1) MARKETING / LANDING                                                     */
/* -------------------------------------------------------------------------- */

export const marketingStats = {
  organisationsProtected: 247,
  incidentsHandled: 1842,
  avgDetectionMinutes: 8,
  avgContainmentHours: 2.4,
  avgRecoveryHours: 5.2,
  availabilityPercent: 99.97,
  countries: 14,
  npsScore: 68,
  crisisResolvedLast30Days: 156,
  totalUsersActive: 3420,
};

export const marketingLogos = [
  "HexaBank",
  "NovaCloud",
  "CityCare Hospital",
  "BlueShield Insurance",
  "DataForge Consulting",
];

export const marketingUseCases = [
  {
    id: "ransomware",
    title: "Attaque ransomware",
    pain: "Chiffrement massif des serveurs, paralysie de la production, pression médiatique.",
    solution: "Plans de crise dédiés, war room en temps réel, journalisation complète des décisions, kits d'urgence offline.",
    result: "Temps moyen de reprise ramené sous 6 heures, preuves structurées pour les assurances et les régulateurs.",
    icon: "🔐",
    stat: "92% faster response"
  },
  {
    id: "datacenter-outage",
    title: "Panne datacenter / cloud",
    pain: "Indisponibilité totale des applications critiques, pression des clients B2B.",
    solution: "Scénarios d'escalade, responsables identifiés, checklists techniques, communication interne/externe centralisée.",
    result: "Coordination des équipes infra/devops/market, réduction du MTTR et meilleure traçabilité post-incident.",
    icon: "🏥",
    stat: "65% less downtime"
  },
  {
    id: "data-leak",
    title: "Fuite de données sensibles",
    pain: "Obligation de notifier la CNIL, les clients, et de piloter une enquête interne complète.",
    solution: "Plan 'Data Leak' prêt à l'emploi, timeline des actions, journal d'audit inviolable, génération de rapports post-mortem.",
    result: "Réponse structurée et documentée, réduction du risque juridique et d'atteinte à la réputation.",
    icon: "📊",
    stat: "100% compliance"
  },
];

export const marketingTestimonials = [
  {
    id: "test-1",
    author: "Claire Martin",
    role: "CISO",
    quote: "Depuis que nous utilisons CrisisShield, chaque incident majeur est piloté, tracé et exploitable pour l'amélioration continue. Le gain de temps est considérable.",
    company: "HexaBank",
    avatar: "CM",
  },
  {
    id: "test-2",
    author: "Julien Dupont",
    role: "Responsable Ops",
    quote: "En 2025, nous avons réduit de 40% notre temps moyen de reprise sur les incidents critiques. La War Room est devenue notre outil indispensable.",
    company: "NovaCloud",
    avatar: "JD",
  },
  {
    id: "test-3",
    author: "Sophie Bernard",
    role: "DPO",
    quote: "La traçabilité complète et les rapports d'audit nous ont fait gagner des semaines lors de notre dernière certification ISO 22301.",
    company: "CityCare Hospital",
    avatar: "SB",
  },
];

export const marketingFaq = [
  {
    question: "À qui s'adresse CrisisShield ?",
    answer: "Aux PME/ETI, ESN/MSSP, et organisations soumises à des exigences fortes en matière de continuité d'activité et de cybersécurité (NIS2, ISO 22301).",
  },
  {
    question: "Combien de temps faut-il pour être opérationnel ?",
    answer: "En moins d'une journée, vous pouvez importer vos premiers plans de crise et organiser votre première simulation.",
  },
];

/* -------------------------------------------------------------------------- */
/* 2) PRICING                                                                 */
/* -------------------------------------------------------------------------- */

export const pricingPlans = [
  {
    id: "pme",
    name: "PME",
    pricePerMonth: 290,
    currency: "EUR",
    highlight: false,
    description: "Pour les PME qui veulent structurer leur réponse aux crises.",
    features: [
      "Jusqu'à 25 utilisateurs",
      "Plans de crise illimités",
      "1 War Room active",
      "Emergency kits (PDF + QR)",
      "Support par email (J+1)",
      "100 GB de stockage documents",
      "Logs d'audit (90 jours)",
    ],
  },
  {
    id: "esn-mssp",
    name: "ESN / MSSP",
    pricePerMonth: 1290,
    currency: "EUR",
    highlight: true,
    description: "Pour les prestataires qui gèrent plusieurs clients.",
    features: [
      "Multi-tenant (clients illimités)",
      "Utilisateurs illimités par client",
      "War Rooms parallèles illimitées",
      "Dashboard partenaire",
      "White-label (logo, domaine)",
      "Support prioritaire (4h)",
      "1 TB de stockage par client",
      "Logs d'audit (2 ans)",
      "API complète",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    pricePerMonth: null,
    currency: "EUR",
    highlight: false,
    description: "Pour les grandes organisations avec besoins avancés.",
    features: [
      "Tout ESN/MSSP +",
      "SSO / SAML",
      "PKI / HSM (hardware security)",
      "On-premise possible",
      "Support 24/7 (SLA <1h)",
      "Stockage illimité",
      "Logs d'audit illimités",
      "Formation sur site",
      "Intégrations custom",
      "Revue légale & conformité",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* 3) ORGANISATIONS                                                           */
/* -------------------------------------------------------------------------- */

export const organisations = [
  {
    id: "org-hexabank",
    name: "HexaBank",
    domain: "hexabank.fr",
    sector: "Finance / Banque",
    size: "5000+ employés",
    country: "France",
    createdAt: "2025-01-15T10:00:00Z",
    plan: "ESN / MSSP",
    compliance: ["NIS2", "ISO 22301", "GDPR"],
  },
  {
    id: "org-novacloud",
    name: "NovaCloud",
    domain: "novacloud.io",
    sector: "Cloud / SaaS",
    size: "200-500 employés",
    country: "France",
    createdAt: "2024-11-01T10:00:00Z",
    plan: "PME",
    compliance: ["ISO 27001", "GDPR"],
  },
];

/* -------------------------------------------------------------------------- */
/* 4) USERS                                                                   */
/* -------------------------------------------------------------------------- */

export const mockCurrentUser = {
  id: "user-claire",
  email: "claire.martin@hexabank.fr",
  fullName: "Claire Martin",
  role: "ORG_ADMIN" as const,
  organisationId: "org-hexabank",
  jobTitle: "CISO",
  createdAt: "2025-01-15T10:30:00Z",
};

export const organisationUsers = [
  {
    id: "user-claire",
    email: "claire.martin@hexabank.fr",
    fullName: "Claire Martin",
    role: "ORG_ADMIN" as const,
    organisationId: "org-hexabank",
    jobTitle: "CISO",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "user-thomas",
    email: "thomas.dubois@hexabank.fr",
    fullName: "Thomas Dubois",
    role: "ORG_MANAGER" as const,
    organisationId: "org-hexabank",
    jobTitle: "Crisis Manager",
    createdAt: "2025-01-15T11:00:00Z",
  },
  {
    id: "user-marie",
    email: "marie.lefebvre@hexabank.fr",
    fullName: "Marie Lefebvre",
    role: "ORG_USER" as const,
    organisationId: "org-hexabank",
    jobTitle: "CTO",
    createdAt: "2025-01-16T09:00:00Z",
  },
  {
    id: "user-pierre",
    email: "pierre.rousseau@hexabank.fr",
    fullName: "Pierre Rousseau",
    role: "ORG_AUDITOR" as const,
    organisationId: "org-hexabank",
    jobTitle: "Compliance Officer",
    createdAt: "2025-01-16T10:00:00Z",
  },
];

/* -------------------------------------------------------------------------- */
/* 5) CRISIS PLANS                                                            */
/* -------------------------------------------------------------------------- */

export const crisisPlans = [
  {
    id: "plan-ransomware",
    organisationId: "org-hexabank",
    name: "Attaque ransomware sur le SI bancaire",
    type: "CYBER_ATTACK",
    criticality: "CRITIQUE",
    status: "ACTIVE",
    description: "Plan d'intervention en cas de chiffrement malveillant des systèmes d'information de production.",
    nextReviewDate: "2026-01-15",
    createdAt: "2025-01-20T14:00:00Z",
    updatedAt: "2025-10-01T10:00:00Z",
    version: "2.1",
    steps: [
      {
        id: "step-r1",
        orderIndex: 1,
        title: "Détection et alerte initiale",
        description: "Identifier les premiers signes de chiffrement (SOC, EDR, alertes utilisateurs). Déclencher l'alerte au Crisis Manager.",
        role: "SOC Team",
        targetDurationMinutes: 15,
        criticality: "CRITIQUE",
      },
      {
        id: "step-r2",
        orderIndex: 2,
        title: "Isolation des systèmes compromis",
        description: "Couper les accès réseau des serveurs affectés pour limiter la propagation. Créer une sauvegarde forensique des logs.",
        role: "Infrastructure Team",
        targetDurationMinutes: 30,
        criticality: "CRITIQUE",
      },
      {
        id: "step-r3",
        orderIndex: 3,
        title: "Activation de la cellule de crise",
        description: "Convoquer CISO, CTO, DG, RSSI, DPO, Juriste. Lancer la War Room CrisisShield. Désigner un secrétaire de séance.",
        role: "Crisis Manager",
        targetDurationMinutes: 20,
        criticality: "HAUTE",
      },
      {
        id: "step-r4",
        orderIndex: 4,
        title: "Communication interne",
        description: "Informer les équipes IT, métiers critiques, direction. Utiliser le template email pré-approuvé.",
        role: "Communication Team",
        targetDurationMinutes: 30,
        criticality: "HAUTE",
      },
      {
        id: "step-r5",
        orderIndex: 5,
        title: "Analyse forensique et containment",
        description: "Identifier le vecteur d'infection, l'étendue du chiffrement, et bloquer toute propagation supplémentaire.",
        role: "SOC Team",
        targetDurationMinutes: 120,
        criticality: "HAUTE",
      },
      {
        id: "step-r6",
        orderIndex: 6,
        title: "Décision : payer ou restaurer",
        description: "Évaluer l'impact business, la faisabilité de restoration depuis backups, et décider de la stratégie (ne pas payer sauf avis DG).",
        role: "CISO",
        targetDurationMinutes: 60,
        criticality: "CRITIQUE",
      },
      {
        id: "step-r7",
        orderIndex: 7,
        title: "Scénario de reprise",
        description: "Restaurer les backups sains, reconstruire les environnements, tester la reprise métier avant remise en production.",
        role: "Infrastructure Team",
        targetDurationMinutes: 480,
        criticality: "HAUTE",
      },
      {
        id: "step-r8",
        orderIndex: 8,
        title: "Communication externe et régulateur",
        description: "Notifier ANSSI, assureur cyber, clients si données exposées. Préparer communiqué de presse si nécessaire.",
        role: "Legal & Communication",
        targetDurationMinutes: 120,
        criticality: "HAUTE",
      },
    ],
  },
  {
    id: "plan-datacenter",
    organisationId: "org-hexabank",
    name: "Indisponibilité complète du datacenter primaire",
    type: "INFRASTRUCTURE_OUTAGE",
    criticality: "HAUTE",
    status: "ACTIVE",
    description: "Plan de bascule sur le datacenter de secours en cas de panne totale du site principal.",
    nextReviewDate: "2026-04-01",
    createdAt: "2025-01-22T09:00:00Z",
    updatedAt: "2025-09-15T14:00:00Z",
    version: "1.5",
    steps: [
      {
        id: "step-d1",
        orderIndex: 1,
        title: "Détection de l'indisponibilité",
        description: "Monitoring détecte la perte totale du datacenter primaire (pas de heartbeat, timeouts généralisés).",
        role: "NOC Team",
        targetDurationMinutes: 5,
        criticality: "CRITIQUE",
      },
      {
        id: "step-d2",
        orderIndex: 2,
        title: "Activation cellule de crise",
        description: "Convoquer CTO, responsables infra, réseau, applicatifs. Ouvrir War Room.",
        role: "Infrastructure Manager",
        targetDurationMinutes: 15,
        criticality: "HAUTE",
      },
      {
        id: "step-d3",
        orderIndex: 3,
        title: "Bascule DNS et load balancers",
        description: "Rediriger le trafic vers le datacenter de secours (site B). Vérifier la réplication des bases de données.",
        role: "Network Team",
        targetDurationMinutes: 30,
        criticality: "CRITIQUE",
      },
      {
        id: "step-d4",
        orderIndex: 4,
        title: "Tests de continuité applicative",
        description: "Vérifier que les services critiques (paiements, accès client) fonctionnent sur le site B.",
        role: "Application Team",
        targetDurationMinutes: 45,
        criticality: "HAUTE",
      },
      {
        id: "step-d5",
        orderIndex: 5,
        title: "Communication clients",
        description: "Publier message sur status page, informer clients business. Template pré-approuvé.",
        role: "Communication Team",
        targetDurationMinutes: 20,
        criticality: "MOYENNE",
      },
    ],
  },
  {
    id: "plan-dataleak",
    organisationId: "org-hexabank",
    name: "Fuite de données clients sensibles",
    type: "DATA_LEAK",
    criticality: "CRITIQUE",
    status: "ACTIVE",
    description: "Procédure en cas de fuite avérée ou suspectée de données personnelles clients (RGPD).",
    nextReviewDate: "2026-02-01",
    createdAt: "2025-01-25T16:00:00Z",
    updatedAt: "2025-08-10T11:00:00Z",
    version: "1.3",
    steps: [
      {
        id: "step-l1",
        orderIndex: 1,
        title: "Qualification de l'incident",
        description: "Identifier la nature des données (PII, financières), le volume, et l'origine de la fuite.",
        role: "DPO",
        targetDurationMinutes: 30,
        criticality: "CRITIQUE",
      },
      {
        id: "step-l2",
        orderIndex: 2,
        title: "Containment immédiat",
        description: "Bloquer l'accès non autorisé, supprimer le leak public si possible (DMCA, contact hosting).",
        role: "Security Team",
        targetDurationMinutes: 60,
        criticality: "CRITIQUE",
      },
      {
        id: "step-l3",
        orderIndex: 3,
        title: "Notification CNIL (72h)",
        description: "Rédiger et envoyer la notification de violation de données à la CNIL dans le délai légal de 72h.",
        role: "DPO",
        targetDurationMinutes: 240,
        criticality: "CRITIQUE",
      },
      {
        id: "step-l4",
        orderIndex: 4,
        title: "Notification clients concernés",
        description: "Informer les personnes dont les données ont fuité, proposer mesures de protection (surveillance crédit, etc.).",
        role: "Communication & Legal",
        targetDurationMinutes: 180,
        criticality: "HAUTE",
      },
      {
        id: "step-l5",
        orderIndex: 5,
        title: "Analyse post-mortem et actions correctives",
        description: "Identifier la cause racine, mettre en place des correctifs pour éviter récidive.",
        role: "CISO",
        targetDurationMinutes: 480,
        criticality: "HAUTE",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* 6) CRISIS EVENTS                                                           */
/* -------------------------------------------------------------------------- */

export const crisisEvents = [
  {
    id: "event-datacenter-oct",
    organisationId: "org-hexabank",
    planId: "plan-datacenter",
    name: "Panne datacenter primaire – 12/10/2025",
    status: "CLOTURE",
    severity: "HAUTE",
    startedAt: "2025-10-12T14:23:00Z",
    closedAt: "2025-10-12T18:45:00Z",
    owner: "user-marie",
    description: "Perte complète du datacenter de Paris suite à une coupure électrique. Bascule réussie sur Lyon.",
    tasks: [
      {
        id: "task-dc1",
        title: "Détection panne",
        assignedTo: "user-marie",
        status: "FAIT",
        priority: "CRITIQUE",
        createdAt: "2025-10-12T14:23:00Z",
        completedAt: "2025-10-12T14:28:00Z",
      },
      {
        id: "task-dc2",
        title: "Activation cellule de crise",
        assignedTo: "user-thomas",
        status: "FAIT",
        priority: "HAUTE",
        createdAt: "2025-10-12T14:28:00Z",
        completedAt: "2025-10-12T14:40:00Z",
      },
      {
        id: "task-dc3",
        title: "Bascule DNS vers Lyon",
        assignedTo: "user-marie",
        status: "FAIT",
        priority: "CRITIQUE",
        createdAt: "2025-10-12T14:40:00Z",
        completedAt: "2025-10-12T15:15:00Z",
      },
      {
        id: "task-dc4",
        title: "Tests applicatifs",
        assignedTo: "user-marie",
        status: "FAIT",
        priority: "HAUTE",
        createdAt: "2025-10-12T15:15:00Z",
        completedAt: "2025-10-12T16:00:00Z",
      },
      {
        id: "task-dc5",
        title: "Communication clients",
        assignedTo: "user-thomas",
        status: "FAIT",
        priority: "MOYENNE",
        createdAt: "2025-10-12T15:30:00Z",
        completedAt: "2025-10-12T16:10:00Z",
      },
    ],
    timeline: [
      {
        id: "tl-dc1",
        type: "INFO",
        at: "2025-10-12T14:23:00Z",
        author: "System",
        message: "Perte de heartbeat datacenter Paris. Tous les services en timeout.",
      },
      {
        id: "tl-dc2",
        type: "ACTION",
        at: "2025-10-12T14:28:00Z",
        author: "Marie Lefebvre",
        message: "Lancement procédure bascule datacenter. Convocation équipe infra.",
      },
      {
        id: "tl-dc3",
        type: "DECISION",
        at: "2025-10-12T14:35:00Z",
        author: "Claire Martin",
        message: "Décision validée : bascule immédiate sur Lyon sans attendre diagnostic Paris.",
      },
      {
        id: "tl-dc4",
        type: "ACTION",
        at: "2025-10-12T15:15:00Z",
        author: "Marie Lefebvre",
        message: "Bascule DNS effectuée. Trafic redirigé vers Lyon.",
      },
      {
        id: "tl-dc5",
        type: "INFO",
        at: "2025-10-12T16:00:00Z",
        author: "Marie Lefebvre",
        message: "Tests OK. Services bancaires opérationnels depuis Lyon.",
      },
      {
        id: "tl-dc6",
        type: "INFO",
        at: "2025-10-12T18:45:00Z",
        author: "Thomas Dubois",
        message: "Crise clôturée. Datacenter Paris remis en service progressif (non-critique uniquement).",
      },
    ],
  },
  {
    id: "event-ransomware-nov",
    organisationId: "org-hexabank",
    planId: "plan-ransomware",
    name: "Attaque ransomware sur le SI bancaire – 30/11/2025",
    status: "EN_COURS",
    severity: "CRITIQUE",
    startedAt: "2025-11-30T03:42:00Z",
    closedAt: null,
    owner: "user-claire",
    description: "Détection chiffrement massif serveurs de fichiers et applications internes. Variant LockBit 4.0 identifié.",
    tasks: [
      {
        id: "task-r1",
        title: "Isoler serveurs compromis",
        assignedTo: "user-marie",
        status: "FAIT",
        priority: "CRITIQUE",
        createdAt: "2025-11-30T03:50:00Z",
        completedAt: "2025-11-30T04:20:00Z",
      },
      {
        id: "task-r2",
        title: "Activer cellule de crise",
        assignedTo: "user-thomas",
        status: "FAIT",
        priority: "CRITIQUE",
        createdAt: "2025-11-30T04:00:00Z",
        completedAt: "2025-11-30T04:30:00Z",
      },
      {
        id: "task-r3",
        title: "Analyse forensique (SOC)",
        assignedTo: "user-marie",
        status: "EN_COURS",
        priority: "HAUTE",
        createdAt: "2025-11-30T04:30:00Z",
        completedAt: null,
      },
      {
        id: "task-r4",
        title: "Notification ANSSI",
        assignedTo: "user-pierre",
        status: "EN_COURS",
        priority: "HAUTE",
        createdAt: "2025-11-30T06:00:00Z",
        completedAt: null,
      },
      {
        id: "task-r5",
        title: "Évaluation backups disponibles",
        assignedTo: "user-marie",
        status: "EN_COURS",
        priority: "CRITIQUE",
        createdAt: "2025-11-30T05:00:00Z",
        completedAt: null,
      },
      {
        id: "task-r6",
        title: "Communication interne (email général)",
        assignedTo: "user-thomas",
        status: "FAIT",
        priority: "HAUTE",
        createdAt: "2025-11-30T07:00:00Z",
        completedAt: "2025-11-30T08:15:00Z",
      },
      {
        id: "task-r7",
        title: "Décision paiement rançon",
        assignedTo: "user-claire",
        status: "A_FAIRE",
        priority: "CRITIQUE",
        createdAt: "2025-11-30T09:00:00Z",
        completedAt: null,
      },
      {
        id: "task-r8",
        title: "Préparer restauration backups",
        assignedTo: "user-marie",
        status: "A_FAIRE",
        priority: "HAUTE",
        createdAt: "2025-11-30T09:00:00Z",
        completedAt: null,
      },
      {
        id: "task-r9",
        title: "Contacter assureur cyber",
        assignedTo: "user-pierre",
        status: "BLOQUE",
        priority: "MOYENNE",
        createdAt: "2025-11-30T10:00:00Z",
        completedAt: null,
      },
    ],
    timeline: [
      {
        id: "tl-r1",
        type: "INFO",
        at: "2025-11-30T03:42:00Z",
        author: "EDR System",
        message: "🚨 Alerte CRITIQUE : Activité de chiffrement détectée sur 47 serveurs. Signature LockBit 4.0.",
      },
      {
        id: "tl-r2",
        type: "ACTION",
        at: "2025-11-30T03:50:00Z",
        author: "Marie Lefebvre",
        message: "Isolation réseau des serveurs SRV-APP-01 à SRV-APP-47. Coupure accès VPN.",
      },
      {
        id: "tl-r3",
        type: "ACTION",
        at: "2025-11-30T04:00:00Z",
        author: "Thomas Dubois",
        message: "Convocation cellule de crise. CISO, CTO, DG, Juriste. War Room activée.",
      },
      {
        id: "tl-r4",
        type: "INFO",
        at: "2025-11-30T04:20:00Z",
        author: "Marie Lefebvre",
        message: "Isolation terminée. 47 serveurs hors ligne. Services internes impactés (RH, Compta, CRM).",
      },
      {
        id: "tl-r5",
        type: "DECISION",
        at: "2025-11-30T04:45:00Z",
        author: "Claire Martin",
        message: "Décision : Pas de paiement de rançon. Stratégie de restauration depuis backups validée.",
      },
      {
        id: "tl-r6",
        type: "INFO",
        at: "2025-11-30T05:30:00Z",
        author: "Marie Lefebvre",
        message: "Analyse forensique en cours. Vecteur initial suspecté : phishing sur compte admin IT.",
      },
      {
        id: "tl-r7",
        type: "ACTION",
        at: "2025-11-30T06:15:00Z",
        author: "Pierre Rousseau",
        message: "Notification ANSSI envoyée. Déclaration NIS2 en cours de rédaction.",
      },
      {
        id: "tl-r8",
        type: "ACTION",
        at: "2025-11-30T08:15:00Z",
        author: "Thomas Dubois",
        message: "Email interne envoyé à tous les collaborateurs. Consignes de sécurité renforcées.",
      },
      {
        id: "tl-r9",
        type: "INFO",
        at: "2025-11-30T09:00:00Z",
        author: "Marie Lefebvre",
        message: "Backups J-1 confirmés sains. Début restauration serveurs prioritaires (RH, Paie).",
      },
      {
        id: "tl-r10",
        type: "DECISION",
        at: "2025-11-30T10:30:00Z",
        author: "Claire Martin",
        message: "Point de situation : 15% des serveurs restaurés. ETA reprise complète : 48h. Pas d'impact services client.",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* 7) DASHBOARD SUMMARY                                                       */
/* -------------------------------------------------------------------------- */

export const dashboardSummary = {
  plansCount: crisisPlans.length, // 3
  activeCrisesCount: crisisEvents.filter(e => e.status === "EN_COURS").length, // 1
  overdueReviewsCount: 2,
  crisesPerMonth: [
    { month: "Jan", year: 2025, count: 0 },
    { month: "Feb", year: 2025, count: 0 },
    { month: "Mar", year: 2025, count: 0 },
    { month: "Apr", year: 2025, count: 0 },
    { month: "May", year: 2025, count: 0 },
    { month: "Jun", year: 2025, count: 0 },
    { month: "Jul", year: 2025, count: 0 },
    { month: "Aug", year: 2025, count: 0 },
    { month: "Sep", year: 2025, count: 0 },
    { month: "Oct", year: 2025, count: 1 }, // Datacenter outage
    { month: "Nov", year: 2025, count: 1 }, // Ransomware
    { month: "Dec", year: 2025, count: 0 },
  ],
  recentActivities: crisisEvents
    .find(e => e.status === "EN_COURS")
    ?.timeline.slice(-5)
    .reverse()
    .map(t => ({
      id: t.id,
      message: t.message,
      authorName: t.author,
      createdAt: t.at,
    })) || [],
};

/* -------------------------------------------------------------------------- */
/* 8) REPORTS                                                                 */
/* -------------------------------------------------------------------------- */

export const reports = [
  {
    id: "report-datacenter-oct",
    organisationId: "org-hexabank",
    relatedEventId: "event-datacenter-oct",
    type: "POST_MORTEM",
    status: "SIGNED",
    title: "Post-Mortem : Panne datacenter 12/10/2025",
    summary: "Analyse complète de l'incident datacenter. Bascule réussie en 4h15. Aucune perte de données.",
    createdAt: "2025-10-20T10:00:00Z",
    signedBy: "user-claire",
    signedAt: "2025-10-22T14:30:00Z",
  },
  {
    id: "report-ransomware-nov",
    organisationId: "org-hexabank",
    relatedEventId: "event-ransomware-nov",
    type: "POST_MORTEM",
    status: "DRAFT",
    title: "Post-Mortem : Ransomware 30/11/2025",
    summary: "Rapport en cours de rédaction. Incident toujours actif.",
    createdAt: "2025-11-30T12:00:00Z",
    signedBy: null,
    signedAt: null,
  },
];

/* -------------------------------------------------------------------------- */
/* 9) AUDIT LOGS                                                              */
/* -------------------------------------------------------------------------- */

export const auditLogs = [
  {
    id: "audit-1",
    organisationId: "org-hexabank",
    userId: "user-claire",
    userName: "Claire Martin",
    action: "PLAN_ACTIVATED",
    target: "plan-ransomware",
    targetType: "CRISIS_PLAN",
    details: "Plan 'Attaque ransomware' activé pour créer l'événement 'event-ransomware-nov'",
    ipAddress: "10.20.30.40",
    userAgent: "Mozilla/5.0",
    timestamp: "2025-11-30T04:00:00Z",
  },
  {
    id: "audit-2",
    organisationId: "org-hexabank",
    userId: "user-thomas",
    userName: "Thomas Dubois",
    action: "CRISIS_CREATED",
    target: "event-ransomware-nov",
    targetType: "CRISIS_EVENT",
    details: "Création événement de crise : Ransomware 30/11/2025",
    ipAddress: "10.20.30.41",
    userAgent: "Mozilla/5.0",
    timestamp: "2025-11-30T04:05:00Z",
  },
  {
    id: "audit-3",
    organisationId: "org-hexabank",
    userId: "user-marie",
    userName: "Marie Lefebvre",
    action: "TASK_STATUS_CHANGED",
    target: "task-r1",
    targetType: "TASK",
    details: "Tâche 'Isoler serveurs compromis' : A_FAIRE → FAIT",
    ipAddress: "10.20.30.42",
    userAgent: "Mozilla/5.0",
    timestamp: "2025-11-30T04:20:00Z",
  },
  {
    id: "audit-4",
    organisationId: "org-hexabank",
    userId: "user-claire",
    userName: "Claire Martin",
    action: "DECISION_LOGGED",
    target: "event-ransomware-nov",
    targetType: "CRISIS_EVENT",
    details: "Décision enregistrée : Pas de paiement de rançon",
    ipAddress: "10.20.30.40",
    userAgent: "Mozilla/5.0",
    timestamp: "2025-11-30T04:45:00Z",
  },
];

/* -------------------------------------------------------------------------- */
/* 10) EMERGENCY KITS                                                         */
/* -------------------------------------------------------------------------- */

export const emergencyKits = [
  {
    id: "kit-ransomware",
    organisationId: "org-hexabank",
    planId: "plan-ransomware",
    planName: "Attaque ransomware sur le SI bancaire",
    generatedAt: "2025-11-01T10:00:00Z",
    expiresAt: "2026-01-15T23:59:59Z",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANS...",
    pdfUrl: "/downloads/kit-ransomware.pdf",
  },
  {
    id: "kit-datacenter",
    organisationId: "org-hexabank",
    planId: "plan-datacenter",
    planName: "Indisponibilité datacenter primaire",
    generatedAt: "2025-10-01T10:00:00Z",
    expiresAt: "2026-04-01T23:59:59Z",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANS...",
    pdfUrl: "/downloads/kit-datacenter.pdf",
  },
];

/* -------------------------------------------------------------------------- */
/* 11) BILLING                                                                */
/* -------------------------------------------------------------------------- */

export const billingOverview = {
  organisationId: "org-hexabank",
  currentPlan: pricingPlans.find(p => p.id === "esn-mssp")!,
  billingEmail: "finance@hexabank.fr",
  nextBillingDate: "2025-12-15",
  usage: {
    currentUsers: organisationUsers.length,
    maxUsers: 999,
    storageUsedGB: 124,
    storageMaxGB: 1024,
    activeCrises: 1,
    maxParallelCrises: 999,
  },
  invoices: [
    {
      id: "inv-2025-11",
      date: "2025-11-15",
      amount: 1290,
      currency: "EUR",
      status: "PAID",
      pdfUrl: "/invoices/2025-11.pdf",
    },
    {
      id: "inv-2025-10",
      date: "2025-10-15",
      amount: 1290,
      currency: "EUR",
      status: "PAID",
      pdfUrl: "/invoices/2025-10.pdf",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* 12) PARTNER PORTFOLIO (for ESN/MSSP)                                      */
/* -------------------------------------------------------------------------- */

export const partnerPortfolio = [
  {
    clientId: "org-hexabank",
    clientName: "HexaBank",
    plansCount: 3,
    activeCrisesCount: 1,
    lastActivityAt: "2025-11-30T10:30:00Z",
  },
  {
    clientId: "org-novacloud",
    clientName: "NovaCloud",
    plansCount: 2,
    activeCrisesCount: 0,
    lastActivityAt: "2025-11-15T14:20:00Z",
  },
];

/* -------------------------------------------------------------------------- */
/* 13) SYSTEM STATUS                                                          */
/* -------------------------------------------------------------------------- */

export const systemStatus = {
  overall: "operational" as const,
  services: [
    { name: "Web Application", status: "operational" as const, uptime: 99.98 },
    { name: "API Gateway", status: "operational" as const, uptime: 99.97 },
    { name: "Database Cluster", status: "operational" as const, uptime: 99.99 },
    { name: "File Storage", status: "operational" as const, uptime: 99.95 },
    { name: "Notification Service", status: "operational" as const, uptime: 99.92 },
  ],
  incidents: [],
  maintenances: [],
};

/* -------------------------------------------------------------------------- */
/* 14) SECURITY STATUS                                                        */
/* -------------------------------------------------------------------------- */

export const securityStatus = {
  encryption: {
    atRest: "AES-256",
    inTransit: "TLS 1.3",
  },
  isolation: "Multi-tenant avec isolation complète par organisation",
  authentication: "SSO ready (SAML 2.0), MFA disponible",
  compliance: ["SOC 2 Type II", "GDPR", "ISO 27001", "NIS2 compatible"],
  audits: "Audits sécurité trimestriels + pentests annuels",
  backups: "Backups chiffrés quotidiens, rétention 90 jours",
};

/* -------------------------------------------------------------------------- */
/* 15) AI SAMPLES                                                             */
/* -------------------------------------------------------------------------- */

export const aiPlanGenerationSample = {
  scenario: "Attaque DDoS massive sur notre site e-commerce",
  suggestedPlan: {
    name: "Atténuation DDoS",
    type: "CYBER_ATTACK",
    criticality: "HAUTE",
    description: "Plan d'intervention en cas d'attaque DDoS volumétrique ciblant les services publics.",
    steps: [
      {
        id: "gen-1",
        orderIndex: 1,
        title: "Détection et qualification",
        description: "Identifier le type d'attaque (volumétrique, applicative), la bande passante consommée.",
        role: "NOC Team",
        targetDurationMinutes: 10,
        criticality: "CRITIQUE",
      },
      {
        id: "gen-2",
        orderIndex: 2,
        title: "Activation protection anti-DDoS",
        description: "Activer Cloudflare/Akamai en mode 'Under Attack'. Basculer DNS si nécessaire.",
        role: "Infrastructure Team",
        targetDurationMinutes: 15,
        criticality: "CRITIQUE",
      },
    ],
  },
};

export const aiPlanAnalysisSample = {
  planId: "plan-ransomware",
  analysis: "Le plan ransomware est complet et couvre les étapes critiques. Suggestion : ajouter une étape de 'test de restauration backup' mensuelle.",
  score: 92,
  suggestions: [
    "Ajouter procédure de test de restauration mensuelle",
    "Inclure contact direct ANSSI dans les coordonnées d'urgence",
    "Prévoir scénario alternatif si backups également chiffrés",
  ],
};

export const aiCrisisSummarySample = {
  eventId: "event-ransomware-nov",
  summary: "Crise ransomware en cours depuis 30/11/2025 03:42. 47 serveurs impactés, isolés avec succès. Décision : pas de paiement. Restauration backups en cours (15% complété). Aucun impact services clients. ETA résolution complète : 48h.",
  keyDecisions: [
    "Pas de paiement de rançon",
    "Stratégie de restauration depuis backups J-1",
    "Notification ANSSI et assureur cyber",
  ],
  nextSteps: [
    "Poursuivre restauration serveurs prioritaires",
    "Finaliser analyse forensique pour identifier vecteur d'infection",
    "Préparer communication client si nécessaire",
  ],
};

/* -------------------------------------------------------------------------- */
/* 16) LEGAL                                                                  */
/* -------------------------------------------------------------------------- */

export const legalPrivacySummary = `
CrisisShield respecte le RGPD et protège vos données personnelles.

Données collectées :
- Identité utilisateurs (nom, email, rôle)
- Logs d'audit
- Contenu des plans et événements de crise

Utilisation :
- Fourniture du service de gestion de crise
- Audit et conformité
- Amélioration du produit

Droits :
- Accès, rectification, suppression de vos données
- Contact : dpo@crisisshield.io
`;

export const legalTermsSummary = `
Conditions Générales d'Utilisation de CrisisShield

1. Objet : Fourniture d'une plateforme SaaS de gestion de crise
2. Disponibilité : 99,9% (hors maintenance programmée)
3. Propriété des données : Les clients conservent la propriété de leurs données
4. Confidentialité : Isolation complète entre organisations
5. Support : Email (J+1) ou prioritaire selon l'offre
6. Résiliation : Possible à tout moment avec préavis de 30 jours

Contact : legal@crisisshield.io
`;
