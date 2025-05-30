import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileDropdownOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white dark:bg-dark-100 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo className="h-10 w-auto" />
            <span className="ml-2 text-xl font-bold text-primary-800 dark:text-primary-400">ResearchChain</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium hover:text-primary-700 dark:hover:text-primary-400 transition-colors ${
                location.pathname === '/' ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-700 dark:text-dark-400'
              }`}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-medium hover:text-primary-700 dark:hover:text-primary-400 transition-colors ${
                    location.pathname === '/dashboard' ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-700 dark:text-dark-400'
              }`}
                >
                  Dashboard
                </Link>
                
                <Link 
                  to="/marketplace" 
                  className={`font-medium hover:text-primary-700 dark:hover:text-primary-400 transition-colors ${
                    location.pathname === '/marketplace' ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-700 dark:text-dark-400'
              }`}
                >
                  Marketplace
                </Link>
              </>
            )}

            {/* Auth buttons or profile dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-1 text-neutral-700 dark:text-dark-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                >
                  <span className="font-medium">{user?.name || 'User'}</span>
                  <ChevronDown size={16} />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-100 rounded-md shadow-lg py-1 z-50">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-neutral-700 dark:text-dark-400 hover:bg-primary-50 dark:hover:bg-dark-200 hover:text-primary-700 dark:hover:text-primary-400"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        Profile
                      </div>
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left block px-4 py-2 text-sm text-neutral-700 dark:text-dark-400 hover:bg-primary-50 dark:hover:bg-dark-200 hover:text-primary-700 dark:hover:text-primary-400"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-outline">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-neutral-700 dark:text-dark-400"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-100 border-t border-neutral-200 dark:border-dark-200">
          <div className="container-custom py-4 space-y-4">
            <Link 
              to="/" 
              className={`block font-medium hover:text-primary-700 dark:hover:text-primary-400 transition-colors ${
                location.pathname === '/' ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-700 dark:text-dark-400'
              }`}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block font-medium hover:text-primary-700 dark:hover:text-primary-400 transition-colors ${
                    location.pathname === '/dashboard' ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-700 dark:text-dark-400'
              }`}
                >
                  Dashboard
                </Link>
                
                <Link 
                  to="/marketplace" 
                  className={`block font-medium hover:text-primary-700 dark:hover:text-primary-400 transition-colors ${
                    location.pathname === '/marketplace' ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-700 dark:text-dark-400'
              }`}
                >
                  Marketplace
                </Link>
                
                <Link 
                  to="/profile" 
                  className={`block font-medium hover:text-primary-700 dark:hover:text-primary-400 transition-colors ${
                    location.pathname === '/profile' ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-700 dark:text-dark-400'
              }`}
                >
                  Profile
                </Link>
                
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left font-medium text-neutral-700 dark:text-dark-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" className="btn-outline w-full text-center">Login</Link>
                <Link to="/register" className="btn-primary w-full text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
