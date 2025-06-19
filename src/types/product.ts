export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  image: string;
  brand: string;
  category: string;
  unitPrice: number;
  wholesalePrice: number;
  tags: string[];
  minimumWholesaleQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Types that match Supabase schema
export interface DbProduct {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  marca: string;
  categoria: string;
  precio_unitario: number;
  precio_por_mayor: number;
  etiquetas: string[] | null;
  cantidad_minima_mayorista: number;
  created_at: string;
  updated_at: string;
}

export interface DbCategory {
  id: string;
  nombre: string;
  imagen_url: string | null;
  created_at: string;
}

export interface DbUser {
  id: string;
  nombre: string;
  usuario: string;
  email: string;
  created_at: string;
}

export interface DbRole {
  id: string;
  nombre: string;
  descripcion: string | null;
  permisos: string[] | null;
  activo: boolean;
  created_at: string;
}

export interface DbUserRole {
  id: string;
  usuario_id: string;
  rol_id: string;
  asignado_por: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  activo: boolean;
  created_at: string;
}

// Helper functions to transform database types to frontend types
export const transformDbProduct = (dbProduct: DbProduct): Product => ({
  id: dbProduct.id,
  name: typeof dbProduct.nombre === "string" ? dbProduct.nombre : "Producto sin nombre",
  code: typeof dbProduct.sku === "string" ? dbProduct.sku : "-",
  description: typeof dbProduct.descripcion === "string" ? dbProduct.descripcion : "",
  image:
    typeof dbProduct.imagen_url === "string" && dbProduct.imagen_url.length > 0
      ? dbProduct.imagen_url
      : "/placeholder.svg",
  brand:
    typeof dbProduct.marca === "string" && dbProduct.marca.length > 0
      ? dbProduct.marca
      : "omegaplast",
  category: typeof dbProduct.categoria === "string" ? dbProduct.categoria : "-",
  unitPrice: typeof dbProduct.precio_unitario === "number" ? Number(dbProduct.precio_unitario) : 0,
  wholesalePrice: typeof dbProduct.precio_por_mayor === "number" ? Number(dbProduct.precio_por_mayor) : 0,
  tags: Array.isArray(dbProduct.etiquetas)
    ? dbProduct.etiquetas.filter(tag => typeof tag === "string")
    : [],
  minimumWholesaleQuantity: typeof dbProduct.cantidad_minima_mayorista === "number"
    ? dbProduct.cantidad_minima_mayorista
    : 10,
  createdAt: dbProduct.created_at ? new Date(dbProduct.created_at) : new Date(),
  updatedAt: dbProduct.updated_at ? new Date(dbProduct.updated_at) : new Date(),
});

export const transformDbCategory = (dbCategory: DbCategory): Category => ({
  id: dbCategory.id,
  name: dbCategory.nombre,
  count: 0, // Will be calculated separately
  image: dbCategory.imagen_url || undefined
});
