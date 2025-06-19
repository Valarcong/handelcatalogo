import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClientes } from '@/hooks/useClientes';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { generatePedidoPDF } from '@/utils/generatePedidoPDF';
import { Dialog } from '@/components/ui/dialog';

const ClienteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { clientes, fetchClientes } = useClientes();
  const { pedidos, fetchPedidos, loading } = useOrders();
  const [cliente, setCliente] = useState<any | null>(null);
  const [detalleModal, setDetalleModal] = useState<any | null>(null);

  useEffect(() => {
    fetchClientes();
    fetchPedidos();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setCliente(clientes.find((c) => c.id === id) || null);
  }, [clientes, id]);

  const pedidosCliente = pedidos.filter((p) => p.cliente_id === id);

  if (!cliente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <div className="bg-gray-800 text-white rounded-lg shadow-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Cliente no encontrado</h2>
          <Button asChild variant="outline" className="mt-2">
            <Link to="/clientes">Volver a clientes</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 py-10">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-2xl p-8 border-2 border-gray-800">
        <Link to="/clientes" className="text-blue-400 hover:underline mb-6 inline-block">← Volver a clientes</Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-widest uppercase">{cliente.nombre}</h1>
        <div className="mb-6 text-gray-200 space-y-1">
          <div><span className="font-bold">Email:</span> {cliente.email || '—'}</div>
          <div><span className="font-bold">Teléfono:</span> {cliente.telefono || '—'}</div>
        </div>
        <h2 className="text-lg font-bold text-yellow-300 mb-2 uppercase tracking-wider">Pedidos realizados</h2>
        {loading ? (
          <div className="text-gray-400">Cargando pedidos...</div>
        ) : pedidosCliente.length === 0 ? (
          <div className="text-gray-400">Este cliente no tiene pedidos registrados.</div>
        ) : (
          <div className="divide-y divide-gray-800 border rounded-lg overflow-hidden">
            {pedidosCliente.map((pedido) => (
              <div key={pedido.id} className="p-4 bg-gray-800 hover:bg-gray-700 transition flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-bold text-gray-100">Orden #{pedido.numero_orden || pedido.id.slice(-6)}</div>
                  <div className="text-gray-300 text-sm">Estado: <span className="font-semibold">{pedido.estado}</span></div>
                  <div className="text-gray-400 text-xs">Fecha: {new Date(pedido.created_at).toLocaleString()}</div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
                  <Button size="sm" variant="secondary" onClick={() => setDetalleModal(pedido)}>
                    Ver detalle
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => generatePedidoPDF(pedido)}>
                    Descargar PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal de detalle del pedido */}
      <Dialog open={!!detalleModal} onOpenChange={open => !open && setDetalleModal(null)}>
        {detalleModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative animate-fade-in">
              <h3 className="text-lg font-bold mb-2">Detalle del pedido #{detalleModal.numero_orden || detalleModal.id.slice(-6)}</h3>
              <div className="mb-2 text-sm text-gray-700">
                <div><span className="font-semibold">Estado:</span> {detalleModal.estado}</div>
                <div><span className="font-semibold">Fecha:</span> {new Date(detalleModal.created_at).toLocaleString()}</div>
                {detalleModal.observaciones && <div><span className="font-semibold">Observaciones:</span> {detalleModal.observaciones}</div>}
              </div>
              <table className="min-w-full text-sm mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Precio unit.</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleModal.productos.map((prod, idx) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="p-2">{prod.nombre}</td>
                      <td className="p-2 text-right">{prod.cantidad}</td>
                      <td className="p-2 text-right">S/. {Number(prod.precio).toFixed(2)}</td>
                      <td className="p-2 text-right">S/. {(Number(prod.precio) * Number(prod.cantidad)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg text-yellow-600">S/. {Number(detalleModal.total).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDetalleModal(null)}>Cerrar</Button>
                <Button variant="secondary" onClick={() => generatePedidoPDF(detalleModal)}>Descargar PDF</Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default ClienteDetail; 