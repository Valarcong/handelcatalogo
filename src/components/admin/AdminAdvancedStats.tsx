import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Product, Category } from "@/types/product";
import { Pedido } from "@/types/order";
import { DollarSign, Package, Repeat, ArrowUpRight, Users } from "lucide-react";

interface AdminAdvancedStatsProps {
  productos: Product[];
  categorias: Category[];
  pedidos: Pedido[];
}

const KPICard = ({ title, value, icon: Icon, change, changeType }: { title: string; value: string; icon: React.ElementType; change?: string; changeType?: 'increase' | 'decrease' }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold">{value}</p>
        {change && (
          <p className={`text-xs font-semibold ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

const AdminAdvancedStats: React.FC<AdminAdvancedStatsProps> = ({ productos, pedidos }) => {
  const recurringCustomers = React.useMemo(() => {
    if (pedidos.length === 0) return 0;
    const customerOrders = pedidos.reduce((acc, pedido) => {
      const customerId = pedido.cliente_id || pedido.cliente_nombre;
      if (customerId) {
        acc[customerId] = (acc[customerId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.values(customerOrders).filter(count => count > 1).length;
  }, [pedidos]);

  const averageTicket = React.useMemo(() => {
    if (pedidos.length === 0) return 0;
    const totalRevenue = pedidos.reduce((sum, p) => sum + p.total, 0);
    return totalRevenue / pedidos.length;
  }, [pedidos]);

  const productsWithoutRotation = React.useMemo(() => {
    const soldProductIds = new Set(pedidos.flatMap(p => p.productos.map(item => item.id)));
    return productos.filter(p => !soldProductIds.has(p.id)).length;
  }, [productos, pedidos]);

  const maxTicket = React.useMemo(() => {
    if (pedidos.length === 0) return 0;
    return Math.max(...pedidos.map(p => p.total));
  }, [pedidos]);
  
  const purchasePerCustomer = React.useMemo(() => {
    if(pedidos.length === 0) return 0;
    const uniqueCustomers = new Set(pedidos.map(p => p.cliente_id || p.cliente_nombre)).size;
    if(uniqueCustomers === 0) return 0;
    return pedidos.length / uniqueCustomers;
  }, [pedidos]);

  const advancedMetrics = [
    { title: "Clientes Recurrentes", value: recurringCustomers.toString(), icon: Users },
    { title: "Ticket Promedio", value: `S/. ${averageTicket.toFixed(2)}`, icon: DollarSign },
    { title: "Productos sin Rotación", value: productsWithoutRotation.toString(), icon: Package },
    { title: "Ticket Máximo", value: `S/. ${maxTicket.toFixed(2)}`, icon: ArrowUpRight },
    { title: "Compras por Cliente", value: purchasePerCustomer.toFixed(2), icon: Repeat },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {advancedMetrics.map((kpi) => (
          <KPICard key={kpi.title} title={kpi.title} value={kpi.value} icon={kpi.icon} />
        ))}
      </div>
      {/* Puedes agregar más gráficos detallados aquí si lo deseas */}
    </div>
  );
};

export default AdminAdvancedStats;
