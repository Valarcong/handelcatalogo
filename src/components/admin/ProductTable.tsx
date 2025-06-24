import React from "react";
import { Product } from "@/types/product";
import SelectedProductRow from "./SelectedProductRow";
import { Button } from "@/components/ui/button";

export type ProdEntry = {
  product: Product;
  cantidad: number;
  precio_venta: number;
  precio_compra: number;
  margen: number;
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

  const handlePrecioVentaChange = (idx: number, price: number) => {
    setProds(p => p.map((prod, i) => {
      if (i !== idx) return prod;
      const margen = prod.precio_compra > 0 ? ((price - prod.precio_compra) / prod.precio_compra) * 100 : 0;
      return { ...prod, precio_venta: price, margen: Number(margen.toFixed(2)) };
    }));
  };

  const handlePrecioCompraChange = (idx: number, price: number) => {
    setProds(p => p.map((prod, i) =>
      i === idx
        ? { ...prod, precio_compra: price, precio_venta: Number((price * (1 + prod.margen / 100)).toFixed(2)) }
        : prod
    ));
  };

  const handleMargenChange = (idx: number, margen: number) => {
    setProds(p => p.map((prod, i) => {
      if (i !== idx) return prod;
      const precio_venta = Number((prod.precio_compra * (1 + margen / 100)).toFixed(2));
      return { ...prod, margen, precio_venta };
    }));
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
              <th className="px-2 py-1 font-semibold">Precio Venta (USD)</th>
              <th className="px-2 py-1 font-semibold">Precio Compra (USD)</th>
              <th className="px-2 py-1 font-semibold">Margen (%)</th>
              <th className="px-2 py-1 font-semibold text-right">Subtotal (USD)</th>
              <th className="px-2 py-1 font-semibold text-center">Ganancia</th>
              <th className="px-2 py-1 text-center font-semibold">Quitar</th>
            </tr>
          </thead>
          <tbody>
            {prods.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 py-4">Sin productos</td>
              </tr>
            ) : (
              prods.map((entry, idx) => (
                <SelectedProductRow
                  key={idx}
                  product={entry.product}
                  cantidad={entry.cantidad}
                  precio_venta={entry.precio_venta}
                  precio_compra={entry.precio_compra}
                  margen={entry.margen}
                  onCantidadChange={qty => handleQtyChange(idx, qty)}
                  onPrecioVentaChange={price => handlePrecioVentaChange(idx, price)}
                  onPrecioCompraChange={price => handlePrecioCompraChange(idx, price)}
                  onMargenChange={margen => handleMargenChange(idx, margen)}
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