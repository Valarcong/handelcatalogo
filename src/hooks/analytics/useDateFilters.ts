
import { useState } from "react";

// YYYY-MM-DD format for compatibility
export interface DateRange {
  from: string;
  to: string;
}

export function useDateFilters() {
  // Default: últimos 30 días
  const today = new Date();
  const past = new Date(Date.now() - 29*24*60*60*1000);
  const defaultRange = {
    from: past.toISOString().slice(0,10),
    to: today.toISOString().slice(0,10)
  };

  const [range, setRange] = useState<DateRange>(defaultRange);

  // Helper para filtrar usando el rango dinámico
  const filterByRange = <T extends { created_at: string}>(
    arr: T[],
    baseField: keyof T = "created_at"
  ) => {
    const isValidDate = (s: string) => {
      const d = new Date(s);
      return !!s && d instanceof Date && !isNaN(d.valueOf());
    };
    if (!isValidDate(range.from) || !isValidDate(range.to)) return arr;
    return arr.filter(item => {
      const created = item[baseField] ? new Date(item[baseField] as string) : null;
      if (!created || isNaN(created.valueOf())) return false;
      if (range.from && created < new Date(range.from)) return false;
      if (range.to && created > new Date(range.to + "T23:59:59")) return false;
      return true;
    });
  };

  return { range, setRange, filterByRange };
}
