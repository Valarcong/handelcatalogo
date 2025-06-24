import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useExchangeRate() {
  const [data, setData] = useState<{ tc: number; fecha: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExchangeRate() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('tc, fecha')
        .order('fecha', { ascending: false })
        .limit(1)
        .single();
      if (error) {
        setError(error.message);
        setData(null);
      } else {
        setData(data);
      }
      setLoading(false);
    }
    fetchExchangeRate();
  }, []);

  return { data, loading, error };
} 