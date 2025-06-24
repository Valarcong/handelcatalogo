import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductSearchDialog from "./ProductSearchDialog";
import ProductTable from "./ProductTable";
import { useClienteSelector } from "@/hooks/useClienteSelector";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';

interface NewQuotationModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const NewQuotationModal: React.FC<NewQuotationModalProps> = ({ open, onClose, onCreated }) => {
  const { clientes } = useClienteSelector();
  const [clienteSearch, setClienteSearch] = useState("");
  const [form, setForm] = useState<any>({ cliente_id: "", observaciones: "" });
  const [prods, setProds] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setClienteSearch("");
    setForm({ cliente_id: "", observaciones: "" });
    setProds([]);
    setError(null);
  }, [open]);

  const filteredClientes = clientes.filter(c =>
    c?.nombre?.toLowerCase().includes(clienteSearch.toLowerCase()) ||
    (c?.email || "").toLowerCase().includes(clienteSearch.toLowerCase()) ||
    (c?.es_empresa && c?.razon_social?.toLowerCase().includes(clienteSearch.toLowerCase())) ||
    (c?.es_empresa && c?.ruc?.toLowerCase().includes(clienteSearch.toLowerCase()))
  );
  const selectedCliente = form.cliente_id ? clientes.find(c => c.id === form.cliente_id) : null;
  const showSelectedOnTop = selectedCliente && !filteredClientes.some(c => c.id === selectedCliente.id);

  const getClienteDisplayName = (cliente: any) => {
    if (!cliente) return "";
    if (cliente.es_empresa) {
      const displayName = cliente.razon_social || cliente.nombre || "";
      const contactInfo = cliente.nombre && cliente.nombre !== cliente.razon_social 
        ? ` (${cliente.nombre})` 
        : '';
      return `${displayName}${contactInfo}`;
    }
    return cliente.nombre || "";
  };

  const getClienteDisplayInfo = (cliente: any) => {
    if (!cliente) return "";
    if (cliente.es_empresa) {
      return cliente.razon_social || cliente.nombre || "";
    }
    return cliente.nombre || "";
  };

  const handleAddProduct = (product) => {
    if (prods.find(pe => pe.product.id === product.id)) return;
    const precio_compra = product.unitPrice || 0;
    const margen = 10;
    const precio_venta = Number((precio_compra * (1 + margen / 100)).toFixed(2));
    setProds(prev => [...prev, { product, cantidad: 1, precio_compra, margen, precio_venta }]);
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
      setError('Debes agregar al menos un producto a la cotización.');
      return;
    }
    setSaving(true);
    try {
      // Insertar cabecera de cotización
      const cliente = clientes.find(c => c.id === form.cliente_id);
      const { data: cotizacion, error: err1 } = await supabase
        .from('cotizaciones')
        .insert({
          cliente_id: cliente.id,
          estado: 'pendiente',
          observaciones: form.observaciones,
          razon_social: cliente.razon_social || null,
          nombre_cliente: cliente.nombre,
          ruc: cliente.ruc || null,
          creado_en: new Date().toISOString(),
        })
        .select()
        .single();
      if (err1) throw err1;
      // Insertar productos asociados
      const productosToInsert = prods.map(prod => ({
        cotizacion_id: cotizacion.id,
        producto_id: prod.product.id,
        nombre_producto: prod.product.name,
        cantidad: Number(prod.cantidad),
        precio_unitario: Number(prod.precio_venta ?? 0),
        precio_compra: Number(prod.precio_compra ?? 0),
        margen: Number(prod.margen ?? 0),
        // Puedes agregar más campos si tu tabla los tiene
      }));
      const { error: err2 } = await supabase
        .from('cotizacion_productos')
        .insert(productosToInsert);
      if (err2) throw err2;
      onCreated();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Error al crear la cotización.');
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
          Nueva Cotización
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
                  placeholder="Buscar por nombre, email, RUC o razón social..."
                  value={clienteSearch}
                  onChange={e => setClienteSearch(e.target.value)}
                  className="mb-2"
                />
              </div>
              {showSelectedOnTop && selectedCliente && (
                <SelectItem value={selectedCliente.id} key={selectedCliente.id}>
                  {getClienteDisplayName(selectedCliente)}
                </SelectItem>
              )}
              {filteredClientes.length === 0 ? (
                <div className="px-3 py-2 text-gray-400 text-sm">No hay clientes coincidentes</div>
              ) : (
                filteredClientes.map(c => (
                  <SelectItem value={c.id} key={c.id}>
                    {getClienteDisplayName(c)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs mb-1 block">Nombre cliente</label>
            <Input required value={getClienteDisplayInfo(selectedCliente)} disabled />
          </div>
          <div>
            <label className="text-xs mb-1 block">Teléfono</label>
            <Input value={selectedCliente?.telefono || ""} disabled />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs mb-1 block">Email</label>
          <Input value={selectedCliente?.email || ""} disabled />
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
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? "Guardando..." : "Crear Cotización"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewQuotationModal; 