
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pedido } from "@/types/order";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line } from "recharts";
import { usePredictiveAnalytics } from "@/hooks/analytics/usePredictiveAnalytics";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { notifyDirect } from "@/hooks/useNotifications";

interface Props {
  pedidos: Pedido[];
  userId: string | null;
  periodo?: { from: string; to: string };
}

const PredictiveAnalytics: React.FC<Props> = ({ pedidos, userId, periodo }) => {
  const { salesSeries, prediction, trendingProducts } = usePredictiveAnalytics(pedidos);
  // Para insights de IA
  const [aiInsights, setAiInsights] = useState<string>("");
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  // Productos para prompt
  const productsDataHook = typeof useProducts === "function" ? useProducts() : undefined;
  const productos = productsDataHook?.products ?? [];

  const chartData = [
    ...salesSeries,
    {
      month: "Próximo",
      total: Math.round(prediction.forecast),
      prediction: true,
    }
  ];

  // Nuevo: también enviar periodo seleccionado 
  const fetchAIInsights = async () => {
    setInsightLoading(true);
    setInsightError(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-business-data", {
        body: {
          pedidos,
          productos,
          periodo: periodo || (salesSeries.length ? { from: salesSeries[0]?.month, to: salesSeries.at(-1)?.month } : {}),
        },
      });
      if (error) throw new Error(error.message ?? "No se pudo obtener el análisis IA");
      setAiInsights(data?.insights ?? "Sin respuesta de la IA.");
    } catch (err: any) {
      setInsightError(err.message ?? "Error desconocido");
    }
    setInsightLoading(false);
  };

  const { toast } = useToast();

  // Guardar alerta IA como notificación usando el userId de props
  const handleCrearAlertaIA = async () => {
    if (!userId || !aiInsights) {
      toast({ title: "Falta usuario o análisis IA", variant: "destructive" });
      return;
    }
    try {
      await notifyDirect({
        usuario_id: userId,
        tipo: "alerta_ia",
        titulo: "Alerta predictiva IA",
        mensaje: aiInsights,
      });
      toast({
        title: "¡Alerta creada!",
        description: "La alerta de IA ha sido guardada para ti.",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "No se pudo guardar alerta",
        description: err?.message ?? "Error desconocido.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Predicción de Ventas (Próximo periodo)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <span className="text-4xl font-bold text-green-700">S/. {Math.round(prediction.forecast).toLocaleString()}</span>
            <span className="ml-3 text-gray-500">Base: regresión lineal de ventas históricas</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" isAnimationActive />
              <Line type="monotone" dataKey="total" stroke="#10b981" dot={false} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Insights de IA (OpenAI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={fetchAIInsights}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition"
              disabled={insightLoading || pedidos.length < 2}
            >
              {insightLoading ? "Generando análisis inteligente..." : "Generar Análisis Inteligente"}
            </button>
            {aiInsights && (
              <button
                onClick={handleCrearAlertaIA}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                Guardar como Alerta Predictiva
              </button>
            )}
          </div>
          {insightError && (
            <div className="text-sm text-red-600 mb-2">Error: {insightError}</div>
          )}
          {aiInsights && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm whitespace-pre-wrap">
              {aiInsights}
              <div className="text-gray-400 text-xs mt-2">
                <b>Configuración IA usada:</b>
                <ul className="ml-4">
                  <li>Modelo: <b>GPT-4o</b></li>
                  <li>Temperature: <b>0.2</b></li>
                  <li>Máx tokens: <b>550</b></li>
                  <li>Periodo enviado: <b>{periodo?.from} a {periodo?.to}</b></li>
                </ul>
              </div>
            </div>
          )}
          {!aiInsights && !insightLoading && !insightError && (
            <div className="text-xs text-gray-400">Haz clic para generar un análisis estratégico de tu negocio usando IA.</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Productos con tendencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="font-semibold mb-1 text-green-800">En crecimiento</div>
              {trendingProducts.growing.length === 0 && <div className="text-xs text-gray-400">Sin productos en crecimiento reciente</div>}
              {trendingProducts.growing.map((item) => (
                <div key={item.name} className="mb-1 flex items-center gap-2">
                  <Badge variant="default" className="bg-green-600/80">{item.name}</Badge>
                  <span className="text-xs text-green-600">+{item.growth}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="font-semibold mb-1 text-red-800">En declive</div>
              {trendingProducts.declining.length === 0 && <div className="text-xs text-gray-400">Sin productos en declive</div>}
              {trendingProducts.declining.map((item) => (
                <div key={item.name} className="mb-1 flex items-center gap-2">
                  <Badge variant="destructive">{item.name}</Badge>
                  <span className="text-xs text-red-600">{item.growth}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Próximos pasos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-gray-500 list-disc ml-5">
            <li>Puedes ampliar estos análisis agregando predicciones por categoría, clientes y márgenes futuro.</li>
            <li>¿Quieres conectar IA de OpenAI para insights automáticos? Dímelo y lo integramos.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
