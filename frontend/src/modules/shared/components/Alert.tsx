import { ReactNode } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert = ({ type = 'info', title, children, onClose, className = '' }: AlertProps) => {
  const config = {
    success: {
      icon: CheckCircle,
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800',
      iconColor: 'text-success-600 dark:text-success-400',
      titleColor: 'text-success-900 dark:text-success-100',
      textColor: 'text-success-800 dark:text-success-200'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      border: 'border-warning-200 dark:border-warning-800',
      iconColor: 'text-warning-600 dark:text-warning-400',
      titleColor: 'text-warning-900 dark:text-warning-100',
      textColor: 'text-warning-800 dark:text-warning-200'
    },
    danger: {
      icon: XCircle,
      bg: 'bg-danger-50 dark:bg-danger-900/20',
      border: 'border-danger-200 dark:border-danger-800',
      iconColor: 'text-danger-600 dark:text-danger-400',
      titleColor: 'text-danger-900 dark:text-danger-100',
      textColor: 'text-danger-800 dark:text-danger-200'
    },
    info: {
      icon: Info,
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      border: 'border-primary-200 dark:border-primary-800',
      iconColor: 'text-primary-600 dark:text-primary-400',
      titleColor: 'text-primary-900 dark:text-primary-100',
      textColor: 'text-primary-800 dark:text-primary-200'
    }
  };

  const { icon: Icon, bg, border, iconColor, titleColor, textColor } = config[type];

  return (
    <div className={`${bg} border-2 ${border} rounded-2xl p-5 animate-slide-up ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-6 h-6 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`text-sm font-bold ${titleColor} mb-2`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${textColor}`}>
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${iconColor} hover:opacity-70 transition-opacity`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
