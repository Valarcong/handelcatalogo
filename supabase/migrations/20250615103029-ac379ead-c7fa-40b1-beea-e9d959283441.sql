
-- 1. Habilitar Row Level Security (RLS) en las tablas indicadas
ALTER TABLE public.producto_proveedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizaciones_proveedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalle_cotizacion_proveedor ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para producto_proveedor
-- Solo administradores pueden gestionar todas las operaciones (CRUD)
CREATE POLICY "Solo administradores pueden gestionar producto_proveedor"
  ON public.producto_proveedor
  FOR ALL TO authenticated
  USING (public.user_has_specific_role(auth.uid(), 'Administrador'));

-- Los vendedores pueden ver relaciones producto-proveedor
CREATE POLICY "Vendedores pueden ver producto_proveedor"
  ON public.producto_proveedor
  FOR SELECT TO authenticated
  USING (
    public.user_has_specific_role(auth.uid(), 'Vendedor')
    OR public.user_has_specific_role(auth.uid(), 'Administrador')
  );

-- 3. Políticas para cotizaciones_proveedor
-- Solo administradores pueden gestionar
CREATE POLICY "Solo administradores pueden gestionar cotizaciones_proveedor"
  ON public.cotizaciones_proveedor
  FOR ALL TO authenticated
  USING (public.user_has_specific_role(auth.uid(), 'Administrador'));

-- 4. Políticas para detalle_cotizacion_proveedor
-- Solo administradores pueden gestionar
CREATE POLICY "Solo administradores pueden gestionar detalle_cotizacion_proveedor"
  ON public.detalle_cotizacion_proveedor
  FOR ALL TO authenticated
  USING (public.user_has_specific_role(auth.uid(), 'Administrador'));
