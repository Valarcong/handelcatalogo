import React, { useState } from "react";
import type { AuditFilters } from "@/types/audit";
import { AUDIT_ACTIONS, AUDIT_TABLES } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuditFiltersProps {
  onFilter: (filters: AuditFilters) => void;
  loading: boolean;
}

const AuditFilters: React.FC<AuditFiltersProps> = ({ onFilter, loading }) => {
  const [filters, setFilters] = useState<AuditFilters>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <form className="flex flex-wrap gap-2 items-end" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs mb-1">Tabla</label>
        <select
          name="table_name"
          value={filters.table_name || ''}
          onChange={handleChange}
          className="border rounded px-2 py-1 text-xs"
        >
          <option value="">Todas</option>
          {AUDIT_TABLES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1">Acción</label>
        <select
          name="action"
          value={filters.action || ''}
          onChange={handleChange}
          className="border rounded px-2 py-1 text-xs"
        >
          <option value="">Todas</option>
          {AUDIT_ACTIONS.map(a => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1">Usuario</label>
        <Input
          name="user_email"
          value={filters.user_email || ''}
          onChange={handleChange}
          placeholder="Email"
          className="text-xs"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Registro ID</label>
        <Input
          name="record_id"
          value={filters.record_id || ''}
          onChange={handleChange}
          placeholder="UUID"
          className="text-xs"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Desde</label>
        <Input
          type="date"
          name="date_from"
          value={filters.date_from || ''}
          onChange={handleChange}
          className="text-xs"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Hasta</label>
        <Input
          type="date"
          name="date_to"
          value={filters.date_to || ''}
          onChange={handleChange}
          className="text-xs"
        />
      </div>
      <Button type="submit" size="sm" className="text-xs" disabled={loading}>
        Filtrar
      </Button>
      <Button type="button" size="sm" variant="outline" className="text-xs" onClick={handleReset} disabled={loading}>
        Limpiar
      </Button>
    </form>
  );
};

export default AuditFilters; 