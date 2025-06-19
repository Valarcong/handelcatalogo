
import React from "react";
import { Pedido, PedidoEstado } from "@/types/order";
import { PEDIDO_ESTADOS } from "@/types/order";
import OrderRow from "./OrderRow";

interface OrderTableProps {
  pedidos: Pedido[];
  loading: boolean;
  filtered: Pedido[];
  estadoEdit: { [id: string]: PedidoEstado | null };
  onAvanzar: (id: string) => Promise<void>;
  avanzarEstado: (estado: PedidoEstado) => PedidoEstado | null;
  onCancelar: (p: Pedido) => void;
  onEdit: (p: Pedido) => void;
  onPDF: (p: Pedido) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  pedidos,
  loading,
  filtered,
  estadoEdit,
  onAvanzar,
  avanzarEstado,
  onCancelar,
  onEdit,
  onPDF,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr>
            <th className="p-2">N° Orden</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Email</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Total</th>
            <th className="p-2">Creado</th>
            <th className="p-2">Productos</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4 text-gray-400">
                No hay pedidos registrados o ningún pedido coincide con los filtros.
              </td>
            </tr>
          ) : (
            filtered.map(p => (
              <OrderRow
                key={p.id}
                pedido={p}
                loading={loading}
                avanzarEstado={avanzarEstado}
                estadoEdit={estadoEdit[p.id]}
                onAvanzar={() => onAvanzar(p.id)}
                onCancelar={() => onCancelar(p)}
                onEdit={() => onEdit(p)}
                onPDF={() => onPDF(p)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
