
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface TopProductsChartData {
  name: string;
  ventas: number;
  ingresos: number;
}

const AdminTopProductsChart: React.FC<{ data: TopProductsChartData[] }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Top Productos Vendidos</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"/>
          <YAxis />
          <Tooltip formatter={(v:number) => v.toLocaleString()}/>
          <Bar dataKey="ventas" fill="#0284c7" />
          <Bar dataKey="ingresos" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
      <span className="text-muted-foreground text-xs pl-2">Azul: Unidades, Verde: Ingresos</span>
    </CardContent>
  </Card>
);

export default AdminTopProductsChart;
