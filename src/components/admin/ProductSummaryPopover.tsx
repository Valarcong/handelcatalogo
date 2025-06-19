
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { MousePointerClick } from "lucide-react";

interface Product {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface ProductSummaryPopoverProps {
  productos: Product[];
}

const ProductSummaryPopover: React.FC<ProductSummaryPopoverProps> = ({ productos }) => {
  if (!Array.isArray(productos) || productos.length === 0) {
    return <span className="text-gray-400">--</span>;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Ver productos"
          className="flex items-center gap-1 text-blue-700 hover:underline hover:text-blue-900 font-medium cursor-pointer"
        >
          {productos.length} producto{productos.length > 1 ? "s" : ""} <MousePointerClick className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 max-w-full p-0">
        <div className="p-4">
          <h4 className="text-sm font-semibold mb-2">Productos del pedido</h4>
          <ul className="divide-y">
            {productos.map((prod, i) => (
              <li key={i} className="py-2 flex flex-col text-xs">
                <span className="font-medium">{prod.nombre}</span>
                <div>
                  <span className="text-gray-600">Cantidad:</span> {prod.cantidad}
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-600">Precio:</span> S/. {Number(prod.precio).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSummaryPopover;
