
import React, { useState } from "react";
import { Bell, Check, MailOpen, AlertTriangle } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications, Notificacion } from "@/hooks/useNotifications";

interface NotificationBellProps {
  userId: string;
}

const getColor = (tipo: string) => {
  switch (tipo) {
    case "nuevo_pedido":
      return "bg-blue-100 text-blue-900 border-blue-300";
    case "pedido_estado":
      return "bg-yellow-100 text-yellow-900 border-yellow-300";
    case "cotizacion_pendiente":
      return "bg-red-100 text-red-900 border-red-300 ring-2 ring-red-400";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getIcon = (tipo: string, leida: boolean) => {
  if (tipo === "cotizacion_pendiente")
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  return leida
    ? <MailOpen className="w-4 h-4 text-green-500" />
    : <Check className="w-4 h-4 text-blue-500" />;
};

const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(userId);

  // Separamos cotizaciones atrasadas
  const alertCount = notifications.filter(n => n.tipo === "cotizacion_pendiente" && !n.leida).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Notificaciones"
          className="relative flex items-center justify-center rounded-full w-10 h-10 hover:bg-gray-100 transition"
        >
          <Bell className="w-6 h-6 text-brand-navy" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 inline-flex items-center px-1.5 py-0.5 rounded bg-red-500 text-white text-xs font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
          {/* Si hay alertas críticas */}
          {alertCount > 0 && (
            <span className="absolute -left-1 -bottom-1 animate-pulse flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 z-50 bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <span className="font-semibold text-base">Notificaciones</span>
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllAsRead}>
              Marcar todo como leído
            </Button>
          )}
        </div>
        {alertCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 px-4 py-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-red-700">
              Hay {alertCount} cotización(es) sin responder (&gt;24h)
            </span>
          </div>
        )}
        <div className="max-h-80 overflow-y-auto flex flex-col gap-0">
          {loading ? (
            <div className="p-4 text-gray-400 text-sm">Cargando...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-gray-400 text-sm">No tienes notificaciones aún.</div>
          ) : notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-2 px-4 py-2 border-b last:border-b-0 cursor-pointer transition group ${getColor(n.tipo)} ${!n.leida ? "font-semibold" : "opacity-80"}`}
              onClick={() => markAsRead(n.id)}
              title={n.tipo === "cotizacion_pendiente" ? "¡Esta cotización requiere tu atención!" : ""}
            >
              <span className="mt-1">
                {getIcon(n.tipo, n.leida)}
              </span>
              <div className="flex-1">
                <span className="block text-sm">{n.titulo}</span>
                {n.mensaje && (
                  <span className="block text-xs text-gray-700">{n.mensaje}</span>
                )}
                <span className="block text-xs text-gray-400 mt-1">
                  {new Date(n.creado_en).toLocaleString("es-PE")}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Info temporal sobre la función manual */}
        <div className="text-xs text-gray-500 px-4 pb-3 pt-2">
          <strong>¡Recordatorio!</strong><br />
          Las alertas por cotización pendiente requieren ejecutar periódicamente la función <code>generar_notificacion_cotizacion_pendiente()</code> en la base de datos o configurarla como tarea automatizada para recibirlas siempre a tiempo.
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;

