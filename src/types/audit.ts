export interface AuditLog {
  id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  table_name: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  additional_data?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface PedidoAuditView {
  id: string;
  user_email?: string;
  action: string;
  pedido_id: string;
  old_values?: any;
  new_values?: any;
  additional_data?: any;
  created_at: string;
  action_description: string;
}

export interface AuditFilters {
  table_name?: string;
  action?: string;
  user_email?: string;
  date_from?: string;
  date_to?: string;
  record_id?: string;
}

export interface AuditReport {
  total_actions: number;
  actions_by_type: { [key: string]: number };
  actions_by_user: { [key: string]: number };
  actions_by_date: { [key: string]: number };
  recent_activity: AuditLog[];
}

export type AuditAction = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'CANCEL' 
  | 'STATUS_CHANGE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'IMPORT';

export const AUDIT_ACTIONS: { value: AuditAction; label: string; color: string }[] = [
  { value: 'CREATE', label: 'Crear', color: 'bg-green-100 text-green-800' },
  { value: 'UPDATE', label: 'Actualizar', color: 'bg-blue-100 text-blue-800' },
  { value: 'DELETE', label: 'Eliminar', color: 'bg-red-100 text-red-800' },
  { value: 'CANCEL', label: 'Cancelar', color: 'bg-orange-100 text-orange-800' },
  { value: 'STATUS_CHANGE', label: 'Cambio de Estado', color: 'bg-purple-100 text-purple-800' },
  { value: 'LOGIN', label: 'Inicio de Sesión', color: 'bg-gray-100 text-gray-800' },
  { value: 'LOGOUT', label: 'Cierre de Sesión', color: 'bg-gray-100 text-gray-800' },
  { value: 'EXPORT', label: 'Exportar', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'IMPORT', label: 'Importar', color: 'bg-teal-100 text-teal-800' },
];

export const AUDIT_TABLES: { value: string; label: string }[] = [
  { value: 'pedidos', label: 'Pedidos' },
  { value: 'clientes', label: 'Clientes' },
  { value: 'productos', label: 'Productos' },
  { value: 'cotizaciones', label: 'Cotizaciones' },
  { value: 'usuarios', label: 'Usuarios' },
]; 