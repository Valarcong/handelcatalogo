
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

interface Props {
  products: Product[];
  onWhatsAppQuote: (product: Product, quantity: number) => void;
  isMobile: boolean;
}

const ProductGrid: React.FC<Props> = ({ products, onWhatsAppQuote, isMobile }) => (
  products.length > 0 ? (
    <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onWhatsAppQuote={onWhatsAppQuote} />
      ))}
    </div>
  ) : null
);

export default ProductGrid;
