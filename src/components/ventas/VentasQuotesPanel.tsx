import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/hooks/AuthContext";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const estadoLabels: Record<string, { text: string; color: string }> = {
  pendiente: { text: "Pendiente", color: "bg-yellow-200 text-yellow-800" },
  respondida: { text: "Respondida", color: "bg-blue-200 text-blue-800" },
  convertida: { text: "Convertida", color: "bg-green-200 text-green-800" },
};

export default function VentasQuotesPanel() {
  const { user } = useAuthContext();
  const [search, setSearch] = React.useState("");
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cotizaciones_ventas", { enviado_por: user?.id }],
    queryFn: async () => {
      let query = supabase
        .from("cotizaciones_ventas")
        .select("*")
        .order("enviado_en", { ascending: false })
        .limit(100);
      if (user?.id) query = query.eq("enviado_por", user.id);
      if (search)
        query = query.ilike("producto_nombre", `%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: Boolean(user?.id),
  });

  if (isLoading) {
    return <div className="p-8 text-gray-500 text-center">Cargando cotizaciones...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <h2 className="text-2xl font-bold text-brand-navy">Cotizaciones enviadas</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filtrar por producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <Button
            variant="outline"
            onClick={() => refetch()}
            title="Refrescar"
          >
            Refrescar
          </Button>
        </div>
      </div>
      <Table>
        <TableCaption>(Solo se muestran las 100 cotizaciones más recientes)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Enviado el</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio Unitario</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No hay cotizaciones registradas.
              </TableCell>
            </TableRow>
          )}
          {data?.map((cot) => (
            <TableRow key={cot.id}>
              <TableCell>
                <div className="font-mono text-xs">{cot.enviado_en ? new Date(cot.enviado_en).toLocaleString() : "—"}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{cot.producto_nombre}</div>
                <div className="text-xs text-muted-foreground">{cot.producto_codigo}</div>
              </TableCell>
              <TableCell className="text-center">{cot.cantidad}</TableCell>
              <TableCell className="text-right">S/. {Number(cot.precio_unitario).toFixed(2)}</TableCell>
              <TableCell className="text-right font-semibold">S/. {Number(cot.precio_total).toFixed(2)}</TableCell>
              <TableCell>
                <div className="font-medium">{cot.nombre_cliente || "—"}</div>
                <div className="text-xs">{cot.telefono_cliente || ""}</div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${estadoLabels[cot.estado]?.color || "bg-gray-200 text-gray-600"}`}>
                  {estadoLabels[cot.estado]?.text || cot.estado}
                </span>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => {
                  navigator.clipboard.writeText(cot.mensaje || "");
                  toast({ title: "Mensaje copiado", description: "El mensaje de la cotización fue copiado al portapapeles."});
                }}>Copiar mensaje</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
