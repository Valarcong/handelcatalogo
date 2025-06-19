
-- Crear tabla proveedores
CREATE TABLE public.proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  contacto TEXT,
  direccion TEXT,
  observaciones TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;

-- Política: Todos los administradores pueden ver y modificar proveedores (ajustar después si lo deseas más restringido)
CREATE POLICY "Admin puede gestionar proveedores"
  ON public.proveedores
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM usuario_roles ur
    JOIN roles r ON ur.rol_id = r.id
    WHERE ur.usuario_id = auth.uid()
      AND r.nombre = 'admin'
      AND ur.activo = true
      AND (ur.fecha_fin IS NULL OR ur.fecha_fin > now())
  ));
