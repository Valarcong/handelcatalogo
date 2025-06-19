
import React from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  selectedBrand: string;
  setSelectedBrand: (v: string) => void;
  isMobile: boolean;
}

const ProductActiveFilters: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  isMobile,
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${isMobile ? "text-xs" : ""}`}>
      {searchTerm && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Búsqueda: "{searchTerm}"
          <button
            onClick={() => setSearchTerm("")}
            className="ml-1 hover:text-red-500"
          >
            ×
          </button>
        </Badge>
      )}
      {selectedCategory !== "all" && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Categoría: {selectedCategory}
          <button
            onClick={() => setSelectedCategory("all")}
            className="ml-1 hover:text-red-500"
          >
            ×
          </button>
        </Badge>
      )}
      {selectedBrand !== "all" && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Marca: {selectedBrand}
          <button
            onClick={() => setSelectedBrand("all")}
            className="ml-1 hover:text-red-500"
          >
            ×
          </button>
        </Badge>
      )}
    </div>
  );
};

export default ProductActiveFilters;
