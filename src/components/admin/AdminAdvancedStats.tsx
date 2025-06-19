
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Product, Category } from "@/types/product";
import { Pedido } from "@/types/order";

// Dummy KPI: puedes conectar con lógica real después
const advancedMetrics = [
  { label: "Tasa de Conversión", value: "12%" },
  { label: "Clientes Frecuentes", value: 18 },
  { label: "Margen Promedio", value: "22%" },
  { label: "Productos sin Movimiento", value: 5 },
  { label: "Ticket Máximo", value: "S/. 175.40" },
];

const AdminAdvancedStats: React.FC<{
  productos: Product[];
  categorias: Category[];
  pedidos: Pedido[];
}> = ({ productos, categorias, pedidos }) => {
  // Placeholder para futuros gráficos/estadísticas avanzadas
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {advancedMetrics.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-6">
              <div className="text-xl font-bold text-brand-navy">{kpi.value}</div>
              <div className="text-sm text-gray-600">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Aquí puedes poner más gráficos tipo heatmap, funnels, análisis avanzado */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis avanzado próximamente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Los gráficos y comparativas avanzadas estarán disponibles pronto. Sugiere nuevos KPIs para tu negocio.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAdvancedStats;
