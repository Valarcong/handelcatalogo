import React from "react";
import { Button } from "@/components/ui/button";

interface OrderManagementHeaderProps {
  onCreateOrder: () => void;
}

const OrderManagementHeader: React.FC<OrderManagementHeaderProps> = ({ onCreateOrder }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Pedidos</h2>
      <Button onClick={onCreateOrder} variant="default">
        + Nuevo Pedido
      </Button>
    </div>
  );
};

export default OrderManagementHeader; 