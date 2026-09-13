import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    // Public navigation
    'nav.features': 'Fonctionnalités',
    'nav.solutions': 'Solutions',
    'nav.pricing': 'Tarifs',
    'nav.security': 'Sécurité',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.signIn': 'Se connecter',
    'nav.startTrial': 'Essai gratuit',

    // App sidebar
    'sidebar.dashboard': 'Tableau de bord',
    'sidebar.crisisPlans': 'Plans de crise',
    'sidebar.events': 'Événements',
    'sidebar.myTasks': 'Mes tâches',
    'sidebar.reports': 'Rapports',
    'sidebar.emergencyKits': 'Kits d\'urgence',
    'sidebar.auditLogs': 'Logs d\'audit',
    'sidebar.billing': 'Facturation',
    'sidebar.users': 'Utilisateurs',
    'sidebar.settings': 'Paramètres',

    // Common actions
    'common.search': 'Rechercher...',
    'common.loading': 'Chargement...',
    'common.noResults': 'Aucun résultat',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.create': 'Créer',
    'common.view': 'Voir',
    'common.download': 'Télécharger',
    'common.close': 'Fermer',
    'common.confirm': 'Confirmer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.signOut': 'Déconnexion',
    'common.activate': 'Activer',
    'common.viewAll': 'Tout voir',

    // Dashboard
    'dashboard.welcome': 'Bienvenue',
    'dashboard.title': 'Tableau de bord',
    'dashboard.subtitle': 'Voici ce qui se passe avec votre gestion de crise aujourd\'hui.',
    'dashboard.crisisPlans': 'Plans de crise',
    'dashboard.activeCrises': 'Crises actives',
    'dashboard.plansToReview': 'Plans à réviser',
    'dashboard.teamMembers': 'Membres de l\'équipe',
    'dashboard.recentPlans': 'Plans récents',
    'dashboard.recentActivity': 'Activité récente',
    'dashboard.quickActions': 'Actions rapides',
    'dashboard.quickActionsSubtitle': 'Optimisez votre gestion de crise',
    'dashboard.createPlan': 'Créer un plan',
    'dashboard.viewTasks': 'Voir mes tâches',
    'dashboard.newPlan': 'Nouveau plan',
    'dashboard.thisMonth': 'ce mois-ci',
    'dashboard.critical': 'critique',
    'dashboard.dueThisWeek': 'À revoir cette semaine',
    'dashboard.allActive': 'Tous actifs',
    'dashboard.steps': 'étapes',
    'dashboard.noActivity': 'Aucune activité récente',
    'dashboard.orgSecure': 'Votre organisation est sécurisée',
    'dashboard.activeCrisisAlert': 'Alerte crise active',
    'dashboard.startedAt': 'Démarrée le',
    'dashboard.tasksInProgress': 'tâches en cours',
    'dashboard.goToWarRoom': 'Aller à la War Room',
    'dashboard.crisisEventsOverTime': 'Événements de crise',
    'dashboard.plansByType': 'Plans par type',

    // Crisis Plans
    'plans.title': 'Plans de crise',
    'plans.subtitle': 'Gérez et organisez vos plans de réponse aux crises',
    'plans.createNew': 'Créer un plan',
    'plans.noPlan': 'Aucun plan de crise',
    'plans.createFirst': 'Créer votre premier plan',
    'plans.type': 'Type',
    'plans.criticality': 'Criticité',
    'plans.status': 'Statut',
    'plans.lastReviewed': 'Dernière révision',
    'plans.actions': 'Actions',
    'plans.critical': 'Critique',
    'plans.high': 'Haute',
    'plans.medium': 'Moyenne',
    'plans.low': 'Basse',
    'plans.draft': 'Brouillon',
    'plans.active': 'Actif',
    'plans.archived': 'Archivé',
    'plans.viewDetail': 'Voir les détails',
    'plans.edit': 'Modifier',
    'plans.activate': 'Activer maintenant',

    // Crisis Events
    'events.title': 'Événements de crise',
    'events.subtitle': 'Gérez les crises actives et l\'historique',
    'events.active': 'Active',
    'events.resolved': 'Résolue',
    'events.inProgress': 'En cours',
    'events.severity': 'Sévérité',
    'events.startedAt': 'Démarrée le',
    'events.resolvedAt': 'Résolue le',
    'events.duration': 'Durée',
    'events.openWarRoom': 'Ouvrir la War Room',
    'events.viewReport': 'Voir le rapport',

    // War Room
    'warroom.title': 'War Room',
    'warroom.overview': 'Vue d\'ensemble',
    'warroom.tasks': 'Tâches',
    'warroom.timeline': 'Chronologie',
    'warroom.aiSummary': 'Résumé IA',
    'warroom.status': 'Statut',
    'warroom.severity': 'Sévérité',
    'warroom.started': 'Démarrée',
    'warroom.elapsed': 'Temps écoulé',
    'warroom.totalTasks': 'Tâches totales',
    'warroom.team': 'Équipe',
    'warroom.plan': 'Plan',
    'warroom.todo': 'À faire',
    'warroom.inProgress': 'En cours',
    'warroom.review': 'Révision',
    'warroom.done': 'Terminé',
    'warroom.assignedTo': 'Assigné à',
    'warroom.addTask': 'Ajouter une tâche',
    'warroom.keyDecisions': 'Décisions clés',
    'warroom.nextSteps': 'Prochaines étapes',
    'warroom.impactAnalysis': 'Analyse d\'impact',

    // Emergency Kits
    'kits.title': 'Kits d\'urgence',
    'kits.subtitle': 'Documents PDF hors-ligne avec QR codes pour accès rapide',
    'kits.whatIs': 'Qu\'est-ce qu\'un kit d\'urgence ?',
    'kits.description': 'Un kit d\'urgence est une version PDF imprimable de votre plan de crise, avec QR code pour accès rapide. À distribuer aux équipes critiques et à afficher dans les locaux.',
    'kits.offlineAccess': 'Accès hors-ligne (pas besoin d\'internet)',
    'kits.qrCode': 'QR code pour lancer la war room directement',
    'kits.contacts': 'Contacts d\'urgence et checklist complète',
    'kits.noKits': 'Aucun kit d\'urgence généré',
    'kits.createFromPlan': 'Créer un kit depuis un plan',
    'kits.generatedOn': 'Généré le',
    'kits.expiresOn': 'Expire le',
    'kits.expired': 'Expiré',
    'kits.active': 'Actif',
    'kits.downloadPdf': 'Télécharger PDF',
    'kits.downloadQr': 'Télécharger QR',

    // Reports
    'reports.title': 'Rapports',
    'reports.subtitle': 'Analyses et rapports post-crise',
    'reports.postCrisis': 'Post-crise',
    'reports.performance': 'Performance',
    'reports.generatedOn': 'Généré le',
    'reports.viewDetails': 'Voir les détails',

    // Audit Logs
    'audit.title': 'Logs d\'audit',
    'audit.subtitle': 'Traçabilité complète des actions',
    'audit.user': 'Utilisateur',
    'audit.action': 'Action',
    'audit.resource': 'Ressource',
    'audit.timestamp': 'Date',
    'audit.ipAddress': 'Adresse IP',
    'audit.exportCsv': 'Exporter CSV',

    // Billing
    'billing.title': 'Facturation',
    'billing.subtitle': 'Gérez votre abonnement et paiements',
    'billing.currentPlan': 'Plan actuel',
    'billing.perMonth': 'par mois',
    'billing.changePlan': 'Changer de plan',
    'billing.users': 'Utilisateurs',
    'billing.storage': 'Stockage',
    'billing.billingHistory': 'Historique de facturation',
    'billing.invoice': 'Facture',
    'billing.amount': 'Montant',
    'billing.date': 'Date',
    'billing.status': 'Statut',
    'billing.paid': 'Payé',
    'billing.pending': 'En attente',
    'billing.downloadInvoice': 'Télécharger',

    // Users
    'users.title': 'Utilisateurs',
    'users.subtitle': 'Gérez les membres de votre organisation',
    'users.inviteUser': 'Inviter un utilisateur',
    'users.name': 'Nom',
    'users.email': 'Email',
    'users.role': 'Rôle',
    'users.status': 'Statut',
    'users.lastActive': 'Dernière activité',
    'users.active': 'Actif',

    // Settings
    'settings.title': 'Paramètres',
    'settings.subtitle': 'Configuration de l\'organisation',
    'settings.orgName': 'Nom de l\'organisation',
    'settings.industry': 'Secteur',
    'settings.size': 'Taille',
    'settings.timezone': 'Fuseau horaire',
    'settings.language': 'Langue',
    'settings.notifications': 'Notifications',
    'settings.saveChanges': 'Enregistrer les modifications',

    // Search
    'search.placeholder': 'Rechercher plans, crises, rapports...',
    'search.plans': 'Plans',
    'search.crises': 'Crises',
    'search.reports': 'Rapports',
    'search.noResults': 'Aucun résultat trouvé',
  },
  en: {
    // Public navigation
    'nav.features': 'Features',
    'nav.solutions': 'Solutions',
    'nav.pricing': 'Pricing',
    'nav.security': 'Security',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.signIn': 'Sign In',
    'nav.startTrial': 'Start Free Trial',

    // App sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.crisisPlans': 'Crisis Plans',
    'sidebar.events': 'Events',
    'sidebar.myTasks': 'My Tasks',
    'sidebar.reports': 'Reports',
    'sidebar.emergencyKits': 'Emergency Kits',
    'sidebar.auditLogs': 'Audit Logs',
    'sidebar.billing': 'Billing',
    'sidebar.users': 'Users',
    'sidebar.settings': 'Settings',

    // Common actions
    'common.search': 'Search...',
    'common.loading': 'Loading...',
    'common.noResults': 'No results',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.view': 'View',
    'common.download': 'Download',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.signOut': 'Sign Out',
    'common.activate': 'Activate',
    'common.viewAll': 'View All',

    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Here\'s what\'s happening with your crisis management today.',
    'dashboard.crisisPlans': 'Crisis Plans',
    'dashboard.activeCrises': 'Active Crises',
    'dashboard.plansToReview': 'Plans to Review',
    'dashboard.teamMembers': 'Team Members',
    'dashboard.recentPlans': 'Recent Plans',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.quickActionsSubtitle': 'Streamline your crisis management',
    'dashboard.createPlan': 'Create Plan',
    'dashboard.viewTasks': 'View My Tasks',
    'dashboard.newPlan': 'New Plan',
    'dashboard.thisMonth': 'this month',
    'dashboard.critical': 'critical',
    'dashboard.dueThisWeek': 'Due this week',
    'dashboard.allActive': 'All active',
    'dashboard.steps': 'steps',
    'dashboard.noActivity': 'No recent activity',
    'dashboard.orgSecure': 'Your organization is secure',
    'dashboard.activeCrisisAlert': 'Active Crisis Alert',
    'dashboard.startedAt': 'Started',
    'dashboard.tasksInProgress': 'tasks in progress',
    'dashboard.goToWarRoom': 'Go to War Room',
    'dashboard.crisisEventsOverTime': 'Crisis Events Over Time',
    'dashboard.plansByType': 'Plans by Type',

    // Crisis Plans
    'plans.title': 'Crisis Plans',
    'plans.subtitle': 'Manage and organize your crisis response plans',
    'plans.createNew': 'Create Plan',
    'plans.noPlan': 'No crisis plans',
    'plans.createFirst': 'Create your first plan',
    'plans.type': 'Type',
    'plans.criticality': 'Criticality',
    'plans.status': 'Status',
    'plans.lastReviewed': 'Last Reviewed',
    'plans.actions': 'Actions',
    'plans.critical': 'Critical',
    'plans.high': 'High',
    'plans.medium': 'Medium',
    'plans.low': 'Low',
    'plans.draft': 'Draft',
    'plans.active': 'Active',
    'plans.archived': 'Archived',
    'plans.viewDetail': 'View Details',
    'plans.edit': 'Edit',
    'plans.activate': 'Activate Now',

    // Crisis Events
    'events.title': 'Crisis Events',
    'events.subtitle': 'Manage active crises and history',
    'events.active': 'Active',
    'events.resolved': 'Resolved',
    'events.inProgress': 'In Progress',
    'events.severity': 'Severity',
    'events.startedAt': 'Started',
    'events.resolvedAt': 'Resolved',
    'events.duration': 'Duration',
    'events.openWarRoom': 'Open War Room',
    'events.viewReport': 'View Report',

    // War Room
    'warroom.title': 'War Room',
    'warroom.overview': 'Overview',
    'warroom.tasks': 'Tasks',
    'warroom.timeline': 'Timeline',
    'warroom.aiSummary': 'AI Summary',
    'warroom.status': 'Status',
    'warroom.severity': 'Severity',
    'warroom.started': 'Started',
    'warroom.elapsed': 'Time Elapsed',
    'warroom.totalTasks': 'Total Tasks',
    'warroom.team': 'Team',
    'warroom.plan': 'Plan',
    'warroom.todo': 'To Do',
    'warroom.inProgress': 'In Progress',
    'warroom.review': 'Review',
    'warroom.done': 'Done',
    'warroom.assignedTo': 'Assigned to',
    'warroom.addTask': 'Add Task',
    'warroom.keyDecisions': 'Key Decisions',
    'warroom.nextSteps': 'Next Steps',
    'warroom.impactAnalysis': 'Impact Analysis',

    // Emergency Kits
    'kits.title': 'Emergency Kits',
    'kits.subtitle': 'Offline PDF documents with QR codes for quick access',
    'kits.whatIs': 'What is an emergency kit?',
    'kits.description': 'An emergency kit is a printable PDF version of your crisis plan with QR code for quick access. Distribute to critical teams and display in premises.',
    'kits.offlineAccess': 'Offline access (no internet needed)',
    'kits.qrCode': 'QR code to launch war room directly',
    'kits.contacts': 'Emergency contacts and complete checklist',
    'kits.noKits': 'No emergency kits generated',
    'kits.createFromPlan': 'Create kit from a plan',
    'kits.generatedOn': 'Generated on',
    'kits.expiresOn': 'Expires on',
    'kits.expired': 'Expired',
    'kits.active': 'Active',
    'kits.downloadPdf': 'Download PDF',
    'kits.downloadQr': 'Download QR',

    // Reports
    'reports.title': 'Reports',
    'reports.subtitle': 'Post-crisis analysis and reports',
    'reports.postCrisis': 'Post-Crisis',
    'reports.performance': 'Performance',
    'reports.generatedOn': 'Generated on',
    'reports.viewDetails': 'View Details',

    // Audit Logs
    'audit.title': 'Audit Logs',
    'audit.subtitle': 'Complete action traceability',
    'audit.user': 'User',
    'audit.action': 'Action',
    'audit.resource': 'Resource',
    'audit.timestamp': 'Timestamp',
    'audit.ipAddress': 'IP Address',
    'audit.exportCsv': 'Export CSV',

    // Billing
    'billing.title': 'Billing',
    'billing.subtitle': 'Manage your subscription and payments',
    'billing.currentPlan': 'Current Plan',
    'billing.perMonth': 'per month',
    'billing.changePlan': 'Change Plan',
    'billing.users': 'Users',
    'billing.storage': 'Storage',
    'billing.billingHistory': 'Billing History',
    'billing.invoice': 'Invoice',
    'billing.amount': 'Amount',
    'billing.date': 'Date',
    'billing.status': 'Status',
    'billing.paid': 'Paid',
    'billing.pending': 'Pending',
    'billing.downloadInvoice': 'Download',

    // Users
    'users.title': 'Users',
    'users.subtitle': 'Manage your organization members',
    'users.inviteUser': 'Invite User',
    'users.name': 'Name',
    'users.email': 'Email',
    'users.role': 'Role',
    'users.status': 'Status',
    'users.lastActive': 'Last Active',
    'users.active': 'Active',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Organization configuration',
    'settings.orgName': 'Organization Name',
    'settings.industry': 'Industry',
    'settings.size': 'Size',
    'settings.timezone': 'Timezone',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.saveChanges': 'Save Changes',

    // Search
    'search.placeholder': 'Search plans, crises, reports...',
    'search.plans': 'Plans',
    'search.crises': 'Crises',
    'search.reports': 'Reports',
    'search.noResults': 'No results found',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('crisisshield_language');
    return (stored === 'en' || stored === 'fr') ? stored : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('crisisshield_language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
