import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pedido } from "@/types/order";
import { Product } from "@/types/product";
import { DateRange } from "./useDateFilters";

interface AIAnalysisResult {
  insights: string;
  loading: boolean;
  error: string | null;
}

export function usePredictiveAnalytics() {
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult>({
    insights: "",
    loading: false,
    error: null,
  });

  const analyzeBusinessData = useCallback(async (
    pedidos: Pedido[],
    productos: Product[],
    periodo: DateRange
  ) => {
    setAnalysisResult(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('analyze-business-data', {
        body: {
          pedidos,
          productos,
          periodo
        }
      });

      if (error) {
        throw new Error(error.message || 'Error al analizar datos');
      }

      setAnalysisResult({
        insights: data?.insights || "No se pudo generar el análisis",
        loading: false,
        error: null,
      });

      return data?.insights;
    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido al analizar datos';
      setAnalysisResult({
        insights: "",
        loading: false,
        error: errorMessage,
      });
      throw err;
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult({
      insights: "",
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...analysisResult,
    analyzeBusinessData,
    clearAnalysis,
  };
}
