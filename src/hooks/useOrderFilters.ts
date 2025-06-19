
import { useState, useMemo } from "react";
import { Pedido, PedidoEstado } from "@/types/order";

interface OrderFilterState {
  estado: PedidoEstado | "all"; // "all" = todos
  search: string;
  fechaDesde: string;
  fechaHasta: string;
}

export function useOrderFilters(pedidos: Pedido[]) {
  const [filters, setFilters] = useState<OrderFilterState>({
    estado: "all",
    search: "",
    fechaDesde: "",
    fechaHasta: "",
  });

  // Manejo cambios filtros
  const setFilter = (key: keyof OrderFilterState, value: string) => {
    setFilters(f => ({ ...f, [key]: value }));
  };

  // Lógica de filtrado actualizada para "all"
  const filtered = useMemo(() => {
    return pedidos.filter(p => {
      // Estado
      if (filters.estado !== "all" && p.estado !== filters.estado) return false;
      // Fecha
      if (filters.fechaDesde) {
        if (new Date(p.created_at).getTime() < new Date(filters.fechaDesde).getTime()) return false;
      }
      if (filters.fechaHasta) {
        if (new Date(p.created_at).getTime() > new Date(filters.fechaHasta).getTime()) return false;
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
    setFilters({ estado: "all", search: "", fechaDesde: "", fechaHasta: "" });

  return { filters, setFilter, reset, filtered };
}
