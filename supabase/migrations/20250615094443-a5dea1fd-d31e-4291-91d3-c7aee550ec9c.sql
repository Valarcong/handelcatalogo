
-- Paso 1: Habilitar notificaciones en tiempo real para la tabla notificaciones

-- Asegurarse de que la tabla soporte replica identity completa
ALTER TABLE public.notificaciones REPLICA IDENTITY FULL;

-- Añadir la tabla notificaciones a la publicación supabase_realtime
BEGIN;

-- Puede que la publicación ya exista, así que lo hacemos idempotente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notificaciones'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notificaciones;
  END IF;
END
$$;

COMMIT;
