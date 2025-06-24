import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product, Category } from '@/types/product';
import ProductFilters from './products/ProductFilters';
import ProductList from './products/ProductList';
import { TestTube } from 'lucide-react';
import { useExchangeRate } from '@/hooks/useExchangeRate';

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
  const [testResult, setTestResult] = useState<string>("");
  const { data: exchangeRate, loading: loadingTC, error: errorTC } = useExchangeRate();

  // Debug: Registrar props y estado para diagnóstico
  useEffect(() => {
    // Logs eliminados por seguridad
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

  const testCategories = () => {
    setTestResult(`✅ Categorías disponibles: ${categories.length}`);
    console.log('Categorías:', categories);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            Productos Existentes ({filteredProducts.length}
            {search || category
              ? ` de ${products.length}`
              : ''}
            )
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={testCategories}
            className="text-xs"
          >
            <TestTube className="h-3 w-3 mr-1" />
            Probar Categorías
          </Button>
        </CardTitle>
        <div className="mt-1 text-xs text-gray-700 font-semibold">
          {loadingTC ? 'Cargando T.C...' : errorTC ? 'Error al cargar T.C.' : exchangeRate ? `T.C. Actual: ${(exchangeRate.tc + 0.05).toFixed(3)}` : null}
        </div>
        {testResult && (
          <p className="text-xs text-gray-600">{testResult}</p>
        )}
      </CardHeader>
      <CardContent>
        <ProductFilters
          search={search}
          category={category}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onClearFilters={handleClearFilters}
        />
        <ProductList
          products={filteredProducts}
          categories={categories}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
        />
      </CardContent>
    </Card>
  );
};

export default ProductManagement;
