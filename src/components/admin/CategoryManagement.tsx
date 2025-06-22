import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Image as ImageIcon, TestTube } from 'lucide-react';
import { Category } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from './ImageUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryManagementProps {
  categories: Category[];
  onRefresh: () => void;
}

// Imágenes disponibles en el proyecto
const AVAILABLE_IMAGES = [
  { value: '/imagenes/categorias/motoreductor_bg.jpeg', label: 'Motor Reductor' },
  { value: '/imagenes/marcas/WMO_MOTORS_CATEGORY_W22_BANNER_ES.png', label: 'WMO Motors' },
  { value: '/imagenes/marcas/Fabricacion_Reductores_Especiales.png', label: 'Fabricación Reductores' },
  { value: '/placeholder.svg', label: 'Imagen por defecto' },
];

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
  const [imageSource, setImageSource] = useState<'upload' | 'select' | 'url'>('select');
  const [testResult, setTestResult] = useState<string>("");

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
      const { error } = await supabase
        .from('categorias')
        .insert([{ 
          nombre: newCategory.nombre.trim(), 
          imagen_url: newCategory.imagen_url || '/placeholder.svg' 
        }]);

      if (error) throw error;

      setNewCategory({ nombre: '', imagen_url: '' });
      setShowAddForm(false);
      setImageSource('select');
      onRefresh();
      
      toast({
        title: "Categoría agregada",
        description: "La categoría ha sido agregada exitosamente.",
      });
    } catch (err) {
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
      const { error } = await supabase
        .from('categorias')
        .update({ 
          nombre: editingCategory.name.trim(), 
          imagen_url: editingCategory.image || '/placeholder.svg' 
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      setEditingCategory(null);
      onRefresh();
      
      toast({
        title: "Categoría actualizada",
        description: "La categoría ha sido actualizada exitosamente.",
      });
    } catch (err) {
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
        const { error } = await supabase
          .from('categorias')
          .delete()
          .eq('id', id);

        if (error) throw error;

        onRefresh();
        
        toast({
          title: "Categoría eliminada",
          description: "La categoría ha sido eliminada exitosamente.",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Error al eliminar la categoría.",
          variant: "destructive"
        });
      }
    }
  };

  const testSupabaseStorage = async () => {
    setTestResult("Probando conexión a Supabase Storage...");
    try {
      // Probar listar archivos en el bucket
      const { data, error } = await supabase.storage
        .from('products')
        .list('categories', { limit: 1 });

      if (error) {
        setTestResult(`❌ Error: ${error.message}`);
      } else {
        setTestResult(`✅ Conexión exitosa! Archivos en categorías: ${data?.length || 0}`);
      }
    } catch (err: any) {
      setTestResult(`❌ Error de conexión: ${err.message}`);
    }
  };

  const renderImageInput = (value: string, onChange: (url: string) => void, isEditing = false) => {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={imageSource === 'select' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setImageSource('select')}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            Seleccionar existente
          </Button>
          <Button
            type="button"
            variant={imageSource === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setImageSource('upload')}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            Subir nueva
          </Button>
          <Button
            type="button"
            variant={imageSource === 'url' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setImageSource('url')}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            URL externa
          </Button>
        </div>

        {imageSource === 'select' && (
          <div>
            <Label>Seleccionar imagen existente</Label>
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una imagen" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_IMAGES.map((img) => (
                  <SelectItem key={img.value} value={img.value}>
                    <div className="flex items-center gap-2">
                      <img 
                        src={img.value} 
                        alt={img.label} 
                        className="w-6 h-6 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      {img.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {imageSource === 'upload' && (
          <ImageUpload
            value={value}
            onChange={onChange}
            folder="categories"
            label="Subir imagen de categoría"
          />
        )}

        {imageSource === 'url' && (
          <div>
            <Label>URL de imagen externa</Label>
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        )}

        {/* Vista previa */}
        {value && (
          <div className="mt-2">
            <Label>Vista previa:</Label>
            <div className="mt-1 w-24 h-24 rounded bg-gray-100 overflow-hidden border border-gray-200">
              <img
                src={value}
                alt="Vista previa"
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Botón de prueba de conexión */}
      <div className="flex gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={testSupabaseStorage}
          className="text-xs"
        >
          <TestTube className="h-3 w-3 mr-1" />
          Probar Storage
        </Button>
        {testResult && (
          <span className="text-xs text-gray-600 self-center">
            {testResult}
          </span>
        )}
      </div>

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
              
              {renderImageInput(
                newCategory.imagen_url,
                (url) => setNewCategory({ ...newCategory, imagen_url: url })
              )}

              <div className="flex gap-2">
                <Button onClick={handleAddCategory}>
                  Agregar Categoría
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategory({ nombre: '', imagen_url: '' });
                    setImageSource('select');
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
                  <div className="flex-1 space-y-4">
                    <Input
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      placeholder="Nombre de la categoría"
                    />
                    
                    {renderImageInput(
                      editingCategory.image || '',
                      (url) => setEditingCategory({ ...editingCategory, image: url }),
                      true
                    )}

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
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                          <img
                            src={category.image || '/placeholder.svg'}
                            alt={category.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <Badge variant="outline">{category.count} productos</Badge>
                        </div>
                      </div>
                      {category.image && category.image !== '/placeholder.svg' && (
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
