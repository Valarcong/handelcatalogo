// Utilidades de validación y sanitización para seguridad

/**
 * Sanitiza texto para prevenir XSS
 */
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim();
};

/**
 * Valida email
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida teléfono (formato peruano)
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Acepta formatos: 9XXXXXXXX, +519XXXXXXXX, 519XXXXXXXX
  const phoneRegex = /^(\+?51)?9\d{8}$/;
  const cleanPhone = phone.replace(/\s|-/g, '');
  return phoneRegex.test(cleanPhone);
};

/**
 * Valida RUC peruano
 */
export const isValidRUC = (ruc: string): boolean => {
  if (!ruc || typeof ruc !== 'string') return false;
  
  const cleanRUC = ruc.replace(/\s|-/g, '');
  return /^\d{11}$/.test(cleanRUC);
};

/**
 * Valida que un número esté en un rango
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return typeof value === 'number' && value >= min && value <= max;
};

/**
 * Valida que un string tenga longitud mínima y máxima
 */
export const isValidLength = (text: string, min: number, max: number): boolean => {
  if (typeof text !== 'string') return false;
  const length = text.trim().length;
  return length >= min && length <= max;
};

/**
 * Valida precio (debe ser positivo)
 */
export const isValidPrice = (price: number): boolean => {
  return typeof price === 'number' && price >= 0 && isFinite(price);
};

/**
 * Valida cantidad (debe ser entero positivo)
 */
export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0;
};

/**
 * Sanitiza y valida datos de cliente
 */
export const validateClienteData = (data: any) => {
  const errors: string[] = [];
  
  // Validar nombre
  if (!data.nombre || !isValidLength(data.nombre, 2, 100)) {
    errors.push('El nombre debe tener entre 2 y 100 caracteres');
  }
  
  // Validar email si se proporciona
  if (data.email && !isValidEmail(data.email)) {
    errors.push('El email no tiene un formato válido');
  }
  
  // Validar teléfono si se proporciona
  if (data.telefono && !isValidPhone(data.telefono)) {
    errors.push('El teléfono no tiene un formato válido');
  }
  
  // Validar RUC si es empresa
  if (data.es_empresa && data.ruc && !isValidRUC(data.ruc)) {
    errors.push('El RUC no tiene un formato válido');
  }
  
  // Validar razón social si es empresa
  if (data.es_empresa && (!data.razon_social || !isValidLength(data.razon_social, 2, 200))) {
    errors.push('La razón social debe tener entre 2 y 200 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      nombre: sanitizeText(data.nombre || ''),
      email: data.email ? sanitizeText(data.email) : null,
      telefono: data.telefono ? sanitizeText(data.telefono) : null,
      es_empresa: Boolean(data.es_empresa),
      ruc: data.ruc ? sanitizeText(data.ruc) : null,
      razon_social: data.razon_social ? sanitizeText(data.razon_social) : null,
    }
  };
};

/**
 * Sanitiza y valida datos de producto
 */
export const validateProductData = (data: any) => {
  const errors: string[] = [];
  
  // Validar nombre
  if (!data.name || !isValidLength(data.name, 2, 200)) {
    errors.push('El nombre debe tener entre 2 y 200 caracteres');
  }
  
  // Validar código
  if (!data.code || !isValidLength(data.code, 1, 50)) {
    errors.push('El código debe tener entre 1 y 50 caracteres');
  }
  
  // Validar descripción
  if (data.description && !isValidLength(data.description, 0, 1000)) {
    errors.push('La descripción no puede exceder 1000 caracteres');
  }
  
  // Validar precios
  if (!isValidPrice(data.unitPrice)) {
    errors.push('El precio unitario debe ser un número positivo');
  }
  
  if (!isValidPrice(data.wholesalePrice)) {
    errors.push('El precio mayorista debe ser un número positivo');
  }
  
  // Validar cantidad mínima
  if (!isValidQuantity(data.minimumWholesaleQuantity)) {
    errors.push('La cantidad mínima para mayorista debe ser un entero positivo');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      name: sanitizeText(data.name || ''),
      code: sanitizeText(data.code || ''),
      description: data.description ? sanitizeText(data.description) : '',
      brand: sanitizeText(data.brand || 'omegaplast'),
      category: sanitizeText(data.category || ''),
      unitPrice: Number(data.unitPrice) || 0,
      wholesalePrice: Number(data.wholesalePrice) || 0,
      minimumWholesaleQuantity: Number(data.minimumWholesaleQuantity) || 10,
      image: data.image || '/placeholder.svg',
      tags: Array.isArray(data.tags) ? data.tags.map(sanitizeText) : [],
    }
  };
};

/**
 * Valida datos de pedido
 */
export const validateOrderData = (data: any) => {
  const errors: string[] = [];
  
  // Validar nombre del cliente
  if (!data.cliente_nombre || !isValidLength(data.cliente_nombre, 2, 100)) {
    errors.push('El nombre del cliente debe tener entre 2 y 100 caracteres');
  }
  
  // Validar contacto (email o teléfono)
  const hasEmail = data.cliente_email && isValidEmail(data.cliente_email);
  const hasPhone = data.cliente_telefono && isValidPhone(data.cliente_telefono);
  
  if (!hasEmail && !hasPhone) {
    errors.push('Debe proporcionar un email o teléfono válido');
  }
  
  // Validar productos
  if (!Array.isArray(data.productos) || data.productos.length === 0) {
    errors.push('Debe agregar al menos un producto');
  } else {
    data.productos.forEach((producto: any, index: number) => {
      if (!producto.nombre || !isValidLength(producto.nombre, 1, 200)) {
        errors.push(`Producto ${index + 1}: nombre inválido`);
      }
      if (!isValidQuantity(producto.cantidad)) {
        errors.push(`Producto ${index + 1}: cantidad inválida`);
      }
      if (!isValidPrice(producto.precio)) {
        errors.push(`Producto ${index + 1}: precio inválido`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      cliente_nombre: sanitizeText(data.cliente_nombre || ''),
      cliente_email: data.cliente_email ? sanitizeText(data.cliente_email) : null,
      cliente_telefono: data.cliente_telefono ? sanitizeText(data.cliente_telefono) : null,
      observaciones: data.observaciones ? sanitizeText(data.observaciones) : '',
      productos: Array.isArray(data.productos) ? data.productos.map((p: any) => ({
        nombre: sanitizeText(p.nombre || ''),
        cantidad: Number(p.cantidad) || 1,
        precio: Number(p.precio) || 0,
      })) : [],
      total: Number(data.total) || 0,
    }
  };
};

/**
 * Previene ataques de inyección en consultas SQL (básico)
 */
export const sanitizeSQLInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remover caracteres peligrosos para SQL
  return input
    .replace(/['";\\]/g, '') // Remover comillas y punto y coma
    .replace(/--/g, '') // Remover comentarios SQL
    .replace(/\/\*/g, '') // Remover comentarios multilínea
    .replace(/\*\//g, '')
    .trim();
};

/**
 * Valida URL de imagen
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol) && 
           /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname);
  } catch {
    return false;
  }
}; 