
-- Tabla principal de pedidos
CREATE TABLE public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nombre TEXT NOT NULL,
  cliente_telefono TEXT,
  cliente_email TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  productos JSONB NOT NULL, -- lista de productos (id, nombre, cantidad, precio)
  total NUMERIC NOT NULL DEFAULT 0,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Política: Permitir a cualquier usuario autenticado leer y crear pedidos
CREATE POLICY "Cualquier autenticado puede leer pedidos"
  ON public.pedidos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Cualquier autenticado puede crear pedidos"
  ON public.pedidos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Solo administradores podrán actualizar y borrar pedidos (extensible en el futuro)
-- Por ahora, dejar sólo usuarios autenticados pero con la opción de mejorar con roles luego
CREATE POLICY "Cualquier autenticado puede actualizar pedidos"
  ON public.pedidos
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Cualquier autenticado puede borrar pedidos"
  ON public.pedidos
  FOR DELETE
  TO authenticated
  USING (true);

