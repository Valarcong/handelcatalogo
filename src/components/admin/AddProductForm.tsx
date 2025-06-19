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

interface AddProductFormProps {
  categories: Category[];
  onAddProduct: (product: any) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ categories, onAddProduct }) => {
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    brand: 'omegaplast',
    description: '',
    image: '',
    category: '',
    unitPrice: 0,
    wholesalePrice: 0,
    minimumWholesaleQuantity: 10,
    tags: ''
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.code || !newProduct.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    const productData = {
      ...newProduct,
      brand: newProduct.brand || 'omegaplast',
      image: newProduct.image || '/placeholder.svg',
      tags: newProduct.tags ? newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      minimumWholesaleQuantity: Number(newProduct.minimumWholesaleQuantity) || 10,
    };

    onAddProduct(productData);
    setNewProduct({
      name: '',
      code: '',
      brand: 'omegaplast',
      description: '',
      image: '',
      category: '',
      unitPrice: 0,
      wholesalePrice: 0,
      minimumWholesaleQuantity: 10,
      tags: ''
    });

    toast({
      title: "Producto agregado",
      description: "El producto ha sido agregado exitosamente.",
    });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre del Producto *</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Ej: Contenedor Hermético 500ml"
            />
          </div>
          <div>
            <Label htmlFor="code">Código del Producto *</Label>
            <Input
              id="code"
              value={newProduct.code}
              onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
              placeholder="Ej: OP-CONT-500"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="brand">Marca *</Label>
          <Input
            id="brand"
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            placeholder="Ej: omegaplast"
          />
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Descripción detallada del producto..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={newProduct.category}
              onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
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
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
            )}
          </div>
          <div>
            <Label htmlFor="unitPrice">Precio Unitario</Label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              value={newProduct.unitPrice}
              onChange={(e) => setNewProduct({ ...newProduct, unitPrice: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="wholesalePrice">Precio por Mayor</Label>
            <Input
              id="wholesalePrice"
              type="number"
              step="0.01"
              value={newProduct.wholesalePrice}
              onChange={(e) => setNewProduct({ ...newProduct, wholesalePrice: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="minimumWholesaleQuantity">Cantidad mínima para precio mayorista *</Label>
          <Input
            id="minimumWholesaleQuantity"
            type="number"
            min={1}
            step={1}
            value={newProduct.minimumWholesaleQuantity}
            onChange={(e) => setNewProduct({ ...newProduct, minimumWholesaleQuantity: parseInt(e.target.value) || 10 })}
            placeholder="10"
          />
        </div>

        <div>
          <Label htmlFor="image">URL de Imagen</Label>
          <ImageUpload
            value={newProduct.image}
            onChange={url => setNewProduct({ ...newProduct, image: url })}
            folder="main"
          />
        </div>

        <div>
          <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
          <Input
            id="tags"
            value={newProduct.tags}
            onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
            placeholder="hermético, alimentos, BPA-free"
          />
        </div>

        <Button onClick={handleAddProduct} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
