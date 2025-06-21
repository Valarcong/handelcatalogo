import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Pedido } from "@/types/order";

interface ChannelPieChartProps {
  pedidos: Pedido[];
}

const COLORS = ["#2563eb", "#10b981", "#facc15", "#ef4444", "#8b5cf6", "#14b8a6"];

const ChannelPieChart: React.FC<ChannelPieChartProps> = ({ pedidos }) => {
  // Ventas por canal (si existe "canal" en pedido, sino simular uno)
  const canales = pedidos.reduce((arr, p) => {
    const canal = (p as any).canal || "Directo";
    const found = arr.find(c => c.name === canal);
    if (found) found.value += 1;
    else arr.push({ name: canal, value: 1 });
    return arr;
  }, [] as { name: string; value: number; }[]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos por Canal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={canales} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {canales.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChannelPieChart; 