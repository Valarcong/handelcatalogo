
import React, { useState, useEffect } from "react";
import { useClientes } from "@/hooks/useClientes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ClienteFormProps {
  cliente: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const emptyCliente = { nombre: "", telefono: "", email: "" };

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onSave, onCancel }) => {
  const [form, setForm] = useState(cliente || emptyCliente);  
  return (
    <form
      className="space-y-2"
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <Input
        required
        placeholder="Nombre completo"
        value={form.nombre}
        onChange={e => setForm({ ...form, nombre: e.target.value })}
      />
      <Input
        placeholder="Teléfono"
        value={form.telefono || ""}
        onChange={e => setForm({ ...form, telefono: e.target.value })}
      />
      <Input
        placeholder="Email"
        value={form.email || ""}
        type="email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <div className="flex gap-2 mt-2">
        <Button type="submit" variant="default">Guardar</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};

const ClientesListPanel: React.FC = () => {
  const { clientes, fetchClientes, saveCliente, isLoading } = useClientes();
  const [showForm, setShowForm] = useState(false);
  const [editCliente, setEditCliente] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClientes();
    // eslint-disable-next-line
  }, []);

  const filteredClientes = clientes.filter(
    c =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (c.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
        <Input
          placeholder="Buscar cliente por nombre o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64"
        />
        <Button onClick={() => { setShowForm(true); setEditCliente(null); }}>
          + Nuevo Cliente
        </Button>
      </div>
      <div>
        {showForm && (
          <Card className="p-4 mb-4">
            <ClienteForm
              cliente={editCliente}
              onSave={async data => {
                await saveCliente(data, editCliente?.id);
                setShowForm(false);
                setEditCliente(null);
              }}
              onCancel={() => { setShowForm(false); setEditCliente(null); }}
            />
          </Card>
        )}

        <div className="divide-y border rounded">
          {isLoading
            ? <div className="p-4 text-blue-500">Cargando clientes...</div>
            : filteredClientes.length === 0
              ? <div className="p-4 text-gray-400">No hay clientes registrados.</div>
              : filteredClientes.map(cliente => (
                  <div
                    key={cliente.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div>
                      <div className="font-semibold text-brand-navy">{cliente.nombre}</div>
                      <div className="text-sm text-gray-700">{cliente.email || "—"}</div>
                      <div className="text-xs text-gray-500">{cliente.telefono || "—"}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditCliente(cliente); setShowForm(true); }}
                    >Editar</Button>
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default ClientesListPanel;
