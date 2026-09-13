import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!isAuthenticated) return <Navigate to="/app/login" replace />;
  return <>{children}</>;
};
