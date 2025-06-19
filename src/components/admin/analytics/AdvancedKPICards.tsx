
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info, ArrowDown, ArrowUp, Circle } from "lucide-react";

type Delta = {
  value: number;
  type: "up" | "down" | "none";
};

function getDelta(current: number, previous: number): Delta {
  if (previous === 0 && current === 0) return { value: 0, type: "none" };
  if (previous === 0) return { value: 100, type: "up" };
  const diff = ((current - previous) / Math.abs(previous)) * 100;
  if (diff > 0.1) return { value: diff, type: "up" };
  if (diff < -0.1) return { value: diff, type: "down" };
  return { value: 0, type: "none" };
}

const ArrowIcon = ({ type }: { type: Delta["type"] }) =>
  type === "up" ? <ArrowUp className="inline w-3 h-3 text-green-500" />
    : type === "down" ? <ArrowDown className="inline w-3 h-3 text-red-500" />
    : <Circle className="inline w-3 h-3 text-muted-foreground" />;

const DeltaText = ({ delta }: { delta: Delta }) => (
  <span className={
    delta.type === "up"
      ? "text-green-600"
      : delta.type === "down"
      ? "text-red-600"
      : "text-muted-foreground"
  }>
    <ArrowIcon type={delta.type} /> {delta.type !== "none" && delta.value !== 100 ? Math.abs(delta.value).toFixed(1) + "%" : ""}
  </span>
);

interface AdvancedKPICardsProps {
  cancellationRate: number;
  avgProcessingTimeDays: number;
  uniqueCustomers: number;
  productsWithoutMovement: number;
  avgValuePerCustomer: number;
  previous?: Partial<AdvancedKPICardsProps>; // Para comparación
}

const AdvancedKPICards: React.FC<AdvancedKPICardsProps> = ({
  cancellationRate,
  avgProcessingTimeDays,
  uniqueCustomers,
  productsWithoutMovement,
  avgValuePerCustomer,
  previous = {}
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 my-4">
    <KPICard
      label="Tasa de Cancelación"
      value={cancellationRate.toFixed(1) + "%"}
      tooltip="Porcentaje de pedidos cancelados respecto al total."
      delta={getDelta(cancellationRate, previous.cancellationRate ?? 0)}
    />
    <KPICard
      label="Tiempo Prom. Procesamiento"
      value={avgProcessingTimeDays.toFixed(2) + " días"}
      tooltip="Tiempo promedio desde la creación hasta cierre/entrega."
      delta={getDelta(avgProcessingTimeDays, previous.avgProcessingTimeDays ?? 0)}
    />
    <KPICard
      label="Clientes Únicos"
      value={uniqueCustomers}
      tooltip="Número de clientes diferentes con pedidos en el período."
      delta={getDelta(uniqueCustomers, previous.uniqueCustomers ?? 0)}
    />
    <KPICard
      label="Prod. sin Movimiento"
      value={productsWithoutMovement}
      tooltip="Cantidad de productos sin ventas en el período seleccionado."
      delta={getDelta(previous.productsWithoutMovement ?? 0, productsWithoutMovement)}
      // Para disminuir productos sin movimiento el delta se invierte (bajar=favorable)
    />
    <KPICard
      label="Valor Prom. por Cliente"
      value={"S/. " + avgValuePerCustomer.toFixed(2)}
      tooltip="Ingreso promedio por cada cliente único."
      delta={getDelta(avgValuePerCustomer, previous.avgValuePerCustomer ?? 0)}
    />
  </div>
);

// Se muestra delta comparativo debajo del valor
const KPICard = ({
  label,
  value,
  tooltip,
  delta,
}: {
  label: string;
  value: string | number;
  tooltip: string;
  delta: Delta;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="text-xl font-bold text-brand-navy flex items-center gap-2">
        {typeof value === "number" ? (Math.abs(value) < 1 && value !== 0 ? Number(value).toFixed(2) : Math.round(Number(value))) : value}
        <span title={tooltip}>
          <Info className="w-4 h-4 text-muted-foreground inline ml-1" />
        </span>
      </div>
      <div className="text-xs mt-1 flex gap-2 items-center">
        {delta && <DeltaText delta={delta} />}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </CardContent>
  </Card>
);

export default AdvancedKPICards;
