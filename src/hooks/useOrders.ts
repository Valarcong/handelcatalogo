import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pedido, PedidoEstado } from "@/types/order";
import { useToast } from "@/hooks/use-toast";

export function useOrders() {
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar todos los pedidos (solo admins)
  const fetchPedidos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar pedidos",
        variant: "destructive",
      });
      setPedidos([]);
    } else if (Array.isArray(data)) {
      // Adaptar el tipo productos a lo que espera el front (JSON de array)
      setPedidos(
        data.map((row: any) => ({
          ...row,
          productos:
            typeof row.productos === "string"
              ? JSON.parse(row.productos)
              : row.productos || [],
        })) as Pedido[]
      );
    }
  };

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
      fetchPedidos();
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
      fetchPedidos();
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
      fetchPedidos();
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
      fetchPedidos();
    }
  };

  return {
    pedidos,
    fetchPedidos,
    updatePedidoEstado,
    updatePedido,
    cancelPedido,
    loading,
    setPedidos,
    createPedido,
  };
}
