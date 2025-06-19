
-- Función para crear notificaciones de cotizaciones pendientes >24h
CREATE OR REPLACE FUNCTION public.generar_notificacion_cotizacion_pendiente()
RETURNS void AS $$
DECLARE
  cotiz RECORD;
  admin RECORD;
  notif_exists boolean;
BEGIN
  -- Revisar cotizaciones de ventas pendientes de más de 24h SIN respuesta
  FOR cotiz IN
    SELECT *
    FROM public.cotizaciones_ventas
    WHERE estado = 'pendiente'
      AND respondido_en IS NULL
      AND enviado_en < now() - INTERVAL '24 hours'
  LOOP
    -- Para cada admin/vendedor activo
    FOR admin IN
      SELECT u.id, ur.rol_id, r.nombre as rol_nombre
      FROM public.usuarios u
      JOIN public.usuario_roles ur ON ur.usuario_id = u.id AND ur.activo = true
      JOIN public.roles r ON ur.rol_id = r.id
      WHERE r.nombre ILIKE ANY(ARRAY['admin%','vendedor%'])
        AND (ur.fecha_fin IS NULL OR ur.fecha_fin > now())
    LOOP
      -- Evitar notificación duplicada
      SELECT EXISTS(
        SELECT 1 FROM public.notificaciones
        WHERE usuario_id = admin.id
          AND tipo = 'cotizacion_pendiente'
          AND mensaje LIKE '%' || cotiz.id || '%'
          AND leida = false
      ) INTO notif_exists;
      IF NOT notif_exists THEN
        INSERT INTO public.notificaciones (
          usuario_id,
          tipo,
          titulo,
          mensaje,
          leida,
          creado_en
        ) VALUES (
          admin.id,
          'cotizacion_pendiente',
          'Cotización pendiente sin respuesta hace más de 24h',
          'Cotización #' || cotiz.id || ' de ' || COALESCE(cotiz.nombre_cliente, '(s/dato)') || 
           ' por S/. ' || to_char(cotiz.precio_total, 'FM999990.00') || 
           ' está pendiente desde ' || to_char(cotiz.enviado_en, 'YYYY-MM-DD HH24:MI') || 
           '. ID: ' || cotiz.id,
          false,
          now()
        );
      END IF;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- (Opcional) Trigger programado (a través de Scheduler externo/cron) o manual para ejecutar la función diariamente
-- Para uso manual por ahora:
-- SELECT public.generar_notificacion_cotizacion_pendiente();

