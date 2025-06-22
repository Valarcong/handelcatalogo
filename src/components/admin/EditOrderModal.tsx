import React, { useState } from "react";
import { Pedido } from "@/types/order";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductSearchDialog from "./ProductSearchDialog";
import ProductTable from "./ProductTable";
import OrderSummary from "./OrderSummary";
import { useOrderForm } from "@/hooks/useOrderForm";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditOrderModalProps {
  pedido: Pedido;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Pedido>) => Promise<void>;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ pedido, open, onClose, onSave }) => {
  const { form, setForm, prods, setProds, total } = useOrderForm(pedido);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddProduct = (product: Product) => {
    if (prods.find(pe => pe.product.id === product.id)) return;
    setProds(prev => [...prev, { 
      product, 
      cantidad: 1, 
      precio_venta: product.unitPrice, 
      precio_compra: 0 
    }]);
    setShowAddDialog(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.cliente_id) {
      setError('Falta el cliente.');
      return;
    }
    if (!prods.length) {
      setError('Debes agregar al menos un producto al pedido.');
      return;
    }
    setSaving(true);
    try {
      const prodToStore = prods.map(prod => ({
        id: prod.product.id,
        nombre: prod.product.name,
        codigo: prod.product.code,
        cantidad: Number(prod.cantidad),
        precio_venta: Number(prod.precio_venta),
        precio_compra: Number(prod.precio_compra),
        subtotal: Number(prod.cantidad) * Number(prod.precio_venta),
      }));
      await onSave({
        ...form,
        productos: prodToStore,
        total,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <form
        className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl shadow-lg relative animate-fade-in overflow-y-auto max-h-[95vh]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-3">
          Editar Pedido <Badge>{pedido.numero_orden}</Badge>
        </h2>
        {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
        <div className="mb-4">
          <span className="text-xs text-gray-500 mr-3">Cliente:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <div>
              <label className="text-xs mb-1 block">Nombre cliente</label>
              <Input required value={form.cliente_nombre || ""} disabled />
            </div>
            <div>
              <label className="text-xs mb-1 block">Teléfono</label>
              <Input value={form.cliente_telefono || ""} disabled />
            </div>
          </div>
          <div>
            <label className="text-xs mb-1 block">Email</label>
            <Input value={form.cliente_email || ""} disabled />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs mb-1 block">Observaciones</label>
          <Textarea
            value={form.observaciones || ""}
            onChange={e => setForm({ ...form, observaciones: e.target.value })}
          />
        </div>
        <ProductTable
          prods={prods}
          setProds={setProds}
          onAddProduct={() => setShowAddDialog(true)}
          alreadySelectedIds={prods.map(p => p.product.id)}
        />
        <ProductSearchDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSelect={handleAddProduct}
          alreadySelectedIds={prods.map(p => p.product.id)}
        />
        <OrderSummary
          estado={form.estado}
          setEstado={estado => setForm({ ...form, estado })}
          total={total}
        />
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderModal;
