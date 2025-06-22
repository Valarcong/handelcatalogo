import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pedido, ProductoPedido } from "@/types/order";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";

export function useOrderData() {
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar todos los pedidos (solo admins)
  const fetchPedidos = async (dateRange?: DateRange) => {
    setLoading(true);
    let query = supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (dateRange?.from) {
      query = query.gte("created_at", dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      // Asegurarse de incluir todo el día de la fecha "hasta"
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      query = query.lte("created_at", toDate.toISOString());
    }

    const { data, error } = await query;
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
        data.map((row: any) => {
          let productos = [];
          try {
            productos = typeof row.productos === "string"
              ? JSON.parse(row.productos)
              : row.productos || [];
            
            // Asegurar que todos los productos tengan la estructura correcta
            productos = productos.map((producto: any) => ({
              id: producto.id || '',
              nombre: producto.nombre || producto.name || '',
              codigo: producto.codigo || producto.code || '',
              cantidad: producto.cantidad || producto.quantity || 0,
              precio_venta: producto.precio_venta || producto.precio || producto.price || 0,
              precio_compra: producto.precio_compra || producto.precio_venta || producto.precio || producto.price || 0,
              subtotal: producto.subtotal || (producto.cantidad || producto.quantity || 0) * (producto.precio_venta || producto.precio || producto.price || 0),
            }));
          } catch (e) {
            console.error('Error parsing productos:', e);
            productos = [];
          }
          
          return {
            ...row,
            productos,
          };
        }) as Pedido[]
      );
    }
  };

  return {
    pedidos,
    setPedidos,
    fetchPedidos,
    loading,
    setLoading,
  };
} 