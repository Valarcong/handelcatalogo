import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/hooks/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type Template = {
  id: string;
  nombre: string;
  tipo: string;
  contenido: string;
  creado_en?: string;
};

const tipos = [
  { value: "cotizacion", label: "Cotización" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "confirmacion", label: "Confirmación" },
];

const VARS = [
  "{nombre_cliente}",
  "{producto}",
  "{precio}",
  "{cantidad}",
  "{usuario}"
];

export default function VentasTemplatesPanel() {
  const { user, loading } = useAuthContext(); // Ahora también traemos loading
  const { toast } = useToast();
  const [nuevo, setNuevo] = React.useState<{
    nombre: string;
    tipo: string;
    contenido: string;
  }>({
    nombre: "",
    tipo: "cotizacion",
    contenido: ""
  });
  const [editando, setEditando] = React.useState<Template | null>(null);

  const queryClient = useQueryClient();

  // Esperar usuario CARGADO antes de consultar
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ["templates_mensajes", { user: user?.id }],
    queryFn: async () => {
      if (!user?.id) throw new Error("Usuario no autenticado.");
      const { data, error } = await supabase
        .from("templates_mensajes")
        .select("*")
        .order("creado_en", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !loading,
  });

  // Render defensivo según loading y existencia de user
  if (loading || !user?.id) {
    return (
      <div className="mx-auto max-w-3xl p-4 text-center text-gray-400">
        Cargando usuario...
      </div>
    );
  }

  const crear = useMutation({
    mutationFn: async (t: { nombre: string; tipo: string; contenido: string }) => {
      if (!user?.id) throw new Error("Falta user.id para crear template.");
      const { data, error } = await supabase
        .from("templates_mensajes")
        .insert({
          nombre: t.nombre,
          tipo: t.tipo,
          contenido: t.contenido,
          creado_por: user?.id ?? "",
          creado_en: new Date().toISOString()
        } as any)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates_mensajes"] });
      toast({ title: "Template creado exitosamente" });
      setNuevo({ nombre: "", tipo: "cotizacion", contenido: "" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const editar = useMutation({
    mutationFn: async (t: Template) => {
      const { data, error } = await supabase
        .from("templates_mensajes")
        .update({
          nombre: t.nombre,
          tipo: t.tipo,
          contenido: t.contenido,
          actualizado_en: new Date().toISOString()
        })
        .eq("id", t.id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates_mensajes"] });
      toast({ title: "Template actualizado" });
      setEditando(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const eliminar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("templates_mensajes")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates_mensajes"] });
      toast({ title: "Template eliminado" });
    }
  });

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h2 className="text-2xl font-bold text-brand-navy mb-4">Templates de mensajes de cotización</h2>
      <div className="mb-4 text-sm text-gray-600">
        Usa variables en los mensajes: {VARS.map(v => (
          <Badge key={v} variant="outline" className="mx-1">{v}</Badge>
        ))}
      </div>
      {/* Crear nuevo template */}
      <div className="bg-muted p-4 rounded mb-8">
        <h3 className="font-semibold mb-2">Nuevo template</h3>
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <Input
            placeholder="Nombre"
            value={nuevo.nombre}
            onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
            className="w-full md:w-44"
          />
          <select
            value={nuevo.tipo}
            onChange={e => setNuevo({ ...nuevo, tipo: e.target.value })}
            className="border rounded px-2 py-1 w-full md:w-44 text-sm"
          >
            {tipos.map(t => <option value={t.value} key={t.value}>{t.label}</option>)}
          </select>
          <Textarea
            placeholder="Mensaje (puedes usar variables dinámicas)"
            value={nuevo.contenido}
            onChange={e => setNuevo({ ...nuevo, contenido: e.target.value })}
            className="w-full md:w-72"
            rows={4}
          />
          <Button onClick={() => crear.mutate(nuevo)} disabled={!nuevo.nombre || !nuevo.contenido} className="md:self-auto">
            Crear
          </Button>
        </div>
      </div>

      {/* Errores de carga y estados */}
      {isLoading ? (
        <div className="text-gray-500 mt-8 text-center">Cargando templates...</div>
      ) : error ? (
        <div className="text-red-600 mt-8 text-center">
          Error: {error.message || "No se pudieron cargar los templates."}
        </div>
      ) : !Array.isArray(templates) ? (
        <div className="text-gray-400 mt-8 text-center">No fue posible obtener la lista de templates. Intenta recargar la página.</div>
      ) : (
        <div className="space-y-4">
          {templates.length === 0 && <div className="text-muted-foreground">No hay templates registrados.</div>}

          {templates.map((t: any) => {
            // Validación defensiva de props mínimas (evita errores fatales si un template está corrupto)
            if (!t || typeof t !== "object" || !t.id || !t.nombre || !t.tipo || typeof t.contenido !== "string") {
              return (
                <div key={t?.id ?? Math.random()} className="bg-red-100 text-red-600 rounded p-2">
                  Error: Este template tiene datos incompletos.
                </div>
              );
            }
            return (
              <div key={t.id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
                {editando?.id === t.id ? (
                  <>
                    <div className="flex gap-2">
                      <Input
                        value={editando.nombre}
                        onChange={e => setEditando({ ...editando, nombre: e.target.value })}
                        className="w-44"
                      />
                      <select
                        value={editando.tipo}
                        onChange={e => setEditando({ ...editando, tipo: e.target.value })}
                        className="border rounded px-2 py-1 w-44 text-sm"
                      >
                        {tipos.map(op => <option value={op.value} key={op.value}>{op.label}</option>)}
                      </select>
                    </div>
                    <Textarea
                      value={editando.contenido}
                      onChange={e => setEditando({ ...editando, contenido: e.target.value })}
                      className="w-full"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => editar.mutate(editando)}>Guardar</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditando(null)}>Cancelar</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{t.nombre}</div>
                      <Badge variant="outline">{tipos.find(tp => tp.value === t.tipo)?.label || t.tipo}</Badge>
                    </div>
                    <div className="whitespace-pre-line bg-muted p-2 rounded">{t.contenido}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditando(t)}>Editar</Button>
                      <Button size="sm" variant="destructive" onClick={() => eliminar.mutate(t.id)}>Eliminar</Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
