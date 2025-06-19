import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Product, Category } from "@/types/product";
import { Pedido, PedidoEstado } from "@/types/order";
import AdminDashboardKPIs from "./AdminDashboardKPIs";
import AdminOrderStatusChart from "./AdminOrderStatusChart";
import AdminSalesTrendsChart from "./AdminSalesTrendsChart";
import AdminTopProductsChart from "./AdminTopProductsChart";
import AdminAdvancedStats from "./AdminAdvancedStats";
import AdminReportsSection from "./AdminReportsSection";
import AdminAdvancedDashboard from "./AdminAdvancedDashboard";
import AdminAIPredictiveAlerts from "./AdminAIPredictiveAlerts";
import { supabase } from "@/integrations/supabase/client";
import DateRangeFilter from "./analytics/DateRangeFilter";
import { useDateFilters } from "@/hooks/analytics/useDateFilters";
import AdvancedKPICards from "./analytics/AdvancedKPICards";
import { useAdvancedKPIs } from "@/hooks/analytics/useAdvancedKPIs";
import { usePreviousPeriod } from "@/hooks/analytics/usePreviousPeriod";
import { useAuthContext } from "@/hooks/AuthContext";
 
// Error boundary simple
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  return (
    <React.Suspense fallback={<div>Cargando...</div>}>
      <React.Fragment>
        {hasError ? (
          <div className="text-red-500 text-sm">Error cargando sección. Intenta de nuevo.</div>
        ) : (
          <ErrorCatcher onError={() => setHasError(true)}>{children}</ErrorCatcher>
        )}
      </React.Fragment>
    </React.Suspense>
  );
}

class ErrorCatcher extends React.Component<{ children: React.ReactNode; onError: () => void }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    if (this.props.onError) this.props.onError();
    // eslint-disable-next-line no-console
    // console.error("ErrorBoundary atrapó un error:", error);
  }
  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-xs">Algo salió mal al cargar el componente.</div>;
    }
    return this.props.children;
  }
}

interface AdminStatsProps {
  products: Product[];
  categories: Category[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ products, categories }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { range, setRange, filterByRange } = useDateFilters();
  const [tab, setTab] = useState<"general" | "advanced" | "reports" | "predictive">("general");

  // NUEVO: obtener usuario autenticado del contexto
  const { authUser, user } = useAuthContext();

  useEffect(() => {
    async function loadPedidos() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from("pedidos").select("*");
        if (error) throw error;
        setPedidos(
          data.map((p: any) => ({
            ...p,
            estado: p.estado as PedidoEstado,
            productos: Array.isArray(p.productos)
              ? p.productos
              : typeof p.productos === "string"
                ? (() => { try { return JSON.parse(p.productos); } catch { return []; } })()
                : [],
          }))
        );
      } catch (err: any) {
        setError("Error cargando pedidos: " + (err?.message ?? "desconocido"));
        setPedidos([]);
      }
      setLoading(false);
    }
    loadPedidos();
  }, []);

  const pedidosFiltrados = filterByRange(pedidos);
  const prevRange = usePreviousPeriod(range);

  const advancedKPIs = useAdvancedKPIs({
    pedidos: pedidos,
    productos: products,
    dateRange: range,
    filterByRange: (arr) => filterByRange(arr),
  });
  const previousKPIs = useAdvancedKPIs({
    pedidos: pedidos,
    productos: products,
    dateRange: prevRange,
    filterByRange: (arr) => filterByRange(arr, "created_at"),
  });

  useEffect(() => {
    if (!pedidosFiltrados.length) return;
    const ingresos = pedidosFiltrados.reduce((acc, p) => acc + Number(p.total), 0);

    // Pie Chart: estados (no se usa set state local)
    const statusAgg = ["pendiente", "enproceso", "enviado", "entregado"].map(status => ({
      name: status,
      value: pedidosFiltrados.filter(p => p.estado === status).length
    }));

    // Trends últimos 6 meses
    const months: { [k: string]: { ingresos: number, pedidos: number } } = {};
    pedidosFiltrados.forEach(p => {
      const d = new Date(p.created_at);
      const label = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, "0")}`;
      if (!months[label]) months[label] = { ingresos: 0, pedidos: 0 };
      months[label].ingresos += Number(p.total);
      months[label].pedidos += 1;
    });
    const sortedMonths = Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-6);

    // Productos más vendidos
    const prodMap: Record<string, { ventas: number, ingresos: number }> = {};
    pedidosFiltrados.forEach(p => {
      p.productos.forEach((item: any) => {
        if (!prodMap[item.nombre]) prodMap[item.nombre] = { ventas: 0, ingresos: 0 };
        prodMap[item.nombre].ventas += item.cantidad;
        prodMap[item.nombre].ingresos += item.cantidad * item.precio;
      });
    });
    const topData = Object.entries(prodMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 8);
    // No se usan set state locales aquí.
  }, [pedidosFiltrados]);

  // Extrae userId del usuario autenticado (nuevo)
  const userId = authUser?.id ?? null;

  if (loading)
    return <div className="text-center text-muted-foreground py-8">Cargando estadísticas...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  // VALIDA DATOS INDISPENSABLES
  if (!userId || !user) {
    return (
      <div className="text-center text-yellow-600 py-8">
        No se detectó usuario autenticado. Por favor vuelve a ingresar al sistema.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* tabs */}
      <div className="mb-3 flex justify-between items-end flex-wrap gap-3">
        {/* tabs */}
        <div className="flex gap-2">
          <button
            className={`px-4 py-1 rounded ${tab === "general" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}
            onClick={() => setTab("general")}
          >
            General
          </button>
          <button
            className={`px-4 py-1 rounded ${tab === "advanced" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}
            onClick={() => setTab("advanced")}
          >
            Avanzadas
          </button>
          <button
            className={`px-4 py-1 rounded ${tab === "reports" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}
            onClick={() => setTab("reports")}
          >
            Reportes
          </button>
          <button
            className={`px-4 py-1 rounded ${tab === "predictive" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}
            onClick={() => setTab("predictive")}
          >
            Predictivo
          </button>
        </div>
        {/* selector de rango de fechas */}
        <DateRangeFilter range={range} setRange={setRange} />
      </div>

      {/* SECCIÓN DE ALERTAS IA EXPANDIBLE */}
      {userId && (
        <div>
          <ErrorBoundary>
            <AdminAIPredictiveAlerts authId={userId} />
          </ErrorBoundary>
        </div>
      )}

      {/* Sección seleccionada (con boundaries en lazyload) */}
      <ErrorBoundary>
        {tab === "general" && (
          <AdminAdvancedDashboard pedidos={pedidosFiltrados} products={products} categories={categories} />
        )}
        {tab === "advanced" && (
          <>
            <AdvancedKPICards
              {...advancedKPIs}
              previous={previousKPIs}
            />
            <AdminAdvancedStats productos={products} categorias={categories} pedidos={pedidosFiltrados} />
          </>
        )}
        {tab === "reports" && (
          <AdminReportsSection pedidos={pedidosFiltrados} productos={products} range={range} />
        )}
        {tab === "predictive" && (
          <React.Suspense fallback={<div>Cargando análisis predictivo...</div>}>
            <PredictiveAnalytics pedidos={pedidosFiltrados} userId={userId} periodo={range} />
          </React.Suspense>
        )}
      </ErrorBoundary>
    </div>
  );
};

const PredictiveAnalytics = React.lazy(() => import("./PredictiveAnalytics"));

export default AdminStats;
