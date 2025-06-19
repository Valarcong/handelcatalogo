
import React from "react";
import { Product } from "@/types/product";
import SelectedProductRow from "./SelectedProductRow";
import { Button } from "@/components/ui/button";

export type ProdEntry = {
  product: Product;
  cantidad: number;
  precio: number;
};

interface ProductTableProps {
  prods: ProdEntry[];
  setProds: (fn: (prev: ProdEntry[]) => ProdEntry[]) => void;
  onAddProduct: () => void;
  alreadySelectedIds: string[];
}

const ProductTable: React.FC<ProductTableProps> = ({
  prods, setProds, onAddProduct, alreadySelectedIds
}) => {
  const handleQtyChange = (idx: number, qty: number) => {
    if (qty < 1) return;
    setProds(p => p.map((prod, i) => i === idx ? { ...prod, cantidad: qty } : prod));
  };

  const handlePriceChange = (idx: number, price: number) => {
    setProds(p => p.map((prod, i) => i === idx ? { ...prod, precio: price } : prod));
  };

  const handleRemove = (idx: number) => {
    setProds(p => p.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-6 border rounded-lg overflow-x-auto bg-gray-50">
      <div className="flex items-center justify-between px-4 pt-3">
        <label className="text-xs font-medium">Productos</label>
        <Button
          size="sm"
          type="button"
          variant="secondary"
          onClick={onAddProduct}
          className="text-xs"
        >
          + Agregar producto
        </Button>
      </div>
      <div className="p-2 pt-1">
        <table className="min-w-full bg-transparent text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left font-semibold">Producto</th>
              <th className="px-2 py-1 text-left font-semibold">Código</th>
              <th className="px-2 py-1 font-semibold">Cantidad</th>
              <th className="px-2 py-1 font-semibold">Precio unit.</th>
              <th className="px-2 py-1 font-semibold text-right">Subtotal</th>
              <th className="px-2 py-1 text-center font-semibold">Quitar</th>
            </tr>
          </thead>
          <tbody>
            {prods.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-4">Sin productos</td>
              </tr>
            ) : (
              prods.map((entry, idx) => (
                <SelectedProductRow
                  key={idx}
                  product={entry.product}
                  cantidad={entry.cantidad}
                  precio={entry.precio}
                  onCantidadChange={qty => handleQtyChange(idx, qty)}
                  onPrecioChange={price => handlePriceChange(idx, price)}
                  onRemove={() => handleRemove(idx)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
