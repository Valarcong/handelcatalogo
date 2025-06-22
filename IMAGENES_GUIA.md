# 🖼️ Guía de Manejo de Imágenes - Handel Catálogo

## 📁 Estructura de Imágenes en el Proyecto

### 1. **Imágenes Estáticas (public/)**
```
public/
├── imagenes/
│   ├── categorias/
│   │   └── motoreductor_bg.jpeg
│   ├── logo/
│   │   ├── handel_logo_blanco_reducido.png
│   │   └── Handel_Logo_Color.png
│   └── marcas/
│       ├── WMO_MOTORS_CATEGORY_W22_BANNER_ES.png
│       ├── Fabricacion_Reductores_Especiales.png
│       └── 146300-788789702_medium (1).mp4
├── placeholder.svg
└── favicon.ico
```

### 2. **Supabase Storage (Dinámico)**
- **Bucket**: `products`
- **Carpetas**: `main`, `categories`
- **Acceso**: Público para lectura, autenticado para escritura

## 🚀 Formas de Agregar Imágenes

### **Opción 1: Seleccionar Imagen Existente** ⭐ (Recomendado)
- Usar imágenes ya disponibles en el proyecto
- Rápido y eficiente
- No consume almacenamiento adicional

**Imágenes disponibles:**
- `/imagenes/categorias/motoreductor_bg.jpeg` - Motor Reductor
- `/imagenes/marcas/WMO_MOTORS_CATEGORY_W22_BANNER_ES.png` - WMO Motors
- `/imagenes/marcas/Fabricacion_Reductores_Especiales.png` - Fabricación Reductores
- `/placeholder.svg` - Imagen por defecto

### **Opción 2: Subir Nueva Imagen** 📤
- Subir archivo desde tu computadora
- Se almacena en Supabase Storage
- URL automática generada
- Soporte para: JPG, PNG, WebP

**Proceso:**
1. Haz clic en "Subir nueva"
2. Selecciona el archivo
3. Se sube automáticamente a Supabase
4. URL generada automáticamente

### **Opción 3: URL Externa** 🌐
- Pegar URL de imagen externa
- Útil para imágenes de Google Drive, Dropbox, etc.
- Debe ser URL directa a la imagen

**Ejemplos válidos:**
- `https://drive.google.com/uc?id=123456789`
- `https://images.unsplash.com/photo-123456`
- `https://mi-sitio.com/imagen.jpg`

## 🛠️ Cómo Agregar Nuevas Imágenes al Proyecto

### **Método 1: Agregar a public/imagenes/**
1. Coloca la imagen en la carpeta correspondiente:
   - `public/imagenes/categorias/` - Para imágenes de categorías
   - `public/imagenes/marcas/` - Para logos de marcas
   - `public/imagenes/logo/` - Para logos de la empresa

2. Actualiza el array `AVAILABLE_IMAGES` en `CategoryManagement.tsx`:
```typescript
const AVAILABLE_IMAGES = [
  // ... imágenes existentes
  { value: '/imagenes/categorias/nueva-imagen.jpg', label: 'Nueva Categoría' },
];
```

### **Método 2: Subir vía Panel de Administración**
1. Ve a **Admin > Categorías**
2. Haz clic en **"Nueva Categoría"**
3. Selecciona **"Subir nueva"**
4. Sube tu imagen
5. Se almacena automáticamente en Supabase Storage

## 📋 Configuración de Supabase Storage

### **Bucket Configurado:**
- **Nombre**: `products`
- **Público**: Sí (lectura pública)
- **Políticas**: 
  - Lectura pública
  - Escritura solo para usuarios autenticados
  - Actualización/eliminación solo para propietarios

### **Carpetas Organizadas:**
- `main/` - Imágenes de productos
- `categories/` - Imágenes de categorías

## 🔧 Componente ImageUpload

El componente `ImageUpload` maneja automáticamente:
- ✅ Validación de tipos de archivo
- ✅ Generación de nombres únicos
- ✅ Subida a Supabase Storage
- ✅ Generación de URLs públicas
- ✅ Vista previa de imagen
- ✅ Manejo de errores

### **Uso:**
```typescript
<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  folder="categories"
  label="Imagen de categoría"
/>
```

## 📏 Especificaciones Técnicas

### **Formatos Soportados:**
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ✅ SVG (.svg)

### **Límites:**
- **Tamaño máximo**: 5MB por archivo
- **Resolución recomendada**: 800x600px mínimo
- **Optimización**: Automática en Supabase

### **Validaciones:**
- Tipo de archivo válido
- Tamaño dentro de límites
- URL válida (para URLs externas)

## 🎯 Mejores Prácticas

### **Para Categorías:**
1. **Usar imágenes existentes** cuando sea posible
2. **Mantener consistencia** en tamaño y estilo
3. **Optimizar** antes de subir (800x600px es ideal)
4. **Usar formatos modernos** (WebP cuando sea posible)

### **Para Productos:**
1. **Fondo blanco** para mejor presentación
2. **Resolución alta** (1200x1200px recomendado)
3. **Múltiples ángulos** si es necesario
4. **Compresión adecuada** para carga rápida

## 🚨 Solución de Problemas

### **Imagen no se muestra:**
1. Verifica que la URL sea correcta
2. Confirma que la imagen existe
3. Revisa permisos de Supabase Storage
4. Usa `/placeholder.svg` como fallback

### **Error al subir:**
1. Verifica el tamaño del archivo (< 5MB)
2. Confirma el formato soportado
3. Revisa la conexión a internet
4. Verifica permisos de Supabase

### **URL externa no funciona:**
1. Asegúrate de que sea URL directa a la imagen
2. Verifica que la imagen sea pública
3. Confirma que el dominio permita hotlinking
4. Prueba con otra URL

## 📞 Soporte

Si tienes problemas con imágenes:
1. Revisa esta guía
2. Verifica la configuración de Supabase
3. Contacta al administrador del sistema

---

**Nota**: Esta guía se actualiza automáticamente con cada nueva funcionalidad agregada al sistema de imágenes. 