import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import useUser from '../../context/useUser';
import path from '../../path';
import { MenuIcon, XIcon } from 'lucide-react';

const Header = () => {
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get routes for current user role
  const userRoutes = user?.rol?.nombre ? path[user.rol.nombre] || [] : [];
  const mainRoutes = userRoutes.filter(route => route.principal);

  if (!user) return null;

  return (
    <header 
      className="bg-white shadow-md" 
      role="banner"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold text-gray-800"
              aria-label="Ir al inicio"
            >
              GProvisión
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-8" 
            aria-label="Navegación principal"
          >
            {mainRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === route.path
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={location.pathname === route.path ? 'page' : undefined}
              >
                {route.alias}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <span className="hidden md:block text-sm text-gray-700 mr-4">
              {user.nombre || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              aria-expanded="false"
              aria-haspopup="true"
              aria-label="Menú de navegación"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div 
          ref={menuRef}
          className="md:hidden bg-white shadow-lg rounded-b-md"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mainRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === route.path
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="menuitem"
                tabIndex="0"
                aria-current={location.pathname === route.path ? 'page' : undefined}
              >
                {route.alias}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="px-3 py-2 text-sm text-gray-700">
                {user.nombre || user.email}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                role="menuitem"
                tabIndex="0"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

