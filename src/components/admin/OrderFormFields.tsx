import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pedido } from "@/types/order";
import { useClienteSelector } from "@/hooks/useClienteSelector";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface Props {
  form: Partial<Pedido>;
  setForm: (f: Partial<Pedido>) => void;
}

const OrderFormFields: React.FC<Props> = ({ form, setForm }) => {
  const { clientes } = useClienteSelector();
  const [clienteSearch, setClienteSearch] = useState("");

  // Reiniciar búsqueda al abrir/cambiar pedido
  useEffect(() => {
    setClienteSearch("");
  }, [form.cliente_id]);

  // Mantener datos sincronizados al elegir cliente manualmente
  useEffect(() => {
    if (form.cliente_id && clientes.length > 0) {
      const found = clientes.find(c => c.id === form.cliente_id);
      if (found) {
        setForm({
          ...form,
          cliente_nombre: found.es_empresa ? found.razon_social || found.nombre : found.nombre,
          cliente_telefono: found.telefono || "",
          cliente_email: found.email || "",
          cliente_id: found.id
        });
      }
    }
    // eslint-disable-next-line
  }, [form.cliente_id, clientes]);

  // Filtrar clientes según búsqueda
  const filteredClientes = clientes.filter(c =>
    c?.nombre?.toLowerCase().includes(clienteSearch.toLowerCase()) ||
    (c?.email || "").toLowerCase().includes(clienteSearch.toLowerCase()) ||
    (c?.es_empresa && c?.razon_social?.toLowerCase().includes(clienteSearch.toLowerCase())) ||
    (c?.es_empresa && c?.ruc?.toLowerCase().includes(clienteSearch.toLowerCase()))
  );
  // Si el cliente seleccionado no está en el filtro, mostrarlo arriba
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

  const getClienteContactInfo = (cliente: any) => {
    if (!cliente) return "sin contacto";
    return cliente.email || cliente.telefono || "sin contacto";
  };

  return (
    <>
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
          <Input
            required
            value={form.cliente_nombre || ""}
            disabled
          />
        </div>
        <div>
          <label className="text-xs mb-1 block">Teléfono</label>
          <Input
            value={form.cliente_telefono || ""}
            disabled
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="text-xs mb-1 block">Email</label>
        <Input
          value={form.cliente_email || ""}
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="text-xs mb-1 block">Observaciones</label>
        <Textarea
          value={form.observaciones || ""}
          onChange={e => setForm({ ...form, observaciones: e.target.value })}
        />
      </div>
    </>
  );
};

export default OrderFormFields;
