import React from "react";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "@/components/ui/NotificationBell";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  user: any;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            Panel de Administración - HandelSAC
          </h1>
          <p className="text-gray-600">
            Bienvenido, {user.nombre}
          </p>
          <div className="flex gap-2 mt-2">
            {user.roles?.map((role: any) => (
              <Badge key={role.id} variant="outline" className="border-brand-secondary text-brand-secondary">
                {role.nombre}
              </Badge>
            ))}
          </div>
        </div>
        {/* Notificaciones badge en la parte superior derecha */}
        <div className="flex items-center gap-4">
          <NotificationBell userId={user.id} />
          <SidebarTrigger />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader; 