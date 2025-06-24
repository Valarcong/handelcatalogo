import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Category } from '@/types/product';
import ImageUpload from "./ImageUpload";
import { Plus } from 'lucide-react';

interface EditProductModalProps {
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  onUpdateProduct: (product: Product) => void;
  categories: Category[];
}

type TechSpec = { key: string; value: string };

const EditProductModal: React.FC<EditProductModalProps> = ({
  editingProduct,
  setEditingProduct,
  onUpdateProduct,
  categories
}) => {
  const [productData, setProductData] = useState<Product | null>(null);
  const [technicalSpecs, setTechnicalSpecs] = useState<TechSpec[]>([]);
  const [features, setFeatures] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setProductData(editingProduct);
      
      // Convertir specs de objeto a array para el form
      const specsArray = editingProduct.technicalSpecs 
        ? Object.entries(editingProduct.technicalSpecs).map(([key, value]) => ({ key, value }))
        : [];
      setTechnicalSpecs(specsArray);

      // Convertir features de array a string para el textarea
      const featuresString = editingProduct.features ? editingProduct.features.join('\\n') : '';
      setFeatures(featuresString);

    } else {
      setProductData(null);
      setTechnicalSpecs([]);
      setFeatures('');
    }
  }, [editingProduct]);


  if (!productData) return null;

  const handleInputChange = (field: keyof Product, value: any) => {
    setProductData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleTagsChange = (value: string) => {
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    handleInputChange('tags', tagsArray);
  };
  
  const handleTechSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...technicalSpecs];
    newSpecs[index][field] = value;
    setTechnicalSpecs(newSpecs);
  };

  const addTechSpec = () => {
    setTechnicalSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const removeTechSpec = (index: number) => {
    setTechnicalSpecs(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSave = () => {
    if (!productData) return;

    // Convertir de nuevo al formato del producto
    const updatedSpecs = technicalSpecs.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key.trim()] = spec.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    const updatedFeatures = features.split('\\n').map(f => f.trim()).filter(Boolean);

    const finalProduct: Product = {
      ...productData,
      technicalSpecs: updatedSpecs,
      features: updatedFeatures,
    };
    
    onUpdateProduct(finalProduct);
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
                value={productData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label>Código del Producto</Label>
              <Input
                value={productData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea
              value={productData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Imagen del producto */}
          <ImageUpload
            value={productData.image}
            onChange={url => handleInputChange('image', url)}
            folder="main"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Categoría</Label>
              <Select
                value={productData.category}
                onValueChange={(value) => handleInputChange('category', value)}
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
                value={productData.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Precio por Mayor</Label>
              <Input
                type="number"
                step="0.01"
                value={productData.wholesalePrice}
                onChange={(e) => handleInputChange('wholesalePrice', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label>Cantidad mínima para precio mayorista</Label>
            <Input
              type="number"
              min={1}
              step={1}
              value={productData.minimumWholesaleQuantity}
              onChange={(e) => 
                handleInputChange('minimumWholesaleQuantity', parseInt(e.target.value, 10) || 10)
              }
            />
          </div>

          <div>
            <Label>Etiquetas (separadas por comas)</Label>
            <Input
              value={productData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
            />
          </div>

          {/* Campo Marca */}
          <div>
            <Label>Marca</Label>
            <Input
              value={productData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
            />
          </div>

          {/* Nuevos Campos */}
          <div>
            <Label htmlFor="features">Características (una por línea)</Label>
            <Textarea
              id="features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Ej: Resistente al agua\\nLibre de BPA"
              rows={4}
            />
          </div>

          <div>
            <Label>Especificaciones Técnicas</Label>
            <div className="space-y-2">
              {technicalSpecs.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={spec.key}
                    onChange={(e) => handleTechSpecChange(index, 'key', e.target.value)}
                    placeholder="Propiedad (Ej: Material)"
                    className="w-1/3"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => handleTechSpecChange(index, 'value', e.target.value)}
                    placeholder="Valor (Ej: Plástico ABS)"
                    className="w-2/3"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeTechSpec(index)} aria-label="Eliminar especificación">
                    <Plus className="h-4 w-4 rotate-45 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addTechSpec} className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Añadir Especificación
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingProduct(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductModal;
