
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Category } from "@/types/product";

interface ProductFiltersProps {
  isMobile: boolean;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  selectedBrand: string;
  setSelectedBrand: (v: string) => void;
  brands: string[];
  categories: Category[];
  clearFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  isMobile,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  selectedBrand,
  setSelectedBrand,
  brands,
  categories,
  clearFilters,
}) => {
  if (isMobile) {
    return (
      <details className="mb-3">
        <summary className="font-semibold text-brand-navy cursor-pointer py-1 px-1 rounded">
          Filtrar & ordenar
        </summary>
        <div className="grid grid-cols-1 gap-3 mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-xs"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-[90]">
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Orden" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-[90]">
              <SelectItem value="name">Nombre A-Z</SelectItem>
              <SelectItem value="code">Código</SelectItem>
              <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-[90]">
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="whitespace-nowrap text-xs h-8"
          >
            Limpiar Filtros
          </Button>
        </div>
      </details>
    );
  }

  // Desktop
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg">
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name} ({category.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger>
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg">
          <SelectItem value="name">Nombre A-Z</SelectItem>
          <SelectItem value="code">Código</SelectItem>
          <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
          <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
        <SelectTrigger>
          <SelectValue placeholder="Todas las marcas" />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg">
          <SelectItem value="all">Todas las marcas</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand} value={brand}>
              {brand}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        onClick={clearFilters}
        className="whitespace-nowrap"
      >
        Limpiar Filtros
      </Button>
    </div>
  );
};

export default ProductFilters;
