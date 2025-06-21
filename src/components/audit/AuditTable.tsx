import React from "react";
import { AuditLog, AUDIT_ACTIONS } from "@/types/audit";
import { Button } from "@/components/ui/button";

interface AuditTableProps {
  logs: AuditLog[];
  loading: boolean;
  onExport: () => void;
}

const AuditTable: React.FC<AuditTableProps> = ({ logs, loading, onExport }) => {
  return (
    <div className="border rounded-lg overflow-x-auto bg-white">
      <div className="flex items-center justify-between px-4 pt-3">
        <label className="text-xs font-medium">Registros de Auditoría</label>
        <Button size="sm" variant="outline" onClick={onExport} disabled={loading}>
          Exportar CSV
        </Button>
      </div>
      <div className="p-2 pt-1">
        <table className="min-w-full bg-transparent text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 font-semibold">Fecha</th>
              <th className="px-2 py-1 font-semibold">Usuario</th>
              <th className="px-2 py-1 font-semibold">Acción</th>
              <th className="px-2 py-1 font-semibold">Tabla</th>
              <th className="px-2 py-1 font-semibold">Registro</th>
              <th className="px-2 py-1 font-semibold">Datos Anteriores</th>
              <th className="px-2 py-1 font-semibold">Datos Nuevos</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Cargando...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4 text-gray-400">Sin registros</td></tr>
            ) : (
              logs.map((log) => {
                const actionMeta = AUDIT_ACTIONS.find(a => a.value === log.action);
                return (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-1 whitespace-nowrap">{new Date(log.created_at).toLocaleString("es-PE")}</td>
                    <td className="px-2 py-1">{log.user_email || <span className="text-gray-400">-</span>}</td>
                    <td className={`px-2 py-1 font-semibold ${actionMeta?.color || ''}`}>{actionMeta?.label || log.action}</td>
                    <td className="px-2 py-1">{log.table_name}</td>
                    <td className="px-2 py-1 font-mono text-xs">{log.record_id || '-'}</td>
                    <td className="px-2 py-1 max-w-xs truncate">
                      <pre className="whitespace-pre-wrap break-all text-xs bg-gray-100 rounded p-1 max-h-24 overflow-auto">{log.old_values ? JSON.stringify(log.old_values, null, 2) : '-'}</pre>
                    </td>
                    <td className="px-2 py-1 max-w-xs truncate">
                      <pre className="whitespace-pre-wrap break-all text-xs bg-green-50 rounded p-1 max-h-24 overflow-auto">{log.new_values ? JSON.stringify(log.new_values, null, 2) : '-'}</pre>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTable; 