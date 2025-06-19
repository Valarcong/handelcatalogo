
-- ================================================
-- 1. Función para enviar notificaciones automáticas a administradores al crear un pedido
-- ================================================

CREATE OR REPLACE FUNCTION public.generar_notificacion_nuevo_pedido()
RETURNS TRIGGER AS $$
DECLARE
  admin RECORD;
  notif_titulo TEXT;
  notif_mensaje TEXT;
BEGIN
  notif_titulo := 'Nuevo Pedido Recibido';
  notif_mensaje := 
    'Pedido ' || COALESCE(NEW.numero_orden, '(sin número)') ||
    ' de ' || COALESCE(NEW.cliente_nombre, '(sin nombre)') ||
    ' por S/. ' || to_char(NEW.total, 'FM999990.00');

  FOR admin IN
    SELECT u.id AS usuario_id, u.nombre, ur.rol_id, r.nombre AS rol_nombre
    FROM public.usuarios u
    JOIN public.usuario_roles ur ON ur.usuario_id = u.id AND ur.activo = true
    JOIN public.roles r ON ur.rol_id = r.id
    WHERE r.nombre ILIKE 'admin%' AND (ur.fecha_fin IS NULL OR ur.fecha_fin > now())
  LOOP
    INSERT INTO public.notificaciones (
      usuario_id, tipo, titulo, mensaje, leida, creado_en
    ) VALUES (
      admin.usuario_id,
      'nuevo_pedido',
      notif_titulo,
      notif_mensaje,
      false,
      NOW()
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- 2. Trigger que se activa después de insertar un pedido, para llamar la función anterior
-- ================================================

DROP TRIGGER IF EXISTS trigger_notificacion_nuevo_pedido ON public.pedidos;

CREATE TRIGGER trigger_notificacion_nuevo_pedido
AFTER INSERT ON public.pedidos
FOR EACH ROW
EXECUTE FUNCTION public.generar_notificacion_nuevo_pedido();

-- ================================================
-- Notas:
-- - Esto asegurará que cada vez que se crea un pedido (frontend o backend),
--   todos los administradores recibirán una notificación automáticamente.
-- - El precio SIEMPRE aparecerá en soles con 2 decimales ("S/. 25.00").
-- - La notificación tendrá tipo 'nuevo_pedido', útil para filtrado en el frontend.
-- ================================================
