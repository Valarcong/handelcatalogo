
export interface Pedido {
  id: string;
  numero_orden: string;
  cliente_nombre: string;
  cliente_telefono?: string;
  cliente_email?: string;
  estado: PedidoEstado;
  productos: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
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

export type PedidoEstado = 'pendiente' | 'enproceso' | 'enviado' | 'entregado' | 'cancelado';

export const PEDIDO_ESTADOS: { value: PedidoEstado; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'enproceso', label: 'En proceso' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
];
