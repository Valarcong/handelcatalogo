import { useState } from "react";
import { AuditLog, PedidoAuditView, AuditFilters, AuditReport } from "@/types/audit";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAudit() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [pedidoAuditLogs, setPedidoAuditLogs] = useState<PedidoAuditView[]>([]);
  const [report, setReport] = useState<AuditReport | null>(null);

  // Obtener logs de auditoría general
  const fetchAuditLogs = async (filters?: AuditFilters, limit: number = 100) => {
    setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Aplicar filtros
      if (filters?.table_name) {
        query = query.eq('table_name', filters.table_name);
      }
      if (filters?.action) {
        query = query.eq('action', filters.action);
      }
      if (filters?.user_email) {
        query = query.ilike('user_email', `%${filters.user_email}%`);
      }
      if (filters?.record_id) {
        query = query.eq('record_id', filters.record_id);
      }
      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to + 'T23:59:59');
      }

      const { data, error } = await query;

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Sistema de Auditoría",
            description: "La tabla de auditoría no está configurada. Contacta al administrador.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        setAuditLogs([]);
        return [];
      }

      setAuditLogs(data || []);
      return data || [];
    } catch (error) {
      console.error('Error in fetchAuditLogs:', error);
      toast({
        title: "Error",
        description: "Error inesperado al cargar logs de auditoría",
        variant: "destructive",
      });
      setAuditLogs([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener logs de auditoría de pedidos específicos
  const fetchPedidoAuditLogs = async (pedidoId?: string, limit: number = 50) => {
    setLoading(true);
    try {
      let query = supabase
        .from('pedidos_audit_view')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (pedidoId) {
        query = query.eq('pedido_id', pedidoId);
      }

      const { data, error } = await query;

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Sistema de Auditoría",
            description: "La vista de auditoría de pedidos no está configurada.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        setPedidoAuditLogs([]);
        return [];
      }

      setPedidoAuditLogs(data || []);
      return data || [];
    } catch (error) {
      console.error('Error in fetchPedidoAuditLogs:', error);
      toast({
        title: "Error",
        description: "Error inesperado al cargar logs de pedidos",
        variant: "destructive",
      });
      setPedidoAuditLogs([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener historial de auditoría de un registro específico
  const fetchRecordAuditHistory = async (tableName: string, recordId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_audit_history', {
          p_table_name: tableName,
          p_record_id: recordId
        });

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Sistema de Auditoría",
            description: "Las funciones de auditoría no están configuradas.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchRecordAuditHistory:', error);
      toast({
        title: "Error",
        description: "Error inesperado al obtener historial",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener historial de auditoría de un usuario específico
  const fetchUserAuditHistory = async (userId: string, limit: number = 50) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_user_audit_history', {
          p_user_id: userId,
          p_limit: limit
        });

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Sistema de Auditoría",
            description: "Las funciones de auditoría no están configuradas.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchUserAuditHistory:', error);
      toast({
        title: "Error",
        description: "Error inesperado al obtener historial del usuario",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Generar reporte de auditoría
  const generateAuditReport = async (filters?: AuditFilters) => {
    setLoading(true);
    try {
      // Obtener logs para el reporte
      const logs = await fetchAuditLogs(filters, 1000);
      
      // Procesar datos para el reporte
      const actionsByType: Record<string, number> = {};
      const actionsByUser: Record<string, number> = {};
      const actionsByDate: Record<string, number> = {};
      
      logs.forEach(log => {
        // Por tipo de acción
        actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
        
        // Por usuario
        const user = log.user_email || 'Sin usuario';
        actionsByUser[user] = (actionsByUser[user] || 0) + 1;
        
        // Por fecha
        const date = new Date(log.created_at).toLocaleDateString('es-PE');
        actionsByDate[date] = (actionsByDate[date] || 0) + 1;
      });

      const report: AuditReport = {
        total_actions: logs.length,
        actions_by_type: actionsByType,
        actions_by_user: actionsByUser,
        actions_by_date: actionsByDate,
        recent_activity: logs.slice(0, 10)
      };
      
      setReport(report);
      return report;
    } catch (error) {
      console.error('Error generating audit report:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el reporte de auditoría",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Exportar logs a CSV
  const exportAuditLogs = async (filters?: AuditFilters) => {
    try {
      const logs = await fetchAuditLogs(filters, 10000);
      
      if (logs.length === 0) {
        toast({
          title: "Sin datos",
          description: "No hay logs para exportar con los filtros aplicados",
          variant: "default",
        });
        return;
      }

      // Crear CSV
      const headers = ['Fecha', 'Usuario', 'Acción', 'Tabla', 'Registro ID', 'Datos Anteriores', 'Datos Nuevos'];
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          new Date(log.created_at).toLocaleString('es-PE'),
          log.user_email || '',
          log.action,
          log.table_name,
          log.record_id || '',
          JSON.stringify(log.old_values || {}),
          JSON.stringify(log.new_values || {})
        ].join(','))
      ].join('\n');

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportación exitosa",
        description: `Se exportaron ${logs.length} registros de auditoría`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast({
        title: "Error",
        description: "No se pudo exportar los logs",
        variant: "destructive",
      });
    }
  };

  return {
    // Estado
    auditLogs,
    pedidoAuditLogs,
    report,
    loading,
    
    // Funciones
    fetchAuditLogs,
    fetchPedidoAuditLogs,
    fetchRecordAuditHistory,
    fetchUserAuditHistory,
    generateAuditReport,
    exportAuditLogs,
  };
} 