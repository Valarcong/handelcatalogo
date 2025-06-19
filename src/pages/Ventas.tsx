
import React from "react";
import { useAuthContext } from "@/hooks/AuthContext";
import { Navigate } from "react-router-dom";
import VentasLayout from "@/components/ventas/VentasLayout";
import VentasHeader from "@/components/ventas/VentasHeader";
import VentasSectionRenderer from "@/components/ventas/VentasSectionRenderer";
import { useVentasNavigation } from "@/hooks/useVentasNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

const Ventas = () => {
  const { user, isVendedor, isAdmin, loading } = useAuthContext();
  const { section } = useVentasNavigation();
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isVendedor && !isAdmin)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <VentasLayout>
      <VentasHeader user={user} showSidebarTrigger={isMobile} />
      <VentasSectionRenderer section={section} />
    </VentasLayout>
  );
};

export default Ventas;
