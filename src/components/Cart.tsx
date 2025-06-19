import React from 'react';
import { useCart } from '@/hooks/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import PedidoModal from "@/components/PedidoModal";
import { usePedido } from "@/hooks/usePedido";
import { useState } from "react";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalAmount,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const { crearPedido, loading } = usePedido();
  const [pedidoModalOpen, setPedidoModalOpen] = useState(false);

  // Función para renderizar el resumen del pedido
  const renderResumen = () => (
    <ul className="space-y-1">
      {cartItems.map((item, idx) => {
        const price = item.quantity >= 10 ? item.product.wholesalePrice : item.product.unitPrice;
        return (
          <li key={item.product.id} className="flex justify-between">
            <span>
              {idx + 1}. {item.product.name} <span className="text-gray-400">x{item.quantity}</span>
            </span>
            <span>
              S/. {(price * item.quantity).toFixed(2)}
            </span>
          </li>
        );
      })}
      <li className="border-t mt-1 pt-1 flex justify-between font-bold">
        <span>Total</span>
        <span>S/. {getTotalAmount().toFixed(2)}</span>
      </li>
    </ul>
  );

  const handleWhatsAppQuote = () => {
    if (cartItems.length === 0) return;

    const totalAmount = getTotalAmount();
    let message = `¡Hola! Me interesa cotizar estos productos:\n\n`;
    
    cartItems.forEach((item, index) => {
      const price = item.quantity >= 10 ? item.product.wholesalePrice : item.product.unitPrice;
      const subtotal = price * item.quantity;
      const priceType = item.quantity >= 10 ? 'Por Mayor' : 'Unitario';
      
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   📦 Cantidad: ${item.quantity}\n`;
      message += `   💰 Precio ${priceType}: S/. ${price.toFixed(2)}\n`;
      message += `   💵 Subtotal: S/. ${subtotal.toFixed(2)}\n\n`;
    });
    
    message += `🧾 TOTAL: S/. ${totalAmount.toFixed(2)}\n\n`;
    message += `Por favor, envíenme una cotización formal con disponibilidad y tiempo de entrega.\n`;
    message += `¡Gracias!`;

    const whatsappUrl = `https://wa.me/51970337910?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    console.log('Cotización de carrito enviada por WhatsApp');
  };

  const handleEnviarPedido = async (cliente: any) => {
    try {
      await crearPedido({
        productos: cartItems.map(item => ({
          id: item.product.id,
          nombre: item.product.name,
          cantidad: item.quantity,
          precio: item.quantity >= 10 ? item.product.wholesalePrice : item.product.unitPrice,
        })),
        total: getTotalAmount(),
        cliente,
      });
      clearCart();
      setPedidoModalOpen(false);
    } catch (e) {
      // El toast se maneja en el hook
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrito de Compras
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400">Agrega productos para empezar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const price = item.quantity >= 10 ? item.product.wholesalePrice : item.product.unitPrice;
                const subtotal = price * item.quantity;
                const priceType = item.quantity >= 10 ? 'Mayor' : 'Unit.';
                
                return (
                  <div key={item.product.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.product.code}
                        </Badge>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-500">{priceType}:</span>
                            <span className="font-semibold ml-1">S/. {price.toFixed(2)}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                              className="w-16 h-8 text-center"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-sm font-bold">
                            S/. {subtotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-xl font-bold text-brand-navy">
                S/. {getTotalAmount().toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={handleWhatsAppQuote}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Cotizar por WhatsApp
              </Button>
              
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full"
              >
                Limpiar Carrito
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPedidoModalOpen(true)}
                className="w-full"
                disabled={cartItems.length === 0}
                title={cartItems.length === 0 ? "Debes agregar productos primero" : ""}
              >
                Enviar pedido
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
      <PedidoModal
        open={pedidoModalOpen}
        setOpen={setPedidoModalOpen}
        onConfirm={handleEnviarPedido}
        loading={loading}
        resumen={cartItems.length > 0 ? renderResumen() : null}
      />
    </Sheet>
  );
};

export default Cart;
