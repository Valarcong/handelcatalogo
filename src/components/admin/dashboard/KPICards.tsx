import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pedido } from "@/types/order";

interface KPICardsProps {
  pedidos: Pedido[];
}

const KPICards: React.FC<KPICardsProps> = ({ pedidos }) => {
  // KPIs rápidos
  const totalVentas = pedidos.reduce((acc, p) => acc + (typeof p.total === "number" ? p.total : 0), 0);
  const totalPedidos = pedidos.length;
  const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0;
  const pedidosCancelados = pedidos.filter(p => p.estado === "cancelado").length;
  const cancelRate = totalPedidos > 0 ? (pedidosCancelados / totalPedidos) * 100 : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-xl font-bold text-brand-navy">S/. {totalVentas.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Ventas totales</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-xl font-bold text-brand-navy">{totalPedidos}</div>
          <div className="text-sm text-gray-600">Pedidos totales</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-xl font-bold text-brand-navy">S/. {ticketPromedio.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Ticket promedio</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-xl font-bold text-brand-navy">{pedidosCancelados}</div>
          <div className="text-sm text-gray-600">Pedidos cancelados</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-xl font-bold text-brand-navy">{cancelRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Tasa de cancelación</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards; 