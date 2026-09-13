import {
  DashboardSummary, CrisisPlan, CrisisEvent, CrisisTask, CrisisTimelineEntry,
  User, Organisation, EmergencyKit, AuditLogEntry, BillingOverview,
  PartnerOrganisation, Report, SystemStatus, CrisisDocument,
  PlanStatus, Criticality, CrisisEventStatus, TaskStatus,
  UserRole, UserStatus, ReportType, ReportStatus, BillingPlan,
  AuditAction, TimelineEntryType, EmergencyKitStatus, PlanType
} from '../types';

const mockOrg: Organisation = {
  id: '1',
  name: 'Acme Corporation',
  logoUrl: undefined,
  timezone: 'America/New_York',
  defaultLanguage: 'en'
};

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@crisisshield.com',
    fullName: 'Sarah Johnson',
    roles: [UserRole.ORG_ADMIN, UserRole.CRISIS_MANAGER],
    status: UserStatus.ACTIVE,
    organisation: mockOrg,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z'
  },
  {
    id: '2',
    email: 'manager@crisisshield.com',
    fullName: 'Michael Chen',
    roles: [UserRole.CRISIS_MANAGER, UserRole.ORG_USER],
    status: UserStatus.ACTIVE,
    organisation: mockOrg,
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-11-25T16:00:00Z'
  },
  {
    id: '3',
    email: 'user@crisisshield.com',
    fullName: 'Emma Davis',
    roles: [UserRole.ORG_USER],
    status: UserStatus.ACTIVE,
    organisation: mockOrg,
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-11-28T10:00:00Z'
  },
  {
    id: '4',
    email: 'auditor@crisisshield.com',
    fullName: 'James Wilson',
    roles: [UserRole.AUDITOR],
    status: UserStatus.ACTIVE,
    organisation: mockOrg,
    createdAt: '2024-04-12T13:00:00Z',
    updatedAt: '2024-11-29T09:00:00Z'
  }
];

export const mockOrganisation: Organisation = mockOrg;

export const mockPlans: CrisisPlan[] = [
  {
    id: '1',
    name: 'Data Breach Response Plan',
    description: 'Comprehensive plan for handling data security breaches and unauthorized access to sensitive information.',
    type: PlanType.CYBER_ATTACK,
    criticality: Criticality.CRITICAL,
    status: PlanStatus.PUBLISHED,
    nextReviewDate: '2025-01-15',
    steps: [],
    createdBy: '1',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-11-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Natural Disaster Evacuation Plan',
    description: 'Emergency procedures for evacuating facilities during natural disasters including earthquakes, floods, and hurricanes.',
    type: PlanType.NATURAL_DISASTER,
    criticality: Criticality.HIGH,
    status: PlanStatus.PUBLISHED,
    nextReviewDate: '2025-02-01',
    steps: [],
    createdBy: '2',
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-10-20T16:00:00Z'
  },
  {
    id: '3',
    name: 'Supply Chain Disruption Plan',
    description: 'Strategies for maintaining operations during major supply chain interruptions and vendor failures.',
    type: PlanType.OPERATIONAL,
    criticality: Criticality.HIGH,
    status: PlanStatus.PUBLISHED,
    nextReviewDate: '2025-03-10',
    steps: [],
    createdBy: '3',
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-11-10T10:30:00Z'
  },
  {
    id: '4',
    name: 'PR Crisis Management Plan',
    description: 'Guidelines for managing public relations crises and maintaining brand reputation during critical incidents.',
    type: PlanType.PR_CRISIS,
    criticality: Criticality.MEDIUM,
    status: PlanStatus.PUBLISHED,
    nextReviewDate: '2025-01-20',
    steps: [],
    createdBy: '1',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-09-15T14:00:00Z'
  },
  {
    id: '5',
    name: 'IT Infrastructure Failure Plan',
    description: 'Response procedures for critical IT system failures and service outages.',
    type: PlanType.OPERATIONAL,
    criticality: Criticality.CRITICAL,
    status: PlanStatus.DRAFT,
    steps: [],
    createdBy: '2',
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-11-28T15:30:00Z'
  }
];

export const mockEvents: CrisisEvent[] = [
  {
    id: '1',
    planId: '1',
    planName: 'Data Breach Response Plan',
    status: CrisisEventStatus.ACTIVE,
    severity: Criticality.CRITICAL,
    startTime: '2024-11-28T08:30:00Z',
    createdBy: '1',
    createdAt: '2024-11-28T08:30:00Z',
    updatedAt: '2024-11-30T10:00:00Z'
  },
  {
    id: '2',
    planId: '3',
    planName: 'Supply Chain Disruption Plan',
    status: CrisisEventStatus.RESOLVED,
    severity: Criticality.HIGH,
    startTime: '2024-11-20T14:00:00Z',
    endTime: '2024-11-25T16:30:00Z',
    createdBy: '3',
    createdAt: '2024-11-20T14:00:00Z',
    updatedAt: '2024-11-25T16:30:00Z'
  },
  {
    id: '3',
    planId: '2',
    planName: 'Natural Disaster Evacuation Plan',
    status: CrisisEventStatus.CLOSED,
    severity: Criticality.HIGH,
    startTime: '2024-10-15T06:00:00Z',
    endTime: '2024-10-16T18:00:00Z',
    createdBy: '2',
    createdAt: '2024-10-15T06:00:00Z',
    updatedAt: '2024-10-17T09:00:00Z'
  }
];

export const mockTasks: CrisisTask[] = [
  {
    id: '1',
    eventId: '1',
    title: 'Notify affected customers',
    description: 'Send email notifications to all customers potentially affected by the data breach',
    status: TaskStatus.IN_PROGRESS,
    assigneeName: 'Sarah Johnson',
    createdAt: '2024-11-28T08:45:00Z',
    updatedAt: '2024-11-30T09:30:00Z'
  },
  {
    id: '2',
    eventId: '1',
    title: 'Secure compromised systems',
    description: 'Isolate and secure all systems that may have been compromised in the breach',
    status: TaskStatus.DONE,
    assigneeName: 'Michael Chen',
    createdAt: '2024-11-28T08:35:00Z',
    updatedAt: '2024-11-28T11:30:00Z'
  },
  {
    id: '3',
    eventId: '1',
    title: 'Prepare incident report',
    description: 'Document all findings and actions taken during the incident response',
    status: TaskStatus.TO_DO,
    assigneeName: 'James Wilson',
    createdAt: '2024-11-28T09:00:00Z',
    updatedAt: '2024-11-29T14:00:00Z'
  },
  {
    id: '4',
    eventId: '1',
    title: 'Contact legal team',
    description: 'Brief legal counsel on the data breach and regulatory requirements',
    status: TaskStatus.IN_PROGRESS,
    assigneeName: 'Sarah Johnson',
    createdAt: '2024-11-28T08:50:00Z',
    updatedAt: '2024-11-29T16:00:00Z'
  },
  {
    id: '5',
    eventId: '1',
    title: 'Update stakeholders',
    description: 'Provide regular updates to executive team and board members',
    status: TaskStatus.IN_PROGRESS,
    assigneeName: 'Emma Davis',
    createdAt: '2024-11-28T09:15:00Z',
    updatedAt: '2024-11-30T08:00:00Z'
  }
];

export const mockTimeline: CrisisTimelineEntry[] = [
  {
    id: '1',
    eventId: '1',
    type: TimelineEntryType.STATUS_CHANGE,
    message: 'Crisis event activated',
    authorId: '1',
    authorName: 'Sarah Johnson',
    createdAt: '2024-11-28T08:30:00Z'
  },
  {
    id: '2',
    eventId: '1',
    type: TimelineEntryType.TASK_UPDATE,
    message: 'Task "Secure compromised systems" completed',
    authorId: '2',
    authorName: 'Michael Chen',
    createdAt: '2024-11-28T11:30:00Z'
  },
  {
    id: '3',
    eventId: '1',
    type: TimelineEntryType.COMMENT,
    message: 'Initial forensic analysis shows unauthorized access from external IP addresses',
    authorId: '2',
    authorName: 'Michael Chen',
    createdAt: '2024-11-28T13:45:00Z'
  },
  {
    id: '4',
    eventId: '1',
    type: TimelineEntryType.TASK_UPDATE,
    message: 'Task "Notify affected customers" started',
    authorId: '1',
    authorName: 'Sarah Johnson',
    createdAt: '2024-11-29T09:00:00Z'
  },
  {
    id: '5',
    eventId: '1',
    type: TimelineEntryType.COMMENT,
    message: 'Legal team briefed on situation and regulatory obligations',
    authorId: '1',
    authorName: 'Sarah Johnson',
    createdAt: '2024-11-29T16:30:00Z'
  },
  {
    id: '6',
    eventId: '1',
    type: TimelineEntryType.COMMENT,
    message: 'Approximately 15,000 customer records potentially affected',
    authorId: '4',
    authorName: 'James Wilson',
    createdAt: '2024-11-30T10:15:00Z'
  }
];

export const mockDashboard: DashboardSummary = {
  plansCount: 5,
  activeCrisesCount: 1,
  overdueReviewsCount: 2,
  recentActivities: [
    {
      id: '1',
      eventId: '1',
      type: TimelineEntryType.STATUS_CHANGE,
      message: 'Data Breach Response Plan activated',
      authorId: '1',
      authorName: 'Sarah Johnson',
      createdAt: '2024-11-28T08:30:00Z'
    },
    {
      id: '2',
      eventId: '1',
      type: TimelineEntryType.TASK_UPDATE,
      message: 'Task "Secure compromised systems" completed',
      authorId: '2',
      authorName: 'Michael Chen',
      createdAt: '2024-11-28T11:30:00Z'
    },
    {
      id: '3',
      eventId: '2',
      type: TimelineEntryType.STATUS_CHANGE,
      message: 'Supply Chain Disruption Plan crisis resolved',
      authorId: '3',
      authorName: 'Emma Davis',
      createdAt: '2024-11-25T16:30:00Z'
    },
    {
      id: '4',
      eventId: '1',
      type: TimelineEntryType.COMMENT,
      message: 'IT Infrastructure Failure Plan updated to version 0.8',
      authorId: '2',
      authorName: 'Michael Chen',
      createdAt: '2024-11-24T15:30:00Z'
    },
    {
      id: '5',
      eventId: '1',
      type: TimelineEntryType.COMMENT,
      message: 'New user James Wilson invited as Auditor',
      authorId: '1',
      authorName: 'Sarah Johnson',
      createdAt: '2024-11-20T10:00:00Z'
    }
  ]
};

export const mockDocuments: CrisisDocument[] = [
  {
    id: '1',
    name: 'data-breach-checklist.pdf',
    fileType: 'application/pdf',
    fileSize: 245760,
    uploadedBy: '1',
    uploadedAt: '2024-01-10T10:30:00Z',
    url: '#'
  },
  {
    id: '2',
    name: 'incident-response-procedures.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 389120,
    uploadedBy: '2',
    uploadedAt: '2024-01-15T14:00:00Z',
    url: '#'
  },
  {
    id: '3',
    name: 'notification-templates.pdf',
    fileType: 'application/pdf',
    fileSize: 156789,
    uploadedBy: '1',
    uploadedAt: '2024-02-01T09:15:00Z',
    url: '#'
  }
];

export const mockEmergencyKits: EmergencyKit[] = [
  {
    id: '1',
    name: 'Critical Security Incidents Kit',
    status: EmergencyKitStatus.READY,
    generatedAt: '2024-05-10T10:00:00Z',
    fileSize: 1024000,
    downloadUrl: '#',
    includedPlans: ['1', '5'],
    createdBy: '1'
  },
  {
    id: '2',
    name: 'Business Continuity Kit',
    status: EmergencyKitStatus.READY,
    generatedAt: '2024-06-15T11:00:00Z',
    fileSize: 856000,
    downloadUrl: '#',
    includedPlans: ['2', '3'],
    createdBy: '2'
  }
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: '2024-11-28T08:30:00Z',
    userId: '1',
    userName: 'Sarah Johnson',
    action: AuditAction.ACTIVATE_CRISIS,
    resourceType: 'CrisisPlan',
    resourceId: '1',
    details: 'Data Breach Response Plan activated',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '2',
    timestamp: '2024-11-28T11:30:00Z',
    userId: '2',
    userName: 'Michael Chen',
    action: AuditAction.UPDATE_TASK,
    resourceType: 'CrisisTask',
    resourceId: '2',
    details: 'Task "Secure compromised systems" marked as completed',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: '3',
    timestamp: '2024-11-20T10:00:00Z',
    userId: '1',
    userName: 'Sarah Johnson',
    action: AuditAction.INVITE_USER,
    resourceType: 'User',
    resourceId: '4',
    details: 'New user invited: auditor@crisisshield.com',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '4',
    timestamp: '2024-11-25T16:30:00Z',
    userId: '3',
    userName: 'Emma Davis',
    action: AuditAction.CLOSE_CRISIS,
    resourceType: 'CrisisEvent',
    resourceId: '2',
    details: 'Supply Chain Disruption crisis closed after 130 hours',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
  },
  {
    id: '5',
    timestamp: '2024-11-24T15:30:00Z',
    userId: '2',
    userName: 'Michael Chen',
    action: AuditAction.UPDATE_PLAN,
    resourceType: 'CrisisPlan',
    resourceId: '5',
    details: 'IT Infrastructure Failure Plan updated to version 0.8',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  }
];

export const mockBilling: BillingOverview = {
  currentPlan: BillingPlan.PROFESSIONAL,
  subscriptionStatus: 'ACTIVE',
  nextBillingDate: '2024-12-30',
  amount: 299,
  currency: 'USD',
  limits: {
    maxUsers: 25,
    maxPlans: 50,
    maxDocuments: 500,
    maxStorage: 100
  },
  usage: {
    users: 4,
    plans: 5,
    documents: 12,
    storageUsed: 2.3
  }
};

export const mockPartnerOrgs: PartnerOrganisation[] = [
  {
    id: '1',
    name: 'Beta Industries',
    plan: BillingPlan.PROFESSIONAL,
    createdAt: '2024-03-15T10:00:00Z',
    lastActivity: '2024-11-29T14:30:00Z',
    stats: {
      plansCount: 8,
      activeCrisesCount: 1,
      usersCount: 12,
      overdueReviewsCount: 2
    }
  },
  {
    id: '2',
    name: 'Gamma Solutions Ltd',
    plan: BillingPlan.ENTERPRISE,
    createdAt: '2024-01-20T11:00:00Z',
    lastActivity: '2024-11-28T09:15:00Z',
    stats: {
      plansCount: 15,
      activeCrisesCount: 2,
      usersCount: 28,
      overdueReviewsCount: 1
    }
  },
  {
    id: '3',
    name: 'Delta Enterprises',
    plan: BillingPlan.STARTER,
    createdAt: '2024-06-10T09:00:00Z',
    lastActivity: '2024-11-25T16:45:00Z',
    stats: {
      plansCount: 6,
      activeCrisesCount: 0,
      usersCount: 8,
      overdueReviewsCount: 3
    }
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    type: ReportType.COMPLIANCE,
    status: ReportStatus.READY,
    generatedAt: '2024-11-25T10:00:00Z',
    generatedBy: '4',
    generatedByName: 'James Wilson',
    fileName: 'compliance-report-2024-q4.pdf',
    fileSize: 1024000,
    downloadUrl: '#'
  },
  {
    id: '2',
    type: ReportType.ACTIVITY,
    status: ReportStatus.READY,
    generatedAt: '2024-11-28T15:30:00Z',
    generatedBy: '1',
    generatedByName: 'Sarah Johnson',
    fileName: 'activity-log-november-2024.pdf',
    fileSize: 567890,
    downloadUrl: '#'
  },
  {
    id: '3',
    type: ReportType.AUDIT_LOG,
    status: ReportStatus.GENERATING,
    generatedAt: '2024-11-30T09:00:00Z',
    generatedBy: '4',
    generatedByName: 'James Wilson',
    fileName: 'audit-trail-q4-2024.pdf'
  },
  {
    id: '4',
    type: ReportType.CRISIS_SUMMARY,
    status: ReportStatus.READY,
    generatedAt: '2024-11-29T14:00:00Z',
    generatedBy: '1',
    generatedByName: 'Sarah Johnson',
    fileName: 'data-breach-incident-summary.pdf',
    fileSize: 789450,
    downloadUrl: '#'
  }
];

export const mockSystemStatus: SystemStatus = {
  version: 'v2.4.1',
  uptime: 99.98,
  services: [
    { name: 'API', status: 'UP', responseTime: 45 },
    { name: 'Database', status: 'UP', responseTime: 12 },
    { name: 'Storage', status: 'UP', responseTime: 78 },
    { name: 'Notifications', status: 'UP', responseTime: 120 }
  ],
  security: {
    pkiStatus: 'HEALTHY',
    hsmConnected: true,
    certificateInfo: {
      commonName: 'crisisshield.com',
      expiresAt: '2025-06-15T00:00:00Z',
      issuer: 'DigiCert Inc'
    },
    lastHealthCheck: '2024-11-30T10:00:00Z'
  }
};
