import React, { useEffect } from "react";
import type { AuditReport } from "@/types/audit";
import { Button } from "@/components/ui/button";

interface AuditReportProps {
  report: AuditReport | null;
  loading: boolean;
  onGenerate: () => void;
}

const AuditReport: React.FC<AuditReportProps> = ({ report, loading, onGenerate }) => {
  useEffect(() => {
    if (!report) onGenerate();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Reporte de Auditoría</h2>
        <Button onClick={onGenerate} disabled={loading} size="sm">
          {loading ? "Generando..." : "Actualizar Reporte"}
        </Button>
      </div>
      {!report ? (
        <div className="text-gray-500">No hay datos para mostrar.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Resumen</h3>
            <ul className="text-sm space-y-1">
              <li>Total de acciones: <b>{report.total_actions}</b></li>
              <li>Usuarios únicos: <b>{Object.keys(report.actions_by_user).length}</b></li>
              <li>Tipos de acción: <b>{Object.keys(report.actions_by_type).length}</b></li>
              <li>Días con actividad: <b>{Object.keys(report.actions_by_date).length}</b></li>
            </ul>
            <h4 className="mt-4 font-semibold">Acciones recientes</h4>
            <ul className="text-xs mt-2 space-y-1 max-h-40 overflow-auto">
              {report.recent_activity.map(log => (
                <li key={log.id} className="border-b py-1">
                  <span className="font-mono text-xs">{new Date(log.created_at).toLocaleString("es-PE")}</span> —
                  <span className="ml-1 font-semibold">{log.action}</span> —
                  <span className="ml-1">{log.user_email || 'Sin usuario'}</span>
                  <span className="ml-1 text-gray-500">({log.table_name})</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Acciones por tipo</h3>
            <ul className="text-sm space-y-1">
              {Object.entries(report.actions_by_type).map(([action, count]) => (
                <li key={action} className="flex justify-between">
                  <span>{action}</span>
                  <span className="font-bold">{count}</span>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold mt-4 mb-2">Acciones por usuario</h3>
            <ul className="text-sm space-y-1 max-h-32 overflow-auto">
              {Object.entries(report.actions_by_user).map(([user, count]) => (
                <li key={user} className="flex justify-between">
                  <span>{user}</span>
                  <span className="font-bold">{count}</span>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold mt-4 mb-2">Acciones por día</h3>
            <ul className="text-xs space-y-1 max-h-32 overflow-auto">
              {Object.entries(report.actions_by_date).map(([date, count]) => (
                <li key={date} className="flex justify-between">
                  <span>{date}</span>
                  <span className="font-bold">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditReport; 