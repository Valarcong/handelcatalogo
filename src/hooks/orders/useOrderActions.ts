import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pedido, PedidoEstado, ProductoPedido } from "@/types/order";
import { useToast } from "@/hooks/use-toast";

export function useOrderActions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Cambiar estado de un pedido
  const updatePedidoEstado = async (id: string, estado: PedidoEstado) => {
    setLoading(true);
    const { error } = await supabase
      .from("pedidos")
      .update({ estado })
      .eq("id", id);
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido",
        variant: "destructive",
      });
      throw error;
    } else {
      toast({ title: "Estado actualizado", description: "El pedido ha sido actualizado." });
    }
  };

  // Actualizar todos los campos editables de un pedido
  const updatePedido = async (id: string, pedido: Partial<Pedido>) => {
    setLoading(true);
    // Eliminar cliente_id si está undefined, no la borres si es null!
    const toUpdate = { ...pedido };
    if (typeof toUpdate.cliente_id === "undefined") {
      delete toUpdate.cliente_id;
    }
    const { error } = await supabase
      .from("pedidos")
      .update(toUpdate)
      .eq("id", id);
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el pedido",
        variant: "destructive",
      });
      throw error;
    } else {
      toast({ title: "Pedido actualizado", description: "El pedido ha sido editado correctamente." });
    }
  };

  // Cancelar pedido
  const cancelPedido = async (
    id: string,
    motivo_cancelacion: string | undefined,
    cancelado_por: string | undefined
  ) => {
    setLoading(true);
    const estado = "cancelado";
    const cancelado_en = new Date().toISOString();
    const toUpdate: any = { estado, cancelado_en };
    if (motivo_cancelacion) toUpdate.motivo_cancelacion = motivo_cancelacion;
    if (cancelado_por) toUpdate.cancelado_por = cancelado_por;
    const { error } = await supabase
      .from("pedidos")
      .update(toUpdate)
      .eq("id", id);
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar el pedido",
        variant: "destructive",
      });
      throw error;
    } else {
      toast({ title: "Pedido cancelado", description: "El pedido ha sido cancelado correctamente." });
    }
  };

  // Eliminar pedido completamente de la base de datos
  const deletePedido = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("pedidos")
      .delete()
      .eq("id", id);
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el pedido",
        variant: "destructive",
      });
      throw error;
    } else {
      toast({ 
        title: "Pedido eliminado", 
        description: "El pedido ha sido eliminado permanentemente de la base de datos.",
        variant: "default"
      });
    }
  };

  // Crear un nuevo pedido
  const createPedido = async (pedido: Partial<Pedido>) => {
    setLoading(true);
    // Validar campos requeridos
    if (!pedido.cliente_nombre || !pedido.productos || typeof pedido.total !== 'number') {
      toast({
        title: 'Error',
        description: 'Faltan datos obligatorios para crear el pedido',
        variant: 'destructive',
      });
      setLoading(false);
      throw new Error('Faltan datos obligatorios para crear el pedido');
    }

    // Validar que todos los productos tengan precio_compra y precio_venta
    const productos = pedido.productos as ProductoPedido[];
    const productosInvalidos = productos.filter(p => 
      typeof p.precio_compra !== 'number' || 
      typeof p.precio_venta !== 'number' ||
      p.precio_compra < 0 ||
      p.precio_venta < 0
    );

    if (productosInvalidos.length > 0) {
      toast({
        title: 'Error',
        description: 'Todos los productos deben tener precios de compra y venta válidos',
        variant: 'destructive',
      });
      setLoading(false);
      throw new Error('Precios de compra y venta inválidos');
    }

    // Adaptar productos a JSON si es necesario
    const toInsert = {
      cliente_nombre: pedido.cliente_nombre,
      cliente_telefono: pedido.cliente_telefono || '',
      cliente_email: pedido.cliente_email || '',
      productos: JSON.stringify(pedido.productos),
      total: pedido.total,
      observaciones: pedido.observaciones || '',
      created_at: new Date().toISOString(),
      estado: pedido.estado || 'pendiente',
      cliente_id: pedido.cliente_id || null,
    };
    const { error } = await supabase.from('pedidos').insert([toInsert]);
    setLoading(false);
    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el pedido',
        variant: 'destructive',
      });
      throw error;
    } else {
      toast({ title: 'Pedido creado', description: 'El pedido ha sido registrado correctamente.' });
    }
  };

  return {
    updatePedidoEstado,
    updatePedido,
    cancelPedido,
    deletePedido,
    createPedido,
    loading,
    setLoading,
  };
} 