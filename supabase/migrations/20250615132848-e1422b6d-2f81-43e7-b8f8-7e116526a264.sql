
-- 1. Agregar campo opcional 'motivo_cancelacion' (texto)
ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS motivo_cancelacion TEXT;

-- 2. Agregar campo opcional 'cancelado_en' (marca de tiempo)
ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS cancelado_en TIMESTAMP WITH TIME ZONE;

-- 3. Agregar campo opcional 'cancelado_por' (UUID del usuario que cancela)
ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS cancelado_por UUID;

-- 4. (Opcional pero recomendado) Agregar campo para el estado 'cancelado'
-- Si el estado ya es un campo libre (texto), solo debemos agregar el valor 'cancelado' en la app.
-- Si se usara un enum en PostgreSQL, deberíamos ALTER TYPE, pero aquí sólo es texto.

-- 5. (Opcional) Crear índice para búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON public.pedidos(estado);

-- 6. (Opcional) Crear RLS si se limita quién puede cancelar (este ejemplo solo actualiza la estructura)

