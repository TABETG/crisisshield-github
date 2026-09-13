import { FileText, AlertTriangle, Clock, Users, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SimpleBarChart, SimplePieChart } from '../shared/components';
import { dashboardSummary, crisisEvents, crisisPlans, organisationUsers } from '../mock/mockData';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const stats = [
    {
      label: t('dashboard.crisisPlans'),
      value: dashboardSummary.plansCount,
      icon: FileText,
      gradient: 'from-primary-500 to-primary-600',
      bgLight: 'bg-primary-50 dark:bg-primary-900/20',
      textColor: 'text-primary-600 dark:text-primary-400',
      change: `+2 ${t('dashboard.thisMonth')}`,
      trend: 'up'
    },
    {
      label: t('dashboard.activeCrises'),
      value: dashboardSummary.activeCrisesCount,
      icon: AlertTriangle,
      gradient: 'from-danger-500 to-danger-600',
      bgLight: 'bg-danger-50 dark:bg-danger-900/20',
      textColor: 'text-danger-600 dark:text-danger-400',
      change: `1 ${t('dashboard.critical')}`,
      trend: 'neutral'
    },
    {
      label: t('dashboard.plansToReview'),
      value: dashboardSummary.overdueReviewsCount,
      icon: Clock,
      gradient: 'from-warning-500 to-warning-600',
      bgLight: 'bg-warning-50 dark:bg-warning-900/20',
      textColor: 'text-warning-600 dark:text-warning-400',
      change: t('dashboard.dueThisWeek'),
      trend: 'down'
    },
    {
      label: t('dashboard.teamMembers'),
      value: organisationUsers.length,
      icon: Users,
      gradient: 'from-success-500 to-success-600',
      bgLight: 'bg-success-50 dark:bg-success-900/20',
      textColor: 'text-success-600 dark:text-success-400',
      change: t('dashboard.allActive'),
      trend: 'up'
    }
  ];

  const plansByType = [
    { label: 'Cyberattaque', value: 1, color: '#3b82f6' },
    { label: 'Panne infra', value: 1, color: '#22c55e' },
    { label: 'Data Leak', value: 1, color: '#f59e0b' }
  ];

  const activeCrisis = crisisEvents.find(e => e.status === 'EN_COURS');
  const recentPlans = crisisPlans.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('dashboard.welcome')}, {user?.fullName.split(' ')[0]}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('dashboard.subtitle')}</p>
        </div>
        <Link
          to="/app/crisis/plans/new"
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-105"
        >
          <FileText className="w-5 h-5 mr-2" />
          {t('dashboard.newPlan')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft hover:shadow-soft-xl transition-all p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                {stat.trend === 'up' && <TrendingUp className="w-5 h-5 text-success-500" />}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</div>
              <div className={`text-xs font-medium ${stat.textColor} ${stat.bgLight} px-2 py-1 rounded-md inline-block`}>
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {activeCrisis && (
        <div className="bg-gradient-to-r from-danger-50 via-orange-50 to-warning-50 dark:from-danger-900/20 dark:via-orange-900/20 dark:to-warning-900/20 rounded-2xl border-2 border-danger-200 dark:border-danger-800 p-6 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-danger-500 to-danger-600 flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.activeCrisisAlert')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.startedAt')} {new Date(activeCrisis.startedAt).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <span className="font-semibold">{t('warroom.plan')}:</span> {crisisPlans.find(p => p.id === activeCrisis.planId)?.name}
              </p>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-danger-600 text-white shadow-lg">
                  {activeCrisis.severity}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{activeCrisis.tasks.length} {t('dashboard.tasksInProgress')}</span>
              </div>
            </div>
            <Link
              to={`/app/crisis/events/${activeCrisis.id}`}
              className="px-6 py-3 bg-gradient-to-r from-danger-600 to-danger-700 text-white rounded-xl hover:from-danger-700 hover:to-danger-800 transition-all font-bold shadow-lg shadow-danger-500/30 hover:shadow-xl hover:shadow-danger-500/40 hover:scale-105"
            >
              {t('dashboard.goToWarRoom')}
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart
          data={dashboardSummary.crisesPerMonth}
          title={t('dashboard.crisisEventsOverTime')}
          color="primary"
        />

        <SimplePieChart
          data={plansByType}
          title={t('dashboard.plansByType')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('dashboard.recentPlans')}</h2>
              </div>
              <Link to="/app/crisis/plans" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition">
                {t('common.viewAll')}
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentPlans.map((plan) => (
              <Link
                key={plan.id}
                to={`/app/crisis/plans/${plan.id}`}
                className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>{plan.type}</span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        plan.criticality === 'CRITIQUE' ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400' :
                        plan.criticality === 'HAUTE' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400' :
                        'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      }`}>
                        {plan.criticality}
                      </span>
                      <span>{plan.steps.length} {t('dashboard.steps')}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${
                    plan.criticality === 'CRITIQUE' ? 'bg-danger-100 dark:bg-danger-900/30' :
                    plan.criticality === 'HAUTE' ? 'bg-warning-100 dark:bg-warning-900/30' :
                    'bg-success-100 dark:bg-success-900/30'
                  } flex items-center justify-center`}>
                    <FileText className={`w-5 h-5 ${
                      plan.criticality === 'CRITIQUE' ? 'text-danger-600 dark:text-danger-400' :
                      plan.criticality === 'HAUTE' ? 'text-warning-600 dark:text-warning-400' :
                      'text-success-600 dark:text-success-400'
                    }`} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('dashboard.recentActivity')}</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {activeCrisis ? (
              <>
                {activeCrisis.timeline.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        entry.type === 'DECISION' ? 'bg-primary-500' :
                        entry.type === 'ACTION' ? 'bg-success-500' :
                        'bg-gray-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{entry.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">{entry.author}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(entry.at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900/20 dark:to-success-800/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-success-600 dark:text-success-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('dashboard.noActivity')}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{t('dashboard.orgSecure')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary-50 via-blue-50 to-cyan-50 dark:from-primary-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-primary-200 dark:border-primary-800 p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{t('dashboard.quickActions')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.quickActionsSubtitle')}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/app/crisis/plans/new"
              className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold text-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
            >
              {t('dashboard.createPlan')}
            </Link>
            <Link
              to="/app/my-tasks"
              className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all font-semibold text-sm shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
            >
              {t('dashboard.viewTasks')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
