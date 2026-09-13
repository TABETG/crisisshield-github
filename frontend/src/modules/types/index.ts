export enum UserRole {
  ORG_ADMIN = 'ORG_ADMIN',
  CRISIS_MANAGER = 'CRISIS_MANAGER',
  ORG_USER = 'ORG_USER',
  AUDITOR = 'AUDITOR',
  PARTNER_ADMIN = 'PARTNER_ADMIN',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export enum PlanType {
  CYBER_ATTACK = 'CYBER_ATTACK',
  NATURAL_DISASTER = 'NATURAL_DISASTER',
  PR_CRISIS = 'PR_CRISIS',
  OPERATIONAL = 'OPERATIONAL',
  FINANCIAL = 'FINANCIAL',
  OTHER = 'OTHER',
}

export enum PlanStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum Criticality {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum CrisisEventStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
}

export enum TimelineEntryType {
  STATUS_CHANGE = 'STATUS_CHANGE',
  TASK_UPDATE = 'TASK_UPDATE',
  COMMENT = 'COMMENT',
  DECISION = 'DECISION',
  ESCALATION = 'ESCALATION',
}

export interface Organisation {
  id: string;
  name: string;
  logoUrl?: string;
  timezone?: string;
  defaultLanguage?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: UserRole[];
  status: UserStatus;
  organisation: Organisation;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrisisStep {
  id?: string;
  title: string;
  description: string;
  roleResponsible: UserRole;
  criticality: Criticality;
  targetDuration?: number;
  order: number;
}

export interface CrisisDocument {
  id: string;
  planId?: string;
  name: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
}

export interface CrisisPlan {
  id: string;
  name: string;
  type: PlanType;
  criticality: Criticality;
  description: string;
  status: PlanStatus;
  nextReviewDate?: string;
  steps: CrisisStep[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrisisTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeRole?: UserRole;
  assigneeId?: string;
  assigneeName?: string;
  stepId?: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrisisTimelineEntry {
  id: string;
  eventId: string;
  type: TimelineEntryType;
  message: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface CrisisEvent {
  id: string;
  planId: string;
  planName: string;
  status: CrisisEventStatus;
  severity: Criticality;
  startTime: string;
  endTime?: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  plansCount: number;
  activeCrisesCount: number;
  overdueReviewsCount: number;
  recentActivities: CrisisTimelineEntry[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export enum EmergencyKitStatus {
  GENERATING = 'GENERATING',
  READY = 'READY',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

export interface EmergencyKit {
  id: string;
  name: string;
  status: EmergencyKitStatus;
  generatedAt: string;
  expiresAt?: string;
  fileSize?: number;
  downloadUrl?: string;
  includedPlans: string[];
  createdBy: string;
}

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE_PLAN = 'CREATE_PLAN',
  UPDATE_PLAN = 'UPDATE_PLAN',
  DELETE_PLAN = 'DELETE_PLAN',
  ACTIVATE_CRISIS = 'ACTIVATE_CRISIS',
  CLOSE_CRISIS = 'CLOSE_CRISIS',
  UPDATE_TASK = 'UPDATE_TASK',
  INVITE_USER = 'INVITE_USER',
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_ORG = 'UPDATE_ORG',
  GENERATE_KIT = 'GENERATE_KIT',
  EXPORT_DATA = 'EXPORT_DATA',
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export enum BillingPlan {
  TRIAL = 'TRIAL',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export interface BillingOverview {
  currentPlan: BillingPlan;
  trialEndsAt?: string;
  subscriptionStatus: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIAL';
  limits: {
    maxUsers: number;
    maxPlans: number;
    maxDocuments: number;
    maxStorage: number;
  };
  usage: {
    users: number;
    plans: number;
    documents: number;
    storageUsed: number;
  };
  nextBillingDate?: string;
  amount?: number;
  currency?: string;
}

export interface PartnerOrganisation {
  id: string;
  name: string;
  plan: BillingPlan;
  createdAt: string;
  lastActivity?: string;
  stats: {
    plansCount: number;
    activeCrisesCount: number;
    usersCount: number;
    overdueReviewsCount: number;
  };
}

export enum ReportType {
  CRISIS_SUMMARY = 'CRISIS_SUMMARY',
  AUDIT_LOG = 'AUDIT_LOG',
  COMPLIANCE = 'COMPLIANCE',
  ACTIVITY = 'ACTIVITY',
}

export enum ReportStatus {
  GENERATING = 'GENERATING',
  READY = 'READY',
  FAILED = 'FAILED',
}

export interface Report {
  id: string;
  type: ReportType;
  status: ReportStatus;
  generatedAt: string;
  generatedBy: string;
  generatedByName: string;
  fileName: string;
  fileSize?: number;
  downloadUrl?: string;
  parameters?: Record<string, unknown>;
}

export interface SecurityStatus {
  pkiStatus: 'HEALTHY' | 'WARNING' | 'ERROR';
  hsmConnected: boolean;
  certificateInfo?: {
    commonName: string;
    expiresAt: string;
    issuer: string;
  };
  lastHealthCheck: string;
}

export interface SystemStatus {
  version: string;
  uptime: number;
  services: {
    name: string;
    status: 'UP' | 'DOWN' | 'DEGRADED';
    responseTime?: number;
  }[];
  security: SecurityStatus;
}

export interface AIGeneratePlanRequest {
  scenario: string;
  criticality: Criticality;
  industry?: string;
}

export interface AIGeneratePlanResponse {
  suggestedPlan: Partial<CrisisPlan>;
}

export interface AIAnalyzePlanResponse {
  score: number;
  suggestions: string[];
  missingElements: string[];
  strengths: string[];
}

export interface AICrisisSummaryResponse {
  summary: string;
  keyEvents: string[];
  recommendations: string[];
  riskLevel: Criticality;
}
