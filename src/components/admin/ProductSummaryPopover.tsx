import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { MousePointerClick } from "lucide-react";

interface Product {
  id: string;
  nombre: string;
  codigo: string;
  cantidad: number;
  precio_venta: number;
  precio_compra: number;
  subtotal: number;
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
      <PopoverContent className="w-80 max-w-full p-0">
        <div className="p-4">
          <h4 className="text-sm font-semibold mb-2">Productos del pedido</h4>
          <ul className="divide-y">
            {productos.map((prod, i) => {
              const ganancia = (prod.precio_venta - prod.precio_compra) * prod.cantidad;
              const margen = prod.precio_compra > 0 ? ((prod.precio_venta - prod.precio_compra) / prod.precio_compra) * 100 : 0;
              
              return (
                <li key={i} className="py-2 flex flex-col text-xs">
                  <span className="font-medium">{prod.nombre}</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <span className="text-gray-600">Cantidad:</span> {prod.cantidad}
                    </div>
                    <div>
                      <span className="text-gray-600">Código:</span> {prod.codigo}
                    </div>
                    <div>
                      <span className="text-gray-600">Precio Venta:</span> S/. {Number(prod.precio_venta).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                    </div>
                    <div>
                      <span className="text-gray-600">Precio Compra:</span> S/. {Number(prod.precio_compra).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                    </div>
                    <div>
                      <span className="text-gray-600">Subtotal:</span> S/. {Number(prod.subtotal).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                    </div>
                    <div>
                      <span className="text-gray-600">Ganancia:</span> 
                      <span className={`ml-1 font-medium ${ganancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        S/. {Number(ganancia).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Margen:</span> 
                      <span className={`ml-1 font-medium ${margen >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {margen.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSummaryPopover; 