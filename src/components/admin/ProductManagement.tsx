import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product, Category } from '@/types/product';
import ProductFilters from './products/ProductFilters';
import ProductList from './products/ProductList';

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
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
        />
      </CardContent>
    </Card>
  );
};

export default ProductManagement;
