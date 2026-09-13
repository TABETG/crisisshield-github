import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
}

export const StatCard = ({ icon: Icon, label, value, change, trend, color = 'primary' }: StatCardProps) => {
  const colorClasses = {
    primary: {
      gradient: 'from-primary-500 to-primary-600',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      text: 'text-primary-600 dark:text-primary-400'
    },
    accent: {
      gradient: 'from-accent-500 to-accent-600',
      bg: 'bg-accent-50 dark:bg-accent-900/20',
      text: 'text-accent-600 dark:text-accent-400'
    },
    success: {
      gradient: 'from-success-500 to-success-600',
      bg: 'bg-success-50 dark:bg-success-900/20',
      text: 'text-success-600 dark:text-success-400'
    },
    warning: {
      gradient: 'from-warning-500 to-warning-600',
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      text: 'text-warning-600 dark:text-warning-400'
    },
    danger: {
      gradient: 'from-danger-500 to-danger-600',
      bg: 'bg-danger-50 dark:bg-danger-900/20',
      text: 'text-danger-600 dark:text-danger-400'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-soft hover:shadow-soft-xl transition-all p-6 border border-gray-100 dark:border-gray-700 hover:scale-105 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {trend && (
          <div className={`text-xs font-bold px-2 py-1 rounded-lg ${
            trend === 'up' ? 'bg-success-100 text-success-700' :
            trend === 'down' ? 'bg-danger-100 text-danger-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:scale-105 transition-transform">
        {value}
      </div>
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {label}
      </div>
      {change && (
        <div className={`text-xs font-medium ${colors.text} ${colors.bg} px-2 py-1 rounded-md inline-block`}>
          {change}
        </div>
      )}
    </div>
  );
};
