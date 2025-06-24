import React from "react";
import { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SelectedProductRowProps {
  product: Product;
  cantidad: number;
  precio_venta: number;
  precio_compra: number;
  margen: number;
  onCantidadChange: (value: number) => void;
  onPrecioVentaChange: (value: number) => void;
  onPrecioCompraChange: (value: number) => void;
  onMargenChange: (value: number) => void;
  onRemove: () => void;
}

const SelectedProductRow: React.FC<SelectedProductRowProps> = ({
  product,
  cantidad,
  precio_venta,
  precio_compra,
  margen,
  onCantidadChange,
  onPrecioVentaChange,
  onPrecioCompraChange,
  onMargenChange,
  onRemove,
}) => {
  const safeMargen = (margen === undefined || margen === null) ? 10 : margen;
  const ganancia = (precio_venta - precio_compra) * cantidad;

  return (
    <tr>
      <td className="py-2 px-2 font-medium text-sm">{product.name}</td>
      <td className="py-2 px-2 text-xs text-gray-500">{product.code}</td>
      <td className="py-2 px-2" style={{ minWidth: 80 }}>
        <Input
          type="number"
          min={1}
          className="w-16"
          value={cantidad}
          onChange={e => onCantidadChange(Number(e.target.value))}
        />
      </td>
      <td className="py-2 px-2" style={{ minWidth: 100 }}>
        <Input
          type="number"
          min={0.01}
          step="0.01"
          className="w-24"
          value={precio_venta}
          onChange={e => onPrecioVentaChange(Number(e.target.value))}
          placeholder="Precio venta (USD)"
        />
      </td>
      <td className="py-2 px-2" style={{ minWidth: 100 }}>
        <Input
          type="number"
          min={0}
          step="0.01"
          className="w-24"
          value={precio_compra}
          onChange={e => onPrecioCompraChange(Number(e.target.value))}
          placeholder="Precio compra (USD)"
        />
      </td>
      <td className="py-2 px-2" style={{ minWidth: 80 }}>
        <Input
          type="number"
          min={0}
          step="0.01"
          className="w-16"
          value={safeMargen}
          onChange={e => onMargenChange(Number(e.target.value))}
          placeholder="Margen %"
        />
      </td>
      <td className="py-2 px-2 text-right w-24">
        USD {(precio_venta * cantidad).toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </td>
      <td className="py-2 px-2 text-center">
        <div className="text-xs">
          <div className={`font-medium ${ganancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            USD {ganancia.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-500">
            {safeMargen.toFixed(1)}%
          </div>
        </div>
      </td>
      <td className="py-2 px-2 text-center">
        <Button
          type="button"
          size="icon"
          variant="destructive"
          onClick={onRemove}
          title="Eliminar"
        >
          ×
        </Button>
      </td>
    </tr>
  );
};

export default SelectedProductRow;
