
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pedido, PedidoEstado } from "@/types/order";
import { PEDIDO_ESTADOS } from "@/types/order";
import { useClienteSelector } from "@/hooks/useClienteSelector";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Props {
  form: Partial<Pedido>;
  setForm: (f: Partial<Pedido>) => void;
}

const OrderFormFields: React.FC<Props> = ({ form, setForm }) => {
  const { clientes, setSearch, loading } = useClienteSelector();
  const [clienteMode, setClienteMode] = useState<"existente" | "nuevo">(
    form.cliente_id ? "existente" : "nuevo"
  );
  const [clienteSearch, setClienteSearch] = useState<string>("");

  // Mantener datos sincronizados al elegir cliente existente
  useEffect(() => {
    if (clienteMode === "existente" && form.cliente_id && clientes.length > 0) {
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
  }, [form.cliente_id, clientes, clienteMode]);

  return (
    <>
      <div className="mb-4">
        <span className="text-xs text-gray-500 mr-3">Selecciona cliente:</span>
        <Button
          type="button"
          size="sm"
          variant={clienteMode === "existente" ? "default" : "outline"}
          className="mr-2"
          onClick={() => setClienteMode("existente")}
        >
          Cliente existente
        </Button>
        <Button
          type="button"
          size="sm"
          variant={clienteMode === "nuevo" ? "default" : "outline"}
          onClick={() => setClienteMode("nuevo")}
        >
          Nuevo cliente
        </Button>
      </div>

      {clienteMode === "existente" ? (
        <div className="mb-4">
          <span className="text-xs text-gray-400">Buscar:</span>
          <Input
            placeholder="Buscar cliente por nombre o email..."
            value={clienteSearch}
            onChange={e => {
              setClienteSearch(e.target.value);
              setSearch(e.target.value);
            }}
            className="mb-2"
          />
          <Select
            value={form.cliente_id || ""}
            onValueChange={id => setForm({ ...form, cliente_id: id })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientes.length === 0 ? (
                <SelectItem value="" disabled>No hay clientes coincidentes</SelectItem>
              ) : (
                clientes
                  .filter(c =>
                    c.nombre.toLowerCase().includes(clienteSearch.toLowerCase()) ||
                    (c.email || "").toLowerCase().includes(clienteSearch.toLowerCase())
                  )
                  .map(c => (
                    <SelectItem value={c.id} key={c.id}>
                      {c.nombre} - {c.email || c.telefono || "sin contacto"}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs mb-1 block">Nombre cliente</label>
          <Input
            required
            value={form.cliente_nombre || ""}
            onChange={e => setForm({ ...form, cliente_nombre: e.target.value })}
            disabled={clienteMode === "existente"}
          />
        </div>
        <div>
          <label className="text-xs mb-1 block">Teléfono</label>
          <Input
            value={form.cliente_telefono || ""}
            onChange={e => setForm({ ...form, cliente_telefono: e.target.value })}
            disabled={clienteMode === "existente"}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="text-xs mb-1 block">Email</label>
        <Input
          value={form.cliente_email || ""}
          onChange={e => setForm({ ...form, cliente_email: e.target.value })}
          disabled={clienteMode === "existente"}
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
