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
import { useClientes } from '@/hooks/useClientes';
import { Button } from "@/components/ui/button";
import NewOrderModal from './NewOrderModal';

const OrderManagement: React.FC = () => {
  const { pedidos, fetchPedidos, updatePedidoEstado, updatePedido, cancelPedido, loading, createPedido } = useOrders();
  const [estadoEdit, setEstadoEdit] = useState<{ [id: string]: PedidoEstado | null }>({});
  const [modal, setModal] = useState<{ open: boolean; pedido: Pedido | null }>({ open: false, pedido: null });
  const [newOrderModal, setNewOrderModal] = useState(false);
  const { filters, setFilter, reset, filtered } = useOrderFilters(pedidos);
  const [cancelModal, setCancelModal] = useState<{ open: boolean; pedido: Pedido | null }>({ open: false, pedido: null });
  const { user } = useAuth();
  const { clientes, fetchClientes } = useClientes();

  useEffect(() => {
    fetchPedidos();
    fetchClientes();
  }, []);

  const avanzarEstado = (estado: PedidoEstado): PedidoEstado | null => {
    const orden = ["pendiente", "enproceso", "enviado", "entregado_pp", "entregado_pr"];
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

  // Nuevo: Crear pedido
  const handleCreatePedido = async (pedidoData: Partial<Pedido>) => {
    await createPedido(pedidoData);
    setNewOrderModal(false);
    await fetchPedidos();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Pedidos</h2>
        <Button onClick={() => setNewOrderModal(true)} variant="default">+ Nuevo Pedido</Button>
      </div>
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
      {/* Modal para crear pedido */}
      {newOrderModal && (
        <NewOrderModal
          open={newOrderModal}
          onClose={() => setNewOrderModal(false)}
          onSave={handleCreatePedido}
        />
      )}
      <CancelOrderModal
        open={cancelModal.open}
        onClose={() => setCancelModal({ open: false, pedido: null })}
        onConfirm={motivo =>
          cancelModal.pedido ? handleCancelPedido(cancelModal.pedido, motivo) : Promise.resolve()
        }
      />
      {/* Modal para editar pedido */}
      <EditOrderModal
        pedido={modal.pedido}
        open={modal.open}
        onClose={() => setModal({ open: false, pedido: null })}
        onSave={handleSave}
      />
    </div>
  );
};

export default OrderManagement;
