import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Category } from '@/types/product';
import ImageUpload from "./ImageUpload";

interface EditProductModalProps {
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  onUpdateProduct: () => void;
  categories: Category[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  editingProduct,
  setEditingProduct,
  onUpdateProduct,
  categories
}) => {
  if (!editingProduct) return null;

  const handleTagsChange = (value: string) => {
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setEditingProduct({ ...editingProduct, tags: tagsArray });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre del Producto</Label>
              <Input
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Código del Producto</Label>
              <Input
                value={editingProduct.code}
                onChange={(e) => setEditingProduct({ ...editingProduct, code: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            />
          </div>

          {/* Imagen del producto */}
          <ImageUpload
            value={editingProduct.image}
            onChange={url => setEditingProduct({ ...editingProduct, image: url })}
            folder="main"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Categoría</Label>
              <Select
                value={editingProduct.category}
                onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      <div className="flex items-center gap-2">
                        {category.image && (
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-4 h-4 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        {category.name}
                        <span className="text-xs text-gray-500">({category.count})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Precio Unitario</Label>
              <Input
                type="number"
                step="0.01"
                value={editingProduct.unitPrice}
                onChange={(e) => setEditingProduct({ ...editingProduct, unitPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Precio por Mayor</Label>
              <Input
                type="number"
                step="0.01"
                value={editingProduct.wholesalePrice}
                onChange={(e) => setEditingProduct({ ...editingProduct, wholesalePrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <Label>Cantidad mínima para precio mayorista</Label>
            <Input
              type="number"
              min={1}
              step={1}
              value={editingProduct.minimumWholesaleQuantity}
              onChange={(e) => 
                setEditingProduct({ 
                  ...editingProduct, 
                  minimumWholesaleQuantity: parseInt(e.target.value) || 10 
                })
              }
            />
          </div>

          <div>
            <Label>Etiquetas (separadas por comas)</Label>
            <Input
              value={Array.isArray(editingProduct.tags) ? editingProduct.tags.join(', ') : editingProduct.tags}
              onChange={(e) => handleTagsChange(e.target.value)}
            />
          </div>

          {/* Campo Marca */}
          <div>
            <Label>Marca</Label>
            <Input
              value={editingProduct.brand}
              onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingProduct(null)}>
              Cancelar
            </Button>
            <Button onClick={onUpdateProduct}>
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductModal;
