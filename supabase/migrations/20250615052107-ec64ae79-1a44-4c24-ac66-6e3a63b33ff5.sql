
-- Agregar el campo numero_orden si no existe
ALTER TABLE public.pedidos
ADD COLUMN IF NOT EXISTS numero_orden TEXT UNIQUE;

-- Crear secuencia para el número de orden correlativo
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_class WHERE relname = 'pedidos_numero_orden_seq') THEN
    CREATE SEQUENCE public.pedidos_numero_orden_seq START 1;
  END IF;
END$$;

-- Trigger para asignar automáticamente el numero_orden (tipo ORPE-0000001)
CREATE OR REPLACE FUNCTION public.set_numero_orden()
RETURNS trigger AS $$
DECLARE
  new_seq bigint;
BEGIN
  IF NEW.numero_orden IS NULL THEN
    new_seq := nextval('public.pedidos_numero_orden_seq');
    NEW.numero_orden := 'ORPE-' || lpad(new_seq::text, 7, '0');
  END IF;
  RETURN NEW;
END;
$$ language plpgsql;

-- Eliminar trigger anterior si existe y crear el nuevo
DROP TRIGGER IF EXISTS pedidos_numero_orden_trigger ON public.pedidos;

CREATE TRIGGER pedidos_numero_orden_trigger
BEFORE INSERT ON public.pedidos
FOR EACH ROW
EXECUTE FUNCTION public.set_numero_orden();
