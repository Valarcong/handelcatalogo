
-- Permitir crear pedidos como usuario anónimo o autenticado

-- Eliminar la política actual de insert (si existe)
DROP POLICY IF EXISTS "Cualquier autenticado puede crear pedidos" ON public.pedidos;

-- Crear una nueva política de insert que permita a anónimos y autenticados crear pedidos
CREATE POLICY "Cualquiera puede crear pedidos"
  ON public.pedidos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Revisar y mantener las otras políticas solo para usuarios autenticados:
-- La SELECT, UPDATE y DELETE continúan sólo para authenticated (por seguridad).
