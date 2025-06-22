import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Pedido } from "@/types/order";
import { useCotizaciones } from "@/hooks/useCotizaciones";

interface OrderFunnelChartProps {
  pedidos: Pedido[];
}

const COLORS = ['#0ea5e9', '#10b981', '#f97316'];

const OrderFunnelChart: React.FC<OrderFunnelChartProps> = ({ pedidos }) => {
  const { cotizaciones, loading: loadingCotizaciones } = useCotizaciones();

  const funnelData = [
    { name: 'Cotizaciones', value: cotizaciones.length || 0 },
    { name: 'Pedidos', value: pedidos.length || 0 },
    { name: 'Ventas', value: pedidos.filter(p => p.estado === 'entregado_pp' || p.estado === 'entregado_pr').length || 0 }
  ].sort((a, b) => b.value - a.value);

  if (loadingCotizaciones) {
    return (
      <Card>
        <CardHeader><CardTitle>Embudo de Conversión</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-[220px] text-gray-500">Cargando datos...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embudo de Conversión</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <FunnelChart>
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
            <Funnel 
              dataKey="value" 
              data={funnelData} 
              isAnimationActive
              lastShapeType="triangle"
            >
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
        <div className="flex justify-end mt-2">
          <div className="flex flex-col items-start gap-2">
            {funnelData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-gray-600">{entry.name}:</span>
                <span className="font-semibold text-gray-800 ml-1.5">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderFunnelChart; 