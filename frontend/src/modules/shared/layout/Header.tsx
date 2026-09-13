import { Shield, LogOut, Sun, Moon, Bell, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { GlobalSearch } from '../components/GlobalSearch';
import { useState, useRef, useEffect } from 'react';

export const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const notifications = [
    { id: 1, type: 'warning', title: 'Plan review overdue', message: 'Ransomware Response Plan needs review', time: '5m ago', unread: true },
    { id: 2, type: 'info', title: 'New team member', message: 'John Doe joined your organization', time: '1h ago', unread: true },
    { id: 3, type: 'success', title: 'Crisis resolved', message: 'Network Outage successfully resolved', time: '3h ago', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 h-16 z-30 transition-all shadow-sm">
      <div className="flex items-center justify-between h-full px-6 gap-4">
        <Link to="/app/dashboard" className="flex items-center flex-shrink-0 group hover:opacity-90 transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all mr-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">CrisisShield</h1>
            {user?.organisation && <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{user.organisation.name}</p>}
          </div>
        </Link>

        <GlobalSearch />

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all group"
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            ) : (
              <Sun className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
            )}
          </button>

          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'fr'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              EN
            </button>
          </div>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all group"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full animate-pulse" />
              )}
            </button>
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs font-bold text-primary-600 bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-lg">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                        notif.unread ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          notif.type === 'warning' ? 'bg-warning-500' :
                          notif.type === 'success' ? 'bg-success-500' :
                          'bg-primary-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{notif.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{notif.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl px-3 py-2 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                <span className="text-sm font-bold text-white">
                  {user?.fullName ? getInitials(user.fullName) : '??'}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.fullName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.roles?.join(', ')}</p>
              </div>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in">
                <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                      <span className="text-base font-bold text-white">
                        {user?.fullName ? getInitials(user.fullName) : '??'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user?.fullName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <Link
                    to="/app/admin/settings"
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-500" />
                    Settings
                  </Link>
                  <Link
                    to="/app/admin/users"
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    Manage Users
                  </Link>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
