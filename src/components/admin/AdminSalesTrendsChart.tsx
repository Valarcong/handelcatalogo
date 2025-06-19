
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface SalesTrendsChartData {
  month: string;
  ingresos: number;
  pedidos: number;
}

const AdminSalesTrendsChart: React.FC<{ data: SalesTrendsChartData[] }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Tendencia de Ventas</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="w-full" style={{minWidth: 0}}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12}/>
            <YAxis width={50}/>
            <Tooltip formatter={(v:number) => `S/. ${v.toFixed(2)}`}/>
            <Line type="monotone" dataKey="ingresos" stroke="#0284c7" strokeWidth={2} />
            <Line type="monotone" dataKey="pedidos" stroke="#facc15" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <span className="text-muted-foreground text-xs pl-2">Azul: Ingresos total, Amarillo: Pedidos #</span>
    </CardContent>
  </Card>
);
export default AdminSalesTrendsChart;
