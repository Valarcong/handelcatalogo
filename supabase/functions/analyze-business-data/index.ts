
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { pedidos, productos, periodo } = body;

    // Nueva validación de datos mínimos
    if (!Array.isArray(pedidos) || pedidos.length < 2 || !Array.isArray(productos) || productos.length === 0) {
      const message = `
Datos insuficientes para análisis avanzado. Para obtener un informe preciso, asegúrate de enviar al menos 2 pedidos y el catálogo de productos. 
Pedidos recibidos: ${pedidos?.length ?? 0}
Productos recibidos: ${productos?.length ?? 0}`;
      return new Response(JSON.stringify({
        insights: message
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Prompt optimizado
    const systemPrompt = `
Eres un consultor senior en inteligencia de negocios especializado en empresas B2B de plásticos con operaciones de dropshipping en Perú. 
Tu rol es analizar datos comerciales (pedidos y productos) y generar insights ejecutivos de alto impacto. Prioriza claridad, rigor analítico, precisión y priorización empresarial. Responde en español. Solo devuelve el análisis, sin explicaciones meta ni saludos.`;

    const userPrompt = `
Analiza los siguientes datos de mi tienda online B2B de plásticos y responde con un informe PERFECTO. 
- Sé exigente, detecta tendencias ocultas, oportunidades de ventas, riesgos y fallos. Revisa precios, volúmenes, márgenes, comportamiento de clientes, productos y proveedores. 
- Usa cifras concretas (ventas, unidades, márgenes) para justificar cada conclusión. 
- Si necesitas suposiciones, indícalas brevemente.
- No ignores anomalías ni detalles pequeños.
- Sé exacto y sintético, utiliza máximo rigor ejecutivo.

Organiza tu informe con las siguientes secciones (usa viñetas si lo estimas efectivo):

1. 📈 Principales oportunidades  
   - ¿Qué productos, categorías o clientes están creciendo?  
   - ¿Qué proveedor o segmento resalta positivamente?  
   - ¿Dónde puedes escalar ventas o aumentar ticket promedio?

2. ⚠️ Problemas o caídas detectadas  
   - Productos con desempeño inferior al esperado.  
   - Clientes o segmentos en declive.  
   - Errores comunes: cancelaciones, demoras, márgenes negativos. Indica cifras.

3. ✅ Sugerencias concretas  
   - Acciones rápidas de mejora comercial.  
   - Optimización: precios, promociones, logística, ventas cruzadas, reactivación, productos a pausar o mejorar.

4. 🔮 Predicciones y próximos pasos  
   - ¿Qué tendencia seguirá/acentuará el próximo mes?  
   - Riesgos logísticos o de abastecimiento.
   - Acciones prioritarias para preparar y no perder ventas.

Datos enviados:  
- Período analizado: ${periodo?.from ?? "-"} a ${periodo?.to ?? "-"}
- Pedidos filtrados (JSON): ${JSON.stringify(pedidos, null, 2)}
- Catálogo de productos completo (JSON): ${JSON.stringify(productos, null, 2)}

Condiciones:  
- Usa datos numéricos, fechas (YYYY-MM-DD) y cantidades.
- Solo responde con el informe, sin explicar tu proceso ni dar contexto meta.
- Prioriza hallazgos de mayor impacto o urgencia.
- Si los datos son mínimos o ves inconsistencias, indícalo en el informe ejecutivamente.
- Mantén formato claro, profesional y de máximo valor para la dirección.

Output en español. Estructura ordenadamente las secciones indicadas. Resume al máximo, pero sin perder precisión ni profundidad.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 1200,
      }),
    });

    const data = await response.json();
    const aiInsights = data.choices?.[0]?.message?.content ?? "Sin respuesta de la IA.";

    return new Response(JSON.stringify({ insights: aiInsights }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("Error en analyze-business-data Edge Function:", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
