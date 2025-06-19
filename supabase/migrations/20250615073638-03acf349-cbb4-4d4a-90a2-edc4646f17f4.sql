
-- Reemplazar la política de RLS para proveedores, usando el nombre correcto del rol 'Administrador'
DROP POLICY IF EXISTS "Admin puede gestionar proveedores" ON public.proveedores;

CREATE POLICY "Administrador puede gestionar proveedores"
  ON public.proveedores
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM usuario_roles ur
    JOIN roles r ON ur.rol_id = r.id
    WHERE ur.usuario_id = auth.uid()
      AND r.nombre = 'Administrador'
      AND ur.activo = true
      AND (ur.fecha_fin IS NULL OR ur.fecha_fin > now())
  ));

