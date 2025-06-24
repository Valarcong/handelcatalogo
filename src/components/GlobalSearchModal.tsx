import React, { useEffect, useState, useMemo } from "react";
import { CommandDialog, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface GlobalSearchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, setOpen }) => {
  const { products, categories, loading } = useProducts();
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // Agrupar y filtrar productos por búsqueda
  const groupedResults = useMemo(() => {
    const query = input.trim().toLowerCase();
    if (!query) return [];

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.code.toLowerCase().includes(query) ||
        product.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
        (product.description || "").toLowerCase().includes(query)
    );

    // Agrupa por categoría
    const categoriesMap: { [key: string]: typeof filtered } = {};
    filtered.forEach((product) => {
      if (!categoriesMap[product.category]) categoriesMap[product.category] = [];
      categoriesMap[product.category].push(product);
    });
    return Object.entries(categoriesMap);
  }, [input, products]);

  // Atajo de teclado para cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [open]);

  // Al hacer click en resultado, navega y cierra modal
  const handleSelect = (productId: string) => {
    setOpen(false);
    navigate(`/productos?highlight=${productId}`);
  };

  // Mostrar todos los resultados (redirigir a /productos con término)
  const handleShowAll = () => {
    if (input.trim()) {
      setOpen(false);
      navigate(`/productos?search=${encodeURIComponent(input.trim())}`);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Buscar productos por nombre, código o categoría..."
        value={input}
        onValueChange={setInput}
        autoFocus
      />
      <div className="px-3 pt-1 pb-2 flex flex-row items-center justify-between text-xs text-gray-500 bg-white border-b">
        <span>
          {groupedResults.length > 0
            ? `Resultados: ${groupedResults.reduce((acc, [_, prods]) => acc + prods.length, 0)}`
            : input
              ? "Sin resultados"
              : "Escribe para buscar productos..."}
        </span>
        <button
          className="underline hover:text-blue-700"
          disabled={!input.trim()}
          onClick={handleShowAll}
        >
          Ver todos en catálogo
        </button>
      </div>
      <CommandList>
        {loading && (
          <CommandEmpty>Buscando...</CommandEmpty>
        )}
        {!loading && (groupedResults.length === 0 && input.trim()) && (
          <CommandEmpty>No se encontraron productos con ese criterio.</CommandEmpty>
        )}
        {!loading && groupedResults.map(([cat, prods]) => (
          <CommandGroup key={cat} heading={cat}>
            {prods.map((product) => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={() => handleSelect(product.id)}
              >
                <span className="font-medium">{product.name}</span>
                <Badge className="mx-2" variant="outline">{product.code}</Badge>
                <span className="text-sm text-muted-foreground">S/. {product.unitPrice}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
      {/* Sugerencias/populares pueden implementarse futuro */}
    </CommandDialog>
  );
};

export default GlobalSearchModal;
