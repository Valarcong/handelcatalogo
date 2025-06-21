-- Crear tipo enum para el estado de la cotización
CREATE TYPE public.estado_cotizacion AS ENUM ('pendiente', 'aceptada', 'rechazada', 'anulada');

-- Tabla cabecera de cotizaciones
CREATE TABLE public.cotizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id),
  estado public.estado_cotizacion NOT NULL DEFAULT 'pendiente',
  observaciones TEXT,
  creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  creado_por UUID, -- usuario interno que crea la cotización
  enviado_en TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla detalle de productos por cotización
CREATE TABLE public.cotizacion_productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cotizacion_id UUID NOT NULL REFERENCES public.cotizaciones(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL,
  nombre_producto TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario NUMERIC NOT NULL DEFAULT 0,
  precio_total NUMERIC NOT NULL DEFAULT 0,
  observaciones TEXT
);

-- Modificar clientes: agregar es_empresa, ruc, razon_social
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS es_empresa BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS ruc TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS razon_social TEXT;

-- Modificar pedidos: agregar cotizacion_id
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS cotizacion_id UUID REFERENCES public.cotizaciones(id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizacion_productos ENABLE ROW LEVEL SECURITY;

-- Políticas: Solo usuarios autenticados pueden ver, insertar y actualizar cotizaciones y sus productos
CREATE POLICY "Usuarios autenticados pueden ver cotizaciones" ON public.cotizaciones
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar cotizaciones" ON public.cotizaciones
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar cotizaciones" ON public.cotizaciones
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden ver productos de cotizacion" ON public.cotizacion_productos
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar productos de cotizacion" ON public.cotizacion_productos
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar productos de cotizacion" ON public.cotizacion_productos
  FOR UPDATE TO authenticated
  USING (true); 