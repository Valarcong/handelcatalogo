import React, { useState } from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/CartContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductCardProps {
  product: Product;
  onWhatsAppQuote: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onWhatsAppQuote }) => {
  // defensivo
  if (!product || typeof product !== "object") {
    return null;
  }
  // valores por defecto en caso de datos incompletos
  const brand = product.brand ?? "omegaplast";
  const name = product.name ?? "Producto sin nombre";
  const code = product.code ?? "-";
  const tags = Array.isArray(product.tags) ? product.tags : [];
  const quantityMinWholesale = typeof product.minimumWholesaleQuantity === "number" ? product.minimumWholesaleQuantity : 10;
  const unitPrice = typeof product.unitPrice === "number" ? product.unitPrice : 0;
  const wholesalePrice = typeof product.wholesalePrice === "number" ? product.wholesalePrice : 0;
  const description = typeof product.description === "string" ? product.description : "";
  const image = typeof product.image === "string" && product.image.length > 0 ? product.image : "/placeholder.svg";

  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
    console.log('Cantidad cambiada:', value);
  };

  const showQuoteButton = typeof onWhatsAppQuote === "function";

  const handleQuoteClick = () => {
    if (showQuoteButton) {
      onWhatsAppQuote(product, quantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    console.log('Producto agregado al carrito:', name, 'Cantidad:', quantity);
  };

  const totalPrice = (quantity >= quantityMinWholesale ? wholesalePrice : unitPrice) * quantity;

  return (
    <Card
      className={`h-full flex ${isMobile ? 'flex-row items-start min-h-[128px] p-2 shadow-sm' : 'flex-col'} hover:shadow-lg transition-shadow duration-300`}
    >
      <div
        className={`${
          isMobile
            ? 'w-24 h-24 min-w-24 min-h-24 max-h-24 max-w-24 flex-shrink-0 rounded-md'
            : 'aspect-square rounded-t-lg'
        } bg-gray-100 overflow-hidden cursor-pointer`}
        onClick={() => navigate(`/producto/${product.id}`)}
        title="Ver detalles"
        role="button"
        tabIndex={0}
        onKeyPress={(e) => { if (e.key === 'Enter') navigate(`/producto/${product.id}`); }}
      >
        <img
          src={image}
          alt={name}
          className={`object-cover w-full h-full ${isMobile ? '' : ''}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      
      <div className={isMobile ? "flex-1 flex flex-col justify-between ml-3" : "flex-1 flex flex-col"}>
        <CardContent className={isMobile ? "p-0 pb-1" : "flex-1 p-4"}>
          <div className={isMobile ? "mb-1" : "mb-2"}>
            <h3
              className={`font-semibold ${isMobile ? 'text-base leading-snug mb-0.5' : 'text-lg mb-1'} cursor-pointer hover:text-brand-navy`}
              onClick={() => navigate(`/producto/${product.id}`)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') navigate(`/producto/${product.id}`); }}
              title="Ver detalles"
            >
              {name}
            </h3>
            <Badge variant="outline" className="text-xs mb-1">{code}</Badge>
            <Badge variant="secondary" className="text-xs ml-2">{brand}</Badge>
          </div>
          <p className={`text-gray-600 ${isMobile ? "text-xs mb-1" : "text-sm mb-3"} line-clamp-2`}>
            {description}
          </p>
          <div className={`space-y-0.5 ${isMobile ? "mb-2" : "mb-3"}`}>
            <p className="text-xs">
              <span className="text-gray-500">Precio unitario:</span>
              <span className="font-semibold text-brand-navy ml-1">S/. {unitPrice.toFixed(2)}</span>
            </p>
            <p className="text-xs">
              <span className="text-gray-500">Precio por mayor:</span>
              <span className="font-semibold text-brand-orange ml-1">S/. {wholesalePrice.toFixed(2)}</span>
            </p>
            <p className="text-[10px] text-gray-400">(Mayor: {quantityMinWholesale}+ unidades)</p>
          </div>
          <div className={`flex flex-wrap gap-1 ${isMobile ? "mb-2" : "mb-3"}`}>
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-[10px]">{tag}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className={isMobile ? "p-0 pt-1" : "p-4 pt-0"}>
          <div className={`${isMobile ? "w-full flex flex-col gap-1" : "w-full space-y-3"}`}>
            <div className={`flex items-center gap-2 ${isMobile ? "mb-0" : ""}`}>
              <label className="text-xs font-medium">Cantidad:</label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 h-8 text-xs px-2 py-1"
              />
            </div>
            <div className={`text-xs ${isMobile ? "" : "text-sm"}`}>
              <span className="text-gray-600">Total: </span>
              <span className="font-bold text-brand-navy">
                S/. {totalPrice.toFixed(2)}
              </span>
            </div>
            <div className={`flex gap-2 w-full`}>
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className={`flex-1 ${isMobile ? "h-8 text-xs px-2" : ""}`}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Agregar
              </Button>
              {showQuoteButton && (
                <Button
                  onClick={handleQuoteClick}
                  className={`flex-1 bg-green-500 hover:bg-green-600 text-white ${isMobile ? "h-8 text-xs px-2" : ""}`}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Cotizar
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
