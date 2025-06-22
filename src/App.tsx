import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Cart from "./components/Cart";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import Ventas from "./pages/Ventas";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Pedidos from "./pages/Pedidos";
import { AuthProvider } from "./hooks/AuthContext";
import { CartProvider } from "./hooks/CartContext";
import ProductDetail from "./pages/ProductDetail";
import Clientes from "./pages/Clientes";
import ErrorBoundary from "./components/ErrorBoundary";

// Configuración del QueryClient con manejo de errores mejorado
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // No reintentar en errores 4xx (excepto 408, 429)
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 408 && error?.status !== 429) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen bg-background">
                <ErrorBoundary>
                  <Header />
                </ErrorBoundary>
                <ErrorBoundary>
                  <Cart />
                </ErrorBoundary>
                <main>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/productos" element={<Products />} />
                      <Route path="/producto/:id" element={<ProductDetail />} />
                      <Route path="/admin/*" element={<Admin />} />
                      <Route path="/ventas" element={<Ventas />} />
                      <Route path="/clientes" element={<Clientes />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/pedidos" element={<Pedidos />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </main>
              </div>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
