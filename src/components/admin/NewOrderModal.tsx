import React, { useState, useEffect } from "react";
import { Pedido } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductSearchDialog from "./ProductSearchDialog";
import ProductTable from "./ProductTable";
import OrderSummary from "./OrderSummary";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useClienteSelector } from "@/hooks/useClienteSelector";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Pedido>) => Promise<void>;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ open, onClose, onSave }) => {
  const { form, setForm, prods, setProds, total, allProducts } = useOrderForm(null);
  const { clientes } = useClienteSelector();
  const [clienteSearch, setClienteSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setClienteSearch("");
  }, [open]);

  // Mantener datos sincronizados al elegir cliente
  useEffect(() => {
    if (form.cliente_id && clientes.length > 0) {
      const found = clientes.find(c => c.id === form.cliente_id);
      if (found) {
        setForm({
          ...form,
          cliente_nombre: found.nombre,
          cliente_telefono: found.telefono || "",
          cliente_email: found.email || "",
          cliente_id: found.id
        });
      }
    }
    // eslint-disable-next-line
  }, [form.cliente_id, clientes]);

  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(clienteSearch.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(clienteSearch.toLowerCase())
  );
  const selectedCliente = form.cliente_id ? clientes.find(c => c.id === form.cliente_id) : null;
  const showSelectedOnTop = selectedCliente && !filteredClientes.some(c => c.id === selectedCliente.id);

  const handleAddProduct = (product) => {
    if (prods.find(pe => pe.product.id === product.id)) return;
    setProds(prev => [...prev, { product, cantidad: 1, precio: product.unitPrice }]);
    setShowAddDialog(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.cliente_id) {
      setError('Debes seleccionar un cliente.');
      return;
    }
    if (!prods.length) {
      setError('Debes agregar al menos un producto al pedido.');
      return;
    }
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <form
        className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl shadow-lg relative animate-fade-in overflow-y-auto max-h-[95vh]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-3">
          Nuevo Pedido
        </h2>
        {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
        <div className="mb-4">
          <span className="text-xs text-gray-500 mr-3">Selecciona cliente:</span>
          <Select
            value={form.cliente_id || ""}
            onValueChange={id => setForm({ ...form, cliente_id: id })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona cliente" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1 sticky top-0 bg-popover z-10">
                <Input
                  autoFocus
                  placeholder="Buscar cliente por nombre o email..."
                  value={clienteSearch}
                  onChange={e => setClienteSearch(e.target.value)}
                  className="mb-2"
                />
              </div>
              {showSelectedOnTop && selectedCliente && (
                <SelectItem value={selectedCliente.id} key={selectedCliente.id}>
                  {selectedCliente.nombre} - {selectedCliente.email || selectedCliente.telefono || "sin contacto"} (actual)
                </SelectItem>
              )}
              {filteredClientes.length === 0 ? (
                <div className="px-3 py-2 text-gray-400 text-sm">No hay clientes coincidentes</div>
              ) : (
                filteredClientes.map(c => (
                  <SelectItem value={c.id} key={c.id}>
                    {c.nombre} - {c.email || c.telefono || "sin contacto"}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs mb-1 block">Nombre cliente</label>
            <Input required value={form.cliente_nombre || ""} disabled />
          </div>
          <div>
            <label className="text-xs mb-1 block">Teléfono</label>
            <Input value={form.cliente_telefono || ""} disabled />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs mb-1 block">Email</label>
          <Input value={form.cliente_email || ""} disabled />
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
            {saving ? "Guardando..." : "Crear Pedido"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewOrderModal; 