
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Category } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CategoryManagementProps {
  categories: Category[];
  onRefresh: () => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ 
  categories, 
  onRefresh 
}) => {
  const { toast } = useToast();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    nombre: '',
    imagen_url: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategory.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es requerido.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Agregando categoría:', newCategory);
      
      const { error } = await supabase
        .from('categorias')
        .insert([{
          nombre: newCategory.nombre.trim(),
          imagen_url: newCategory.imagen_url || '/placeholder.svg'
        }]);

      if (error) {
        console.error('Error agregando categoría:', error);
        throw error;
      }

      setNewCategory({ nombre: '', imagen_url: '' });
      setShowAddForm(false);
      onRefresh();
      
      toast({
        title: "Categoría agregada",
        description: "La categoría ha sido agregada exitosamente.",
      });
    } catch (error) {
      console.error('Error en handleAddCategory:', error);
      toast({
        title: "Error",
        description: "Error al agregar la categoría.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es requerido.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Actualizando categoría:', editingCategory);
      
      const { error } = await supabase
        .from('categorias')
        .update({
          nombre: editingCategory.name.trim(),
          imagen_url: editingCategory.image || '/placeholder.svg'
        })
        .eq('id', editingCategory.id);

      if (error) {
        console.error('Error actualizando categoría:', error);
        throw error;
      }

      setEditingCategory(null);
      onRefresh();
      
      toast({
        title: "Categoría actualizada",
        description: "La categoría ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error('Error en handleUpdateCategory:', error);
      toast({
        title: "Error",
        description: "Error al actualizar la categoría.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${name}"?`)) {
      try {
        console.log('Eliminando categoría:', id);
        
        const { error } = await supabase
          .from('categorias')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error eliminando categoría:', error);
          throw error;
        }

        onRefresh();
        
        toast({
          title: "Categoría eliminada",
          description: "La categoría ha sido eliminada exitosamente.",
        });
      } catch (error) {
        console.error('Error en handleDeleteCategory:', error);
        toast({
          title: "Error",
          description: "Error al eliminar la categoría.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulario para agregar nueva categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gestionar Categorías
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div>
                <Label htmlFor="categoryName">Nombre de la Categoría *</Label>
                <Input
                  id="categoryName"
                  value={newCategory.nombre}
                  onChange={(e) => setNewCategory({ ...newCategory, nombre: e.target.value })}
                  placeholder="Ej: Contenedores"
                />
              </div>
              <div>
                <Label htmlFor="categoryImage">URL de Imagen</Label>
                <Input
                  id="categoryImage"
                  value={newCategory.imagen_url}
                  onChange={(e) => setNewCategory({ ...newCategory, imagen_url: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCategory}>
                  Agregar Categoría
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategory({ nombre: '', imagen_url: '' });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de categorías existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías Existentes ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4 flex items-center justify-between">
                {editingCategory?.id === category.id ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      placeholder="Nombre de la categoría"
                    />
                    <Input
                      value={editingCategory.image || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                      placeholder="URL de imagen"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdateCategory}>
                        Guardar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingCategory(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{category.name}</h3>
                        <Badge variant="outline">{category.count} productos</Badge>
                      </div>
                      {category.image && (
                        <p className="text-sm text-gray-600">Imagen: {category.image}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory({
                          id: category.id,
                          name: category.name,
                          count: category.count,
                          image: category.image
                        })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManagement;
