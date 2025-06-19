import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Notificacion {
  id: string;
  usuario_id: string;
  tipo: string;
  titulo: string;
  mensaje: string | null;
  leida: boolean;
  creado_en: string;
}

export function useNotifications(authId: string | null) {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // NUEVO

  // Para evitar setState sobre componente desmontado
  const mountedRef = useRef(true);

  // Referencia al canal actual de Supabase
  const channelRef = useRef<any>(null);
  // NUEVO: bandera para evitar doble subscribe
  const isSubscribedRef = useRef(false);

  const fetchNotifications = useCallback(async () => {
    setError(null);
    if (!authId) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("notificaciones")
        .select("*")
        .eq("usuario_id", authId)
        .order("creado_en", { ascending: false });

      if (fetchError) {
        setNotifications([]);
        setError(fetchError.message || "Error desconocido al consultar notificaciones.");
        console.error("[useNotifications] Supabase error:", fetchError);
      } else {
        setNotifications((data as Notificacion[]) || []);
        setError(null);
      }
    } catch (err: any) {
      setNotifications([]);
      setError("Error llamando a Supabase: " + (err?.message || String(err)));
      console.error("[useNotifications] JS error:", err);
    } finally {
      setLoading(false);
    }
  }, [authId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchNotifications();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchNotifications]);

  // Mejor gestión de suscripción en tiempo real
  useEffect(() => {
    // Limpieza anterior SIEMPRE primero (solo en cleanup)
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
        console.log("[Notifications] Canal realtime eliminado correctamente (previo cambio de authId).");
      } catch (err) {
        // Nada
      }
      channelRef.current = null;
      // importante: flag fuera del flujo normal!
      isSubscribedRef.current = false;
    }

    if (!authId) {
      // Sin usuario, limpiar canal y no suscribir
      return;
    }

    // Evitar multi-subscribe: Si el ref indica que ya hubo un subscribe exitoso previo, NO continuar.
    if (isSubscribedRef.current) {
      console.warn("[Notifications] Ya hay una suscripción activa, NO se volverá a crear.");
      return;
    }

    // Crear canal new y guardar referencia
    const channel = supabase
      .channel(`notificaciones-insert-${authId}-${Date.now()}`) // incluye timestamp para evitar colisiones viejas
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notificaciones',
          filter: `usuario_id=eq.${authId}`,
        },
        (payload: any) => {
          setNotifications((prev) => {
            const existe = prev.some((n) => n.id === payload.new.id);
            if (existe) return prev;
            return [{ ...(payload.new as Notificacion) }, ...prev];
          });
        }
      );

    console.log("[Notifications] Suscribiendo canal realtime para userId:", authId, channel);

    // NUEVO: suscripción usando callback (no promesa)
    channel.subscribe((status: string) => {
      if (status === "SUBSCRIBED") {
        isSubscribedRef.current = true;
        channelRef.current = channel;
        console.log("[Notifications] Suscripción a canal realtime exitosa para userId:", authId);
      } else {
        console.error("[Notifications] Error al suscribir canal realtime para userId:", authId, "status:", status);
      }
    });

    // Cleanup: remover canal y dejar flag listo
    return () => {
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
          console.log("[Notifications] Canal realtime eliminado en cleanup.");
        } catch (err) {
          // Nada
        }
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [authId]);

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from("notificaciones")
        .update({ leida: true })
        .eq("id", id);
      setNotifications((nots) =>
        nots.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    } catch (err: any) {
      setError("Error marcando como leída: " + (err?.message || String(err)));
      console.error("[Notifications] markAsRead error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from("notificaciones")
        .update({ leida: true })
        .eq("usuario_id", authId)
        .eq("leida", false);
      setNotifications((nots) =>
        nots.map((n) => ({ ...n, leida: true }))
      );
    } catch (err: any) {
      setError("Error marcando todas como leídas: " + (err?.message || String(err)));
      console.error("[Notifications] markAllAsRead error:", err);
    }
  };

  const notify = async (values: Omit<Notificacion, "id" | "creado_en" | "leida">) => {
    await supabase.from("notificaciones").insert([
      { ...values }
    ]);
  };

  const unreadCount = notifications.filter((n) => !n.leida).length;

  return {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
    notify,
    error, // NUEVO
  };
}

// --- NUEVO, función util para crear notificación directa desde fuera del hook ---
export async function notifyDirect(values: Omit<Notificacion, "id" | "creado_en" | "leida">) {
  await supabase.from("notificaciones").insert([
    { ...values }
  ]);
}
