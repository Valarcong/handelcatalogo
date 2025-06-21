import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string, name: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEditProduct,
  onDeleteProduct,
}) => {
  if (products.length === 0) {
    return (
      <div className="text-gray-500 text-center my-10">
        No se encontraron productos con los filtros aplicados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-14 h-14 rounded object-cover border border-gray-200 bg-gray-100"
              onError={e => ((e.target as HTMLImageElement).src = "/placeholder.svg")}
            />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{product.name}</h3>
                <Badge variant="outline">{product.code}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {product.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span>Categoría: {product.category}</span>
                <span>Precio: ${product.unitPrice}</span>
                <span>Mayor: ${product.wholesalePrice}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditProduct(product)}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M17.013 3.425a2.116 2.116 0 113 3l-10.5 10.5-4 1 1-4 10.5-10.5z"></path>
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteProduct(product.id, product.name)}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6h18M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2m2 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"></path>
              </svg>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 