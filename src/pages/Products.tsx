
// Refactorizado: toda la lógica está dividida en componentes independientes.
import React, { useState, useMemo, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Product } from "@/types/product";
import ProductFilters from "@/components/products/ProductFilters";
import ProductActiveFilters from "@/components/products/ProductActiveFilters";
import ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Search } from "lucide-react";

const Products = () => {
  const { products: rawProducts, categories, loading } = useProducts();
  const isMobile = useIsMobile();

  // Fallback defensivo básico
  const products = useMemo(
    () => Array.isArray(rawProducts) ? rawProducts.filter(Boolean) : [],
    [rawProducts]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");

  const brands = useMemo(() => {
    const set = new Set(
      products
        .filter((p) => typeof p.brand === "string" && p.brand.length > 0)
        .map((p) => p.brand || "omegaplast")
    );
    return Array.from(set);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
    filtered = filtered.filter(
      (product) =>
        product &&
        typeof product.name === "string" &&
        typeof product.code === "string" &&
        typeof product.category === "string"
    );
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(lowerSearch) ||
        product.code.toLowerCase().includes(lowerSearch) ||
        (Array.isArray(product.tags) &&
          product.tags.some(
            (tag) =>
              typeof tag === "string" &&
              tag.toLowerCase().includes(lowerSearch)
          ))
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }
    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    switch (sortBy) {
      case "name":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.unitPrice - b.unitPrice);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.unitPrice - a.unitPrice);
        break;
      case "code":
        filtered = [...filtered].sort((a, b) => a.code.localeCompare(b.code));
        break;
      default:
        break;
    }
    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, selectedBrand]);

  const handleWhatsAppQuote = useCallback((product: Product, quantity: number) => {
    if (!product || typeof product.name !== "string" || typeof product.code !== "string") return;
    const totalPrice =
      (quantity >= 10 ? product.wholesalePrice : product.unitPrice) * quantity;
    const priceType = quantity >= 10 ? "Por Mayor" : "Unitario";
    const message = `¡Hola! Me interesa este producto:

🧾 *${product.name}*
📋 Código: ${product.code}
📦 Cantidad: ${quantity}
💰 Precio ${priceType}: S/. ${(
      quantity >= 10 ? product.wholesalePrice : product.unitPrice
    ).toFixed(2)}
💵 Total: *S/. ${totalPrice.toFixed(2)}*

¿Podrían enviarme más información sobre disponibilidad y tiempo de entrega?

¡Gracias!`;

    const whatsappUrl = `https://wa.me/51970337910?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    // console.log('Cotización WhatsApp:', { product: product.name, quantity, totalPrice });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("name");
    setSelectedBrand("all");
    // console.log('Filtros limpiados');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className={`container mx-auto px-4 ${isMobile ? "py-4" : "py-8"}`}>
          <h1
            className={`text-2xl font-bold text-brand-navy mb-1 ${
              isMobile ? "" : "text-3xl mb-2"
            }`}
          >
            Catálogo de Productos
          </h1>
          <p className={`text-gray-600 ${isMobile ? "text-xs" : ""}`}>
            Encuentra el producto perfecto para tus necesidades. {products.length} productos disponibles.
          </p>
        </div>
      </div>

      <div className={`container mx-auto px-2 ${isMobile ? "py-4" : "py-8"}`}>
        {/* Filtros */}
        <div className={`bg-white rounded-lg shadow-sm ${isMobile ? "p-3 mb-4" : "p-6 mb-8"}`}>
          <ProductFilters
            isMobile={isMobile}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            brands={brands}
            categories={categories}
            clearFilters={clearFilters}
          />
          <ProductActiveFilters
            isMobile={isMobile}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
        </div>

        {/* Resultados */}
        <div className={`mb-4 ${isMobile ? "text-xs" : "mb-6"}`}>
          <p className="text-gray-600">
            Mostrando {filteredAndSortedProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Grid de productos o resultado vacío */}
        {filteredAndSortedProducts.length > 0 ? (
          <ProductGrid
            products={filteredAndSortedProducts}
            onWhatsAppQuote={handleWhatsAppQuote}
            isMobile={isMobile}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500 mb-4">
              Intenta ajustar los filtros o buscar con otros términos.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Limpiar Filtros
            </Button>
          </div>
        )}
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default Products;
