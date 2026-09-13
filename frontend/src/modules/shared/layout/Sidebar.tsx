import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText, AlertTriangle, CheckSquare, Users, Settings,
  Package, FileSearch, CreditCard, Building2, Server, BarChart3, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { UserRole } from '../../types';

export const Sidebar = () => {
  const { hasRole } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { to: '/app/dashboard', icon: LayoutDashboard, labelKey: 'sidebar.dashboard', show: true, section: 'main', color: 'primary' },
    { to: '/app/crisis/plans', icon: FileText, labelKey: 'sidebar.crisisPlans', show: true, section: 'main', color: 'accent' },
    { to: '/app/crisis/events', icon: AlertTriangle, labelKey: 'sidebar.events', show: true, section: 'main', color: 'danger' },
    { to: '/app/my-tasks', icon: CheckSquare, labelKey: 'sidebar.myTasks', show: true, section: 'main', color: 'success' },
    { to: '/app/emergency/kits', icon: Package, labelKey: 'sidebar.emergencyKits', show: true, section: 'tools', color: 'warning' },
    { to: '/app/audit/logs', icon: FileSearch, labelKey: 'sidebar.auditLogs', show: hasRole(UserRole.ORG_ADMIN) || hasRole(UserRole.AUDITOR), section: 'tools', color: 'primary' },
    { to: '/app/reports', icon: BarChart3, labelKey: 'sidebar.reports', show: hasRole(UserRole.ORG_ADMIN), section: 'tools', color: 'accent' },
    { to: '/app/billing', icon: CreditCard, labelKey: 'sidebar.billing', show: hasRole(UserRole.ORG_ADMIN), section: 'admin', color: 'success' },
    { to: '/app/admin/users', icon: Users, labelKey: 'sidebar.users', show: hasRole(UserRole.ORG_ADMIN), section: 'admin', color: 'primary' },
    { to: '/app/admin/settings', icon: Settings, labelKey: 'sidebar.settings', show: hasRole(UserRole.ORG_ADMIN), section: 'admin', color: 'accent' },
    { to: '/app/admin/tech/status', icon: Server, label: 'System Status', show: hasRole(UserRole.PLATFORM_ADMIN), section: 'admin', color: 'danger' },
    { to: '/app/partner/dashboard', icon: Building2, label: 'Partner Dashboard', show: hasRole(UserRole.PARTNER_ADMIN), section: 'partner', color: 'primary' },
  ];

  const sections = [
    { id: 'main', label: null },
    { id: 'tools', label: 'Tools' },
    { id: 'admin', label: 'Administration' },
    { id: 'partner', label: 'Partner' },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      const colorMap: Record<string, { bg: string; text: string; border: string }> = {
        primary: { bg: 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30', text: 'text-primary-700 dark:text-primary-400', border: 'border-l-4 border-primary-600' },
        accent: { bg: 'bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30', text: 'text-accent-700 dark:text-accent-400', border: 'border-l-4 border-accent-600' },
        danger: { bg: 'bg-gradient-to-r from-danger-50 to-danger-100 dark:from-danger-900/30 dark:to-danger-800/30', text: 'text-danger-700 dark:text-danger-400', border: 'border-l-4 border-danger-600' },
        success: { bg: 'bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30', text: 'text-success-700 dark:text-success-400', border: 'border-l-4 border-success-600' },
        warning: { bg: 'bg-gradient-to-r from-warning-50 to-warning-100 dark:from-warning-900/30 dark:to-warning-800/30', text: 'text-warning-700 dark:text-warning-400', border: 'border-l-4 border-warning-600' },
      };
      return colorMap[color] || colorMap.primary;
    }
    return { bg: '', text: 'text-gray-700 dark:text-gray-300', border: '' };
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-all">
      <nav className="p-4">
        {sections.map((section) => {
          const sectionItems = navItems.filter((item) => item.section === section.id && item.show);
          if (sectionItems.length === 0) return null;
          return (
            <div key={section.id} className="mb-8">
              {section.label && (
                <h3 className="px-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {section.label}
                </h3>
              )}
              <div className="space-y-1">
                {sectionItems.map((item) => {
                  const Icon = item.icon;
                  const label = item.labelKey ? t(item.labelKey) : item.label;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) => {
                        const colors = getColorClasses(item.color, isActive);
                        return `group flex items-center justify-between px-3 py-3 rounded-xl transition-all hover:scale-105 ${
                          isActive
                            ? `${colors.bg} ${colors.text} ${colors.border} font-bold shadow-md`
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm'
                        }`;
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center flex-1 min-w-0">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-all ${
                              isActive
                                ? 'bg-white dark:bg-gray-800 shadow-sm'
                                : 'group-hover:bg-white dark:group-hover:bg-gray-800'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm truncate">{label}</span>
                          </div>
                          {isActive && (
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-4 border border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">System Status</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">All systems operational</p>
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Uptime</span>
              <span className="font-bold text-success-600">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
