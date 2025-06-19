import { useMemo } from "react";
import { Pedido } from "@/types/order";
import { Product } from "@/types/product";
import { DateRange } from "./useDateFilters";

// Se puede pasar explícitamente un rango de fechas y función de filtro para usar también en período anterior.
export function useAdvancedKPIs({
  pedidos,
  productos,
  dateRange,
  filterByRange,
}: {
  pedidos: Pedido[];
  productos: Product[];
  dateRange?: DateRange;
  filterByRange?: <T extends { created_at: string }>(arr: T[], baseField?: keyof T) => T[];
}) {
  // Si se especifica un rango+filtro, filtramos explícitamente
  const pedidosUsados =
    filterByRange && dateRange
      ? filterByRange(pedidos, "created_at")
      : pedidos;

  const {
    cancellationRate,
    avgProcessingTimeDays,
    uniqueCustomers,
    productsWithoutMovement,
    avgValuePerCustomer,
  } = useMemo(() => {
    if (!pedidosUsados.length) {
      return {
        cancellationRate: 0,
        avgProcessingTimeDays: 0,
        uniqueCustomers: 0,
        productsWithoutMovement: productos.length,
        avgValuePerCustomer: 0,
      };
    }
    // 1. Cancelación
    const cancelled = pedidosUsados.filter((p) => p.estado === "cancelado").length;
    const cancellationRate = (cancelled / pedidosUsados.length) * 100;
    // 2. Tiempo promedio procesamiento
    const delivered = pedidosUsados.filter(
      (p) =>
        p.estado === "entregado" &&
        p.created_at &&
        typeof p.created_at === "string"
    );
    const avgProcessingTimeDays =
      delivered.length > 0
        ? delivered.reduce((sum, p) => {
            const start = new Date(p.created_at!).getTime();
            const delivered_at = p.cancelado_en
              ? new Date(p.cancelado_en).getTime()
              : Date.now(); // fallback
            return sum + (delivered_at - start) / (1000 * 60 * 60 * 24);
          }, 0) / delivered.length
        : 0;

    // 3. Clientes únicos
    const clientes = new Set(
      pedidosUsados
        .map((p) => (p.cliente_email || p.cliente_telefono || p.cliente_nombre || "").trim())
        .filter(Boolean)
    );
    const uniqueCustomers = clientes.size;

    // 4. Productos sin movimiento
    const productosVendidos = new Set<string>();
    pedidosUsados.forEach((p) => {
      if (Array.isArray(p.productos)) {
        p.productos.forEach((item: any) => {
          if (item.nombre) productosVendidos.add(item.nombre);
        });
      }
    });
    const productsWithoutMovement = productos.filter(
      (prod) => !productosVendidos.has(prod.name)
    ).length;

    // 5. Valor promedio por cliente
    const ingresosTotales = pedidosUsados.reduce((acc, p) => acc + (typeof p.total === "number" ? p.total : 0), 0);
    const avgValuePerCustomer = uniqueCustomers ? ingresosTotales / uniqueCustomers : 0;

    return {
      cancellationRate,
      avgProcessingTimeDays,
      uniqueCustomers,
      productsWithoutMovement,
      avgValuePerCustomer,
    };
  }, [pedidosUsados, productos]);

  return {
    cancellationRate,
    avgProcessingTimeDays,
    uniqueCustomers,
    productsWithoutMovement,
    avgValuePerCustomer,
  };
}
