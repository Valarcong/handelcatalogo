
-- Crear la tabla de notificaciones
CREATE TABLE public.notificaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  tipo text NOT NULL,
  titulo text NOT NULL,
  mensaje text,
  leida boolean NOT NULL DEFAULT false,
  creado_en timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

-- Policy: cada usuario solo puede ver sus propias notificaciones
CREATE POLICY "Solo dueño puede ver notificaciones"
ON public.notificaciones
FOR SELECT
USING (auth.uid() = usuario_id);

-- Policy: cada usuario solo puede insertar sus propias notificaciones
CREATE POLICY "Solo puedo crear mis notificaciones"
ON public.notificaciones
FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

-- Policy: solo el dueño puede marcar como leída/borrar
CREATE POLICY "Solo dueño puede modificar/borrar notificaciones"
ON public.notificaciones
FOR UPDATE
USING (auth.uid() = usuario_id);

CREATE POLICY "Solo dueño puede borrar notificaciones"
ON public.notificaciones
FOR DELETE
USING (auth.uid() = usuario_id);
