import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Pedido } from "@/types/order";
import { usePredictiveAnalytics } from "@/hooks/analytics/usePredictiveAnalytics";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Brain, TrendingUp, AlertTriangle, Lightbulb, Target, TestTube } from "lucide-react";
import { type DateRange } from "react-day-picker";

interface Props {
  pedidos: Pedido[];
  productos: Product[];
  dateRange: DateRange | undefined;
}

const PredictiveAnalytics: React.FC<Props> = ({ pedidos, productos, dateRange }) => {
  const {
    insights,
    loading,
    error,
    analyzeBusinessData,
    clearAnalysis
  } = usePredictiveAnalytics();

  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [testResult, setTestResult] = useState<string>("");

  const handleAnalyze = async () => {
    try {
      await analyzeBusinessData(pedidos, productos, dateRange);
      setHasAnalyzed(true);
    } catch (err) {
      console.error("Error al analizar datos:", err);
    }
  };

  const testSupabaseConnection = async () => {
    setTestResult("Probando conexión...");
    try {
      const { data, error } = await supabase.functions.invoke('analyze-business-data', {
        body: {
          pedidos: pedidos.slice(0, 2),
          productos: productos.slice(0, 5),
          periodo: dateRange
        }
      });

      if (error) {
        setTestResult(`Error: ${error.message}`);
      } else {
        setTestResult(`✅ Conexión exitosa! Respuesta: ${data?.insights ? 'Análisis generado' : 'Sin análisis'}`);
      }
    } catch (err: any) {
      setTestResult(`❌ Error de conexión: ${err.message}`);
    }
  };

  const formatInsights = (insights: string) => {
    // Dividir por secciones y formatear
    const sections = insights.split(/(?=^\d+\.|^📈|^⚠️|^✅|^🔮)/m).filter(Boolean);
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const title = lines[0];
      const content = lines.slice(1).join('\n');
      
      return (
        <div key={index} className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            {title.includes('📈') && <TrendingUp className="h-4 w-4 text-green-600" />}
            {title.includes('⚠️') && <AlertTriangle className="h-4 w-4 text-orange-600" />}
            {title.includes('✅') && <Lightbulb className="h-4 w-4 text-blue-600" />}
            {title.includes('🔮') && <Target className="h-4 w-4 text-purple-600" />}
            {title}
          </h4>
          <div className="text-sm text-gray-700 whitespace-pre-line pl-6">
            {content}
          </div>
        </div>
      );
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Análisis Predictivo IA
        </CardTitle>
        <CardDescription>
          Análisis inteligente de tendencias y predicciones basado en tus datos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botón de prueba de conexión */}
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={testSupabaseConnection}
            className="text-xs"
          >
            <TestTube className="h-3 w-3 mr-1" />
            Probar Conexión
          </Button>
          {testResult && (
            <span className="text-xs text-gray-600 self-center">
              {testResult}
            </span>
          )}
        </div>

        {!hasAnalyzed ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Analiza tus datos con IA para obtener insights predictivos y recomendaciones
            </p>
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || pedidos.length < 2}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Iniciar Análisis IA
                </>
              )}
            </Button>
            {pedidos.length < 2 && (
              <p className="text-sm text-gray-500 mt-2">
                Necesitas al menos 2 pedidos para realizar el análisis
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Análisis IA Completado
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  clearAnalysis();
                  setHasAnalyzed(false);
                }}
              >
                Nuevo Análisis
              </Button>
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Error al analizar datos: {error}
                  <br />
                  <span className="text-xs mt-2 block">
                    Verifica que la función de Supabase esté desplegada y configurada correctamente.
                  </span>
                </AlertDescription>
              </Alert>
            ) : insights ? (
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  {formatInsights(insights)}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No se pudo generar el análisis
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalytics;
