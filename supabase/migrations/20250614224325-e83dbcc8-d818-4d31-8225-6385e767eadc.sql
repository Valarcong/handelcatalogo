
-- Agregar columna email a la tabla usuarios
ALTER TABLE public.usuarios ADD COLUMN email text;

-- Actualizar el registro existente con el email correspondiente
UPDATE public.usuarios 
SET email = 'valarcong.ingsistemas@gmail.com' 
WHERE usuario = 'valarcon';

-- Eliminar la columna contrasena ya que Supabase Auth manejará las contraseñas
ALTER TABLE public.usuarios DROP COLUMN contrasena;

-- Hacer que la columna email sea obligatoria y única
ALTER TABLE public.usuarios ALTER COLUMN email SET NOT NULL;
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_email_unique UNIQUE (email);
