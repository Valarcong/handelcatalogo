import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, LogOut, Menu, X, Home, Package, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/hooks/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import GlobalSearchModal from './GlobalSearchModal';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const location = useLocation();
  const { user, isAdmin, isVendedor, logout } = useAuthContext();
  const isMobile = useIsMobile();

  const [openSearch, setOpenSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Atajo teclado Ctrl+K o Cmd+K
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearch(true);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-brand-orange font-medium' : 'text-white hover:text-brand-orange';
  };

  const handleLogout = async () => {
    await logout();
  };

  // Navegación móvil
  const MobileNavigation = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-gray-200 hover:text-yellow-300 hover:bg-gray-800/60 border border-gray-700 shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-gray-900 border-gray-700">
        <div className="flex flex-col h-full">
          {/* Header del menú móvil */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <img
              src="/imagenes/logo/handel_logo_blanco_reducido.png"
              alt="HandelSac Logo"
              className="h-12 object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Información del usuario */}
          {user && (
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.nombre?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{user.nombre}</p>
                  <div className="flex gap-1 mt-1">
                    {user.roles?.map((role: any) => (
                      <Badge
                        key={role.id}
                        variant="secondary"
                        className="text-xs bg-gray-800 border border-gray-600 text-gray-200"
                      >
                        {role.nombre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navegación */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Inicio</span>
              </Link>

              <Link
                to="/productos"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  location.pathname === '/productos' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Package className="h-5 w-5" />
                <span className="font-medium">Productos</span>
              </Link>

              {user && isVendedor && (
                <Link
                  to="/ventas"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    location.pathname === '/ventas' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Ventas</span>
                </Link>
              )}

              {user && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    location.pathname === '/admin' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Administración</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Acciones */}
          <div className="p-4 border-t border-gray-700">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800"
                onClick={() => {
                  setOpenSearch(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar productos
              </Button>

              {user && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-400 border-red-600 hover:bg-red-900/20"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 border-b-2 border-gray-800 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/imagenes/logo/handel_logo_blanco_reducido.png"
              alt="HandelSac Logo"
              className="h-10 md:h-16 object-contain drop-shadow-xl"
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`transition-colors ${isActive("/")}`}>
              <span className="font-bold text-base tracking-wide uppercase">Inicio</span>
            </Link>
            <Link
              to="/productos"
              className={`transition-colors ${isActive("/productos")}`}
            >
              <span className="font-bold text-base tracking-wide uppercase">Productos</span>
            </Link>
            {user && isVendedor && (
              <Link
                to="/ventas"
                className={`transition-colors ${isActive("/ventas")}`}
              >
                <span className="font-bold text-base tracking-wide uppercase">Ventas</span>
              </Link>
            )}
            {user && isAdmin && (
              <Link
                to="/admin"
                className={`transition-colors ${isActive("/admin")}`}
              >
                <span className="font-bold text-base tracking-wide uppercase">Administración</span>
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenSearch(true)}
              className="text-gray-200 hover:text-yellow-300 hover:bg-gray-800/60 border border-gray-700 shadow-md"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {isMobile ? <MobileNavigation /> : null}

            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 border-red-500/50 hover:bg-red-900/20 shadow-md"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <GlobalSearchModal open={openSearch} setOpen={setOpenSearch} />
    </header>
  );
};

export default Header;