import React, { useState } from "react";
import { useAudit } from "@/hooks/useAudit";
import AuditTable from "@/components/audit/AuditTable";
import AuditReport from "@/components/audit/AuditReport";
import AuditFilters from "@/components/audit/AuditFilters";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminAuditoria: React.FC = () => {
  const [tab, setTab] = useState<'logs' | 'report'>('logs');
  const {
    auditLogs,
    report,
    loading,
    fetchAuditLogs,
    generateAuditReport,
    exportAuditLogs,
  } = useAudit();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auditoría del Sistema</h1>
      <Tabs value={tab} onValueChange={(value) => setTab(value as 'logs' | 'report')} className="mb-4">
        <TabsList>
          <TabsTrigger value="logs">Registros</TabsTrigger>
          <TabsTrigger value="report">Reportes</TabsTrigger>
        </TabsList>
        <TabsContent value="logs">
          <AuditFilters onFilter={fetchAuditLogs} loading={loading} />
          <div className="mt-4">
            <AuditTable logs={auditLogs} loading={loading} onExport={exportAuditLogs} />
          </div>
        </TabsContent>
        <TabsContent value="report">
          <AuditReport report={report} loading={loading} onGenerate={generateAuditReport} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAuditoria; 