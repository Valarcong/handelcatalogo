
import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

interface ProductSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  alreadySelectedIds?: string[];
}

const ProductSearchDialog: React.FC<ProductSearchDialogProps> = ({
  open,
  onClose,
  onSelect,
  alreadySelectedIds = []
}) => {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState("");

  // basic search, but can be expanded to category/brand etc.
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter(
      p =>
        !alreadySelectedIds.includes(p.id) &&
        (p.name.toLowerCase().includes(term) ||
          p.code.toLowerCase().includes(term) ||
          (p.brand && p.brand.toLowerCase().includes(term)) ||
          (p.category && p.category.toLowerCase().includes(term)))
    );
  }, [products, search, alreadySelectedIds]);

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Buscar Producto</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buscar por nombre, código, marca, categoría..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-2"
          autoFocus
        />
        <div className="max-h-80 overflow-y-auto border rounded">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Cargando productos...</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-center text-gray-400">Sin resultados.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="font-semibold text-xs border-b">
                  <th className="p-2">Cód.</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Marca</th>
                  <th className="p-2">Categoría</th>
                  <th className="p-2">Precio (S/.)</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map(prod => (
                  <tr key={prod.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{prod.code}</td>
                    <td className="p-2">{prod.name}</td>
                    <td className="p-2">{prod.brand}</td>
                    <td className="p-2">{prod.category}</td>
                    <td className="p-2">{prod.unitPrice.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</td>
                    <td className="p-2">
                      <Button size="sm" variant="secondary" onClick={() => { onSelect(prod); onClose(); }}>
                        Seleccionar
                      </Button>
                    </td>
                  </tr>
                ))}
                {/* Nota: para virtualizar infinitos, usar react-window */}
              </tbody>
            </table>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSearchDialog;

