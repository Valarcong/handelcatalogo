
-- 1. Añadir columna 'marca' a productos (por defecto 'omegaplast')
ALTER TABLE public.productos
  ADD COLUMN marca TEXT NOT NULL DEFAULT 'omegaplast';

-- 2. Actualizar la marca de productos existentes a 'omegaplast' (ya lo cubre el default, pero es extra seguro)
UPDATE public.productos SET marca = 'omegaplast' WHERE marca IS NULL OR marca = '';

