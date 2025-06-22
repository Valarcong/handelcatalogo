import React from "react";
import { Pedido } from "@/types/order";
import KPICards from "./dashboard/KPICards";
import OrderFunnelChart from "./dashboard/OrderFunnelChart";
import ChannelPieChart from "./dashboard/ChannelPieChart";
import SalesHistoryChart from "./dashboard/SalesHistoryChart";

interface Props {
  pedidos: Pedido[];
}

const AdminAdvancedDashboard: React.FC<Props> = ({ pedidos }) => {
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
