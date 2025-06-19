
-- Crear políticas RLS para la tabla usuarios
-- Política para permitir que usuarios autenticados vean su propio perfil
CREATE POLICY "Users can view their own profile" ON public.usuarios
FOR SELECT TO authenticated 
USING (auth.uid() = id);

-- Política para permitir que usuarios autenticados inserten su propio perfil durante el registro
CREATE POLICY "Users can insert their own profile" ON public.usuarios
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = id);

-- Política para permitir que usuarios autenticados actualicen su propio perfil
CREATE POLICY "Users can update their own profile" ON public.usuarios
FOR UPDATE TO authenticated 
USING (auth.uid() = id);

-- Política opcional para permitir que usuarios eliminen su propio perfil
CREATE POLICY "Users can delete their own profile" ON public.usuarios
FOR DELETE TO authenticated 
USING (auth.uid() = id);
