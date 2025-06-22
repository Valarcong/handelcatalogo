import { useState } from "react";
import { DateRange } from "react-day-picker";

export function useDateFilters() {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 29);

  const defaultRange: DateRange = {
    from: past,
    to: today,
  };

  const [range, setRange] = useState<DateRange | undefined>(defaultRange);

  return { range, setRange };
}
