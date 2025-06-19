import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Product, Category } from '@/types/product';

interface ProductManagementProps {
  products: Product[];
  categories: Category[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string, name: string) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  categories,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Debug: Registrar props y estado para diagnóstico
  useEffect(() => {
    console.log('[ProductManagement] Monto de products:', products?.length, products);
    console.log('[ProductManagement] Monto de categories:', categories?.length, categories);
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchText = (
        product.name +
        ' ' +
        product.code +
        ' ' +
        product.description
      )
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const matchCategory = !category || product.category === category;

      return matchText && matchCategory;
    });
  }, [products, search, category]);

  function handleClearFilters() {
    setSearch('');
    setCategory('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Productos Existentes ({filteredProducts.length}
          {search || category
            ? ` de ${products.length}`
            : ''}
          )
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-4 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/30 p-4 shadow transition-all"
          style={{ minHeight: 65 }}
          data-testid="filtros-productos"
        >
          <label className="text-sm font-medium text-blue-800" htmlFor="prod-busqueda">
            Buscar:
          </label>
          <Input
            id="prod-busqueda"
            className="md:w-72 rounded shadow border-blue-400"
            placeholder="Buscar nombre, código o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            data-testid="input-busqueda"
          />
          <label className="text-sm font-medium text-blue-800" htmlFor="prod-cat">
            Categoría:
          </label>
          <select
            id="prod-cat"
            className="border rounded-md px-2 py-2 bg-background text-base md:w-48 border-blue-400 shadow"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            data-testid="select-categoria"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name} {cat.count ? `(${cat.count})` : ''}
              </option>
            ))}
          </select>
          {(search || category) && (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-gray-500 text-center my-10">
            No se encontraron productos con los filtros aplicados.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
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
        )}
      </CardContent>
    </Card>
  );
};

export default ProductManagement;
