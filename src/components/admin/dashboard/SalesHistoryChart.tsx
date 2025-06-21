import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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
        ? d.toISOString().slice(0,10)
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map[label]) map[label] = { ingresos: 0, pedidos: 0 };
      map[label].ingresos += typeof p.total === "number" ? p.total : 0;
      map[label].pedidos += 1;
    });
    return Object.entries(map)
      .map(([period, v]) => ({ period, ...v }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }, [pedidos, groupBy]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Histórico de Ventas ({groupBy === "día" ? "días" : "meses"})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={timeSeries}>
            <XAxis dataKey="period" />
            <YAxis width={60} />
            <Tooltip formatter={(v:number) => `S/. ${v.toFixed(2)}`} />
            <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos"/>
            <Line type="monotone" dataKey="pedidos" stroke="#facc15" strokeWidth={2} name="Pedidos"/>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesHistoryChart; 