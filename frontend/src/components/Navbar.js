import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="font-cinzel text-xl md:text-2xl font-bold text-gold-400 hover:text-gold-300 transition-colors"
            data-testid="logo-link"
          >
            Anjuman-e-Bagh-e-Zehra
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-gold-400 transition-colors font-manrope"
              data-testid="nav-home"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-gold-400 transition-colors font-manrope"
              data-testid="nav-about"
            >
              About
            </Link>
            <Link
              to="/plans"
              className="text-gray-300 hover:text-gold-400 transition-colors font-manrope"
              data-testid="nav-plans"
            >
              Membership
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-gold-400 transition-colors font-manrope"
              data-testid="nav-contact"
            >
              Contact
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors font-manrope"
                  data-testid="nav-dashboard"
                >
                  <User size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors font-manrope"
                  data-testid="logout-button"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-white font-cinzel tracking-widest uppercase text-sm px-8 py-3 rounded-sm"
                data-testid="nav-login"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gold-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/5" data-testid="mobile-menu">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-gold-400 transition-colors font-manrope"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-gold-400 transition-colors font-manrope"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/plans"
                className="text-gray-300 hover:text-gold-400 transition-colors font-manrope"
                onClick={() => setMobileMenuOpen(false)}
              >
                Membership
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-gold-400 transition-colors font-manrope"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    className="text-gray-300 hover:text-gold-400 transition-colors font-manrope"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-300 hover:text-red-400 transition-colors font-manrope"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary text-white font-cinzel tracking-widest uppercase text-sm px-8 py-3 rounded-sm text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
