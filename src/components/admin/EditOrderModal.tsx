
import React, { useState } from "react";
import { Pedido } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductSearchDialog from "./ProductSearchDialog";
import OrderFormFields from "./OrderFormFields";
import ProductTable from "./ProductTable";
import OrderSummary from "./OrderSummary";
import { useOrderForm } from "@/hooks/useOrderForm";

interface EditOrderModalProps {
  pedido: Pedido | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Pedido>) => Promise<void>;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  pedido,
  open,
  onClose,
  onSave,
}) => {
  const {
    form, setForm,
    prods, setProds,
    total, allProducts
  } = useOrderForm(pedido);

  const [saving, setSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (!open || !pedido) return null;

  // Agregar producto
  const handleAddProduct = (product) => {
    if (prods.find(pe => pe.product.id === product.id)) return;
    setProds(prev => [...prev, { product, cantidad: 1, precio: product.unitPrice }]);
    setShowAddDialog(false);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const prodToStore = prods.map(prod => ({
        nombre: prod.product.name,
        cantidad: Number(prod.cantidad),
        precio: Number(prod.precio),
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <form
        className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative animate-fade-in"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-3">
          Editar Pedido <Badge>{pedido.numero_orden}</Badge>
        </h2>

        <OrderFormFields form={form} setForm={setForm} />

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

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderModal;
