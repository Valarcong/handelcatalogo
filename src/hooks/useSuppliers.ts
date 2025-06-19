
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Supplier {
  id: string;
  nombre: string;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  contacto?: string | null;
  observaciones?: string | null;
  created_at: string;
  updated_at: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("proveedores")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error cargando proveedores:", error);
    } else {
      setSuppliers(data as Supplier[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const addSupplier = async (values: Omit<Supplier, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("proveedores")
      .insert([values])
      .select()
      .single();
    if (error) throw error;
    fetchSuppliers();
    return data as Supplier;
  };

  const updateSupplier = async (id: string, values: Partial<Supplier>) => {
    const { data, error } = await supabase
      .from("proveedores")
      .update(values)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    fetchSuppliers();
    return data as Supplier;
  };

  const deleteSupplier = async (id: string) => {
    const { error } = await supabase
      .from("proveedores")
      .delete()
      .eq("id", id);
    if (error) throw error;
    fetchSuppliers();
  };

  return {
    suppliers,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    refresh: fetchSuppliers,
  };
};
