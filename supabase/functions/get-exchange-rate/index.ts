import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const EXCHANGE_API_URL = 'https://api.exchangerate.host/live?access_key=6aef87f8e29888e72e9996e981da87f4&currencies=USD,PEN&format=1'

serve(async (req) => {
  // Permitir CORS y acceso público
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('exchange_rates')
    .select('id_tc, tc')
    .eq('fecha', today)
    .single()

  if (data && data.tc) {
    return new Response(JSON.stringify({ tc: data.tc, source: 'cache', id_tc: data.id_tc }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  const res = await fetch(EXCHANGE_API_URL)
  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'No se pudo obtener el tipo de cambio externo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
  const json = await res.json()
  const tc = json.quotes?.USDPEN

  if (!tc) {
    return new Response(JSON.stringify({ error: 'Respuesta inválida de exchangerate.host' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  const { data: upserted, error: upsertError } = await supabase
    .from('exchange_rates')
    .upsert([{ fecha: today, tc }])
    .select('id_tc, tc')
    .single()

  if (upsertError || !upserted) {
    return new Response(JSON.stringify({ error: 'No se pudo guardar el tipo de cambio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  return new Response(JSON.stringify({ tc: upserted.tc, source: 'api', id_tc: upserted.id_tc }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
})