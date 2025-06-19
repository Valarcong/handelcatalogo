import { useMemo } from "react";
import { Pedido } from "@/types/order";

/**
 * Calcula una regresión lineal simple para predecir valores futuros.
 * Retorna predicción para el siguiente periodo y los datos de la tendencia.
 */
function linearRegression(x: number[], y: number[]) {
  const n = x.length;
  if (n < 2) return { m: 0, b: y[0] || 0, predict: (_x: number) => y[0] || 0 };
  const sum_x = x.reduce((a, b) => a + b, 0);
  const sum_y = y.reduce((a, b) => a + b, 0);
  const sum_xy = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sum_xx = x.reduce((sum, val) => sum + val * val, 0);
  const m = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x || 1);
  const b = (sum_y - m * sum_x) / n;
  return {
    m, b,
    predict: (next_x: number) => m * next_x + b,
  };
}

export function usePredictiveAnalytics(pedidos: Pedido[]) {
  // agrupamos ventas por mes ["2024-06"] → total
  const series = useMemo(() => {
    const monthly: Record<string, number> = {};
    pedidos.forEach(p => {
      const d = new Date(p.created_at);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthly[ym] = (monthly[ym] || 0) + Number(p.total);
    });
    // sorting
    return Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total }));
  }, [pedidos]);

  // Predecir ventas para el mes siguiente usando regresión lineal
  const prediction = useMemo(() => {
    const x = series.map((_, i) => i + 1); // x = 1,2,...
    const y = series.map(s => s.total);
    const lr = linearRegression(x, y);
    const nextX = x.length + 1;
    const predicted = lr.predict(nextX);
    return {
      forecast: Math.max(predicted, 0),
      m: lr.m,
      b: lr.b,
      nextPeriod: nextX,
    };
  }, [series]);

  // Identificar productos en crecimiento/declive (top 3)
  const trendingProducts = useMemo(() => {
    const lastMonths = series.length > 4 ? series.slice(-4).map(s => s.month) : series.map(s => s.month);
    const productSales: Record<string, number[]> = {};
    pedidos.forEach(p => {
      const d = new Date(p.created_at);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (lastMonths.includes(month)) {
        p.productos.forEach(item => {
          if (!productSales[item.nombre]) productSales[item.nombre] = [];
          productSales[item.nombre].push(item.cantidad);
        });
      }
    });
    // Saco la diferencia entre última y primera aparición
    const trends = Object.entries(productSales).map(([name, sales]) => ({
      name,
      growth: sales[sales.length - 1] - sales[0]
    }));
    return {
      growing: trends.filter(t => t.growth > 0).sort((a, b) => b.growth - a.growth).slice(0, 3),
      declining: trends.filter(t => t.growth < 0).sort((a, b) => a.growth - b.growth).slice(0, 3)
    };
  }, [pedidos, series]);

  return {
    salesSeries: series,
    prediction,
    trendingProducts
  };
}
