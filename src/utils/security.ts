// Utilidades de seguridad adicionales

/**
 * Configuración de Content Security Policy
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'font-src': ["'self'", "https://fonts.gstatic.com"],
  'img-src': ["'self'", "data:", "https:", "blob:"],
  'connect-src': ["'self'", "https://*.supabase.co"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

/**
 * Headers de seguridad recomendados
 */
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

/**
 * Validar y sanitizar entrada de usuario
 */
export class InputSanitizer {
  /**
   * Sanitiza HTML para prevenir XSS
   */
  static sanitizeHTML(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitiza URLs
   */
  static sanitizeURL(url: string): string {
    if (typeof url !== 'string') return '';
    
    try {
      const urlObj = new URL(url);
      // Solo permitir HTTP y HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return '';
      }
      return urlObj.toString();
    } catch {
      return '';
    }
  }

  /**
   * Sanitiza números
   */
  static sanitizeNumber(value: any): number {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Sanitiza booleanos
   */
  static sanitizeBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
    }
    return Boolean(value);
  }
}

/**
 * Validación de rate limiting básica
 */
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();

  /**
   * Verificar si una acción está permitida
   */
  static isAllowed(key: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Limpiar registros expirados
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

/**
 * Validación de permisos
 */
export class PermissionValidator {
  /**
   * Verificar si el usuario tiene permisos para una acción
   */
  static hasPermission(user: any, permission: string): boolean {
    if (!user || !user.roles) return false;
    
    return user.roles.some((role: any) => 
      role.permisos && role.permisos.includes(permission)
    );
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  static hasRole(user: any, roleName: string): boolean {
    if (!user || !user.roles) return false;
    
    return user.roles.some((role: any) => role.nombre === roleName);
  }

  /**
   * Verificar si el usuario puede acceder a un recurso
   */
  static canAccessResource(user: any, resourceOwnerId: string): boolean {
    if (!user) return false;
    
    // Administradores pueden acceder a todo
    if (this.hasRole(user, 'Administrador')) return true;
    
    // Usuarios solo pueden acceder a sus propios recursos
    return user.id === resourceOwnerId;
  }
}

/**
 * Auditoría de acciones
 */
export class AuditLogger {
  /**
   * Registrar una acción del usuario
   */
  static logAction(userId: string, action: string, details: any = {}): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      action,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // En producción, enviar a un servicio de logging
    console.log('AUDIT LOG:', logEntry);
  }

  /**
   * Registrar acceso a recursos sensibles
   */
  static logSensitiveAccess(userId: string, resource: string): void {
    this.logAction(userId, 'SENSITIVE_ACCESS', { resource });
  }

  /**
   * Registrar cambios en datos críticos
   */
  static logDataChange(userId: string, table: string, recordId: string, changes: any): void {
    this.logAction(userId, 'DATA_CHANGE', { table, recordId, changes });
  }
}

/**
 * Validación de sesión
 */
export class SessionValidator {
  /**
   * Verificar si la sesión es válida
   */
  static isSessionValid(session: any): boolean {
    if (!session) return false;
    
    // Verificar que la sesión no haya expirado
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return false;
    }
    
    return true;
  }

  /**
   * Verificar si el token es válido
   */
  static isTokenValid(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    // Verificar formato básico del token JWT
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Decodificar el payload (sin verificar la firma)
      const payload = JSON.parse(atob(parts[1]));
      
      // Verificar expiración
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Configuración de seguridad global
 */
export const SECURITY_CONFIG = {
  // Configuración de contraseñas
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  
  // Configuración de sesión
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    refreshThreshold: 60 * 60 * 1000 // 1 hora
  },
  
  // Configuración de rate limiting
  rateLimit: {
    login: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 intentos en 15 minutos
    api: { limit: 100, windowMs: 60 * 1000 }, // 100 requests por minuto
    upload: { limit: 10, windowMs: 60 * 1000 } // 10 uploads por minuto
  },
  
  // Configuración de archivos
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    scanForViruses: true
  }
}; 