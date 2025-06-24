import { useState, useEffect } from "react";
import { Pedido } from "@/types/order";
import { Product } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";

export type ProdEntry = {
  product: Product;
  cantidad: number;
  precio_venta: number;
  precio_compra: number;
  margen: number;
};

export function useOrderForm(pedido: Pedido | null) {
  const { products: allProducts } = useProducts();
  const [form, setForm] = useState<Partial<Pedido>>(pedido || {});
  const [prods, setProds] = useState<ProdEntry[]>([]);

  useEffect(() => {
    setForm(pedido || {});
    if (pedido?.productos) {
      setProds(
        pedido.productos.map(prod => {
          const found = allProducts.find(p => p.name === prod.nombre);
          const margen = prod.precio_compra > 0
            ? ((prod.precio_venta - prod.precio_compra) / prod.precio_compra) * 100
            : 0;
          return found
            ? {
                product: found,
                cantidad: prod.cantidad,
                precio_venta: prod.precio_venta || 0,
                precio_compra: prod.precio_compra || 0,
                margen: Number(margen.toFixed(2)),
              }
            : null;
        }).filter(Boolean) as ProdEntry[]
      );
    } else {
      setProds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedido, allProducts.length]);

  const total = prods.reduce((a, b) => a + (b.cantidad * b.precio_venta), 0);

  return {
    form,
    setForm,
    prods,
    setProds,
    total,
    allProducts
  }
} 