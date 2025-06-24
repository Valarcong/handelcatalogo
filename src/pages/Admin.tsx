import React, { useState } from 'react';
import { useAuthContext } from '@/hooks/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useLocation, Routes, Route } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import EditProductModal from '@/components/admin/EditProductModal';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSectionRenderer from '@/components/admin/AdminSectionRenderer';
import AdminAuditoria from "./AdminAuditoria";

function getCurrentSection(search: string) {
  const params = new URLSearchParams(search);
  return params.get("section") || "add";
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuthContext();
  const { products, categories, addProduct, updateProduct, deleteProduct, refreshData } = useProducts();
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const location = useLocation();
  const section = getCurrentSection(location.search);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Cambiado: ahora SÓLO admin puede acceder
  if (!user || !isAdmin) {
    return <Navigate to="/ventas" replace />; // redirige a Ventas si no es admin
  }

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addProduct(productData);
      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado exitosamente.",
      });
    } catch (error) {
      console.error('Error agregando producto:', error);
      toast({
        title: "Error",
        description: "Error al agregar el producto.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProduct = async (productToUpdate: Product) => {
    if (!productToUpdate) return;
    try {
      await updateProduct(productToUpdate.id, productToUpdate);
      setEditingProduct(null);
      toast({
        title: "Producto actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });
    } catch (error) {
      console.error('Error actualizando producto:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el producto.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${name}"?`)) {
      try {
        await deleteProduct(id);
        toast({
          title: "Producto eliminado",
          description: "El producto ha sido eliminado exitosamente.",
        });
      } catch (error) {
        console.error('Error eliminando producto:', error);
        toast({
          title: "Error",
          description: "Error al eliminar el producto.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 min-w-0 px-4 py-8">
          <AdminHeader user={user} />
          <Routes>
            <Route path="auditoria" element={<AdminAuditoria />} />
            <Route path="*" element={
              <AdminSectionRenderer
                section={section}
                products={products}
                categories={categories}
                onAddProduct={handleAddProduct}
                onEditProduct={setEditingProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateProduct={handleUpdateProduct}
                onRefresh={refreshData}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
              />
            } />
          </Routes>
          <EditProductModal
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            onUpdateProduct={handleUpdateProduct}
            categories={categories}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;