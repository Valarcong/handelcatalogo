
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useClientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchClientes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("clientes").select("*").order("nombre");
    setIsLoading(false);
    if (error) {
      toast({ title: "Error al cargar clientes", description: error.message, variant: "destructive" });
      setClientes([]);
    } else {
      setClientes(data || []);
    }
  };

  const saveCliente = async (cliente: any, id?: string) => {
    setIsLoading(true);
    let result;
    if (id) {
      result = await supabase.from("clientes").update(cliente).eq("id", id);
    } else {
      result = await supabase.from("clientes").insert([cliente]);
    }
    setIsLoading(false);
    if (result.error) {
      toast({ title: "Error al guardar", description: result.error.message, variant: "destructive" });
    } else {
      toast({ title: "Cliente guardado", description: "Cliente guardado correctamente" });
      fetchClientes();
    }
  };

  return { clientes, fetchClientes, saveCliente, isLoading };
}
