import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Pedido } from "@/types/order";

interface OrderFunnelChartProps {
  pedidos: Pedido[];
}

const OrderFunnelChart: React.FC<OrderFunnelChartProps> = ({ pedidos }) => {
  // Embudo de pedidos por estado
  const estadosFunnel = ["pendiente", "enproceso", "enviado", "entregado_pp", "entregado_pr", "cancelado"];
  const funnelData = estadosFunnel.map(estado => ({
    name: estado.charAt(0).toUpperCase() + estado.slice(1),
    value: pedidos.filter(p => p.estado === estado).length
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embudo de pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={funnelData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OrderFunnelChart; 