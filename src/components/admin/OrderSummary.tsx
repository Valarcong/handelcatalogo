
import React from "react";
import { PedidoEstado, PEDIDO_ESTADOS } from "@/types/order";

interface Props {
  estado: PedidoEstado | undefined;
  setEstado: (estado: PedidoEstado) => void;
  total: number;
}

const OrderSummary: React.FC<Props> = ({ estado, setEstado, total }) => (
  <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
    <div />
    <div>
      <label className="text-xs mb-1 block">Estado</label>
      <select
        className="w-full border px-2 py-2 rounded"
        value={estado || "pendiente"}
        onChange={e => setEstado(e.target.value as PedidoEstado)}
      >
        {PEDIDO_ESTADOS.map(e => (
          <option key={e.value} value={e.value}>{e.label}</option>
        ))}
      </select>
      <div className="mt-6 flex justify-end sm:justify-normal">
        <div className="font-bold text-lg text-brand-navy">
          Total:&nbsp;
          <span>
            S/.{total.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default OrderSummary;
