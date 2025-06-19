import React, { useState } from 'react';
import { useAuthContext } from '@/hooks/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import AddProductForm from '@/components/admin/AddProductForm';
import ProductManagement from '@/components/admin/ProductManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import ImportExport from '@/components/admin/ImportExport';
import AdminStats from '@/components/admin/AdminStats';
import EditProductModal from '@/components/admin/EditProductModal';
import { Navigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import OrderManagement from '@/components/admin/OrderManagement';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SupplierManagement from '@/components/admin/SupplierManagement';
import NotificationBell from '@/components/ui/NotificationBell';
import ClientesListPanel from "@/components/clientes/ClientesListPanel";

const sectionComponents: Record<string, React.ReactNode | ((props: any) => React.ReactNode)> = {
  add: (props: any) => <AddProductForm {...props} />,
  manage: (props: any) => <ProductManagement {...props} />,
  categories: (props: any) => <CategoryManagement {...props} />,
  import: (props: any) => <ImportExport {...props} />,
  stats: (props: any) => <AdminStats {...props} />,
  pedidos: () => <OrderManagement />,
  settings: () => (
    <div className="p-8 text-gray-400">
      <p className="text-lg">Próximamente: ajustes de administración...</p>
    </div>
  ),
  suppliers: () => <SupplierManagement />,
  clientes: () => <ClientesListPanel />,
};

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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
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

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      const updatedData = {
        ...editingProduct,
        tags: Array.isArray(editingProduct.tags) 
          ? editingProduct.tags
          : (editingProduct.tags as string)
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag.length > 0)
      };
      await updateProduct(editingProduct.id, updatedData);
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

  const renderSectionContent = () => {
    if(!(section in sectionComponents)) return <div className="p-8 text-gray-400">Sección no encontrada.</div>;
    const Component = sectionComponents[section];
    if (typeof Component === "function") {
      const sharedProps = {
        products,
        categories,
        onAddProduct: handleAddProduct,
        onEditProduct: setEditingProduct,
        onDeleteProduct: handleDeleteProduct,
        onUpdateProduct: handleUpdateProduct,
        onRefresh: refreshData,
        editingProduct,
        setEditingProduct,
      };
      return (Component as any)(sharedProps);
    }
    return Component;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 min-w-0 px-4 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-brand-navy mb-2">
                  Panel de Administración - OmegaPlast
                </h1>
                <p className="text-gray-600">
                  Bienvenido, {user.nombre}
                </p>
                <div className="flex gap-2 mt-2">
                  {user.roles?.map((role: any) => (
                    <Badge key={role.id} variant="outline">
                      {role.nombre}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Notificaciones badge en la parte superior derecha */}
              <NotificationBell userId={user.id} />
            </div>
          </div>
          <div>
            <SidebarTrigger />
          </div>
          {renderSectionContent()}
          <EditProductModal
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            onUpdateProduct={handleUpdateProduct}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
