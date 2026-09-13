import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    localStorage.setItem('accessToken', 'mock-token-bypass');
    localStorage.setItem('refreshToken', 'mock-refresh-bypass');
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      fullName: 'Admin User',
      roles: [UserRole.ORG_ADMIN, UserRole.CRISIS_MANAGER, UserRole.ORG_USER, UserRole.AUDITOR, UserRole.PARTNER_ADMIN, UserRole.PLATFORM_ADMIN],
      status: 'ACTIVE' as any,
      organisation: {
        id: '1',
        name: 'Demo Organisation',
        logoUrl: undefined,
        defaultLanguage: 'en',
        timezone: 'UTC'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const hasRole = (role: UserRole): boolean => user?.roles.includes(role) || false;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
