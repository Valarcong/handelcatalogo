import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/product';

interface ProductFiltersProps {
  search: string;
  category: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
}) => {
  return (
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
        onChange={(e) => onSearchChange(e.target.value)}
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
        onChange={(e) => onCategoryChange(e.target.value)}
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
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
};

export default ProductFilters; 