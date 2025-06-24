import { useState, useMemo } from "react";
import { Pedido, PedidoEstado } from "@/types/order";

interface OrderFilterState {
  estado: PedidoEstado | "all"; // "all" = todos
  search: string;
  dateRange?: { from?: Date; to?: Date };
}

export function useOrderFilters(pedidos: Pedido[]) {
  const [filters, setFilters] = useState<OrderFilterState>({
    estado: "all",
    search: "",
    dateRange: undefined,
  });

  // Manejo cambios filtros (acepta cualquier tipo de valor)
  const setFilter = (key: keyof OrderFilterState, value: any) => {
    setFilters(f => ({ ...f, [key]: value }));
  };

  // Lógica de filtrado actualizada para "all"
  const filtered = useMemo(() => {
    return pedidos.filter(p => {
      // Estado
      if (filters.estado !== "all" && p.estado !== filters.estado) return false;
      // Fecha (nuevo: rango)
      if (filters.dateRange?.from) {
        if (new Date(p.created_at).getTime() < new Date(filters.dateRange.from).setHours(0,0,0,0)) return false;
      }
      if (filters.dateRange?.to) {
        if (new Date(p.created_at).getTime() > new Date(filters.dateRange.to).setHours(23,59,59,999)) return false;
      }
      // Búsqueda
      if (filters.search) {
        const txt = filters.search.toLowerCase();
        if (
          !(p.numero_orden?.toLowerCase().includes(txt) ||
            p.cliente_nombre.toLowerCase().includes(txt) ||
            (p.cliente_email || "").toLowerCase().includes(txt) ||
            (p.cliente_telefono || "").toLowerCase().includes(txt)
          )
        ) {
          return false;
        }
      }
      return true;
    });
  }, [filters, pedidos]);

  // Reset
  const reset = () =>
    setFilters({ estado: "all", search: "", dateRange: undefined });

  return { filters, setFilter, reset, filtered };
}
