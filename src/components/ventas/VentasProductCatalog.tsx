import React, { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import VentasQuoteModal from "./VentasQuoteModal";
import { useIsMobile } from "@/hooks/use-mobile";

const VentasProductCatalog: React.FC = () => {
  const { products, categories, loading } = useProducts();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [quoteModal, setQuoteModal] = useState<{
    open: boolean;
    product: any;
    quantity: number;
  }>({ open: false, product: null, quantity: 1 });

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.code.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }
    return filtered;
  }, [products, search, category]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mr-4"></span>
        <span className="text-blue-600">Cargando productos...</span>
      </div>
    );
  }

  const handleWhatsAppQuote = (product: any, quantity: number) => {
    setQuoteModal({ open: true, product, quantity });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-brand-navy">Catálogo de Productos</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Buscar por nombre o código"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="md:w-64"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Todas las categorías"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name} {cat.count ? `(${cat.count})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || category !== "all") && (
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCategory("all"); }}>
            Limpiar filtros
          </Button>
        )}
      </div>
      <div>
        <p className="mb-2 text-gray-600">
          Mostrando {filteredProducts.length} de {products.length} productos.
        </p>
      </div>
      {filteredProducts.length > 0 ? (
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onWhatsAppQuote={handleWhatsAppQuote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-2"/>
          <div>No se encontraron productos</div>
        </div>
      )}
      <VentasQuoteModal
        open={quoteModal.open}
        product={quoteModal.product}
        quantity={quoteModal.quantity}
        onClose={() => setQuoteModal({ ...quoteModal, open: false })}
      />
    </div>
  );
};

export default VentasProductCatalog;
