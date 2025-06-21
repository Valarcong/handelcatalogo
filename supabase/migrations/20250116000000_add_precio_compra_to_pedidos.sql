-- Agregar funciones helper para precio_compra y cálculos de ganancia
-- Esta migración solo agrega funciones, no modifica datos existentes

-- Verificar que la tabla pedidos existe antes de proceder
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pedidos') THEN
        RAISE EXCEPTION 'La tabla pedidos no existe. Ejecute primero las migraciones anteriores.';
    END IF;
END $$;

-- Agregar comentarios a la tabla para documentar el nuevo campo
COMMENT ON COLUMN pedidos.productos IS 'JSON array con productos del pedido. Cada producto debe incluir: id, codigo, nombre, cantidad, precio_venta, precio_compra, subtotal';

-- Crear un índice para mejorar el rendimiento de consultas que busquen por precio_compra
CREATE INDEX IF NOT EXISTS idx_pedidos_productos_precio_compra 
ON pedidos USING GIN ((productos::jsonb));

-- Función helper para calcular el margen de ganancia
CREATE OR REPLACE FUNCTION calcular_margen_ganancia(precio_venta numeric, precio_compra numeric)
RETURNS numeric AS $$
BEGIN
    IF precio_compra = 0 THEN
        RETURN 0;
    END IF;
    RETURN ((precio_venta - precio_compra) / precio_compra) * 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Agregar comentario a la función
COMMENT ON FUNCTION calcular_margen_ganancia IS 'Calcula el margen de ganancia como porcentaje: ((precio_venta - precio_compra) / precio_compra) * 100';

-- Función helper para calcular la ganancia total de un pedido
CREATE OR REPLACE FUNCTION calcular_ganancia_total_pedido(pedido_id uuid)
RETURNS numeric AS $$
DECLARE
    total_ganancia numeric := 0;
    productos_json JSONB;
    producto_item jsonb;
BEGIN
    SELECT productos::JSONB INTO productos_json FROM pedidos WHERE id = pedido_id;
    
    IF productos_json IS NULL OR jsonb_typeof(productos_json) != 'array' THEN
        RETURN 0;
    END IF;
    
    FOR producto_item IN SELECT * FROM jsonb_array_elements(productos_json)
    LOOP
        IF jsonb_typeof(producto_item) = 'object' THEN
            total_ganancia := total_ganancia + 
                COALESCE(((producto_item->>'precio_venta')::numeric - (producto_item->>'precio_compra')::numeric) * 
                (producto_item->>'cantidad')::numeric, 0);
        END IF;
    END LOOP;
    
    RETURN total_ganancia;
END;
$$ LANGUAGE plpgsql STABLE;

-- Agregar comentario a la función
COMMENT ON FUNCTION calcular_ganancia_total_pedido IS 'Calcula la ganancia total de un pedido sumando la ganancia de todos sus productos';

-- Función helper para calcular el margen promedio de un pedido
CREATE OR REPLACE FUNCTION calcular_margen_promedio_pedido(pedido_id uuid)
RETURNS numeric AS $$
DECLARE
    total_margen numeric := 0;
    total_productos integer := 0;
    productos_json JSONB;
    producto_item jsonb;
    precio_venta numeric;
    precio_compra numeric;
BEGIN
    SELECT productos::JSONB INTO productos_json FROM pedidos WHERE id = pedido_id;
    
    IF productos_json IS NULL OR jsonb_typeof(productos_json) != 'array' THEN
        RETURN 0;
    END IF;
    
    FOR producto_item IN SELECT * FROM jsonb_array_elements(productos_json)
    LOOP
        IF jsonb_typeof(producto_item) = 'object' THEN
            precio_venta := COALESCE((producto_item->>'precio_venta')::numeric, 0);
            precio_compra := COALESCE((producto_item->>'precio_compra')::numeric, 0);
            
            IF precio_compra > 0 THEN
                total_margen := total_margen + calcular_margen_ganancia(precio_venta, precio_compra);
                total_productos := total_productos + 1;
            END IF;
        END IF;
    END LOOP;
    
    IF total_productos = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN total_margen / total_productos;
END;
$$ LANGUAGE plpgsql STABLE;

-- Agregar comentario a la función
COMMENT ON FUNCTION calcular_margen_promedio_pedido IS 'Calcula el margen promedio de un pedido basado en todos sus productos'; 