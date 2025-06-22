import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, Category } from '@/types/product';
import { Pencil, Trash2, Package } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string, name: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  onEditProduct,
  onDeleteProduct,
}) => {
  // Función para obtener información de la categoría
  const getCategoryInfo = (categoryName: string) => {
    return categories.find(cat => cat.name === categoryName);
  };

  if (products.length === 0) {
    return (
      <div className="text-gray-500 text-center my-10">
        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No se encontraron productos con los filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const categoryInfo = getCategoryInfo(product.category);
        
        return (
          <div
            key={product.id}
            className="border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-gray-100"
                  onError={e => ((e.target as HTMLImageElement).src = "/placeholder.svg")}
                />
                {categoryInfo?.image && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                    <img
                      src={categoryInfo.image}
                      alt={categoryInfo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {product.code}
                  </Badge>
                  {product.brand && (
                    <Badge variant="secondary" className="text-xs">
                      {product.brand}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {product.description || "Sin descripción"}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium">{product.category}</span>
                  {categoryInfo && (
                    <span className="text-xs">({categoryInfo.count} productos)</span>
                  )}
                  <span>Unit: ${product.unitPrice.toFixed(2)}</span>
                  <span>Mayor: ${product.wholesalePrice.toFixed(2)}</span>
                  {product.minimumWholesaleQuantity > 1 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Min: {product.minimumWholesaleQuantity}
                    </span>
                  )}
                </div>
                
                {Array.isArray(product.tags) && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{product.tags.length - 3} más
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditProduct(product)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteProduct(product.id, product.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList; 