-- Crear tabla de auditoría para registrar acciones importantes
-- Esta tabla almacenará un historial completo de cambios en el sistema

-- Verificar que la tabla pedidos existe antes de proceder
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pedidos') THEN
        RAISE EXCEPTION 'La tabla pedidos no existe. Ejecute primero las migraciones anteriores.';
    END IF;
END $$;

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

-- Crear índices para mejorar el rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Crear índice compuesto para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_action_date ON audit_logs(table_name, action, created_at);

-- Agregar comentarios a la tabla
COMMENT ON TABLE audit_logs IS 'Tabla de auditoría para registrar todas las acciones importantes en el sistema';
COMMENT ON COLUMN audit_logs.user_id IS 'ID del usuario que realizó la acción (referencia a auth.users)';
COMMENT ON COLUMN audit_logs.user_email IS 'Email del usuario al momento de la acción';
COMMENT ON COLUMN audit_logs.action IS 'Tipo de acción realizada (CREATE, UPDATE, DELETE, etc.)';
COMMENT ON COLUMN audit_logs.table_name IS 'Nombre de la tabla afectada';
COMMENT ON COLUMN audit_logs.record_id IS 'ID del registro afectado';
COMMENT ON COLUMN audit_logs.old_values IS 'Valores anteriores (para UPDATE/DELETE)';
COMMENT ON COLUMN audit_logs.new_values IS 'Valores nuevos (para CREATE/UPDATE)';
COMMENT ON COLUMN audit_logs.additional_data IS 'Datos adicionales específicos de la acción';
COMMENT ON COLUMN audit_logs.ip_address IS 'Dirección IP del usuario';
COMMENT ON COLUMN audit_logs.user_agent IS 'User agent del navegador';

-- Función helper para registrar auditoría
CREATE OR REPLACE FUNCTION log_audit_event(
    p_action TEXT,
    p_table_name TEXT,
    p_record_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_additional_data JSONB DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_user_email TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO audit_logs (
        user_id,
        user_email,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        additional_data
    ) VALUES (
        p_user_id,
        p_user_email,
        p_action,
        p_table_name,
        p_record_id,
        p_old_values,
        p_new_values,
        p_additional_data
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agregar comentario a la función
COMMENT ON FUNCTION log_audit_event IS 'Función helper para registrar eventos de auditoría de forma segura';

-- Función para obtener historial de auditoría de un registro específico
CREATE OR REPLACE FUNCTION get_audit_history(
    p_table_name TEXT,
    p_record_id UUID
)
RETURNS TABLE (
    id UUID,
    user_email TEXT,
    action TEXT,
    old_values JSONB,
    new_values JSONB,
    additional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.id,
        al.user_email,
        al.action,
        al.old_values,
        al.new_values,
        al.additional_data,
        al.created_at
    FROM audit_logs al
    WHERE al.table_name = p_table_name 
    AND al.record_id = p_record_id
    ORDER BY al.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Agregar comentario a la función
COMMENT ON FUNCTION get_audit_history IS 'Función para obtener el historial de auditoría de un registro específico';

-- Función para obtener auditoría de un usuario específico
CREATE OR REPLACE FUNCTION get_user_audit_history(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    action TEXT,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    additional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.id,
        al.action,
        al.table_name,
        al.record_id,
        al.old_values,
        al.new_values,
        al.additional_data,
        al.created_at
    FROM audit_logs al
    WHERE al.user_id = p_user_id
    ORDER BY al.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Agregar comentario a la función
COMMENT ON FUNCTION get_user_audit_history IS 'Función para obtener el historial de auditoría de un usuario específico';

-- Política RLS para audit_logs (solo administradores pueden ver)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción desde funciones
CREATE POLICY "Allow audit log insertion" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- Política para permitir lectura solo a administradores
CREATE POLICY "Allow admin read audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Crear vista para auditoría de pedidos (más fácil de consultar)
CREATE OR REPLACE VIEW pedidos_audit_view AS
SELECT 
    al.id,
    al.user_email,
    al.action,
    al.record_id as pedido_id,
    al.old_values,
    al.new_values,
    al.additional_data,
    al.created_at,
    CASE 
        WHEN al.action = 'CREATE' THEN 'Pedido creado'
        WHEN al.action = 'UPDATE' THEN 'Pedido actualizado'
        WHEN al.action = 'DELETE' THEN 'Pedido eliminado'
        WHEN al.action = 'CANCEL' THEN 'Pedido cancelado'
        WHEN al.action = 'STATUS_CHANGE' THEN 'Estado cambiado'
        ELSE al.action
    END as action_description
FROM audit_logs al
WHERE al.table_name = 'pedidos'
ORDER BY al.created_at DESC;

-- Agregar comentario a la vista
COMMENT ON VIEW pedidos_audit_view IS 'Vista simplificada para consultar auditoría de pedidos';

-- Función para limpiar logs antiguos (mantener solo últimos 2 años)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '2 years';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agregar comentario a la función
COMMENT ON FUNCTION cleanup_old_audit_logs IS 'Función para limpiar logs de auditoría antiguos (más de 2 años)'; 