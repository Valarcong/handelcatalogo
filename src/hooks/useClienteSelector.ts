import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ClienteSelectorOption {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  es_empresa?: boolean;
  ruc?: string;
  razon_social?: string;
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
        .select("id,nombre,email,telefono,es_empresa,ruc,razon_social")
        .order("nombre", { ascending: true });
      if (search && search.length > 1) {
        query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%,razon_social.ilike.%${search}%,ruc.ilike.%${search}%`);
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
