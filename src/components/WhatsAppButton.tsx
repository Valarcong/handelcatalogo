import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phone = "51970337910", 
  message = "¡Hola! Me interesa información sobre sus productos industriales. ¿Podrían ayudarme?",
  className = ""
}) => {
  const location = useLocation();

  // Ocultar si la ruta es de detalle de producto (/producto/:id)
  const isProductDetailPage = /^\/producto\/[^/]+$/.test(location.pathname);

  if (isProductDetailPage) return null;

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    console.log('WhatsApp abierto con mensaje:', message);
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50 animate-float
        ${className}
        sm:p-3 sm:bottom-4 sm:right-4
      `}
      aria-label="Contactar por WhatsApp"
      style={{ 
        // Prevenir superposición en mobile/demo
        maxWidth: '64px',
        maxHeight: '64px',
        width: 'auto'
      }}
    >
      <MessageCircle className="h-6 w-6 sm:h-5 sm:w-5" />
    </button>
  );
};

export default WhatsAppButton;