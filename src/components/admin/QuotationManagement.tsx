import React, { useState, useMemo, useEffect } from 'react';
import { useCotizaciones, Cotizacion } from '@/hooks/useCotizaciones';
import { useClientes } from '@/hooks/useClientes';
import QuotationDetailModal from './QuotationDetailModal';
import { Button } from '@/components/ui/button';
import { generateCotizacionPDF } from '@/utils/generateCotizacionPDF';
import NewQuotationModal from './NewQuotationModal';
import EditQuotationModal from './EditQuotationModal';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { DateRangeFilter } from '@/components/admin/analytics/DateRangeFilter';
import { Input } from '@/components/ui/input';

const ESTADOS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'aceptada', label: 'Aceptada' },
  { value: 'rechazada', label: 'Rechazada' },
  { value: 'anulada', label: 'Anulada' },
  { value: 'pedido_generado', label: 'Pedido Generado' },
];

const QuotationManagement: React.FC = () => {
  const { cotizaciones, loading, updateEstado, getDetalle, fetchCotizaciones } = useCotizaciones();
  const { clientes, fetchClientes } = useClientes();
  const [modal, setModal] = useState<{ open: boolean; cotizacion: Cotizacion | null }>({ open: false, cotizacion: null });
  const [estadoEdit, setEstadoEdit] = useState<{ [id: string]: string | null }>({});
  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; cotizacion: Cotizacion | null }>({ open: false, cotizacion: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; cotizacion: Cotizacion | null }>({ open: false, cotizacion: null });
  const { data: exchangeRate, loading: loadingTC, error: errorTC } = useExchangeRate();
  const [filters, setFilters] = useState({
    estado: 'all',
    search: '',
    dateRange: undefined,
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const cotizacionesConCliente = useMemo(() => {
    if (!clientes.length) return [];
    return cotizaciones.map(cot => {
      const cliente = clientes.find(c => c.id === cot.cliente_id);
      return {
        ...cot,
        cliente: cliente || { nombre: 'Cliente no encontrado', razon_social: '', telefono: '', email: '' },
      };
    });
  }, [cotizaciones, clientes]);

  const filteredCotizaciones = useMemo(() => {
    return cotizacionesConCliente.filter(cot => {
      // Estado
      if (filters.estado !== 'all' && cot.estado !== filters.estado) return false;
      // Rango de fechas
      if (filters.dateRange?.from) {
        if (new Date(cot.creado_en).getTime() < new Date(filters.dateRange.from).setHours(0,0,0,0)) return false;
      }
      if (filters.dateRange?.to) {
        if (new Date(cot.creado_en).getTime() > new Date(filters.dateRange.to).setHours(23,59,59,999)) return false;
      }
      // Búsqueda
      if (filters.search) {
        const txt = filters.search.toLowerCase();
        if (!(
          (cot.cliente?.razon_social || cot.cliente?.nombre || '').toLowerCase().includes(txt) ||
          (cot.cliente?.email || '').toLowerCase().includes(txt) ||
          (cot.cliente?.telefono || '').toLowerCase().includes(txt) ||
          (cot.id || '').toLowerCase().includes(txt)
        )) {
          return false;
        }
      }
      return true;
    });
  }, [cotizacionesConCliente, filters]);

  const resetFilters = () => setFilters({ estado: 'all', search: '', dateRange: undefined });

  const handleEstadoChange = async (id: string, estado: string) => {
    setEstadoEdit(e => ({ ...e, [id]: estado }));
    await updateEstado(id, estado as any);
    setEstadoEdit(e => ({ ...e, [id]: null }));
  };

  const fetchClienteYProductos = async (cotizacion) => {
    let cliente = null;
    if (cotizacion.cliente_id) {
      const { data } = await supabase.from('clientes').select('*').eq('id', cotizacion.cliente_id).single();
      cliente = data;
    }
    const { data: productosCotizados } = await supabase.from('cotizacion_productos').select('*').eq('cotizacion_id', cotizacion.id);
    const productoIds = productosCotizados.map(p => p.producto_id);
    let productosBase = [];
    if (productoIds.length > 0) {
      const { data } = await supabase.from('productos').select('id, sku').in('id', productoIds);
      productosBase = data || [];
    }
    const productosConSku = productosCotizados.map(prod => {
      const base = productosBase.find(b => b.id === prod.producto_id);
      const p = prod as import('@/hooks/useCotizaciones').CotizacionProducto;
      return {
        ...p,
        sku: base ? base.sku : '',
        precio_compra: p.precio_compra ?? 0,
        margen: p.margen ?? 0,
      };
    });
    return { cliente, productosConSku };
  };

  const handlePDF = async (cotizacion: Cotizacion) => {
    if (!exchangeRate || typeof exchangeRate.tc !== 'number') {
      toast.error('No se pudo obtener el tipo de cambio. Intenta de nuevo más tarde.');
      return;
    }
    const { cliente, productosConSku } = await fetchClienteYProductos(cotizacion);
    await generateCotizacionPDF(cotizacion, productosConSku, cliente, exchangeRate.tc);
  };

  const handleGenerarPedido = async (cotizacion: Cotizacion) => {
    const { cliente, productosConSku } = await fetchClienteYProductos(cotizacion);
    const productosPedido = productosConSku.map(prod => ({
      id: prod.producto_id,
      nombre: prod.nombre_producto,
      codigo: prod.sku || '',
      cantidad: prod.cantidad,
      precio_venta: prod.precio_unitario,
      precio_compra: prod.precio_compra ?? 0,
      margen: prod.margen ?? 0,
      subtotal: prod.cantidad * prod.precio_unitario,
    }));

    const { error } = await supabase.from('pedidos').insert({
      cliente_id: cotizacion.cliente_id,
      cliente_nombre: cliente?.nombre || 'N/A',
      cliente_telefono: cliente?.telefono || '',
      cliente_email: cliente?.email || '',
      productos: productosPedido,
      total: productosPedido.reduce((sum, p) => sum + (p.precio_venta * p.cantidad), 0),
      observaciones: cotizacion.observaciones,
      cotizacion_id: cotizacion.id,
      estado: 'pendiente',
    });

    if (!error) {
      await supabase.from('cotizaciones').update({ estado: 'pedido_generado' }).eq('id', cotizacion.id);
      toast.success('Pedido generado exitosamente');
      fetchCotizaciones();
    } else {
      toast.error('Error al generar pedido: ' + error.message);
    }
  };

  const handleDelete = async (cotizacion: Cotizacion) => {
    const { error } = await supabase.from('cotizaciones').delete().eq('id', cotizacion.id);
    if (error) {
      toast.error(`Error al eliminar: ${error.message}`);
    } else {
      toast.success('Cotización eliminada correctamente');
    }
    setDeleteModal({ open: false, cotizacion: null });
    await fetchCotizaciones();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div>
          <h2 className="text-xl font-semibold">Cotizaciones</h2>
          <div className="mt-1 text-xs text-gray-700 font-semibold">
            {loadingTC ? 'Cargando T.C...' : errorTC ? 'Error al cargar T.C.' : exchangeRate ? `T.C. Actual: ${(exchangeRate.tc + 0.05).toFixed(3)}` : null}
          </div>
        </div>
        <Button onClick={() => setNewModal(true)} variant="default">+ Nueva Cotización</Button>
      </div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center mb-4 bg-muted px-4 py-3 rounded-md">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Estado:</span>
          <select
            value={filters.estado}
            onChange={e => setFilters(f => ({ ...f, estado: e.target.value }))}
            className="w-40 border rounded px-2 py-1"
          >
            <option value="all">Todos</option>
            {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Buscar:</span>
          <Input
            placeholder="Cliente, email, teléfono o ID"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-48"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Rango de fechas:</span>
          <DateRangeFilter
            range={filters.dateRange}
            setRange={range => setFilters(f => ({ ...f, dateRange: range }))}
          />
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={resetFilters}>Limpiar</Button>
      </div>
      {loading ? <div>Cargando cotizaciones...</div> : (
        <table className="min-w-full bg-white border rounded-lg overflow-x-auto text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1">Cliente</th>
              <th className="px-2 py-1">Estado</th>
              <th className="px-2 py-1">Fecha</th>
              <th className="px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCotizaciones.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-gray-400 py-4">Sin cotizaciones</td></tr>
            ) : filteredCotizaciones.map(cot => {
              const isPedidoGenerado = cot.estado === 'pedido_generado';
              return (
              <tr key={cot.id}>
                <td className="px-2 py-1">
                  {cot.cliente?.razon_social || cot.cliente.nombre}
                </td>
                <td className="px-2 py-1">
                  <select
                    value={estadoEdit[cot.id] ?? cot.estado}
                    onChange={e => handleEstadoChange(cot.id, e.target.value)}
                    disabled={isPedidoGenerado}
                    className="border rounded px-1 py-0.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {ESTADOS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </td>
                <td className="px-2 py-1">{new Date(cot.creado_en).toLocaleDateString()}</td>
                <td className="px-2 py-1 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setModal({ open: true, cotizacion: cot })}>Ver detalle</Button>
                  <Button size="sm" variant="outline" onClick={() => handlePDF(cot)}>Descargar PDF</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditModal({ open: true, cotizacion: cot })} disabled={isPedidoGenerado}>Editar</Button>
                  {cot.estado === 'aceptada' && (
                    <Button size="sm" variant="default" onClick={() => handleGenerarPedido(cot)} disabled={isPedidoGenerado}>Generar Pedido</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => setDeleteModal({ open: true, cotizacion: cot })} disabled={isPedidoGenerado}>Eliminar</Button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      )}
      <QuotationDetailModal
        open={modal.open}
        onClose={() => setModal({ open: false, cotizacion: null })}
        cotizacion={modal.cotizacion}
        getDetalle={getDetalle}
      />
      <NewQuotationModal
        open={newModal}
        onClose={() => setNewModal(false)}
        onCreated={() => {
          fetchCotizaciones();
          setNewModal(false);
        }}
      />
      <EditQuotationModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, cotizacion: null })}
        cotizacion={editModal.cotizacion}
        onUpdated={() => {
          fetchCotizaciones();
          setEditModal({ open: false, cotizacion: null });
        }}
      />
      <Dialog open={deleteModal.open} onOpenChange={v => { if (!v) setDeleteModal({ open: false, cotizacion: null }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Cotización</DialogTitle>
          </DialogHeader>
          <div className="mb-4">¿Estás seguro que deseas eliminar esta cotización? Esta acción no se puede deshacer.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, cotizacion: null })}>Cancelar</Button>
            <Button variant="destructive" onClick={() => deleteModal.cotizacion && handleDelete(deleteModal.cotizacion)}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotationManagement; 