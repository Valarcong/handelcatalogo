# 🔍 Sistema de Auditoría - Handel Catálogo

## 📋 Descripción General

El sistema de auditoría registra automáticamente todas las acciones importantes realizadas en el sistema, proporcionando un historial completo de cambios para fines de seguridad, cumplimiento y trazabilidad.

## 🏗️ Arquitectura del Sistema

### **Tablas Principales**

1. **`audit_logs`** - Tabla principal de auditoría
2. **`pedidos_audit_view`** - Vista especializada para auditoría de pedidos

### **Funciones de Base de Datos**

- `log_audit_event()` - Registrar eventos de auditoría
- `get_audit_history()` - Obtener historial de un registro
- `get_user_audit_history()` - Obtener historial de un usuario
- `cleanup_old_audit_logs()` - Limpiar logs antiguos

## 📊 Tipos de Acciones Registradas

### **Acciones de Productos**
- `CREATE` - Crear producto
- `UPDATE` - Actualizar producto
- `DELETE` - Eliminar producto

### **Acciones de Pedidos**
- `CREATE` - Crear pedido
- `UPDATE` - Actualizar pedido
- `DELETE` - Eliminar pedido
- `CANCEL` - Cancelar pedido
- `STATUS_CHANGE` - Cambiar estado

### **Acciones de Usuarios**
- `LOGIN` - Inicio de sesión
- `LOGOUT` - Cierre de sesión

### **Acciones de Datos**
- `EXPORT` - Exportar datos
- `IMPORT` - Importar datos

## 🔧 Configuración

### **1. Migración de Base de Datos**

La migración `20250116000002_create_audit_logs.sql` debe estar ejecutada en Supabase:

```sql
-- Crear tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    additional_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **2. Políticas de Seguridad (RLS)**

```sql
-- Solo administradores pueden ver logs
CREATE POLICY "Allow admin read audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );
```

### **3. Índices para Rendimiento**

```sql
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
```

## 🚀 Funcionalidades

### **1. Panel de Auditoría**

**Ubicación:** Admin > Auditoría

**Características:**
- ✅ Vista de registros de auditoría
- ✅ Filtros avanzados por tabla, acción, usuario, fecha
- ✅ Generación de reportes
- ✅ Exportación a CSV
- ✅ Vista previa de cambios (valores anteriores y nuevos)

### **2. Filtros Disponibles**

- **Tabla:** pedidos, productos, clientes, cotizaciones, usuarios
- **Acción:** CREATE, UPDATE, DELETE, CANCEL, STATUS_CHANGE, etc.
- **Usuario:** Email del usuario que realizó la acción
- **Fecha:** Rango de fechas personalizable
- **Registro ID:** ID específico del registro

### **3. Reportes**

**Información incluida:**
- Total de acciones
- Acciones por tipo
- Acciones por usuario
- Acciones por fecha
- Actividad reciente

## 📱 Interfaz de Usuario

### **Pestaña "Registros"**
- Tabla con todos los logs de auditoría
- Filtros en la parte superior
- Botón de exportación
- Vista detallada de cambios

### **Pestaña "Reportes"**
- Resumen estadístico
- Gráficos de actividad
- Acciones por usuario
- Actividad por fecha

## 🔍 Ejemplos de Uso

### **1. Verificar Cambios en un Producto**

```typescript
// Obtener historial de un producto específico
const history = await fetchRecordAuditHistory('productos', 'product-id-123');
```

### **2. Auditoría de Usuario**

```typescript
// Ver todas las acciones de un usuario
const userHistory = await fetchUserAuditHistory('user-id-123', 50);
```

### **3. Exportar Logs**

```typescript
// Exportar logs filtrados a CSV
await exportAuditLogs({
  table_name: 'pedidos',
  date_from: '2024-01-01',
  date_to: '2024-12-31'
});
```

## 🛡️ Seguridad

### **Acceso Restringido**
- Solo usuarios con rol "Administrador" pueden acceder
- Políticas RLS configuradas
- Logs de acceso registrados

### **Datos Sensibles**
- No se registran contraseñas
- Información personal limitada
- IP y User Agent registrados para trazabilidad

### **Retención de Datos**
- Logs se mantienen por 2 años
- Función automática de limpieza
- Backup automático en Supabase

## 🔧 Integración con el Sistema

### **Registro Automático**

El sistema registra automáticamente:

1. **Cambios en Productos:**
   - Creación, actualización, eliminación
   - Cambios de precio, categoría, stock

2. **Cambios en Pedidos:**
   - Creación, actualización, cancelación
   - Cambios de estado
   - Modificaciones de productos

3. **Acciones de Usuarios:**
   - Inicios de sesión
   - Exportaciones/importaciones
   - Acciones administrativas

### **Función de Registro**

```typescript
// Ejemplo de uso en el código
await supabase.rpc('log_audit_event', {
  p_action: 'UPDATE',
  p_table_name: 'productos',
  p_record_id: productId,
  p_old_values: oldData,
  p_new_values: newData,
  p_user_id: userId,
  p_user_email: userEmail
});
```

## 📈 Monitoreo y Alertas

### **Métricas Importantes**
- Número de acciones por día
- Usuarios más activos
- Tablas más modificadas
- Acciones de eliminación

### **Alertas Recomendadas**
- Múltiples eliminaciones en corto tiempo
- Acciones fuera del horario laboral
- Usuarios con muchas acciones
- Cambios en productos críticos

## 🚨 Solución de Problemas

### **Sistema no disponible**
1. Verificar que la migración esté ejecutada
2. Confirmar políticas RLS
3. Verificar permisos de usuario

### **Sin datos mostrados**
1. Verificar que haya acciones registradas
2. Revisar filtros aplicados
3. Confirmar permisos de lectura

### **Error de exportación**
1. Verificar que haya datos para exportar
2. Confirmar permisos de escritura
3. Revisar límites de tamaño

## 📞 Soporte

### **Para Administradores:**
1. Revisar logs de Supabase
2. Verificar configuración de RLS
3. Confirmar migraciones ejecutadas

### **Para Desarrolladores:**
1. Documentación de API en código
2. Ejemplos de integración
3. Guías de implementación

---

**Nota:** Este sistema de auditoría es fundamental para el cumplimiento de políticas de seguridad y trazabilidad de datos. Se recomienda revisar regularmente los logs y configurar alertas apropiadas. 