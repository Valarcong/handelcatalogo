
import { useState, useEffect } from "react";
import { Pedido, PedidoEstado } from "@/types/order";
import { Product } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";

export type ProdEntry = {
  product: Product;
  cantidad: number;
  precio: number;
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
          return found
            ? { product: found, cantidad: prod.cantidad, precio: prod.precio }
            : null;
        }).filter(Boolean) as ProdEntry[]
      );
    } else {
      setProds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedido, allProducts.length]);

  const total = prods.reduce((a, b) => a + (b.cantidad * b.precio), 0);

  return {
    form,
    setForm,
    prods,
    setProds,
    total,
    allProducts
  }
}
