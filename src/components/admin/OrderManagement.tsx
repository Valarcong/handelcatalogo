import React, { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Pedido, PedidoEstado } from "@/types/order";
import { generatePedidoPDF } from "@/utils/generatePedidoPDF";
import { useAuth } from "@/hooks/useAuth";
import OrderTable from "./orders/OrderTable";
import OrderFilters from "./orders/OrderFilters";
import { useOrderFilters } from "@/hooks/useOrderFilters";
import { useClientes } from '@/hooks/useClientes';
import OrderManagementHeader from "./orders/OrderManagementHeader";
import OrderManagementModals, { DeleteOrderModal } from "./orders/OrderManagementModals";
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { toast } from 'sonner';

const OrderManagement: React.FC = () => {
  const { pedidos, fetchPedidos, updatePedidoEstado, updatePedido, cancelPedido, deletePedido, loading, createPedido } = useOrders();
  const [estadoEdit, setEstadoEdit] = useState<{ [id: string]: PedidoEstado | null }>({});
  const [modal, setModal] = useState<{ open: boolean; pedido: Pedido | null }>({ open: false, pedido: null });
  const [newOrderModal, setNewOrderModal] = useState(false);
  const { filters, setFilter, reset, filtered } = useOrderFilters(pedidos);
  const [cancelModal, setCancelModal] = useState<{ open: boolean; pedido: Pedido | null }>({ open: false, pedido: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; pedido: Pedido | null }>({ open: false, pedido: null });
  const { user } = useAuth();
  const { clientes, fetchClientes } = useClientes();
  const { data: exchangeRate, loading: loadingTC, error: errorTC } = useExchangeRate();

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

  const handleDeletePedido = async (pedido: Pedido) => {
    try {
      await deletePedido(pedido.id);
      setDeleteModal({ open: false, pedido: null });
      await fetchPedidos(); // Recargar la lista
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
      <OrderManagementHeader onCreateOrder={() => setNewOrderModal(true)} />
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
          onPDF={p => {
            if (!exchangeRate || typeof exchangeRate.tc !== 'number') {
              toast.error('No se pudo obtener el tipo de cambio. Intenta de nuevo más tarde.');
              return;
            }
            generatePedidoPDF(p, exchangeRate.tc);
          }}
          onDelete={p => setDeleteModal({ open: true, pedido: p })}
        />
      )}
      
      <OrderManagementModals
        newOrderModal={newOrderModal}
        setNewOrderModal={setNewOrderModal}
        modal={modal}
        setModal={setModal}
        cancelModal={cancelModal}
        setCancelModal={setCancelModal}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        onSave={handleSave}
        onCancelPedido={handleCancelPedido}
        onCreatePedido={handleCreatePedido}
        onDeletePedido={handleDeletePedido}
        loading={loading}
      />
    </div>
  );
};

export default OrderManagement;
