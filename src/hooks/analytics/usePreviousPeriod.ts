import { DateRange } from "./useDateFilters";

// Calcula el rango anterior dado el rango seleccionado
export function usePreviousPeriod(current: DateRange): DateRange {
  // Si las fechas están vacías o son inválidas, devolver últimos 30 días anteriores a hoy
  const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());
  const today = new Date();
  const getDefaultRange = () => {
    // Usar siempre .getTime() para operar con números.
    const msInDay = 24 * 60 * 60 * 1000;
    const toMs = today.getTime() - 30 * msInDay;
    const fromMs = toMs - 29 * msInDay;
    const to = new Date(toMs);
    const from = new Date(fromMs);
    return {
      from: from.toISOString().slice(0,10),
      to: to.toISOString().slice(0,10),
    };
  };

  if (!current.from || !current.to) {
    return getDefaultRange();
  }

  const from = new Date(current.from);
  const to = new Date(current.to);

  if (!isValidDate(from) || !isValidDate(to)) {
    return getDefaultRange();
  }

  const days = Math.round((to.getTime() - from.getTime()) / (1000*60*60*24)) + 1;

  // Calcula el período justo antes
  const prevToMs = from.getTime() - 24 * 60 * 60 * 1000;
  const prevFromMs = prevToMs - (days - 1) * 24 * 60 * 60 * 1000;
  const prevTo = new Date(prevToMs);
  const prevFrom = new Date(prevFromMs);

  return {
    from: prevFrom.toISOString().slice(0,10),
    to: prevTo.toISOString().slice(0,10),
  };
}
