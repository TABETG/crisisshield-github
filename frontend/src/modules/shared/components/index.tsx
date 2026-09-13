import { ReactNode, ButtonHTMLAttributes, useEffect } from 'react';
import { LucideIcon, X } from 'lucide-react';

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  as?: string;
}

export const Button = ({ variant = 'primary', size = 'md', children, className = '', as, ...props }: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed';
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'hover:bg-gray-100 text-gray-700',
  };
  const sizeStyles = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  const Element = as === 'span' ? 'span' : 'button';
  return <Element className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...(as === 'span' ? {} : props)}>{children}</Element>;
};

// Badge Component
export const Badge = ({ children, variant = 'neutral' }: { children: ReactNode; variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }) => {
  const variantStyles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>{children}</span>;
};

// LoadingSpinner Component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// EmptyState Component
export const EmptyState = ({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) => (
  <div className="text-center py-12">
    <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6">{description}</p>
    {action && <div>{action}</div>}
  </div>
);

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />
        <div className={`relative bg-white rounded-lg shadow-xl w-full ${sizeStyles[size]}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export { SimpleBarChart } from './SimpleBarChart';
export { SimplePieChart } from './SimplePieChart';
export { GlobalSearch } from './GlobalSearch';
export { StatCard } from './StatCard';
export { Alert } from "./Alert";
