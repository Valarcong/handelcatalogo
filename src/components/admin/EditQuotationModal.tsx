import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductSearchDialog from "./ProductSearchDialog";
import { useClienteSelector } from "@/hooks/useClienteSelector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import type { Cotizacion, CotizacionProducto } from '@/hooks/useCotizaciones';

interface EditQuotationModalProps {
  open: boolean;
  onClose: () => void;
  cotizacion: Cotizacion | null;
  onUpdated: () => void;
}

const EditQuotationModal: React.FC<EditQuotationModalProps> = ({ open, onClose, cotizacion, onUpdated }) => {
  const { clientes } = useClienteSelector();
  const [form, setForm] = useState<{ observaciones: string }>({ observaciones: "" });
  const [prods, setProds] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && cotizacion) {
      setForm({ observaciones: cotizacion.observaciones || "" });
      supabase.from('cotizacion_productos').select('*').eq('cotizacion_id', cotizacion.id).then(({ data }) => {
        setProds((data || []).map(prod => {
          const p: any = { ...prod };
          p.precio_compra = p.precio_compra ?? 0;
          p.margen = p.margen ?? (p.precio_compra > 0 ? ((p.precio_unitario - p.precio_compra) / p.precio_compra) * 100 : 0);
          p.precio_unitario = p.precio_unitario ?? 0;
          return p;
        }));
      });
    } else {
      setProds([] as any[]);
      setForm({ observaciones: "" });
    }
    setError(null);
  }, [open, cotizacion]);

  const selectedCliente = cotizacion && cotizacion.cliente_id ? clientes.find(c => c.id === cotizacion.cliente_id) : null;

  const handleAddProduct = (product) => {
    if (prods.some(pe => pe.producto_id === product.id)) return;
    setProds(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        cotizacion_id: cotizacion!.id,
        producto_id: product.id,
        nombre_producto: product.name,
        cantidad: 1,
        precio_unitario: product.unitPrice,
        precio_total: product.unitPrice,
        observaciones: ""
      }
    ]);
    setShowAddDialog(false);
  };

  const handleQtyChange = (idx: number, qty: number) => {
    if (qty < 1) return;
    setProds(p => p.map((prod, i) => i === idx ? { ...prod, cantidad: qty, precio_total: prod.precio_unitario * qty } : prod));
  };

  const handlePriceCompraChange = (idx: number, price: number) => {
    setProds(p => p.map((prod, i) =>
      i === idx
        ? { ...prod, precio_compra: price, precio_unitario: Number((price * (1 + (prod as any).margen / 100)).toFixed(2)) }
        : prod
    ));
  };

  const handleMargenChange = (idx: number, margen: number) => {
    setProds(p => p.map((prod, i) =>
      i === idx
        ? { ...prod, margen, precio_unitario: Number(((prod as any).precio_compra ?? 0) * (1 + margen / 100)).toFixed(2) }
        : prod
    ));
  };

  const handlePriceVentaChange = (idx: number, price: number) => {
    setProds(p => p.map((prod, i) => i === idx ? { ...prod, precio_unitario: price } : prod));
  };

  const handleRemove = (idx: number) => {
    setProds(p => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!cotizacion?.cliente_id) {
      setError('Falta el cliente.');
      return;
    }
    if (!prods.length) {
      setError('Debes agregar al menos un producto a la cotización.');
      return;
    }
    setSaving(true);
    try {
      await supabase
        .from('cotizaciones')
        .update({ observaciones: form.observaciones, updated_at: new Date().toISOString() })
        .eq('id', cotizacion.id);
      await supabase.from('cotizacion_productos').delete().eq('cotizacion_id', cotizacion.id);
      const productosToInsert = prods.map(prod => ({
        cotizacion_id: cotizacion.id,
        producto_id: prod.producto_id,
        nombre_producto: prod.nombre_producto,
        cantidad: prod.cantidad,
        precio_unitario: prod.precio_unitario,
        precio_total: prod.precio_total,
        precio_compra: prod.precio_compra ?? 0,
        margen: prod.margen ?? 0,
        observaciones: prod.observaciones || ""
      }));
      await supabase.from('cotizacion_productos').insert(productosToInsert);
      onUpdated();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Error al actualizar la cotización.');
    } finally {
      setSaving(false);
    }
  };

  if (!open || !cotizacion) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <form
        className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl shadow-lg relative animate-fade-in overflow-y-auto max-h-[95vh]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-3">
          Editar Cotización
        </h2>
        {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
        <div className="mb-4">
          <span className="text-xs text-gray-500 mr-3">Cliente:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs mb-1 block">Nombre cliente</label>
            <Input required value={selectedCliente?.nombre || ""} disabled />
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
        <div className="mb-4">
          <label className="text-xs mb-1 block">Productos</label>
          <table className="min-w-full bg-transparent text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left font-semibold">Producto</th>
                <th className="px-2 py-1 font-semibold">Cantidad</th>
                <th className="px-2 py-1 font-semibold">Precio compra</th>
                <th className="px-2 py-1 font-semibold">Margen (%)</th>
                <th className="px-2 py-1 font-semibold">Precio venta</th>
                <th className="px-2 py-1 font-semibold">Subtotal</th>
                <th className="px-2 py-1 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {prods.map((prod, idx) => (
                <tr key={prod.id || prod.producto_id}>
                  <td className="px-2 py-1">{prod.nombre_producto}</td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      min={1}
                      value={prod.cantidad}
                      onChange={e => handleQtyChange(idx, Number(e.target.value))}
                      className="w-20"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={(prod as any).precio_compra ?? 0}
                      onChange={e => handlePriceCompraChange(idx, Number(e.target.value))}
                      className="w-24"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={(prod as any).margen ?? 10}
                      onChange={e => handleMargenChange(idx, Number(e.target.value))}
                      className="w-16"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={prod.precio_unitario}
                      onChange={e => handlePriceVentaChange(idx, Number(e.target.value))}
                      className="w-24"
                    />
                  </td>
                  <td className="px-2 py-1 text-right">
                    USD {(prod.precio_unitario * prod.cantidad).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-2 py-1">
                    <Button type="button" variant="destructive" size="icon" onClick={() => handleRemove(idx)}>
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button type="button" variant="outline" className="mt-2" onClick={() => setShowAddDialog(true)}>
            + Agregar producto
          </Button>
        </div>
        <ProductSearchDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSelect={handleAddProduct}
          alreadySelectedIds={prods.map(p => p.producto_id)}
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

export default EditQuotationModal; 