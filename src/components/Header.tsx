import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/hooks/AuthContext';
import { useCart } from '@/hooks/CartContext';
import { Badge } from '@/components/ui/badge';
import GlobalSearchModal from './GlobalSearchModal';

const Header = () => {
  const location = useLocation();
  const { user, isAdmin, isVendedor, logout } = useAuthContext();
  const { getTotalItems, setIsCartOpen } = useCart();

  const [openSearch, setOpenSearch] = useState(false);

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

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const totalItems = getTotalItems();

  const isMobile = window.innerWidth <= 480;

  return (
    <header className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 border-b-2 border-gray-800 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-between h-20 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/imagenes/logo/handel_logo_blanco_reducido.png"
              alt="HandelSac Logo"
              className={`object-contain w-auto drop-shadow-xl ${
                isMobile ? "h-12" : "h-16"
              } max-w-none`}
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link to="/" className={`transition-colors ${isActive("/")}`}>
              <span className="font-extrabold text-lg tracking-widest uppercase">Inicio</span>
            </Link>
            <Link
              to="/productos"
              className={`transition-colors ${isActive("/productos")}`}
            >
              <span className="font-extrabold text-lg tracking-widest uppercase">Productos</span>
            </Link>
            {user && isVendedor && (
              <Link
                to="/ventas"
                className={`transition-colors ${isActive("/ventas")}`}
              >
                <span className="font-extrabold text-lg tracking-widest uppercase">Ventas</span>
              </Link>
            )}
            {user && isAdmin && (
              <Link
                to="/admin"
                className={`transition-colors ${isActive("/admin")}`}
              >
                <span className="font-extrabold text-lg tracking-widest uppercase">Administración</span>
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Global Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenSearch(true)}
              className="text-gray-200 hover:text-yellow-300 hover:bg-gray-800/60 border border-gray-700 shadow-md relative"
              aria-label="Buscar productos global"
            >
              <Search className="h-5 w-5" />
            </Button>
            {/* Carrito de compras */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCartClick}
              className="text-gray-200 hover:text-yellow-300 hover:bg-gray-800/60 border border-gray-700 shadow-md relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs border-2 border-gray-900 bg-yellow-400 text-gray-900 font-extrabold"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-gray-100 text-sm font-bold tracking-wider">{user.nombre}</span>
                  <div className="flex gap-1">
                    {user.roles?.map((role: any) => (
                      <Badge
                        key={role.id}
                        variant="secondary"
                        className="text-xs bg-gray-800 border border-gray-600 text-gray-200 font-bold"
                      >
                        {role.nombre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-200 hover:text-red-400 hover:bg-gray-800/60 border border-gray-700 shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden pb-4">
          <div className="flex justify-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-extrabold tracking-widest uppercase transition-colors ${isActive("/")}`}
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className={`text-sm font-extrabold tracking-widest uppercase transition-colors ${isActive("/productos")}`}
            >
              Productos
            </Link>
            {user && isVendedor && (
              <Link
                to="/ventas"
                className={`text-sm font-extrabold tracking-widest uppercase transition-colors ${isActive("/ventas")}`}
              >
                Ventas
              </Link>
            )}
            {user && isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-extrabold tracking-widest uppercase transition-colors ${isActive("/admin")}`}
              >
                Admin
              </Link>
            )}
          </div>
        </nav>
      </div>
      <GlobalSearchModal open={openSearch} onOpenChange={setOpenSearch} />
    </header>
  );
};

export default Header;