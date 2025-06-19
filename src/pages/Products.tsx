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
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 pb-10">
      <section className="container mx-auto px-4 pt-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-6 text-center drop-shadow-xl tracking-widest uppercase">
          Catálogo de Productos
        </h1>
        {/* Barra de búsqueda y filtro */}
        <form className="w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-center bg-gray-900/80 rounded-xl shadow-2xl p-4 border-2 border-gray-700 backdrop-blur mb-8">
          <input
            type="text"
            placeholder="Buscar productos, marcas, códigos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
          />
          <select
            className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px] text-lg font-semibold"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </form>
        {/* Grid de productos */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-300 ml-4">Cargando productos...</p>
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map((product) => (
              <div key={product.id} className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow p-6 flex flex-col items-center relative group border-2 border-gray-700">
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2 z-10">
                  {product.tags?.includes('Nuevo') && (
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">Nuevo</span>
                  )}
                  {product.tags?.includes('Oferta') && (
                    <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">Oferta</span>
                  )}
                </div>
                {/* Imagen (enlace) */}
                <Link to={`/producto/${product.id}`} className="block w-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-contain mb-4 mx-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-xl bg-gray-900 rounded-lg p-2 border border-gray-700"
                  />
                </Link>
                {/* Nombre (enlace) */}
                <Link to={`/producto/${product.id}`} className="block w-full">
                  <h3 className="font-extrabold text-base text-gray-100 mb-1 text-center line-clamp-2 hover:underline uppercase tracking-wider drop-shadow">{product.name}</h3>
                </Link>
                {/* Precio */}
                <div className="text-yellow-300 font-extrabold text-base mb-2 drop-shadow">S/. {product.unitPrice.toFixed(2)}</div>
                {/* Botón WhatsApp */}
                <button
                  onClick={() => {
                    const message = `¡Hola! Me interesa este producto:\n\n🧾 *${product.name}*\n📋 Código: ${product.code}\n💰 Precio Unitario: S/. ${product.unitPrice.toFixed(2)}\n¿Podrían enviarme más información sobre disponibilidad y tiempo de entrega?\n\n¡Gracias!`;
                    const whatsappUrl = `https://wa.me/51970337910?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="mt-auto w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg tracking-wider text-lg border-2 border-green-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.007 4.003A9.967 9.967 0 0012 2C6.477 2 2 6.477 2 12c0 1.657.404 3.22 1.116 4.59L2 22l5.527-1.09A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10 0-2.652-1.032-5.073-2.993-6.997z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.243 15.657a4 4 0 01-5.657-5.657" />
                  </svg>
                  Cotizar por WhatsApp
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <Package className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No hay productos disponibles en esta categoría o búsqueda</p>
          </div>
        )}
      </section>
      <WhatsAppButton />
    </div>
  );
};

export default Products;
