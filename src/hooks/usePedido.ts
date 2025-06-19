
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PedidoCliente {
  cliente_nombre: string;
  cliente_telefono?: string;
  cliente_email?: string;
  observaciones?: string;
}

export const usePedido = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const crearPedido = async ({
    productos,
    total,
    cliente,
  }: {
    productos: any[];
    total: number;
    cliente: PedidoCliente;
  }) => {
    setLoading(true);
    const { cliente_nombre, cliente_email, cliente_telefono, observaciones } = cliente;
    const { error } = await supabase.from("pedidos").insert([
      {
        cliente_nombre,
        cliente_email,
        cliente_telefono,
        observaciones: observaciones || "",
        productos,
        total,
        estado: "pendiente",
      },
    ]);
    setLoading(false);

    if (error) {
      toast({
        title: "Error al crear pedido",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } else {
      toast({
        title: "¡Pedido enviado!",
        description: "Te contactaremos al WhatsApp/email para coordinar.",
      });
    }
  };

  return { crearPedido, loading };
};
