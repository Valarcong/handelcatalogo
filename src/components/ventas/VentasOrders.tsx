
import React, { useEffect } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PEDIDO_ESTADOS } from "@/types/order";
import { Download } from "lucide-react";
import ProductSummaryPopover from "@/components/admin/ProductSummaryPopover";
import { generatePedidoPDF } from "@/utils/generatePedidoPDF";

const estadosColor = {
  pendiente: "bg-yellow-400 text-white",
  enproceso: "bg-blue-500 text-white",
  enviado: "bg-purple-500 text-white",
  entregado: "bg-green-500 text-white",
};

const VentasOrders: React.FC = () => {
  const { pedidos, fetchPedidos, loading } = useOrders();

  useEffect(() => {
    fetchPedidos();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-brand-navy">Consulta de Pedidos</h2>
      {loading ? (
        <div className="text-blue-500 animate-pulse">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="text-gray-400">No hay pedidos registrados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded text-sm">
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
                <th className="p-2">PDF</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id} className="border-b">
                  <td className="p-2 font-mono font-semibold tracking-tight">{p.numero_orden}</td>
                  <td className="p-2 font-semibold">{p.cliente_nombre}</td>
                  <td className="p-2">{p.cliente_email}</td>
                  <td className="p-2">{p.cliente_telefono}</td>
                  <td className="p-2">
                    <Badge className={estadosColor[p.estado] || "bg-gray-200"}>
                      {PEDIDO_ESTADOS.find(e => e.value === p.estado)?.label || p.estado}
                    </Badge>
                  </td>
                  <td className="p-2">S/. {p.total}</td>
                  <td className="p-2">{new Date(p.created_at).toLocaleString()}</td>
                  <td className="p-2">
                    <ProductSummaryPopover productos={p.productos} />
                  </td>
                  <td className="p-2">
                    <button
                      aria-label="Descargar PDF"
                      onClick={() => generatePedidoPDF(p)}
                      title="Descargar PDF"
                      className="p-2 rounded hover:bg-blue-100 transition"
                    >
                      <Download className="w-4 h-4 text-blue-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs text-gray-500 mt-2">
            Sólo consulta. No se permite editar pedidos desde este panel.
          </div>
        </div>
      )}
    </div>
  );
};

export default VentasOrders;
