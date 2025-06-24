import React from "react";
import { Button } from "@/components/ui/button";
import { useExchangeRate } from '@/hooks/useExchangeRate';

interface OrderManagementHeaderProps {
  onCreateOrder: () => void;
}

const OrderManagementHeader: React.FC<OrderManagementHeaderProps> = ({ onCreateOrder }) => {
  const { data: exchangeRate, loading: loadingTC, error: errorTC } = useExchangeRate();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
      <div>
        <h2 className="text-xl font-semibold">Pedidos</h2>
        <div className="mt-1 text-xs text-gray-700 font-semibold">
          {loadingTC ? 'Cargando T.C...' : errorTC ? 'Error al cargar T.C.' : exchangeRate ? `T.C. Actual: ${(exchangeRate.tc + 0.05).toFixed(3)}` : null}
        </div>
      </div>
      <Button onClick={onCreateOrder} variant="default">
        + Nuevo Pedido
      </Button>
    </div>
  );
};

export default OrderManagementHeader; 