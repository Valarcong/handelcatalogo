import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category, DbProduct, DbCategory, transformDbProduct, transformDbCategory } from '@/types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [productosRes, categoriasRes] = await Promise.all([
        supabase.from('productos').select('*').order('created_at', { ascending: false }),
        supabase.from('categorias').select('*').order('nombre')
      ]);

      if (productosRes.error || categoriasRes.error) {
        console.error('Error al cargar datos:', productosRes.error || categoriasRes.error);
        setLoading(false);
        return;
      }

      const productos = (productosRes.data as DbProduct[]).map(transformDbProduct);
      const categorias = (categoriasRes.data as DbCategory[]).map(transformDbCategory);

      // Calcular conteo de productos por categoría
      const categoryMap = new Map<string, number>();
      productos.forEach(product => {
        categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
      });

      const categoriasConCount = categorias.map(cat => ({
        ...cat,
        count: categoryMap.get(cat.name) || 0
      }));

      setProducts(productos);
      setCategories(categoriasConCount);
    } catch (error) {
      console.error('Error en refreshData:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const dbProductData = {
        sku: productData.code,
        nombre: productData.name,
        descripcion: productData.description,
        imagen_url: productData.image,
        marca: productData.brand || 'omegaplast',
        categoria: productData.category,
        precio_unitario: productData.unitPrice,
        precio_por_mayor: productData.wholesalePrice,
        etiquetas: productData.tags,
        cantidad_minima_mayorista: productData.minimumWholesaleQuantity ?? 10,
        caracteristicas: productData.features,
        especificaciones_tecnicas: productData.technicalSpecs
      };

      const { data, error } = await supabase
        .from('productos')
        .insert([dbProductData])
        .select()
        .single();

      if (error) throw error;

      const newProduct = transformDbProduct(data as DbProduct);
      setProducts(prev => [newProduct, ...prev]);
    } catch (error) {
      console.error('Error en addProduct:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const dbUpdates: Partial<DbProduct> = {};
      if (updates.name) dbUpdates.nombre = updates.name;
      if (updates.code) dbUpdates.sku = updates.code;
      if (updates.description) dbUpdates.descripcion = updates.description;
      if (updates.image) dbUpdates.imagen_url = updates.image;
      if (updates.brand !== undefined) dbUpdates.marca = updates.brand;
      if (updates.category) dbUpdates.categoria = updates.category;
      if (updates.unitPrice !== undefined) dbUpdates.precio_unitario = updates.unitPrice;
      if (updates.wholesalePrice !== undefined) dbUpdates.precio_por_mayor = updates.wholesalePrice;
      if (updates.tags) dbUpdates.etiquetas = updates.tags;
      if (updates.minimumWholesaleQuantity !== undefined) dbUpdates.cantidad_minima_mayorista = updates.minimumWholesaleQuantity;
      if (updates.features !== undefined) dbUpdates.caracteristicas = updates.features;
      if (updates.technicalSpecs !== undefined) dbUpdates.especificaciones_tecnicas = updates.technicalSpecs;

      const { data, error } = await supabase
        .from('productos')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedProduct = transformDbProduct(data as DbProduct);
      setProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)));
    } catch (error) {
      console.error('Error en updateProduct:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error en deleteProduct:', error);
      throw error;
    }
  };

  return {
    products,
    categories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshData
  };
};
