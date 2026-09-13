import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '../types';
import { ReactNode } from 'react';

export const RoleGuard = ({ children, allowedRoles }: { children: ReactNode; allowedRoles: UserRole[] }) => {
  const { user, hasRole } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const hasAccess = allowedRoles.some((role) => hasRole(role));
  if (!hasAccess) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1><p className="text-gray-600">You do not have permission to access this page.</p></div></div>;
  return <>{children}</>;
};
