import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pedido } from "@/types/order";
import { useCotizaciones } from "@/hooks/useCotizaciones";
import { DollarSign, FileText, Package, CheckCircle } from "lucide-react";

interface KPICardsProps {
  pedidos: Pedido[];
}

const KPICard = ({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const KPICards: React.FC<KPICardsProps> = ({ pedidos }) => {
  const { cotizaciones } = useCotizaciones();

  const totalVentas = pedidos
    .filter(p => p.estado === 'entregado_pp' || p.estado === 'entregado_pr')
    .reduce((acc, p) => acc + (typeof p.total === "number" ? p.total : 0), 0);

  const totalPedidos = pedidos.length;
  
  const totalCotizaciones = cotizaciones.length;

  const kpis = [
    { title: "Ingresos (Ventas)", value: `S/. ${totalVentas.toFixed(2)}`, icon: DollarSign },
    { title: "Cotizaciones", value: totalCotizaciones.toString(), icon: FileText },
    { title: "Pedidos", value: totalPedidos.toString(), icon: Package },
    { title: "Ventas Completadas", value: pedidos.filter(p => p.estado === 'entregado_pp' || p.estado === 'entregado_pr').length.toString(), icon: CheckCircle }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(kpi => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
};

export default KPICards; 