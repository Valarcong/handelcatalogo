
import React from "react";
import { Input } from "@/components/ui/input";

interface DateRange {
  from: string;
  to: string;
}

interface DateRangeFilterProps {
  range: DateRange;
  setRange: (range: DateRange) => void;
  className?: string;
}

const getDefaultRange = () => {
  const d = new Date();
  const past = new Date(Date.now() - 29*24*60*60*1000);
  return {
    from: past.toISOString().slice(0,10),
    to: d.toISOString().slice(0,10)
  }
};

const getTodayRange = () => {
  const today = new Date();
  const formatted = today.toISOString().slice(0,10);
  return { from: formatted, to: formatted };
};

// NUEVOS PRESETS
const presets = [
  { label: "7 días", get: () => {
    const d = new Date();
    const past = new Date(Date.now() - 6*24*60*60*1000);
    return { from: past.toISOString().slice(0,10), to: d.toISOString().slice(0,10) };
  }},
  { label: "15 días", get: () => {
    const d = new Date();
    const past = new Date(Date.now() - 14*24*60*60*1000);
    return { from: past.toISOString().slice(0,10), to: d.toISOString().slice(0,10) };
  }},
  { label: "1 mes", get: () => {
    const d = new Date();
    const past = new Date(Date.now() - 29*24*60*60*1000);
    return { from: past.toISOString().slice(0,10), to: d.toISOString().slice(0,10) };
  }},
  { label: "3 meses", get: () => {
    const d = new Date();
    const past = new Date(Date.now() - 89*24*60*60*1000);
    return { from: past.toISOString().slice(0,10), to: d.toISOString().slice(0,10) };
  }},
  { label: "6 meses", get: () => {
    const d = new Date();
    const past = new Date(Date.now() - 179*24*60*60*1000);
    return { from: past.toISOString().slice(0,10), to: d.toISOString().slice(0,10) };
  }},
  { label: "12 meses", get: () => {
    const d = new Date();
    const past = new Date(Date.now() - 364*24*60*60*1000);
    return { from: past.toISOString().slice(0,10), to: d.toISOString().slice(0,10) };
  }},
];

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ range, setRange, className }) => {
  return (
    <div className={`flex flex-col md:flex-row flex-wrap md:items-center gap-2 md:gap-3 mb-4 w-full ${className ?? ''}`}>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col w-24">
          <label className="text-xs text-muted-foreground">Desde</label>
          <Input type="date" value={range.from} onChange={e => setRange({ ...range, from: e.target.value })} className="w-full" />
        </div>
        <div className="flex flex-col w-24">
          <label className="text-xs text-muted-foreground">Hasta</label>
          <Input type="date" value={range.to} onChange={e => setRange({ ...range, to: e.target.value })} className="w-full" />
        </div>
      </div>
      <div className="flex gap-1 flex-wrap overflow-x-auto py-1">
        {presets.map(p => (
          <button
            type="button"
            key={p.label}
            className="bg-blue-50 border border-blue-100 text-blue-600 text-xs rounded-full px-3 py-1 hover:bg-blue-100 transition whitespace-nowrap"
            onClick={() => setRange(p.get())}
          >
            {p.label}
          </button>
        ))}
        {(range.from || range.to) && (
          <button
            className="ml-2 text-gray-600 text-xs underline"
            onClick={() => setRange(getTodayRange())}
            type="button"
          >Limpiar</button>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;
