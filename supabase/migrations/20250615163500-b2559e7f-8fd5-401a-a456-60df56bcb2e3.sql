
-- Habilitar la extensión pg_cron si no está activada
create extension if not exists pg_cron with schema public;

-- Programar la función para que se ejecute cada día a las 8:30am (hora del servidor)
select cron.schedule(
  'notificar-cotizaciones-pendientes-diario',
  '30 8 * * *',
  $$ select public.generar_notificacion_cotizacion_pendiente(); $$
);

-- Consultar el historial de ejecuciones de cron (opcional)
-- select * from cron.job_run_details order by end_time desc;

