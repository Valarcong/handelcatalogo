
import React from "react";
import VentasProductCatalog from "./VentasProductCatalog";
import VentasOrders from "./VentasOrders";
import VentasQuotesPanel from "./VentasQuotesPanel";
import VentasTemplatesPanel from "./VentasTemplatesPanel";

const VentasStatsCharts = React.lazy(() => import("./VentasStatsCharts"));

interface VentasSectionRendererProps {
  section: string;
}

const VentasSectionRenderer: React.FC<VentasSectionRendererProps> = ({ section }) => {
  if (section === "products") return <VentasProductCatalog />;
  if (section === "orders") return <VentasOrders />;
  if (section === "quotes") return <VentasQuotesPanel />;
  if (section === "templates") return <VentasTemplatesPanel />;
  if (section === "stats") {
    return (
      <div className="mt-2">
        <h2 className="text-2xl font-bold text-brand-navy mb-4">Estadísticas Avanzadas</h2>
        <React.Suspense fallback={<div className="text-center py-10">Cargando estadísticas...</div>}>
          <VentasStatsCharts />
        </React.Suspense>
      </div>
    );
  }
  return <div className="p-8 text-gray-400">Sección no encontrada.</div>;
};

export default VentasSectionRenderer;
