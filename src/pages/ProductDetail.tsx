import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, MessageCircle, ArrowLeft, Minus, Plus } from 'lucide-react';

const MIN_QTY = 1;
const MAX_QTY = 999; // Puedes ajustar este máximo

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  // Nuevo estado para cantidad
  const [quantity, setQuantity] = useState<number>(MIN_QTY);

  const product = products.find((p) => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
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
💰 Precio Unitario: S/. ${product.unitPrice.toFixed(2)}
🔢 Cantidad: ${quantity}

¿Me podrían dar más información?`;
    const whatsappUrl = `https://wa.me/51970337910?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-300 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 rounded-xl shadow-2xl p-8 md:flex gap-10 border border-gray-700">
          <div className="md:w-1/2 flex-shrink-0 flex flex-col items-center">
            <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg overflow-hidden w-full max-w-xs border-2 border-gray-600 shadow-lg">
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
            {/* Futuro: galería de imágenes aquí */}
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0 flex flex-col gap-4">
            <h1 className="font-extrabold text-3xl text-gray-100 mb-2 tracking-wide uppercase flex items-center gap-2">
              {product.name}
              {product.tags.includes('Nuevo') && (
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded ml-2">Nuevo</span>
              )}
              {product.tags.includes('Oferta') && (
                <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded ml-2">Oferta</span>
              )}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs border-gray-500 text-gray-300 bg-gray-800">{product.code}</Badge>
              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200">{product.category}</Badge>
              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200">{product.brand}</Badge>
            </div>
            {/* Descripción técnica */}
            <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 text-gray-200 font-mono text-sm max-h-72 overflow-y-auto shadow-inner">
              {product.description}
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-blue-400 mb-1">
                Precio: <span className="text-white">S/. {product.unitPrice.toFixed(2)}</span>
              </p>
            </div>
            {/* Selector de cantidad */}
            <div className="flex items-center gap-3 mt-2">
              <span className="font-semibold text-gray-200">Cantidad</span>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= MIN_QTY}
                aria-label="Restar"
                className="bg-gray-700 border border-gray-600 text-white"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <input
                type="number"
                min={MIN_QTY}
                max={MAX_QTY}
                value={quantity}
                onChange={e => handleQuantityChange(Number(e.target.value))}
                className="w-16 text-center border border-gray-600 rounded bg-gray-800 text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= MAX_QTY}
                aria-label="Sumar"
                className="bg-gray-700 border border-gray-600 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {/* Previsualización de precio total */}
            <div className="mt-2">
              <span className={`px-2 py-1 rounded inline-block text-sm font-bold mb-1 bg-blue-900 text-blue-200`}>
                Total
              </span>
              <span className="block text-2xl font-extrabold text-yellow-300 mt-1">{(product.unitPrice * quantity).toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })}</span>
            </div>
            <div className="flex flex-wrap gap-2 my-2">
              {product.tags.slice(0, 6).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-gray-700 text-gray-200 border border-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col gap-2 mt-4 w-full">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold tracking-wider"
                onClick={handleQuote}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Cotizar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
