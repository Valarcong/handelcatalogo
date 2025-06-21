export interface Pedido {
  id: string;
  numero_orden: string;
  cliente_nombre: string;
  cliente_telefono?: string;
  cliente_email?: string;
  estado: PedidoEstado;
  productos: Array<{
    id: string;
    nombre: string;
    codigo: string;
    cantidad: number;
    precio_venta: number;
    precio_compra: number;
    subtotal: number;
  }>;
  total: number;
  observaciones?: string;
  created_at: string;
  motivo_cancelacion?: string;
  cancelado_en?: string;
  cancelado_por?: string;
  // Nuevo campo para ordenes con cliente existente
  cliente_id?: string | null;
}

export type PedidoEstado = 'pendiente' | 'enproceso' | 'enviado' | 'entregado_pp' | 'entregado_pr' | 'cancelado';

export const PEDIDO_ESTADOS: { value: PedidoEstado; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'enproceso', label: 'En proceso' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado_pp', label: 'Entregado - PP' },
  { value: 'entregado_pr', label: 'Entregado - PR' },
  { value: 'cancelado', label: 'Cancelado' },
];

// Interfaz para productos en el carrito/pedido en proceso
export interface ProductoPedido {
  id: string;
  nombre: string;
  codigo: string;
  cantidad: number;
  precio_venta: number;
  precio_compra: number;
  subtotal: number;
}

// Función helper para calcular el margen de ganancia
export const calcularMargenGanancia = (precioVenta: number, precioCompra: number): number => {
  if (precioCompra === 0) return 0;
  return ((precioVenta - precioCompra) / precioCompra) * 100;
};

// Función helper para calcular la ganancia total
export const calcularGananciaTotal = (precioVenta: number, precioCompra: number, cantidad: number): number => {
  return (precioVenta - precioCompra) * cantidad;
};
