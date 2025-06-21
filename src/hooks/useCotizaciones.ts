import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Cotizacion = {
  id: string;
  cliente_id: string;
  estado: string;
  observaciones: string | null;
  creado_en: string;
  creado_por?: string | null;
  enviado_en?: string | null;
  updated_at?: string | null;
};

export type CotizacionProducto = {
  id: string;
  cotizacion_id: string;
  producto_id: string;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  precio_total: number;
  observaciones?: string | null;
};

export function useCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCotizaciones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*')
      .order('creado_en', { ascending: false });
    if (error) setError(error.message);
    setCotizaciones(data || []);
    setLoading(false);
  };

  const updateEstado = async (id: string, estado: string) => {
    const { error } = await supabase
      .from('cotizaciones')
      .update({ estado })
      .eq('id', id);
    if (error) throw error;
    await fetchCotizaciones();
  };

  const getDetalle = async (cotizacionId: string) => {
    const { data, error } = await supabase
      .from('cotizacion_productos')
      .select('*')
      .eq('cotizacion_id', cotizacionId);
    if (error) throw error;
    return data as CotizacionProducto[];
  };

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  return { cotizaciones, loading, error, fetchCotizaciones, updateEstado, getDetalle };
} 