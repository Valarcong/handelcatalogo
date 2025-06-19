
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ClienteSelectorOption {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
}

export const useClienteSelector = () => {
  const [clientes, setClientes] = useState<ClienteSelectorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      let query = supabase
        .from("clientes")
        .select("id,nombre,email,telefono")
        .order("nombre", { ascending: true });
      if (search && search.length > 1) {
        query = query.ilike("nombre", `%${search}%`);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) setClientes(data);
      setLoading(false);
    };
    fetchClientes();
  }, [search]);

  return {
    clientes,
    setSearch,
    loading,
  };
};
