
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const COLORS = ["#0284c7", "#facc15", "#10b981", "#a1a1aa"];

export interface StatusChartData {
  name: string;
  value: number;
}

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  enproceso: "En proceso",
  enviado: "Enviado",
  entregado: "Entregado",
};

const AdminOrderStatusChart: React.FC<{ data: StatusChartData[] }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Pedidos por Estado</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie 
            data={data} 
            cx="50%" cy="50%" 
            labelLine={false}
            label={({ name, percent }) => `${STATUS_LABELS[name] ?? name} (${(percent*100).toFixed(0)}%)`}
            outerRadius={70}
            dataKey="value"
          >
            {data.map((entry, i) => (<Cell key={entry.name} fill={COLORS[i % COLORS.length]}/>))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-2 flex flex-wrap gap-2 text-xs">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            {STATUS_LABELS[d.name] ?? d.name}: {d.value}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default AdminOrderStatusChart;
