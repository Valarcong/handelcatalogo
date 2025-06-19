
-- 1. Agregar columna cliente_id a pedidos y relacionarla con clientes
ALTER TABLE public.pedidos
  ADD COLUMN cliente_id uuid NULL;

ALTER TABLE public.pedidos
  ADD CONSTRAINT pedidos_cliente_id_fkey
  FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);

-- 2. (Opcional) Indexar para futuras búsquedas rápidas por cliente
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON public.pedidos(cliente_id);

-- 3. Sin cambios en RLS por ahora (heredan los existentes)
