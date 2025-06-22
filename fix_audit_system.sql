-- Script para verificar y corregir el sistema de auditoría
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Verificar si la tabla audit_logs existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audit_logs') THEN
        RAISE NOTICE 'La tabla audit_logs NO existe. Ejecute primero la migración 20250116000002_create_audit_logs.sql';
    ELSE
        RAISE NOTICE '✅ La tabla audit_logs existe';
    END IF;
END $$;

-- 2. Verificar si RLS está habilitado
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'audit_logs' AND rowsecurity = true) THEN
        RAISE NOTICE '✅ RLS está habilitado en audit_logs';
    ELSE
        RAISE NOTICE '⚠️ RLS NO está habilitado en audit_logs';
        ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE '✅ RLS habilitado';
    END IF;
END $$;

-- 3. Verificar y corregir políticas
DO $$
BEGIN
    -- Verificar política de inserción
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Allow audit log insertion') THEN
        RAISE NOTICE 'Creando política de inserción...';
        CREATE POLICY "Allow audit log insertion" ON audit_logs
            FOR INSERT WITH CHECK (true);
        RAISE NOTICE '✅ Política de inserción creada';
    ELSE
        RAISE NOTICE '✅ Política de inserción ya existe';
    END IF;
    
    -- Verificar política de lectura
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Allow admin read audit logs') THEN
        RAISE NOTICE 'Creando política de lectura...';
        CREATE POLICY "Allow admin read audit logs" ON audit_logs
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM auth.users 
                    WHERE auth.users.id = auth.uid() 
                    AND auth.users.raw_user_meta_data->>'role' = 'admin'
                )
            );
        RAISE NOTICE '✅ Política de lectura creada';
    ELSE
        RAISE NOTICE '✅ Política de lectura ya existe';
    END IF;
END $$;

-- 4. Verificar y crear funciones
DO $$
BEGIN
    -- Verificar función log_audit_event
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'log_audit_event') THEN
        RAISE NOTICE 'Creando función log_audit_event...';
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
        RAISE NOTICE '✅ Función log_audit_event creada';
    ELSE
        RAISE NOTICE '✅ Función log_audit_event ya existe';
    END IF;
    
    -- Verificar función get_audit_history
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_audit_history') THEN
        RAISE NOTICE 'Creando función get_audit_history...';
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
        RAISE NOTICE '✅ Función get_audit_history creada';
    ELSE
        RAISE NOTICE '✅ Función get_audit_history ya existe';
    END IF;
    
    -- Verificar función get_user_audit_history
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_user_audit_history') THEN
        RAISE NOTICE 'Creando función get_user_audit_history...';
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
        RAISE NOTICE '✅ Función get_user_audit_history creada';
    ELSE
        RAISE NOTICE '✅ Función get_user_audit_history ya existe';
    END IF;
    
    -- Verificar función cleanup_old_audit_logs
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'cleanup_old_audit_logs') THEN
        RAISE NOTICE 'Creando función cleanup_old_audit_logs...';
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
        RAISE NOTICE '✅ Función cleanup_old_audit_logs creada';
    ELSE
        RAISE NOTICE '✅ Función cleanup_old_audit_logs ya existe';
    END IF;
END $$;

-- 5. Verificar y crear vista
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'pedidos_audit_view') THEN
        RAISE NOTICE 'Creando vista pedidos_audit_view...';
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
        RAISE NOTICE '✅ Vista pedidos_audit_view creada';
    ELSE
        RAISE NOTICE '✅ Vista pedidos_audit_view ya existe';
    END IF;
END $$;

-- 6. Verificar y crear índices
DO $$
BEGIN
    -- Verificar índices
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_audit_logs_user_id') THEN
        CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
        RAISE NOTICE '✅ Índice idx_audit_logs_user_id creado';
    ELSE
        RAISE NOTICE '✅ Índice idx_audit_logs_user_id ya existe';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_audit_logs_action') THEN
        CREATE INDEX idx_audit_logs_action ON audit_logs(action);
        RAISE NOTICE '✅ Índice idx_audit_logs_action creado';
    ELSE
        RAISE NOTICE '✅ Índice idx_audit_logs_action ya existe';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_audit_logs_table_name') THEN
        CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
        RAISE NOTICE '✅ Índice idx_audit_logs_table_name creado';
    ELSE
        RAISE NOTICE '✅ Índice idx_audit_logs_table_name ya existe';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_audit_logs_created_at') THEN
        CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
        RAISE NOTICE '✅ Índice idx_audit_logs_created_at creado';
    ELSE
        RAISE NOTICE '✅ Índice idx_audit_logs_created_at ya existe';
    END IF;
END $$;

-- 7. Insertar log de verificación
DO $$
BEGIN
    -- Solo insertar si no hay logs de verificación recientes
    IF NOT EXISTS (SELECT 1 FROM audit_logs WHERE record_id = 'system-verification' AND created_at > NOW() - INTERVAL '1 hour') THEN
        INSERT INTO audit_logs (
            user_email,
            action,
            table_name,
            record_id,
            new_values,
            additional_data
        ) VALUES (
            'system@handel.com',
            'SYSTEM_CHECK',
            'audit_logs',
            'system-verification',
            '{"check": "audit_system_verification", "status": "completed", "timestamp": "' || NOW() || '"}',
            '{"description": "Verificación del sistema de auditoría completada"}'
        );
        RAISE NOTICE '✅ Log de verificación insertado';
    ELSE
        RAISE NOTICE '✅ Log de verificación ya existe (reciente)';
    END IF;
END $$;

-- 8. Mostrar resumen final
SELECT 
    'SISTEMA DE AUDITORÍA VERIFICADO' as status,
    COUNT(*) as total_logs,
    MAX(created_at) as last_activity
FROM audit_logs; 