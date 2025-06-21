import React from 'react';
import { Product } from '@/types/product';
import AddProductForm from './AddProductForm';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import ImportExport from './ImportExport';
import AdminStats from './AdminStats';
import OrderManagement from './OrderManagement';
import SupplierManagement from './SupplierManagement';
import ClientesListPanel from "@/components/clientes/ClientesListPanel";
import QuotationManagement from './QuotationManagement';

interface AdminSectionRendererProps {
  section: string;
  products: Product[];
  categories: any[];
  onAddProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string, name: string) => Promise<void>;
  onUpdateProduct: () => Promise<void>;
  onRefresh: () => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
}

const AdminSectionRenderer: React.FC<AdminSectionRendererProps> = ({
  section,
  products,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateProduct,
  onRefresh,
  editingProduct,
  setEditingProduct,
}) => {
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
    cotizaciones: () => <QuotationManagement />,
  };

  if (!(section in sectionComponents)) {
    return <div className="p-8 text-gray-400">Sección no encontrada.</div>;
  }

  const Component = sectionComponents[section];
  if (typeof Component === "function") {
    const sharedProps = {
      products,
      categories,
      onAddProduct,
      onEditProduct,
      onDeleteProduct,
      onUpdateProduct,
      onRefresh,
      editingProduct,
      setEditingProduct,
    };
    return (Component as any)(sharedProps);
  }
  return Component;
};

export default AdminSectionRenderer; 