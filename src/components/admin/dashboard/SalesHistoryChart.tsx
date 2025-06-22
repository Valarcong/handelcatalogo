import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { Pedido } from "@/types/order";

interface SalesHistoryChartProps {
  pedidos: Pedido[];
}

const SalesHistoryChart: React.FC<SalesHistoryChartProps> = ({ pedidos }) => {
  // Detectar granularidad adecuada: si el rango es <= 31 días → usar "día", si > 31 → usar mes
  const groupBy = (() => {
    if (pedidos.length < 2) return "día";
    const fechas = pedidos.map(p => new Date(p.created_at));
    fechas.sort((a,b) => a.getTime() - b.getTime());
    const diffMs = fechas.at(-1)!.getTime() - fechas[0].getTime();
    const diffDays = diffMs / (1000*60*60*24);
    return diffDays > 31 ? "mes" : "día";
  })();

  // Ventas por periodo adecuado
  const timeSeries = useMemo(() => {
    const map: { [k: string]: { ingresos: number, pedidos: number } } = {};
    pedidos.forEach((p) => {
      const d = new Date(p.created_at);
      const label = groupBy === "día"
        ? d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
        : d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      if (!map[label]) map[label] = { ingresos: 0, pedidos: 0 };
      map[label].ingresos += typeof p.total === "number" ? p.total : 0;
      map[label].pedidos += 1;
    });
    // Esta es una simulación de ordenamiento, idealmente se usaría una librería de fechas
    return Object.entries(map).map(([period, v]) => ({ period, ...v }));

  }, [pedidos, groupBy]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Visión General ({groupBy === "día" ? "Días" : "Meses"})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={timeSeries} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" tick={{ fill: '#6b7280' }} stroke="#d1d5db" />
            <YAxis yAxisId="left" orientation="left" tick={{ fill: '#6b7280' }} stroke="#d1d5db" />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280' }} stroke="#d1d5db" />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
              labelStyle={{ color: '#1f2937' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar yAxisId="left" dataKey="ingresos" barSize={20} fill="#3b82f6" name="Ingresos (S/.)" />
            <Line yAxisId="right" type="monotone" dataKey="pedidos" stroke="#f97316" strokeWidth={2} name="N° Pedidos" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesHistoryChart; 