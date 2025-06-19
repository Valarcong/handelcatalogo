
import React, { useState } from "react";
import { useSuppliers, Supplier } from "@/hooks/useSuppliers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const emptySupplier: Partial<Supplier> = {
  nombre: "",
  email: "",
  telefono: "",
  direccion: "",
  contacto: "",
  observaciones: "",
};

const SupplierManagement: React.FC = () => {
  const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier, refresh } = useSuppliers();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptySupplier);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSupplier(editingId, form);
        toast({ title: "Proveedor actualizado" });
      } else {
        await addSupplier(form as any);
        toast({ title: "Proveedor agregado" });
      }
      setForm(emptySupplier);
      setEditingId(null);
    } catch (err) {
      toast({ title: "Error", description: String((err as Error).message), variant: "destructive" });
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setForm({
      nombre: supplier.nombre,
      email: supplier.email || "",
      telefono: supplier.telefono || "",
      direccion: supplier.direccion || "",
      contacto: supplier.contacto || "",
      observaciones: supplier.observaciones || "",
    });
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Eliminar proveedor "${nombre}"?`)) {
      try {
        await deleteSupplier(id);
        toast({ title: "Proveedor eliminado" });
      } catch (err) {
        toast({ title: "Error", description: String((err as Error).message), variant: "destructive" });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptySupplier);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 mb-8">
        <h2 className="font-bold mb-2 text-xl">{editingId ? "Editar Proveedor" : "Agregar Proveedor"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input placeholder="Nombre*" name="nombre" value={form.nombre || ""} onChange={handleFormChange} required />
          </div>
          <div>
            <Input placeholder="Email" name="email" value={form.email || ""} onChange={handleFormChange} />
          </div>
          <div>
            <Input placeholder="Teléfono" name="telefono" value={form.telefono || ""} onChange={handleFormChange} />
          </div>
          <div>
            <Input placeholder="Contacto" name="contacto" value={form.contacto || ""} onChange={handleFormChange} />
          </div>
          <div className="sm:col-span-2">
            <Input placeholder="Dirección" name="direccion" value={form.direccion || ""} onChange={handleFormChange} />
          </div>
          <div className="sm:col-span-2">
            <textarea
              className="w-full rounded border border-input bg-background p-2 text-base min-h-[40px] resize-vertical"
              placeholder="Observaciones"
              name="observaciones"
              value={form.observaciones || ""}
              onChange={handleFormChange}
            />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit">{editingId ? "Guardar cambios" : "Agregar"}</Button>
            {editingId && <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>}
          </div>
        </form>
      </Card>
      <h3 className="mb-2 font-bold text-lg">Proveedores registrados</h3>
      {loading ? (
        <div className="py-6 text-center text-gray-500">Cargando...</div>
      ) : suppliers.length === 0 ? (
        <div className="py-6 text-center text-gray-500">No hay proveedores registrados.</div>
      ) : (
        <div className="space-y-3">
          {suppliers.map(s => (
            <Card key={s.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{s.nombre}</div>
                <div className="text-xs text-gray-500">{s.direccion}</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {s.email && <Badge variant="outline">📧 {s.email}</Badge>}
                  {s.telefono && <Badge variant="secondary">📱 {s.telefono}</Badge>}
                  {s.contacto && <Badge variant="default">👤 {s.contacto}</Badge>}
                </div>
                {s.observaciones && (
                  <div className="mt-1 text-xs text-gray-400">📝 {s.observaciones}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(s)}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id, s.nombre)}>Eliminar</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
