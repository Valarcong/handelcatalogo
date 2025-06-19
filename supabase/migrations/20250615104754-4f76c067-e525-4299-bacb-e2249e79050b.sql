
-- 1. Insertar el usuario (si no existe) en la tabla usuarios
INSERT INTO public.usuarios (id, nombre, usuario, email)
VALUES (
  '5da63ff1-ad9d-4c9a-a81a-2f7bbd92a4ac', -- ID de Supabase Auth
  'Usuario Vendedor',                      -- Nombre (puedes personalizarlo)
  'vendedor_test',                         -- Username (puedes personalizarlo)
  'aspid_vcnt@hotmail.com'                 -- Email
)
ON CONFLICT (id) DO NOTHING;

-- 2. Obtener el id del rol "Vendedor" (ajusta si el rol tuvo otro uuid)
-- Para efectos del insert, podemos asumir que existe el id: 1a4646fc-1836-469a-9341-2ecd4295d167
-- (Si por alguna razón este id cambia, primero consulta: SELECT id FROM roles WHERE nombre = 'Vendedor';)

-- 3. Asignar el rol de vendedor al usuario (si no existe ya)
INSERT INTO public.usuario_roles (usuario_id, rol_id, activo)
VALUES (
  '5da63ff1-ad9d-4c9a-a81a-2f7bbd92a4ac',           -- usuario_id
  '1a4646fc-1836-469a-9341-2ecd4295d167',           -- rol_id (Vendedor)
  true
)
ON CONFLICT (usuario_id, rol_id) DO NOTHING;
