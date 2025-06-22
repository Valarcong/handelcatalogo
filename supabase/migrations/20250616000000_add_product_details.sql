-- Agrega campos para detalles adicionales del producto.

ALTER TABLE public.productos
ADD COLUMN especificaciones_tecnicas jsonb,
ADD COLUMN caracteristicas text[];

COMMENT ON COLUMN public.productos.especificaciones_tecnicas IS 'Pares clave-valor para especificaciones técnicas, ej: {"Material": "Poliestireno", "Dimensiones": "10x20cm"}.';
COMMENT ON COLUMN public.productos.caracteristicas IS 'Lista de características principales del producto, ej: {"Resistente a altas temperaturas", "Libre de BPA"}.'; 