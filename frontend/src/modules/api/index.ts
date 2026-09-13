import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  User, DashboardSummary, CrisisPlan, CrisisDocument, CrisisEvent,
  CrisisTask, CrisisTimelineEntry, Organisation, LoginCredentials, AuthResponse,
  EmergencyKit, AuditLogEntry, BillingOverview, PartnerOrganisation, Report,
  SystemStatus, AIGeneratePlanRequest, AIGeneratePlanResponse, AIAnalyzePlanResponse,
  AICrisisSummaryResponse
} from '../types';
import {
  mockDashboard, mockPlans, mockEvents, mockTasks, mockTimeline, mockUsers,
  mockOrganisation, mockDocuments, mockEmergencyKits, mockAuditLogs,
  mockBilling, mockPartnerOrgs, mockReports, mockSystemStatus
} from './mockData';

// Auth API
export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>('/api/auth/login', credentials).then(r => r.data),
  getMe: () => apiClient.get<User>('/api/auth/me').then(r => r.data),
};

// Dashboard API
export const dashboardApi = {
  getSummary: () => apiClient.get<DashboardSummary>('/api/dashboard/summary').then(r => r.data),
};

// Plans API
const plansApi = {
  getPlans: () => apiClient.get<CrisisPlan[]>('/api/crisis/plans').then(r => r.data),
  getPlan: (id: string) => apiClient.get<CrisisPlan>(`/api/crisis/plans/${id}`).then(r => r.data),
  createPlan: (data: Partial<CrisisPlan>) => apiClient.post<CrisisPlan>('/api/crisis/plans', data).then(r => r.data),
  updatePlan: (id: string, data: Partial<CrisisPlan>) => apiClient.put<CrisisPlan>(`/api/crisis/plans/${id}`, data).then(r => r.data),
  activatePlan: (id: string) => apiClient.post<CrisisEvent>(`/api/crisis/plans/${id}/activate`).then(r => r.data),
  getDocuments: (planId: string) => apiClient.get<CrisisDocument[]>(`/api/crisis/plans/${planId}/documents`).then(r => r.data),
  uploadDocument: (planId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<CrisisDocument>(`/api/crisis/plans/${planId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
  deleteDocument: (docId: string) => apiClient.delete(`/api/crisis/documents/${docId}`),
};

// Events API
const eventsApi = {
  getEvents: () => apiClient.get<CrisisEvent[]>('/api/crisis/events').then(r => r.data),
  getEvent: (id: string) => apiClient.get<CrisisEvent>(`/api/crisis/events/${id}`).then(r => r.data),
  closeEvent: (id: string) => apiClient.post<CrisisEvent>(`/api/crisis/events/${id}/close`).then(r => r.data),
  getTasks: (eventId: string) => apiClient.get<CrisisTask[]>(`/api/crisis/events/${eventId}/tasks`).then(r => r.data),
  updateTask: (taskId: string, data: Partial<CrisisTask>) => apiClient.patch<CrisisTask>(`/api/crisis/tasks/${taskId}`, data).then(r => r.data),
  getTimeline: (eventId: string) => apiClient.get<CrisisTimelineEntry[]>(`/api/crisis/events/${eventId}/timeline`).then(r => r.data),
  addTimelineEntry: (eventId: string, data: Partial<CrisisTimelineEntry>) => apiClient.post<CrisisTimelineEntry>(`/api/crisis/events/${eventId}/timeline`, data).then(r => r.data),
};

// Tasks API
export const tasksApi = {
  getMyTasks: () => apiClient.get<CrisisTask[]>('/api/crisis/tasks/my').then(r => r.data),
};

// Admin API
const adminApi = {
  getUsers: () => apiClient.get<User[]>('/api/admin/users').then(r => r.data),
  inviteUser: (data: { email: string; fullName: string; roles: string[] }) => apiClient.post<User>('/api/admin/users', data).then(r => r.data),
  updateUser: (id: string, data: Partial<User>) => apiClient.patch<User>(`/api/admin/users/${id}`, data).then(r => r.data),
  getOrganisation: () => apiClient.get<Organisation>('/api/admin/organisation').then(r => r.data),
  updateOrganisation: (data: Partial<Organisation>) => apiClient.put<Organisation>('/api/admin/organisation', data).then(r => r.data),
  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<{ logoUrl: string }>('/api/admin/organisation/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};

// React Query Hooks
export const useMe = (): UseQueryResult<User, Error> => useQuery({ queryKey: ['me'], queryFn: authApi.getMe, retry: false });
export const useDashboardSummary = (): UseQueryResult<DashboardSummary, Error> => useQuery({ queryKey: ['dashboard'], queryFn: async () => mockDashboard });
export const usePlans = (): UseQueryResult<CrisisPlan[], Error> => useQuery({ queryKey: ['plans'], queryFn: async () => mockPlans });
export const usePlan = (id: string): UseQueryResult<CrisisPlan, Error> => useQuery({ queryKey: ['plans', id], queryFn: async () => mockPlans.find(p => p.id === id)!, enabled: !!id });
export const usePlanDocuments = (planId: string): UseQueryResult<CrisisDocument[], Error> => useQuery({ queryKey: ['plans', planId, 'documents'], queryFn: async () => mockDocuments.filter(d => d.planId === planId), enabled: !!planId });
export const useEvents = (): UseQueryResult<CrisisEvent[], Error> => useQuery({ queryKey: ['events'], queryFn: async () => mockEvents });
export const useEvent = (id: string): UseQueryResult<CrisisEvent, Error> => useQuery({ queryKey: ['events', id], queryFn: async () => mockEvents.find(e => e.id === id)!, enabled: !!id });
export const useEventTasks = (eventId: string): UseQueryResult<CrisisTask[], Error> => useQuery({ queryKey: ['events', eventId, 'tasks'], queryFn: async () => mockTasks.filter(t => t.eventId === eventId), enabled: !!eventId });
export const useEventTimeline = (eventId: string): UseQueryResult<CrisisTimelineEntry[], Error> => useQuery({ queryKey: ['events', eventId, 'timeline'], queryFn: async () => mockTimeline.filter(t => t.eventId === eventId), enabled: !!eventId, refetchInterval: 10000 });
export const useMyTasks = (): UseQueryResult<CrisisTask[], Error> => useQuery({ queryKey: ['tasks', 'my'], queryFn: async () => mockTasks });
export const useUsers = (): UseQueryResult<User[], Error> => useQuery({ queryKey: ['admin', 'users'], queryFn: async () => mockUsers });
export const useOrganisation = (): UseQueryResult<Organisation, Error> => useQuery({ queryKey: ['admin', 'organisation'], queryFn: async () => mockOrganisation });

export const useCreatePlan = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: plansApi.createPlan, onSuccess: () => qc.invalidateQueries({ queryKey: ['plans'] }) });
};

export const useUpdatePlan = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<CrisisPlan> }) => plansApi.updatePlan(id, data), onSuccess: (data) => { qc.invalidateQueries({ queryKey: ['plans'] }); qc.invalidateQueries({ queryKey: ['plans', data.id] }); } });
};

export const useActivatePlan = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: plansApi.activatePlan, onSuccess: () => { qc.invalidateQueries({ queryKey: ['events'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); } });
};

export const useUploadDocument = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ planId, file }: { planId: string; file: File }) => plansApi.uploadDocument(planId, file), onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['plans', v.planId, 'documents'] }) });
};

export const useDeleteDocument = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ docId }: { docId: string; planId: string }) => plansApi.deleteDocument(docId), onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['plans', v.planId, 'documents'] }) });
};

export const useCloseEvent = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: eventsApi.closeEvent, onSuccess: (data) => { qc.invalidateQueries({ queryKey: ['events'] }); qc.invalidateQueries({ queryKey: ['events', data.id] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); } });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ taskId, data }: { taskId: string; eventId: string; data: Partial<CrisisTask> }) => eventsApi.updateTask(taskId, data), onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['events', v.eventId, 'tasks'] }); qc.invalidateQueries({ queryKey: ['tasks', 'my'] }); } });
};

export const useAddTimelineEntry = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ eventId, data }: { eventId: string; data: Partial<CrisisTimelineEntry> }) => eventsApi.addTimelineEntry(eventId, data), onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ['events', v.eventId, 'timeline'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); } });
};

export const useInviteUser = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: adminApi.inviteUser, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }) });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => adminApi.updateUser(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }) });
};

export const useUpdateOrganisation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: adminApi.updateOrganisation, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'organisation'] }); qc.invalidateQueries({ queryKey: ['me'] }); } });
};

export const useUploadLogo = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: adminApi.uploadLogo, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'organisation'] }); qc.invalidateQueries({ queryKey: ['me'] }); } });
};

// Emergency Kits API
const emergencyApi = {
  getKits: () => apiClient.get<EmergencyKit[]>('/api/emergency/kits').then(r => r.data),
  getKit: (id: string) => apiClient.get<EmergencyKit>(`/api/emergency/kits/${id}`).then(r => r.data),
  generateKit: (data: { name: string; planIds: string[] }) => apiClient.post<EmergencyKit>('/api/emergency/kits', data).then(r => r.data),
};

export const useEmergencyKits = (): UseQueryResult<EmergencyKit[], Error> => useQuery({ queryKey: ['emergency', 'kits'], queryFn: async () => mockEmergencyKits });
export const useEmergencyKit = (id: string): UseQueryResult<EmergencyKit, Error> => useQuery({ queryKey: ['emergency', 'kits', id], queryFn: async () => mockEmergencyKits.find(k => k.id === id)!, enabled: !!id });
export const useGenerateKit = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: emergencyApi.generateKit, onSuccess: () => qc.invalidateQueries({ queryKey: ['emergency', 'kits'] }) });
};

// Audit API
export const auditApi = {
  getLogs: (params?: { startDate?: string; endDate?: string; userId?: string; action?: string }) =>
    apiClient.get<AuditLogEntry[]>('/api/audit/logs', { params }).then(r => r.data),
  exportLogs: (params?: { format?: 'CSV' | 'JSON'; startDate?: string; endDate?: string }) =>
    apiClient.get<Blob>('/api/audit/logs/export', { params, responseType: 'blob' }).then(r => r.data),
};

export const useAuditLogs = (params?: { startDate?: string; endDate?: string; userId?: string; action?: string }): UseQueryResult<AuditLogEntry[], Error> =>
  useQuery({ queryKey: ['audit', 'logs', params], queryFn: async () => mockAuditLogs });

// Billing API
const billingApi = {
  getOverview: () => apiClient.get<BillingOverview>('/api/billing/overview').then(r => r.data),
  upgrade: (plan: string) => apiClient.post<{ checkoutUrl: string }>('/api/billing/upgrade', { plan }).then(r => r.data),
};

export const useBillingOverview = (): UseQueryResult<BillingOverview, Error> => useQuery({ queryKey: ['billing', 'overview'], queryFn: async () => mockBilling });
export const useUpgradePlan = () => useMutation({ mutationFn: billingApi.upgrade });

// Partner API
export const partnerApi = {
  getOrganisations: () => apiClient.get<PartnerOrganisation[]>('/api/partner/organisations').then(r => r.data),
  getOrganisation: (id: string) => apiClient.get<PartnerOrganisation>(`/api/partner/organisations/${id}`).then(r => r.data),
};

export const usePartnerOrganisations = (): UseQueryResult<PartnerOrganisation[], Error> => useQuery({ queryKey: ['partner', 'organisations'], queryFn: async () => mockPartnerOrgs });
export const usePartnerOrganisation = (id: string): UseQueryResult<PartnerOrganisation, Error> => useQuery({ queryKey: ['partner', 'organisations', id], queryFn: async () => mockPartnerOrgs.find(o => o.id === id)!, enabled: !!id });

// Reports API
export const reportsApi = {
  getReports: () => apiClient.get<Report[]>('/api/reports').then(r => r.data),
  getReport: (id: string) => apiClient.get<Report>(`/api/reports/${id}`).then(r => r.data),
  downloadReport: (id: string) => apiClient.get<Blob>(`/api/reports/${id}/download`, { responseType: 'blob' }).then(r => r.data),
};

export const useReports = (): UseQueryResult<Report[], Error> => useQuery({ queryKey: ['reports'], queryFn: async () => mockReports });
export const useReport = (id: string): UseQueryResult<Report, Error> => useQuery({ queryKey: ['reports', id], queryFn: async () => mockReports.find(r => r.id === id)!, enabled: !!id });

// System Status API
export const systemApi = {
  getStatus: () => apiClient.get<SystemStatus>('/api/admin/tech/status').then(r => r.data),
  getSecurityStatus: () => apiClient.get<SystemStatus['security']>('/api/admin/security/status').then(r => r.data),
};

export const useSystemStatus = (): UseQueryResult<SystemStatus, Error> => useQuery({ queryKey: ['system', 'status'], queryFn: async () => mockSystemStatus });

// AI API
const aiApi = {
  generatePlan: (data: AIGeneratePlanRequest) => apiClient.post<AIGeneratePlanResponse>('/api/ai/plans/generate', data).then(r => r.data),
  analyzePlan: (planId: string) => apiClient.post<AIAnalyzePlanResponse>(`/api/ai/plans/${planId}/analyze`).then(r => r.data),
  summarizeCrisis: (eventId: string) => apiClient.post<AICrisisSummaryResponse>(`/api/ai/crisis-events/${eventId}/summarize`).then(r => r.data),
};

export const useGeneratePlanWithAI = () => useMutation({ mutationFn: aiApi.generatePlan });
export const useAnalyzePlanWithAI = () => useMutation({ mutationFn: aiApi.analyzePlan });
export const useSummarizeCrisis = () => useMutation({ mutationFn: aiApi.summarizeCrisis });
