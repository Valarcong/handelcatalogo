
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useInsertCotizacionVenta() {
  return useMutation({
    mutationFn: async (cotizacion: any) => {
      const { data, error } = await supabase
        .from("cotizaciones_ventas")
        .insert([cotizacion])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
  });
}
