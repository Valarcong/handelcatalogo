import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  ArrowLeft, 
  Minus, 
  Plus, 
  Package, 
  Ruler, 
  Thermometer, 
  Zap, 
  Shield, 
  Info,
  Share2,
  Heart,
  Star
} from 'lucide-react';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ui/responsive';

const MIN_QTY = 1;
const MAX_QTY = 999;

// Componente para especificaciones técnicas
const TechnicalSpecs: React.FC<{ product: any }> = ({ product }) => {
  // Solo mostrar 'Código' por defecto
  const specs: Record<string, string> = {};
  specs['Código'] = product.code;

  // Agregar solo las especificaciones técnicas que existan y tengan valor
  if (product.technicalSpecs && typeof product.technicalSpecs === 'object') {
    Object.entries(product.technicalSpecs).forEach(([key, value]) => {
      if (key !== 'Código' && value && value.toString().trim() !== '') {
        specs[key] = String(value);
      }
    });
  }

  const specEntries = Object.entries(specs);

  if (specEntries.length === 0 || specEntries.every(s => !s[1])) {
    return <p className="text-gray-500">No hay especificaciones técnicas disponibles.</p>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Package className="h-5 w-5 text-blue-600" />
        Especificaciones Técnicas
      </h3>
      <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
        {specEntries.map(([key, value]: [string, string]) => (
          <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Info className="h-5 w-5 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-700">{key}</p>
              <p className="text-sm text-gray-600">{value}</p>
            </div>
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  );
};

// Componente para características del producto
const ProductFeatures: React.FC<{ product: any }> = ({ product }) => {
  const features = product.features || [];

  if (features.length === 0) {
    return <p className="text-gray-500">No hay características destacadas disponibles.</p>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Características Principales</h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [quantity, setQuantity] = useState<number>(MIN_QTY);
  const [activeTab, setActiveTab] = useState('technical');

  const product = products.find((p) => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded shadow p-8 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Producto no encontrado</h2>
          <Button asChild variant="outline" className="mt-2">
            <Link to="/productos">
              Volver al catálogo
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (val: number) => {
    setQuantity(Math.max(MIN_QTY, Math.min(val, MAX_QTY)));
  };

  const handleQuote = () => {
    const message = `¡Hola! Me interesa este producto:

🧾 *${product.name}*
📋 Código: ${product.code}
💰 Precio Unitario: USD ${product.unitPrice.toFixed(2)}
🔢 Cantidad: ${quantity}

¿Me podrían dar más información?`;
    const whatsappUrl = `https://wa.me/51970337910?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isWholesale = quantity >= (product.minimumWholesaleQuantity || 10);
  const displayPrice = isWholesale ? product.wholesalePrice : product.unitPrice;
  const displayTotal = displayPrice * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveContainer maxWidth="full" className="py-6">
        {/* Header con navegación */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Imagen y acciones */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                {/* Imagen del producto */}
                <div className="aspect-square bg-white rounded-lg overflow-hidden border mb-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>

                {/* Badges de estado */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.includes('Nuevo') && (
                    <Badge className="bg-green-100 text-green-800">Nuevo</Badge>
                  )}
                  {product.tags.includes('Oferta') && (
                    <Badge className="bg-orange-100 text-orange-800">Oferta</Badge>
                  )}
                  {isWholesale && (
                    <Badge className="bg-blue-100 text-blue-800">Precio Mayorista</Badge>
                  )}
                </div>

                {/* Selector de cantidad */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Cantidad</span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= MIN_QTY}
                        className="h-8 w-8"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <input
                        type="number"
                        min={MIN_QTY}
                        max={MAX_QTY}
                        value={quantity}
                        onChange={e => handleQuantityChange(Number(e.target.value))}
                        className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= MAX_QTY}
                        className="h-8 w-8"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Precios */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Precio unitario:</span>
                      <span className="font-medium">
                        USD {displayPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total:</span>
                      <span className="text-xl font-bold text-blue-600">
                        USD {displayTotal.toFixed(2)}
                      </span>
                    </div>
                    {isWholesale && (
                      <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                        ✓ Aplicando precio mayorista (mín. {product.minimumWholesaleQuantity || 10} unidades)
                      </p>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleQuote}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Cotizar en WhatsApp
                  </Button>
                  {/*
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Heart className="h-4 w-4 mr-1" />
                      Favorito
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Share2 className="h-4 w-4 mr-1" />
                      Compartir
                    </Button>
                  </div>
                  */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Información del producto */}
          <div className="lg:col-span-2">
            {/* Información básica */}
            <Card className="mb-6">
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{product.code}</Badge>
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="secondary">{product.brand}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Tabs con información detallada */}
            <Card>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    {/* <TabsTrigger value="general">General</TabsTrigger> */}
                    <TabsTrigger value="technical">Técnico</TabsTrigger>
                    <TabsTrigger value="features">Características</TabsTrigger>
                  </TabsList>
                  {/* <TabsContent value="general" className="mt-6 p-6">
                    <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                  </TabsContent> */}
                  <TabsContent value="technical" className="mt-6 p-6">
                    <TechnicalSpecs product={product} />
                  </TabsContent>
                  <TabsContent value="features" className="mt-6 p-6">
                    <ProductFeatures product={product} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductDetail;
