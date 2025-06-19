
-- Paso 1: Eliminar las políticas RLS problemáticas que causan recursión infinita
DROP POLICY IF EXISTS "Solo admins pueden gestionar usuario_roles" ON public.usuario_roles;
DROP POLICY IF EXISTS "Usuarios pueden ver sus roles" ON public.usuario_roles;

-- Paso 2: Crear función helper con SECURITY DEFINER para evitar recursión
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT r.nombre 
  FROM public.usuario_roles ur
  JOIN public.roles r ON ur.rol_id = r.id
  WHERE ur.usuario_id = auth.uid() 
  AND ur.activo = true
  AND (ur.fecha_fin IS NULL OR ur.fecha_fin > now())
  LIMIT 1;
$$;

-- Paso 3: Crear función helper para verificar si un usuario tiene un rol específico
CREATE OR REPLACE FUNCTION public.user_has_specific_role(user_id uuid, role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.usuario_roles ur
    JOIN public.roles r ON ur.rol_id = r.id
    WHERE ur.usuario_id = user_id 
    AND r.nombre = role_name
    AND ur.activo = true
    AND (ur.fecha_fin IS NULL OR ur.fecha_fin > now())
  );
$$;

-- Paso 4: Crear políticas RLS simples y correctas para usuario_roles
CREATE POLICY "Users can view their own roles" ON public.usuario_roles 
FOR SELECT TO authenticated 
USING (usuario_id = auth.uid());

-- Solo administradores pueden gestionar roles (usando la función helper para evitar recursión)
CREATE POLICY "Admins can manage user roles" ON public.usuario_roles 
FOR ALL TO authenticated 
USING (public.user_has_specific_role(auth.uid(), 'Administrador'));

-- Paso 5: Asegurar que todos puedan leer la tabla roles (necesario para el JOIN)
DROP POLICY IF EXISTS "Todos pueden ver roles" ON public.roles;
CREATE POLICY "Authenticated users can view roles" ON public.roles 
FOR SELECT TO authenticated 
USING (true);

-- Paso 6: Recrear las políticas de productos y categorías usando la nueva función
DROP POLICY IF EXISTS "Solo administradores pueden gestionar categorías" ON public.categorias;
DROP POLICY IF EXISTS "Solo administradores pueden gestionar productos" ON public.productos;
DROP POLICY IF EXISTS "Vendedores pueden ver productos" ON public.productos;
DROP POLICY IF EXISTS "Vendedores pueden ver categorías" ON public.categorias;

CREATE POLICY "Solo administradores pueden gestionar categorías" ON public.categorias 
FOR ALL TO authenticated 
USING (public.user_has_specific_role(auth.uid(), 'Administrador'));

CREATE POLICY "Solo administradores pueden gestionar productos" ON public.productos 
FOR ALL TO authenticated 
USING (public.user_has_specific_role(auth.uid(), 'Administrador'));

CREATE POLICY "Vendedores pueden ver productos" ON public.productos 
FOR SELECT TO authenticated 
USING (
  public.user_has_specific_role(auth.uid(), 'Vendedor') OR 
  public.user_has_specific_role(auth.uid(), 'Administrador')
);

CREATE POLICY "Vendedores pueden ver categorías" ON public.categorias 
FOR SELECT TO authenticated 
USING (
  public.user_has_specific_role(auth.uid(), 'Vendedor') OR 
  public.user_has_specific_role(auth.uid(), 'Administrador')
);
