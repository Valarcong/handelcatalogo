
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Add user/session import
import { useAuth } from "@/hooks/useAuth";

const estadosColor = {
  pendiente: "bg-yellow-400 text-white",
  enproceso: "bg-blue-500 text-white",
  enviado: "bg-purple-500 text-white",
  entregado: "bg-green-500 text-white",
};

const Pedidos = () => {
  const { user } = useAuth(); // ensure user is loaded
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setErrorMsg(null);

      // Only attempt if logged in
      if (!user) {
        setPedidos([]);
        setLoading(false);
        setErrorMsg("Debes iniciar sesión para ver tus pedidos.");
        return;
      }

      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .order("created_at", { ascending: false });

      // RLS: data will only contain pedidos for the logged-in user or all pedidos if admin
      if (error) {
        setPedidos([]);
        setErrorMsg("No se pudo cargar los pedidos o no tienes acceso.");
      } else {
        setPedidos(data || []);
        if (data && data.length === 0) {
          setErrorMsg("Aún no hay pedidos para mostrar o no tienes permisos para verlos.");
        }
      }
      setLoading(false);
    };
    fetchPedidos();
    // Add dependency on user to react to login changes
  }, [user]);

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6 text-brand-navy">Pedidos recibidos</h1>
      {loading ? (
        <div className="text-center text-gray-400">Cargando...</div>
      ) : errorMsg ? (
        <div className="text-center text-red-400">{errorMsg}</div>
      ) : (
        <div className="space-y-4">
          {pedidos.map(p => (
            <Card key={p.id}>
              <CardHeader className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">{p.cliente_nombre}</CardTitle>
                  <div className="text-sm text-gray-500">{p.cliente_email || <span className="italic">Sin email</span>}</div>
                  <div className="text-sm text-gray-500">{p.cliente_telefono || <span className="italic">Sin teléfono</span>}</div>
                </div>
                <Badge className={estadosColor[(p.estado || "pendiente").replace(/\s/g, "").toLowerCase()] || "bg-gray-200"}>
                  {p.estado}
                </Badge>
              </CardHeader>
              <CardContent>
                <div>
                  <strong>Productos:</strong>
                  <ul className="ml-4 text-sm list-disc mt-2">
                    {Array.isArray(p.productos)
                      ? p.productos.map((prod: any, idx: number) => (
                          <li key={idx}>
                            {prod.nombre} &mdash; x{prod.cantidad} &mdash; S/. {prod.precio} c/u
                          </li>
                        ))
                      : null}
                  </ul>
                  <div className="mt-2">
                    <strong>Total:</strong> <span className="text-brand-navy">S/. {p.total}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {p.observaciones}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {new Date(p.created_at).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pedidos;

