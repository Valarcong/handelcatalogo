
import React from "react";
import { PEDIDO_ESTADOS } from "@/types/order";
import { Filter } from "lucide-react";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrderFiltersProps {
  filters: any;
  setFilter: (key: string, value: string) => void;
  reset: () => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  setFilter,
  reset,
}) => (
  <div className="flex flex-wrap gap-2 items-center mb-4 bg-muted px-4 py-3 rounded-md">
    <Filter className="text-brand-navy w-5 h-5" />
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">Estado:</span>
      <Select
        value={filters.estado}
        onValueChange={v => setFilter("estado", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {PEDIDO_ESTADOS.map(e => (
            <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">Buscar:</span>
      <Input
        placeholder="Cliente, email, teléfono u orden"
        value={filters.search}
        onChange={e => setFilter("search", e.target.value)}
        className="w-48"
      />
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">Desde:</span>
      <Input
        type="date"
        value={filters.fechaDesde}
        onChange={e => setFilter("fechaDesde", e.target.value)}
        className="w-36"
      />
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">Hasta:</span>
      <Input
        type="date"
        value={filters.fechaHasta}
        onChange={e => setFilter("fechaHasta", e.target.value)}
        className="w-36"
      />
    </div>
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={reset}
    >
      Limpiar
    </Button>
  </div>
);

export default OrderFilters;
