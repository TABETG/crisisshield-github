import { Link, Outlet } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CrisisShield</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-gray-700 hover:text-blue-600 transition">Features</Link>
              <Link to="/solutions" className="text-gray-700 hover:text-blue-600 transition">Solutions</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</Link>
              <Link to="/security" className="text-gray-700 hover:text-blue-600 transition">Security</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link>
              <Link to="/app/login" className="text-gray-700 hover:text-blue-600 transition">Sign In</Link>
              <Link
                to="/app/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Start Free Trial
              </Link>
            </div>

            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link to="/features" className="text-gray-700 hover:text-blue-600">Features</Link>
                <Link to="/solutions" className="text-gray-700 hover:text-blue-600">Solutions</Link>
                <Link to="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
                <Link to="/security" className="text-gray-700 hover:text-blue-600">Security</Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
                <Link to="/app/login" className="text-gray-700 hover:text-blue-600">Sign In</Link>
                <Link
                  to="/app/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-bold text-white">CrisisShield</span>
              </div>
              <p className="text-sm">
                Enterprise crisis management platform. Be ready for the next crisis.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/solutions" className="hover:text-white transition">Solutions</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="/book-demo" className="hover:text-white transition">Book a Demo</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/legal/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/legal/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2024 CrisisShield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
