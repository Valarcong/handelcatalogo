import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-900 text-gray-200 border-t border-gray-800 mt-12">
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
      <div className="flex-1 mb-4 md:mb-0">
        <img src="/imagenes/logo/handel_logo_blanco_reducido.png" alt="Handel Logo" className="h-10 mb-2" />
        <p className="text-sm text-gray-400 max-w-xs">
          Soluciones industriales y comerciales para tu empresa. Calidad, innovación y atención personalizada.
        </p>
      </div>
      <div className="flex-1 mb-4 md:mb-0">
        <h4 className="font-bold text-base mb-2 text-white">Contacto</h4>
        <ul className="text-sm space-y-1">
          <li>Email: <a href="mailto:ventas@handel.pe" className="text-blue-400 hover:underline">ventas@handel.pe</a></li>
          <li>WhatsApp: <a href="https://wa.me/51970337910" className="text-blue-400 hover:underline">+51 970 337 910</a></li>
          <li>Dirección: Lima, Perú</li>
        </ul>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-base mb-2 text-white">Enlaces útiles</h4>
        <ul className="text-sm space-y-1">
          <li><a href="/productos" className="hover:underline">Catálogo</a></li>
          <li><a href="/clientes" className="hover:underline">Clientes</a></li>
          <li><a href="https://www.handelsac.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Página Web</a></li>
        </ul>
        <div className="flex gap-3 mt-3">
          <a href="https://www.facebook.com/handelperu" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0"/></svg>
          </a>
          <a href="https://www.linkedin.com/company/handelperu/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.25c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.25 11.25h-3v-5.604c0-1.337-.025-3.062-1.867-3.062-1.868 0-2.154 1.459-2.154 2.967v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z"/></svg>
          </a>
        </div>
      </div>
    </div>
    <div className="bg-gray-950 text-gray-400 text-xs text-center py-3 border-t border-gray-800">
      © {new Date().getFullYear()} Handel Perú. Todos los derechos reservados.
    </div>
  </footer>
);

export default Footer; 