import React from "react";
import { Product, Category } from "@/types/product";
import { Pedido } from "@/types/order";
import KPICards from "./dashboard/KPICards";
import OrderFunnelChart from "./dashboard/OrderFunnelChart";
import ChannelPieChart from "./dashboard/ChannelPieChart";
import SalesHistoryChart from "./dashboard/SalesHistoryChart";

interface Props {
  pedidos: Pedido[];
  products: Product[];
  categories: Category[];
}

const AdminAdvancedDashboard: React.FC<Props> = ({ pedidos, products, categories }) => {
  return (
    <div className="space-y-6">
      <KPICards pedidos={pedidos} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OrderFunnelChart pedidos={pedidos} />
        <ChannelPieChart pedidos={pedidos} />
      </div>

      <SalesHistoryChart pedidos={pedidos} />
    </div>
  );
};

export default AdminAdvancedDashboard;
