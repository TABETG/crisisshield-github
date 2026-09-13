import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../modules/auth/LoginPage';
import { ProtectedRoute } from '../modules/auth/ProtectedRoute';
import { RoleGuard } from '../modules/auth/RoleGuard';
import { MainLayout } from '../modules/shared/layout/MainLayout';
import { PublicLayout } from '../modules/shared/layout/PublicLayout';
import { DashboardPage } from '../modules/dashboard/DashboardPage';
import { PlansListPage } from '../modules/crisis/plans/PlansListPage';
import { PlanViewPage } from '../modules/crisis/plans/PlanViewPage';
import { PlanFormPage } from '../modules/crisis/plans/PlanFormPage';
import { EventsListPage } from '../modules/crisis/events/EventsListPage';
import { WarRoomPage } from '../modules/crisis/events/WarRoomPage';
import { MyTasksPage } from '../modules/crisis/tasks/MyTasksPage';
import { UsersPage } from '../modules/admin/UsersPage';
import { SettingsPage } from '../modules/admin/SettingsPage';
import { SystemStatusPage } from '../modules/admin/SystemStatusPage';
import { EmergencyKitsPage } from '../modules/emergency/EmergencyKitsPage';
import { EmergencyKitDetailPage } from '../modules/emergency/EmergencyKitDetailPage';
import { AuditLogsPage } from '../modules/audit/AuditLogsPage';
import { BillingOverviewPage } from '../modules/billing/BillingOverviewPage';
import { BillingCheckoutReturnPage } from '../modules/billing/BillingCheckoutReturnPage';
import { PartnerDashboardPage } from '../modules/partner/PartnerDashboardPage';
import { PartnerOrganisationDetailPage } from '../modules/partner/PartnerOrganisationDetailPage';
import { ReportsPage } from '../modules/reports/ReportsPage';
import { ReportDetailPage } from '../modules/reports/ReportDetailPage';
import {
  HomePage,
  FeaturesPage,
  PricingPage,
  SolutionsPage,
  SecurityPage,
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage
} from '../modules/marketing/pages';
import { UserRole } from '../modules/types';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/book-demo" element={<ContactPage />} />
          <Route path="/legal/privacy" element={<PrivacyPage />} />
          <Route path="/legal/terms" element={<TermsPage />} />
        </Route>

        <Route path="/app/login" element={<LoginPage />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Navigate to="/app/dashboard" replace />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/crisis/plans"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PlansListPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/crisis/plans/new"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PlanFormPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/crisis/plans/:planId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PlanViewPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/crisis/plans/:planId/edit"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PlanFormPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/crisis/events"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EventsListPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/crisis/events/:eventId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <WarRoomPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/my-tasks"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyTasksPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/admin/users"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRole.ORG_ADMIN]}>
                <MainLayout>
                  <UsersPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/admin/settings"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRole.ORG_ADMIN]}>
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/admin/tech/status"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRole.PLATFORM_ADMIN]}>
                <MainLayout>
                  <SystemStatusPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/emergency/kits"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EmergencyKitsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/emergency/kits/:kitId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EmergencyKitDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/audit/logs"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRole.ORG_ADMIN, UserRole.AUDITOR]}>
                <MainLayout>
                  <AuditLogsPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/billing"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRole.ORG_ADMIN]}>
                <MainLayout>
                  <BillingOverviewPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route path="/app/billing/checkout/complete" element={<BillingCheckoutReturnPage />} />

        <Route
          path="/app/partner/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRole.PARTNER_ADMIN]}>
                <MainLayout>
                  <PartnerDashboardPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/partner/organisations/:orgId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRole.PARTNER_ADMIN]}>
                <MainLayout>
                  <PartnerOrganisationDetailPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/reports"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRole.ORG_ADMIN]}>
                <MainLayout>
                  <ReportsPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/reports/:reportId"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[UserRole.ORG_ADMIN]}>
                <MainLayout>
                  <ReportDetailPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
