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

  const isMobile = window.innerWidth <= 480; // Solo aplica el tamaño visualmente, mejora con useIsMobile si se requiere

  return (
    <header className="bg-brand-navy shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center max-h-12 overflow-hidden">
            <img
              src="/imagenes/logo/handel_logo_blanco_reducido.png"
              alt="HandelSac Logo"
              className={`object-contain w-auto ${
                isMobile ? "h-8 max-w-[120px]" : "h-10 max-w-[180px]"
              }`}
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`transition-colors ${isActive("/")}`}>
              Inicio
            </Link>
            <Link
              to="/productos"
              className={`transition-colors ${isActive("/productos")}`}
            >
              Productos
            </Link>
            {user && isVendedor && (
              <Link
                to="/ventas"
                className={`transition-colors ${isActive("/ventas")}`}
              >
                Panel Ventas
              </Link>
            )}
            {user && isAdmin && (
              <Link
                to="/admin"
                className={`transition-colors ${isActive("/admin")}`}
              >
                Administración
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
              className="text-white hover:text-brand-orange hover:bg-white/10 relative"
              aria-label="Buscar productos global"
            >
              <Search className="h-4 w-4" />
            </Button>
            {/* Carrito de compras */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCartClick}
              className="text-white hover:text-brand-orange hover:bg-white/10 relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-white text-sm">{user.nombre}</span>
                  <div className="flex gap-1">
                    {user.roles?.map((role: any) => (
                      <Badge
                        key={role.id}
                        variant="secondary"
                        className="text-xs"
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
                  className="text-white hover:text-brand-orange hover:bg-white/10"
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
              className={`text-sm transition-colors ${isActive("/")}`}
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className={`text-sm transition-colors ${isActive("/productos")}`}
            >
              Productos
            </Link>
            {user && isVendedor && (
              <Link
                to="/ventas"
                className={`text-sm transition-colors ${isActive("/ventas")}`}
              >
                Ventas
              </Link>
            )}
            {user && isAdmin && (
              <Link
                to="/admin"
                className={`text-sm transition-colors ${isActive("/admin")}`}
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
