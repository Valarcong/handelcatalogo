-- Migración para corregir permisos RLS en la tabla de auditoría

-- 1. Crear una función SECURITY DEFINER para verificar si el usuario es administrador
-- Esta función se ejecutará con los permisos del creador (que puede ver auth.users)
-- y determinará de forma segura si el usuario actual tiene el rol de 'admin'.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
-- SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM auth.users
        WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    );
$$;

-- 2. Eliminar la política de lectura anterior si es que existe
DROP POLICY IF EXISTS "Allow admin read audit logs" ON public.audit_logs;

-- 3. Crear una nueva política de lectura que use la función is_admin()
-- Esto soluciona el error de "permission denied for table users" porque la verificación
-- de permisos se delega a la función segura 'is_admin'.
CREATE POLICY "Allow admin read audit logs" ON public.audit_logs
FOR SELECT
USING (public.is_admin());

-- Comentario sobre la función para futura referencia
COMMENT ON FUNCTION public.is_admin() IS 'Verifica de forma segura si el usuario autenticado tiene el rol de administrador en sus metadatos de auth.';

-- Mensaje de finalización para la consola de Supabase
SELECT 'Migración de permisos RLS para auditoría completada exitosamente.' as status; 