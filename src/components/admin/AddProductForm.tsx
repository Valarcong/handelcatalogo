import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Category } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from "./ImageUpload";
import { validateProductData } from '@/utils/validation';

interface AddProductFormProps {
  categories: Category[];
  onAddProduct: (product: any) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ categories, onAddProduct }) => {
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    brand: '',
    description: '',
    image: '',
    category: '',
    unitPrice: 0,
    wholesalePrice: 0,
    minimumWholesaleQuantity: 10,
    tags: '',
    features: '',
    technicalSpecs: [{ key: '', value: '' }]
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddProduct = () => {
    // Validar datos usando las utilidades de validación
    const validation = validateProductData(newProduct);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast({
        title: "Error de validación",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    // Usar datos sanitizados
    const productData = {
      ...validation.sanitizedData,
      tags: newProduct.tags ? newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      features: newProduct.features ? newProduct.features.split('\\n').map(f => f.trim()).filter(f => f.length > 0) : [],
      technicalSpecs: newProduct.technicalSpecs.reduce((acc, spec) => {
        if (spec.key && spec.value) {
          acc[spec.key.trim()] = spec.value.trim();
        }
        return acc;
      }, {} as Record<string, string>),
      minimumWholesaleQuantity: Number(newProduct.minimumWholesaleQuantity) || 10,
    };

    onAddProduct(productData);
    
    // Limpiar formulario
    setNewProduct({
      name: '',
      code: '',
      brand: '',
      description: '',
      image: '',
      category: '',
      unitPrice: 0,
      wholesalePrice: 0,
      minimumWholesaleQuantity: 10,
      tags: '',
      features: '',
      technicalSpecs: [{ key: '', value: '' }]
    });
    setErrors([]);

    toast({
      title: "Producto agregado",
      description: "El producto ha sido agregado exitosamente.",
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
    // Limpiar errores cuando el usuario empiece a corregir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleTechSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...newProduct.technicalSpecs];
    newSpecs[index][field] = value;
    setNewProduct(prev => ({ ...prev, technicalSpecs: newSpecs }));
  };

  const addTechSpec = () => {
    setNewProduct(prev => ({
      ...prev,
      technicalSpecs: [...prev.technicalSpecs, { key: '', value: '' }]
    }));
  };
  
  const removeTechSpec = (index: number) => {
    const newSpecs = newProduct.technicalSpecs.filter((_, i) => i !== index);
    setNewProduct(prev => ({ ...prev, technicalSpecs: newSpecs }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Agregar Nuevo Producto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Errores de validación:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre del Producto *</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: Taza de plástico hermética"
              maxLength={200}
            />
          </div>
          <div>
            <Label htmlFor="code">Código del Producto *</Label>
            <Input
              id="code"
              value={newProduct.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="Ej: TAZA-001"
              maxLength={50}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="brand">Marca</Label>
          <Input
            id="brand"
            value={newProduct.brand}
            onChange={(e) => handleInputChange('brand', e.target.value)}
            placeholder="Ej: Handel, Omegaplast, Genérico"
            maxLength={100}
          />
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={newProduct.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe las características del producto..."
            maxLength={1000}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={newProduct.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
                <SelectItem value="nueva">+ Nueva Categoría</SelectItem>
              </SelectContent>
            </Select>
            {newProduct.category === 'nueva' && (
              <Input
                className="mt-2"
                placeholder="Nombre de la nueva categoría"
                onChange={(e) => handleInputChange('category', e.target.value)}
              />
            )}
          </div>
          <div>
            <Label htmlFor="unitPrice">Precio Unitario *</Label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              min="0"
              value={newProduct.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="wholesalePrice">Precio por Mayor *</Label>
            <Input
              id="wholesalePrice"
              type="number"
              step="0.01"
              min="0"
              value={newProduct.wholesalePrice}
              onChange={(e) => handleInputChange('wholesalePrice', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="minimumWholesaleQuantity">Cantidad mínima para precio mayorista *</Label>
          <Input
            id="minimumWholesaleQuantity"
            type="number"
            min="1"
            step="1"
            value={newProduct.minimumWholesaleQuantity}
            onChange={(e) => handleInputChange('minimumWholesaleQuantity', parseInt(e.target.value) || 10)}
            placeholder="10"
          />
        </div>

        <div>
          <Label htmlFor="image">URL de Imagen</Label>
          <ImageUpload
            value={newProduct.image}
            onChange={url => handleInputChange('image', url)}
            folder="main"
          />
        </div>

        <div>
          <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
          <Input
            id="tags"
            value={newProduct.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            placeholder="hermético, alimentos, BPA-free"
            maxLength={500}
          />
        </div>

        <div>
          <Label htmlFor="features">Características (una por línea)</Label>
          <Textarea
            id="features"
            value={newProduct.features}
            onChange={(e) => handleInputChange('features', e.target.value)}
            placeholder="Ej: Resistente al agua\\nLibre de BPA\\nApto para microondas"
            rows={4}
          />
        </div>

        <div>
          <Label>Especificaciones Técnicas</Label>
          <div className="space-y-2">
            {newProduct.technicalSpecs.map((spec, index) => (
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

        <Button 
          onClick={handleAddProduct} 
          className="w-full md:w-auto"
          disabled={!newProduct.name || !newProduct.code || !newProduct.category}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
