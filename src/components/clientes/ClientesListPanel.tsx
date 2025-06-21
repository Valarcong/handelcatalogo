import React, { useState, useEffect } from "react";
import { useClientes } from "@/hooks/useClientes";
import { useOrders } from '@/hooks/useOrders';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { generatePedidoPDF } from '@/utils/generatePedidoPDF';
import { generateClientesReportPDF } from '@/utils/generateReportPDF';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ClienteFormProps {
  cliente: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const emptyCliente = { 
  nombre: "", 
  telefono: "", 
  email: "", 
  es_empresa: false,
  ruc: "",
  razon_social: ""
};

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onSave, onCancel }) => {
  const [form, setForm] = useState(cliente || emptyCliente);  
  
  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <div className="flex items-center space-x-2">
        <Checkbox
          id="es_empresa"
          checked={form.es_empresa || false}
          onCheckedChange={(checked) => 
            setForm({ ...form, es_empresa: checked as boolean })
          }
        />
        <Label htmlFor="es_empresa" className="text-sm font-medium">
          Es empresa
        </Label>
      </div>

      {form.es_empresa ? (
        // Campos para empresa
        <>
          <Input
            required
            placeholder="Razón Social"
            value={form.razon_social || ""}
            onChange={e => setForm({ ...form, razon_social: e.target.value })}
          />
          <Input
            placeholder="RUC"
            value={form.ruc || ""}
            onChange={e => setForm({ ...form, ruc: e.target.value })}
          />
          <Input
            placeholder="Nombre de contacto (opcional)"
            value={form.nombre || ""}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
          />
        </>
      ) : (
        // Campos para persona
        <Input
          required
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
        />
      )}

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
      
      <div className="flex gap-2 mt-4">
        <Button type="submit" variant="default">Guardar</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
};

const ClientesListPanel: React.FC = () => {
  const { clientes, fetchClientes, saveCliente, isLoading } = useClientes();
  const { pedidos, fetchPedidos, loading: loadingPedidos } = useOrders();
  const [showForm, setShowForm] = useState(false);
  const [editCliente, setEditCliente] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalView, setModalView] = useState<"pedidos" | "detalle" | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<any | null>(null);
  const [detallePedido, setDetallePedido] = useState<any | null>(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    fetchClientes();
    fetchPedidos();
  }, []);

  const filteredClientes = clientes.filter(
    c =>
      c?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      (c?.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (c?.es_empresa && c?.razon_social?.toLowerCase().includes(search.toLowerCase())) ||
      (c?.es_empresa && c?.ruc?.toLowerCase().includes(search.toLowerCase()))
  );

  const pedidosCliente = pedidos.filter(p =>
    selectedCliente && p.cliente_id === selectedCliente.id &&
    (!fechaDesde || new Date(p.created_at) >= new Date(fechaDesde)) &&
    (!fechaHasta || new Date(p.created_at) <= new Date(fechaHasta))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
        <Input
          placeholder="Buscar por nombre, email, RUC o razón social..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64"
        />
        <div className="flex gap-2">
          <Button onClick={() => { setShowForm(true); setEditCliente(null); }}>
            + Nuevo Cliente
          </Button>
          <Button variant="outline" onClick={() => {
            const clientesConExtras = filteredClientes.map(cliente => ({
              ...cliente,
              fecha_registro: cliente.creado_en ? cliente.creado_en.slice(0, 10) : undefined,
              cantidad_ordenes: pedidos.filter(p => p.cliente_id === cliente.id).length
            }));
            generateClientesReportPDF(clientesConExtras);
          }}>
            Exportar PDF
          </Button>
        </div>
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
                    <div className="flex-1">
                      <div className="font-semibold text-brand-navy">
                        <Link to={`/clientes/${cliente.id}`} className="hover:underline">
                          {cliente?.es_empresa ? cliente?.razon_social || cliente?.nombre : cliente?.nombre}
                        </Link>
                        {cliente?.es_empresa && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Empresa
                          </span>
                        )}
                      </div>
                      {cliente?.es_empresa && cliente?.ruc && (
                        <div className="text-xs text-gray-600">RUC: {cliente.ruc}</div>
                      )}
                      {cliente?.es_empresa && cliente?.nombre && cliente?.nombre !== cliente?.razon_social && (
                        <div className="text-sm text-gray-700">Contacto: {cliente.nombre}</div>
                      )}
                      <div className="text-sm text-gray-700">{cliente.email || "—"}</div>
                      <div className="text-xs text-gray-500">{cliente.telefono || "—"}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setEditCliente(cliente); setShowForm(true); }}
                      >Editar</Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedCliente(cliente);
                          setModalView("pedidos");
                          setModalOpen(true);
                        }}
                      >Ver Pedidos</Button>
                    </div>
                  </div>
                ))}
        </div>
      </div>
      <Dialog open={modalOpen} onOpenChange={(open) => {
        if (!open) {
          setModalOpen(false);
          setModalView(null);
          setDetallePedido(null);
          setSelectedCliente(null);
        }
      }}>
        <DialogContent className="max-w-2xl bg-gray-900 border-2 border-gray-800 rounded-xl shadow-2xl">
          {modalView === "pedidos" && selectedCliente && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-yellow-300 uppercase tracking-wider">
                  Pedidos de {selectedCliente.nombre}
                </DialogTitle>
              </DialogHeader>
              <div className="flex gap-2 mb-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Desde</label>
                  <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-100" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Hasta</label>
                  <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-100" />
                </div>
                <Button size="sm" variant="outline" className="self-end" onClick={() => { setFechaDesde(""); setFechaHasta(""); }}>Limpiar</Button>
              </div>
              {loadingPedidos ? (
                <div className="text-gray-400">Cargando pedidos...</div>
              ) : pedidosCliente.length === 0 ? (
                <div className="text-gray-400">No hay pedidos para este cliente en el rango seleccionado.</div>
              ) : (
                <div className="divide-y divide-gray-800 border rounded-lg overflow-hidden">
                  {pedidosCliente.map((pedido) => (
                    <div key={pedido.id} className="p-4 bg-gray-800 hover:bg-gray-700 transition flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-bold text-gray-100">Orden #{pedido.numero_orden || pedido.id.slice(-6)}</div>
                        <div className="text-gray-300 text-sm">Estado: <span className="font-semibold">{pedido.estado}</span></div>
                        <div className="text-gray-400 text-xs">Fecha: {format(new Date(pedido.created_at), 'yyyy-MM-dd HH:mm')}</div>
                      </div>
                      <Button size="sm" variant="secondary" className="mt-2 md:mt-0" onClick={() => {
                        setDetallePedido(pedido);
                        setModalView("detalle");
                      }}>
                        Ver detalle
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {modalView === "detalle" && detallePedido && (
            <>
              <h3 className="text-lg font-bold mb-2 text-white">
                Detalle Orden #{detallePedido.numero_orden || detallePedido.id.slice(-6)}
              </h3>
              <div className="mb-2 text-sm text-gray-300">
                <div><span className="font-semibold">Estado:</span> {detallePedido.estado}</div>
                <div><span className="font-semibold">Fecha:</span> {format(new Date(detallePedido.created_at), 'yyyy-MM-dd HH:mm')}</div>
                {detallePedido.observaciones && <div><span className="font-semibold">Observaciones:</span> {detallePedido.observaciones}</div>}
              </div>
              <table className="min-w-full text-sm mb-4">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Precio unit.</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detallePedido.productos.map((prod, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 text-white">
                      <td className="p-2">{prod.nombre}</td>
                      <td className="p-2 text-right">{prod.cantidad}</td>
                      <td className="p-2 text-right">S/. {Number(prod.precio).toFixed(2)}</td>
                      <td className="p-2 text-right">S/. {(Number(prod.precio) * Number(prod.cantidad)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mb-2 text-white">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg text-yellow-500">S/. {Number(detallePedido.total).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setModalView("pedidos")}>Volver</Button>
                <Button variant="secondary" onClick={() => generatePedidoPDF(detallePedido)}>Descargar PDF</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientesListPanel;
