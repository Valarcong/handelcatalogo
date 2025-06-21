import { useOrderData } from "./orders/useOrderData";
import { useOrderActions } from "./orders/useOrderActions";

export function useOrders() {
  const orderData = useOrderData();
  const orderActions = useOrderActions();

  // Combinar las funciones de acciones con el estado de datos
  const updatePedidoEstado = async (id: string, estado: any) => {
    await orderActions.updatePedidoEstado(id, estado);
    await orderData.fetchPedidos();
  };

  const updatePedido = async (id: string, pedido: any) => {
    await orderActions.updatePedido(id, pedido);
    await orderData.fetchPedidos();
  };

  const cancelPedido = async (id: string, motivo_cancelacion: string | undefined, cancelado_por: string | undefined) => {
    await orderActions.cancelPedido(id, motivo_cancelacion, cancelado_por);
    await orderData.fetchPedidos();
  };

  const deletePedido = async (id: string) => {
    await orderActions.deletePedido(id);
    await orderData.fetchPedidos();
  };

  const createPedido = async (pedido: any) => {
    await orderActions.createPedido(pedido);
    await orderData.fetchPedidos();
  };

  return {
    // Datos
    pedidos: orderData.pedidos,
    loading: orderData.loading || orderActions.loading,
    
    // Acciones
    fetchPedidos: orderData.fetchPedidos,
    updatePedidoEstado,
    updatePedido,
    cancelPedido,
    deletePedido,
    createPedido,
    setPedidos: orderData.setPedidos,
  };
}
