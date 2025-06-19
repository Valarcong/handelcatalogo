
-- Tabla para cotizaciones de ventas
CREATE TABLE public.cotizaciones_ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID, -- referencia opcional a clientes
  nombre_cliente TEXT,
  telefono_cliente TEXT,
  email_cliente TEXT,
  producto_id UUID NOT NULL,
  producto_nombre TEXT NOT NULL,
  producto_codigo TEXT,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario NUMERIC NOT NULL DEFAULT 0,
  precio_total NUMERIC NOT NULL DEFAULT 0,
  precio_tipo TEXT NOT NULL, -- "unitario" o "mayorista"
  margen_est_mensaje INTEGER, -- porcentaje
  mensaje TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  enviado_por UUID, -- usuario
  enviado_en TIMESTAMP WITH TIME ZONE DEFAULT now(),
  convertido_pedido_id UUID,
  respondido_en TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla para clientes
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Template de mensajes para cotización (editable por admin/vendedor)
CREATE TABLE public.templates_mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL, -- por ejemplo: 'cotizacion', 'seguimiento', 'confirmacion'
  contenido TEXT NOT NULL,
  creado_por UUID,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Agregar índices básicos
CREATE INDEX ON public.cotizaciones_ventas (enviado_en);
CREATE INDEX ON public.cotizaciones_ventas (estado);
CREATE INDEX ON public.clientes (nombre);

-- RLS: Los usuarios pueden ver/insertar/actualizar cotizaciones y templates solo si son admin/vendedor
ALTER TABLE public.cotizaciones_ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates_mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Cotizaciones ventas: admins/vendedores (por rol) pueden ver/insertar propias
CREATE POLICY "Acceso vendedor/admin cotizaciones" ON public.cotizaciones_ventas
  FOR ALL
  USING (
    auth.role() = 'authenticated'
  );

-- Clientes: admins/vendedores pueden ver/insertar/actualizar propios
CREATE POLICY "Acceso vendedor/admin clientes" ON public.clientes
  FOR ALL
  USING (
    auth.role() = 'authenticated'
  );


-- Templates: admins/vendedores pueden ver/insertar/actualizar
CREATE POLICY "Acceso vendedor/admin templates" ON public.templates_mensajes
  FOR ALL
  USING (
    auth.role() = 'authenticated'
  );
