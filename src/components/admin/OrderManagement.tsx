import React, { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Pedido, PEDIDO_ESTADOS, PedidoEstado } from "@/types/order";
import EditOrderModal from "./EditOrderModal";
import ProductSummaryPopover from "./ProductSummaryPopover";
import { generatePedidoPDF } from "@/utils/generatePedidoPDF";
import CancelOrderModal from "./CancelOrderModal";
import { useAuth } from "@/hooks/useAuth";
import OrderTable from "./orders/OrderTable";
import OrderFilters from "./orders/OrderFilters";
import { useOrderFilters } from "@/hooks/useOrderFilters"; // <-- FIX: import the missing hook

const OrderManagement: React.FC = () => {
  const { pedidos, fetchPedidos, updatePedidoEstado, updatePedido, cancelPedido, loading } = useOrders();
  const [estadoEdit, setEstadoEdit] = useState<{ [id: string]: PedidoEstado | null }>({});
  const [modal, setModal] = useState<{ open: boolean; pedido: Pedido | null }>({ open: false, pedido: null });
  const { filters, setFilter, reset, filtered } = useOrderFilters(pedidos);
  const [cancelModal, setCancelModal] = useState<{ open: boolean; pedido: Pedido | null }>({ open: false, pedido: null });
  const { user } = useAuth();

  useEffect(() => {
    fetchPedidos();
  }, []);

  const avanzarEstado = (estado: PedidoEstado): PedidoEstado | null => {
    const orden = ["pendiente", "enproceso", "enviado", "entregado"];
    const idx = orden.indexOf(estado);
    if (idx >= 0 && idx < orden.length - 1) {
      return orden[idx + 1] as PedidoEstado;
    }
    return null;
  };

  const handleSave = async (pedidoData: Partial<Pedido>) => {
    if (!modal.pedido) return;
    await updatePedido(modal.pedido.id, pedidoData);
  };

  const handleCancelPedido = async (pedido: Pedido, motivo: string) => {
    try {
      await cancelPedido(pedido.id, motivo, user?.id);
      setCancelModal({ open: false, pedido: null });
    } catch (e) {
      // El toast está en el hook
    }
  };

  const handleAvanzar = async (id: string) => {
    const pedido = pedidos.find(x => x.id === id);
    if (!pedido) return;
    setEstadoEdit(e => ({ ...e, [id]: avanzarEstado(pedido.estado) }));
    try {
      await updatePedidoEstado(id, avanzarEstado(pedido.estado)!);
    } finally {
      setEstadoEdit(e => ({ ...e, [id]: null }));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pedidos</h2>
      <OrderFilters filters={filters} setFilter={setFilter} reset={reset} />
      {loading ? (
        <div>Cargando pedidos...</div>
      ) : (
        <OrderTable
          pedidos={pedidos}
          filtered={filtered}
          loading={loading}
          estadoEdit={estadoEdit}
          onAvanzar={handleAvanzar}
          avanzarEstado={avanzarEstado}
          onCancelar={p => setCancelModal({ open: true, pedido: p })}
          onEdit={p => setModal({ open: true, pedido: p })}
          onPDF={p => generatePedidoPDF(p)}
        />
      )}
      <EditOrderModal
        pedido={modal.pedido}
        open={modal.open}
        onClose={() => setModal({ open: false, pedido: null })}
        onSave={handleSave}
      />
      <CancelOrderModal
        open={cancelModal.open}
        onClose={() => setCancelModal({ open: false, pedido: null })}
        onConfirm={motivo =>
          cancelModal.pedido ? handleCancelPedido(cancelModal.pedido, motivo) : Promise.resolve()
        }
      />
    </div>
  );
};

export default OrderManagement;
