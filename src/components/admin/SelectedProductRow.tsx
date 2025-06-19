
import React from "react";
import { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SelectedProductRowProps {
  product: Product;
  cantidad: number;
  precio: number;
  onCantidadChange: (value: number) => void;
  onPrecioChange: (value: number) => void;
  onRemove: () => void;
}

const SelectedProductRow: React.FC<SelectedProductRowProps> = ({
  product,
  cantidad,
  precio,
  onCantidadChange,
  onPrecioChange,
  onRemove,
}) => {
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
          value={precio}
          onChange={e => onPrecioChange(Number(e.target.value))}
        />
      </td>
      <td className="py-2 px-2 text-right w-24">
        S/. {(precio * cantidad).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
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
