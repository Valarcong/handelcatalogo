import React from 'react';
import ProductCard from '@/components/ProductCard';
import { ResponsiveGrid } from '@/components/ui/responsive';

interface Props {
  products: any[];
  onWhatsAppQuote: (product: any) => void;
  isMobile?: boolean;
}

const ProductGrid: React.FC<Props> = ({ products, onWhatsAppQuote, isMobile }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No se encontraron productos</div>
        <p className="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <ResponsiveGrid 
      cols={{ 
        mobile: 1, 
        tablet: 2, 
        desktop: 3, 
        wide: 4 
      }}
      className="gap-4 md:gap-6"
    >
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onWhatsAppQuote={onWhatsAppQuote} 
        />
      ))}
    </ResponsiveGrid>
  );
};

export default ProductGrid;
