
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AdminDashboardKPIsProps {
  totalPedidos: number;
  ingresosTotales: number;
  ticketPromedio: number;
  pedidosPendientes: number;
  pedidosCompletados: number;
}

const KPICard = ({ label, value }: { label: string, value: string | number }) => (
  <Card>
    <CardContent className="p-6">
      <div className="text-xl font-bold text-brand-navy">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </CardContent>
  </Card>
);

const AdminDashboardKPIs: React.FC<AdminDashboardKPIsProps> = ({
  totalPedidos,
  ingresosTotales,
  ticketPromedio,
  pedidosPendientes,
  pedidosCompletados
}) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-4">
    <KPICard label="Total de Pedidos" value={totalPedidos} />
    <KPICard label="Ingresos Totales" value={`S/. ${ingresosTotales.toFixed(2)}`} />
    <KPICard label="Ticket Promedio" value={`S/. ${ticketPromedio.toFixed(2)}`} />
    <KPICard label="Pendientes" value={pedidosPendientes} />
    <KPICard label="Completados" value={pedidosCompletados} />
  </div>
);

export default AdminDashboardKPIs;
