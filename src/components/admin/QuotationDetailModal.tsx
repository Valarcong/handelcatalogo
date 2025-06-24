import React, { useEffect, useState } from 'react';
import { Cotizacion, CotizacionProducto } from '@/hooks/useCotizaciones';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  cotizacion: Cotizacion | null;
  getDetalle: (id: string) => Promise<CotizacionProducto[]>;
}

const QuotationDetailModal: React.FC<Props> = ({ open, onClose, cotizacion, getDetalle }) => {
  const [productos, setProductos] = useState<CotizacionProducto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && cotizacion) {
      setLoading(true);
      getDetalle(cotizacion.id).then(setProductos).finally(() => setLoading(false));
    }
  }, [open, cotizacion, getDetalle]);

  if (!cotizacion) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Detalle de Cotización</DialogTitle>
        <div className="mb-2">
          <strong>Cliente:</strong> {cotizacion.razon_social ?? cotizacion.nombre_cliente ?? ''}<br/>
          <strong>Estado:</strong> {cotizacion.estado}<br/>
          <strong>Fecha:</strong> {new Date(cotizacion.creado_en).toLocaleDateString()}
        </div>
        <div>
          <strong>Productos cotizados:</strong>
          {loading ? <div>Cargando productos...</div> : (
            <ul className="mt-2">
              {productos.map((prod, idx) => (
                <li key={prod.id} className="mb-1">
                  {idx + 1}. {prod.nombre_producto} - Cantidad: {prod.cantidad} - Precio Unit: {prod.precio_unitario}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuotationDetailModal; 