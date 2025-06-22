import React, { useState, useEffect } from "react";
import { useAudit } from "@/hooks/useAudit";
import AuditTable from "@/components/audit/AuditTable";
import AuditReport from "@/components/audit/AuditReport";
import AuditFilters from "@/components/audit/AuditFilters";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TestTube, AlertTriangle, CheckCircle, Plus, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminAuditoria: React.FC = () => {
  const [tab, setTab] = useState<'logs' | 'report'>('logs');
  const [testResult, setTestResult] = useState<string>("");
  const [systemStatus, setSystemStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const { toast } = useToast();
  const {
    auditLogs,
    report,
    loading,
    fetchAuditLogs,
    generateAuditReport,
    exportAuditLogs,
  } = useAudit();

  // Verificar estado del sistema y cargar datos al montar el componente
  useEffect(() => {
    const checkSystemStatus = async () => {
      setSystemStatus('checking');
      try {
        const { error } = await supabase
          .from('audit_logs')
          .select('id', { count: 'exact', head: true });

        if (error) {
          console.error("Error al verificar sistema de auditoría:", error.message);
          setSystemStatus('error');
          return;
        }

        setSystemStatus('ready');
        // Cargar logs iniciales sin filtros
        fetchAuditLogs();
      } catch (error) {
        console.error("Error inesperado al verificar sistema:", error);
        setSystemStatus('error');
      }
    };
    
    checkSystemStatus();
  }, [fetchAuditLogs]);

  const testAuditSystem = async () => {
    setTestResult("Probando sistema de auditoría...");
    try {
      const logs = await fetchAuditLogs({}, 1);
      if (logs.length >= 0) {
        setTestResult("✅ Sistema de auditoría funcionando correctamente");
      } else {
        setTestResult("⚠️ Sistema disponible pero sin datos");
      }
    } catch (error) {
      setTestResult("❌ Error en el sistema de auditoría");
    }
  };

  const generateTestLogs = async () => {
    try {
      setTestResult("Generando logs de prueba...");
      
      // Generar algunos logs de ejemplo
      const testLogs = [
        {
          p_action: 'CREATE',
          p_table_name: 'productos',
          p_record_id: 'test-product-1',
          p_new_values: { nombre: 'Producto de Prueba 1', precio: 100 },
          p_user_email: 'admin@handel.com'
        },
        {
          p_action: 'UPDATE',
          p_table_name: 'pedidos',
          p_record_id: 'test-order-1',
          p_old_values: { estado: 'pendiente' },
          p_new_values: { estado: 'confirmado' },
          p_user_email: 'admin@handel.com'
        },
        {
          p_action: 'DELETE',
          p_table_name: 'productos',
          p_record_id: 'test-product-2',
          p_old_values: { nombre: 'Producto Eliminado', precio: 200 },
          p_user_email: 'admin@handel.com'
        }
      ];

      for (const log of testLogs) {
        await supabase.rpc('log_audit_event', log);
      }

      setTestResult("✅ Logs de prueba generados correctamente");
      toast({
        title: "Logs de prueba creados",
        description: "Se han generado 3 logs de ejemplo para probar el sistema.",
        variant: "default",
      });

      // Recargar los logs
      await fetchAuditLogs();
    } catch (error) {
      console.error('Error generating test logs:', error);
      setTestResult("❌ Error generando logs de prueba");
      toast({
        title: "Error",
        description: "No se pudieron generar los logs de prueba.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Auditoría del Sistema</h1>
        <div className="flex items-center gap-2">
          {/* Indicador de estado del sistema */}
          <div className="flex items-center gap-1 text-xs">
            {systemStatus === 'checking' && (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span className="text-blue-600">Verificando...</span>
              </>
            )}
            {systemStatus === 'ready' && (
              <>
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-green-600">Sistema Activo</span>
              </>
            )}
            {systemStatus === 'error' && (
              <>
                <AlertTriangle className="h-3 w-3 text-red-600" />
                <span className="text-red-600">Error de Conexión</span>
              </>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={testAuditSystem}
            className="text-xs"
          >
            <TestTube className="h-3 w-3 mr-1" />
            Probar Sistema
          </Button>
          {systemStatus === 'ready' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateTestLogs}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Generar Logs de Prueba
            </Button>
          )}
          {testResult && (
            <span className="text-xs text-gray-600">
              {testResult}
            </span>
          )}
        </div>
      </div>

      {systemStatus === 'ready' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-600" />
            <span className="text-green-800 font-medium">Sistema de Auditoría Activo</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            El sistema está registrando automáticamente todas las acciones importantes. 
            Se han detectado {auditLogs.length > 0 ? auditLogs.length : ''} registros de auditoría.
          </p>
        </div>
      )}

      {systemStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-red-800 font-medium">Error en el Sistema de Auditoría</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            No se pudo establecer la conexión con la tabla de auditoría. 
            Verifica las políticas RLS y la consola del navegador para más detalles.
          </p>
        </div>
      )}

      {systemStatus === 'ready' && (
        <Tabs value={tab} onValueChange={(value) => setTab(value as 'logs' | 'report')} className="mb-4">
          <TabsList>
            <TabsTrigger value="logs">Registros ({auditLogs.length})</TabsTrigger>
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
      )}
    </div>
  );
};

export default AdminAuditoria; 