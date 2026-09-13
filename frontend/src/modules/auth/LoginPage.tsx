import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate('/app/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/40 to-accent-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-200/30 to-primary-200/30 rounded-full blur-3xl" />

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-10 border border-primary-100 animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">CrisisShield</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-danger-50 border-2 border-danger-200 text-danger-700 px-4 py-3 rounded-xl text-sm font-medium animate-slide-up">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-105 flex items-center justify-center"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <>
                Sign in
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Demo credentials: <span className="font-semibold text-primary-600">admin@crisisshield.com</span> / <span className="font-semibold text-primary-600">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};
