
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Tipos para el producto-proveedor
export interface ProductSupplier {
  id: string;
  producto_id: string;
  proveedor_id: string;
  precio: number;
  tiempo_entrega_dias?: number | null;
  disponible: boolean;
}

// Para crear una relación nuevo producto-proveedor
export interface UpsertProductSupplier {
  producto_id: string;
  proveedor_id: string;
  precio: number;
  tiempo_entrega_dias?: number | null;
  disponible?: boolean;
}

export const useProductSuppliers = (producto_id?: string, proveedor_id?: string) => {
  const [records, setRecords] = useState<ProductSupplier[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Cargar asociaciones (puede filtrar por producto/proveedor)
  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("producto_proveedor").select("*");
    if (producto_id) query = query.eq("producto_id", producto_id);
    if (proveedor_id) query = query.eq("proveedor_id", proveedor_id);
    const { data, error } = await query;
    if (error) {
      toast({ title: "Error", description: "No se pudo cargar asociaciones producto/proveedor", variant: "destructive" });
      setRecords([]);
    } else {
      setRecords(data as ProductSupplier[]);
    }
    setLoading(false);
  }, [producto_id, proveedor_id, toast]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Añadir o actualizar una relación producto-proveedor
  const upsert = async (item: UpsertProductSupplier) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("producto_proveedor")
      .upsert([item])
      .select()
      .single();
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "No se pudo agregar/vincular proveedor", variant: "destructive" });
      throw error;
    }
    await fetch();
    toast({ title: "¡Relación guardada!", description: "Proveedor vinculado correctamente" });
    return data as ProductSupplier;
  };

  // Eliminar una relación producto-proveedor
  const remove = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("producto_proveedor")
      .delete()
      .eq("id", id);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "No se pudo eliminar la relación", variant: "destructive" });
      throw error;
    }
    await fetch();
    toast({ title: "Vínculo eliminado" });
  };

  return {
    records,
    loading,
    fetch,
    upsert,
    remove
  };
};

