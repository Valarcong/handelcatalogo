
-- Primero eliminar las políticas RLS que dependen de la columna cargo
DROP POLICY IF EXISTS "Solo administradores pueden gestionar categorías" ON public.categorias;
DROP POLICY IF EXISTS "Solo administradores pueden gestionar productos" ON public.productos;

-- Crear tabla de roles
CREATE TABLE public.roles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre text NOT NULL UNIQUE,
    descripcion text,
    permisos jsonb DEFAULT '[]'::jsonb,
    activo boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Crear tabla intermedia usuario_roles
CREATE TABLE public.usuario_roles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    rol_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    asignado_por uuid REFERENCES public.usuarios(id),
    fecha_inicio timestamp with time zone NOT NULL DEFAULT now(),
    fecha_fin timestamp with time zone,
    activo boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(usuario_id, rol_id)
);

-- Insertar roles iniciales
INSERT INTO public.roles (nombre, descripcion, permisos) VALUES 
('Administrador', 'Acceso completo al sistema', '["admin", "products.create", "products.update", "products.delete", "categories.manage", "users.manage"]'),
('Vendedor', 'Consulta de productos y ventas', '["products.view", "sales.create", "sales.view"]');

-- Asignar rol de Administrador al usuario actual
INSERT INTO public.usuario_roles (usuario_id, rol_id, asignado_por)
SELECT u.id, r.id, u.id
FROM public.usuarios u
CROSS JOIN public.roles r
WHERE u.email = 'valarcong.ingsistemas@gmail.com' 
AND r.nombre = 'Administrador';

-- Ahora sí podemos eliminar la columna cargo
ALTER TABLE public.usuarios DROP COLUMN cargo;

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_roles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para roles (todos pueden leer los roles)
CREATE POLICY "Todos pueden ver roles" ON public.roles FOR SELECT TO authenticated USING (true);

-- Políticas RLS para usuario_roles (solo pueden ver sus propios roles)
CREATE POLICY "Usuarios pueden ver sus roles" ON public.usuario_roles 
FOR SELECT TO authenticated 
USING (usuario_id = auth.uid());

-- Solo administradores pueden gestionar roles de usuarios
CREATE POLICY "Solo admins pueden gestionar usuario_roles" ON public.usuario_roles 
FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.usuario_roles ur
        JOIN public.roles r ON ur.rol_id = r.id
        WHERE ur.usuario_id = auth.uid() 
        AND r.nombre = 'Administrador' 
        AND ur.activo = true
        AND (ur.fecha_fin IS NULL OR ur.fecha_fin > now())
    )
);

-- Crear función helper para verificar si un usuario tiene un rol específico
CREATE OR REPLACE FUNCTION public.user_has_role(user_id uuid, role_name text)
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

-- Recrear las políticas RLS usando el nuevo sistema de roles
CREATE POLICY "Solo administradores pueden gestionar categorías" ON public.categorias 
FOR ALL TO authenticated 
USING (public.user_has_role(auth.uid(), 'Administrador'));

CREATE POLICY "Solo administradores pueden gestionar productos" ON public.productos 
FOR ALL TO authenticated 
USING (public.user_has_role(auth.uid(), 'Administrador'));

-- Política para que vendedores puedan ver productos
CREATE POLICY "Vendedores pueden ver productos" ON public.productos 
FOR SELECT TO authenticated 
USING (
    public.user_has_role(auth.uid(), 'Vendedor') OR 
    public.user_has_role(auth.uid(), 'Administrador')
);

-- Política para que vendedores puedan ver categorías
CREATE POLICY "Vendedores pueden ver categorías" ON public.categorias 
FOR SELECT TO authenticated 
USING (
    public.user_has_role(auth.uid(), 'Vendedor') OR 
    public.user_has_role(auth.uid(), 'Administrador')
);
