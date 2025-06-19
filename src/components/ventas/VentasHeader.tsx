import React from "react";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface VentasHeaderProps {
  user: any;
  showSidebarTrigger?: boolean;
}

const VentasHeader: React.FC<VentasHeaderProps> = ({ user, showSidebarTrigger }) => {
  return (
    <div className="mb-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-primary mb-2">
          Panel de Ventas - HandelSAC
        </h1>
        <p className="text-gray-600">
          Bienvenido, {user?.nombre ?? "usuari@"} - Catálogo y documentos de pedidos para vendedores.
        </p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {user?.roles?.map?.((role: any) => (
            <Badge key={role.id} variant="outline" className="border-brand-secondary text-brand-secondary">
              {role.nombre}
            </Badge>
          ))}
        </div>
      </div>
      {showSidebarTrigger ? <SidebarTrigger /> : null}
    </div>
  );
};

export default VentasHeader;