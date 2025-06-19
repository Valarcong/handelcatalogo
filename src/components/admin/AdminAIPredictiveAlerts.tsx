import React from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface Props {
  authId: string;
}

const AdminAIPredictiveAlerts: React.FC<Props> = ({ authId }) => {
  const {
    notifications,
    markAsRead,
    fetchNotifications,
    loading,
    error,
    unreadCount,
  } = useNotifications(authId);

  // Logs para debugging
  // console.log("[AdminAIPredictiveAlerts] authId:", authId);
  // console.log("[AdminAIPredictiveAlerts] notifications:", notifications);
  // console.log("[AdminAIPredictiveAlerts] loading:", loading);
  // console.log("[AdminAIPredictiveAlerts] error:", error);

  const aiAlerts = notifications.filter(n => n.tipo === "alerta_ia");
  const aiUnread = aiAlerts.filter(n => !n.leida);

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="">
      <AccordionItem value="ia-alertas">
        <AccordionTrigger>
          <div className="flex items-center gap-2 w-full">
            <Badge variant="secondary">IA</Badge>
            <span className="font-semibold flex-1 text-left">
              Alertas predictivas IA
            </span>
            {aiUnread.length > 0 && (
              <span className="rounded-full bg-blue-600 text-white text-xs px-2 py-0.5">{aiUnread.length}</span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {/* Contenido expandible */}
          {error ? (
            <div className="p-4 text-red-700 space-y-2 text-sm bg-red-50 border border-red-300 rounded">
              <div>
                <strong>Ocurrió un error cargando Alertas IA:</strong>
                <br />
                <span>{error}</span>
              </div>
              <button
                className="mt-2 bg-blue-600 px-3 py-1 text-white rounded text-xs"
                onClick={async () => {
                  await fetchNotifications();
                }}
              >Reintentar</button>
              <div className="mt-2 text-xs text-gray-500">
                Si ves un mensaje de permisos, revisa la configuración de RLS en la tabla <b>notificaciones</b>.<br />
                Si error de red, revisa acceso a Supabase.
              </div>
            </div>
          ) : loading ? (
            <div className="p-4 text-xs text-gray-400">
              Cargando alertas IA...
            </div>
          ) : aiAlerts.length === 0 ? (
            <div className="p-4 text-xs text-gray-400">
              No tienes alertas predictivas IA por el momento.
            </div>
          ) : (
            <div className="space-y-4">
              {aiAlerts.map(alert => (
                <Alert
                  key={alert.id}
                  variant={alert.leida ? "default" : "destructive"}
                  className="border-l-4 border-blue-600"
                >
                  <AlertTitle>
                    <Badge variant="secondary" className="mr-2">IA</Badge>
                    {alert.titulo}
                  </AlertTitle>
                  <AlertDescription>
                    {alert.mensaje}
                    {!alert.leida && (
                      <button
                        className="ml-4 text-xs underline text-blue-700"
                        onClick={async () => {
                          await markAsRead(alert.id);
                          await fetchNotifications();
                        }}
                      >
                        Marcar como leída
                      </button>
                    )}
                  </AlertDescription>
                  <div className="text-xs text-right text-gray-400 mt-2">
                    {new Date(alert.creado_en).toLocaleString()}
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdminAIPredictiveAlerts;
