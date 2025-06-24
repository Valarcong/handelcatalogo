import React from "react";
import { Pedido, PEDIDO_ESTADOS, PedidoEstado, calcularGananciaTotal } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductSummaryPopover from "@/components/admin/ProductSummaryPopover";
import { XCircle, Pencil, Download, Trash2 } from "lucide-react";

const estadosColor = {
  pendiente: "bg-yellow-400 text-white",
  enproceso: "bg-blue-500 text-white",
  enviado: "bg-purple-500 text-white",
  entregado_pp: "bg-green-500 text-white",
  entregado_pr: "bg-green-700 text-white",
  cancelado: "bg-red-500 text-white",
} as Record<PedidoEstado, string>;

interface OrderRowProps {
  pedido: Pedido;
  loading: boolean;
  avanzarEstado: (estado: PedidoEstado) => PedidoEstado | null;
  estadoEdit: PedidoEstado | null;
  onAvanzar: () => Promise<void>;
  onCancelar: () => void;
  onEdit: () => void;
  onPDF: () => void;
  onDelete: () => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({
  pedido,
  loading,
  avanzarEstado,
  estadoEdit,
  onAvanzar,
  onCancelar,
  onEdit,
  onPDF,
  onDelete,
}) => {
  // Calcular ganancia total del pedido
  const gananciaTotal = pedido.productos.reduce((total, producto) => {
    return total + calcularGananciaTotal(
      producto.precio_venta, 
      producto.precio_compra, 
      producto.cantidad
    );
  }, 0);

  // Calcular margen promedio
  const margenPromedio = pedido.productos.length > 0 
    ? pedido.productos.reduce((total, producto) => {
        if (producto.precio_compra > 0) {
          return total + ((producto.precio_venta - producto.precio_compra) / producto.precio_compra) * 100;
        }
        return total;
      }, 0) / pedido.productos.filter(p => p.precio_compra > 0).length
    : 0;

  return (
    <tr
      className={`border-b ${pedido.estado === "cancelado" ? "bg-red-50 opacity-70" : ""}`}
    >
      <td className="p-2 font-mono font-semibold tracking-tight">{pedido.numero_orden}</td>
      <td className="p-2 font-semibold">{pedido.cliente_nombre}</td>
      <td className="p-2">{pedido.cliente_email}</td>
      <td className="p-2">{pedido.cliente_telefono}</td>
      <td className="p-2">
        <Badge className={estadosColor[pedido.estado] || "bg-gray-200"}>
          {PEDIDO_ESTADOS.find(e => e.value === pedido.estado)?.label || pedido.estado}
        </Badge>
        {pedido.estado === "cancelado" && pedido.motivo_cancelacion && (
          <span className="block text-xs text-red-400 mt-1">
            Motivo: {pedido.motivo_cancelacion}
          </span>
        )}
      </td>
      <td className="p-2 font-semibold">USD {pedido.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
      <td className="p-2">
        <div className="text-sm">
          <div className={`font-semibold ${gananciaTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            USD {gananciaTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-500">
            {margenPromedio.toFixed(1)}% margen
          </div>
        </div>
      </td>
      <td className="p-2">
        <div className="text-sm">
          <div className="font-semibold text-blue-600">
            {margenPromedio.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">
            promedio
          </div>
        </div>
      </td>
      <td className="p-2 text-xs">{new Date(pedido.created_at).toLocaleString()}</td>
      <td className="p-2">
        <ProductSummaryPopover productos={pedido.productos} />
      </td>
      <td className="p-2 flex gap-2">
        {pedido.estado !== "cancelado" && avanzarEstado(pedido.estado) ? (
          <Button
            size="sm"
            variant="outline"
            disabled={loading || !!estadoEdit}
            onClick={onAvanzar}
          >
            Pasar a: {PEDIDO_ESTADOS.find(e => e.value === avanzarEstado(pedido.estado))?.label}
          </Button>
        ) : pedido.estado === "cancelado" ? (
          <span className="text-red-600 flex items-center gap-1">
            <XCircle className="inline w-4 h-4" /> Cancelado
          </span>
        ) : (
          <span className="text-green-600">Completado</span>
        )}
        {(pedido.estado === "pendiente" || pedido.estado === "enproceso") && (
          <Button
            size="sm"
            variant="destructive"
            onClick={onCancelar}
            disabled={loading}
            title="Cancelar pedido"
          >
            <XCircle className="w-4 h-4" /> Cancelar
          </Button>
        )}
        <Button
          size="icon"
          variant="outline"
          aria-label="Editar"
          onClick={onEdit}
          disabled={pedido.estado === "cancelado" || loading}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          aria-label="Descargar PDF"
          onClick={onPDF}
          title="Descargar PDF"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          aria-label="Eliminar permanentemente"
          onClick={onDelete}
          disabled={loading}
          title="Eliminar pedido permanentemente"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
};

export default OrderRow;
