
-- Agrega la columna cantidad_minima_mayorista a productos
ALTER TABLE productos
ADD COLUMN cantidad_minima_mayorista integer NOT NULL DEFAULT 10;

-- Opcional: Si deseas agregar un comentario descriptivo
COMMENT ON COLUMN productos.cantidad_minima_mayorista IS 'Cantidad mínima de unidades para acceder al precio por mayor';
