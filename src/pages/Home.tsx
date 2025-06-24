/**
 * Objetivo: Transformar la página principal actual en un layout de estilo marketplace.
 * Cambios solicitados:
 *
 * 1. Rediseñar el "hero section" para mostrar una barra de búsqueda centrada con categoría filtrable
 *    al estilo Amazon/MercadoLibre.
 *
 * 2. Debajo del hero, mostrar una cuadrícula (grid) de productos destacados, con:
 *    - Imágenes visibles
 *    - Nombre, precio y botón "Comprar por WhatsApp"
 *    - Etiquetas o badges como "Nuevo", "Oferta", etc. si están disponibles
 *
 * 3. Reemplazar las 3 ventajas (Alta calidad, etc.) por una fila de íconos más pequeños tipo badges o cards laterales.
 *
 * 4. Añadir un carrusel (slider) o sección de categorías más visual, tipo "ver por categoría"
 *    con íconos grandes o tarjetas con imágenes de fondo.
 *
 * 5. Agregar una sección de promociones o productos recomendados más abajo (opcional).
 *
 * 6. Añadir sticky bar o botón flotante con acceso directo a WhatsApp o búsqueda.
 *
 * Dejar estilos con Tailwind, evitar usar componentes muy pesados si es posible.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Users, Award, Shield, Truck, Clock } from 'lucide-react';
import { Product } from '@/types/product';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Footer from '@/components/Footer';

const Home = () => {
  const { products, categories, loading } = useProducts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  const handleWhatsAppQuote = (product: Product, quantity: number) => {
    const totalPrice = product.unitPrice * quantity;
    const message = `¡Hola! Me interesa este producto:\n\n🧾 *${product.name}*\n📋 Código: ${product.code}\n📦 Cantidad: ${quantity}\n💰 Precio Unitario: USD ${product.unitPrice.toFixed(2)}\n💵 Total: *USD ${totalPrice.toFixed(2)}*\n\n¿Podrían enviarme más información sobre disponibilidad y tiempo de entrega?\n\n¡Gracias!`;
    const whatsappUrl = `https://wa.me/51970337910?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    }
    if (searchCategory) {
      params.set('categoria', searchCategory);
    }
    navigate(`/productos?${params.toString()}`);
  };

  const featuredProducts = products.slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      {/* Hero Section: fondo degradado oscuro, logo, título y barra de búsqueda */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 border-b border-gray-800 shadow-xl px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-gray-900/80 to-green-900/70" />
        <div className="relative z-10 w-full flex flex-col items-center justify-center h-full">
          <img src="/imagenes/logo/handel_logo_blanco_reducido.png" alt="Handel Logo" className="h-20 md:h-28 mb-4 drop-shadow-2xl" />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-6 text-center drop-shadow-xl tracking-widest uppercase">
            Encuentra el producto ideal para tu industria
          </h1>
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl flex flex-col md:flex-row gap-3 items-center justify-center bg-gray-900/80 rounded-xl shadow-2xl p-4 border-2 border-gray-700 backdrop-blur"
          >
            <input
              type="text"
              placeholder="Buscar productos, marcas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:flex-[2_2_0%] px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg font-semibold"
            />
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full md:w-auto md:min-w-[120px] md:max-w-[160px] px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg font-semibold"
            >
              <option value="">Categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 rounded-lg bg-blue-700 text-white font-extrabold hover:bg-blue-800 transition-colors shadow-lg text-base md:text-lg border-2 border-blue-900"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Ventajas tipo badges/cards industriales */}
      <section className="w-full flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 py-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 border-b border-gray-800 px-4">
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 shadow-md w-full md:w-auto justify-center">
          <Award className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-bold text-blue-100 uppercase tracking-wider">+40 años de experiencia</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 shadow-md w-full md:w-auto justify-center">
          <Package className="h-5 w-5 text-green-400" />
          <span className="text-sm font-bold text-green-100 uppercase tracking-wider">Calidad garantizada</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 shadow-md w-full md:w-auto justify-center">
          <Users className="h-5 w-5 text-orange-400" />
          <span className="text-sm font-bold text-orange-100 uppercase tracking-wider">Atención personalizada</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 shadow-md w-full md:w-auto justify-center">
          <ArrowRight className="h-5 w-5 text-purple-400" />
          <span className="text-sm font-bold text-purple-100 uppercase tracking-wider">Entrega rápida</span>
        </div>
      </section>

      {/* Carrusel visual de categorías industriales */}
      <section className="py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-100 mb-2 tracking-widest uppercase">Ver por Categoría</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Explora nuestras categorías principales y encuentra lo que necesitas rápidamente.</p>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {categories
                .slice()
                .sort((a, b) => b.count - a.count)
                .map((category) => (
                  <CarouselItem key={category.id} className="basis-4/5 sm:basis-1/3 md:basis-1/4 px-2">
                    <Link to={`/productos?categoria=${encodeURIComponent(category.name)}`}
                      className="block group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow relative h-48 md:h-56 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 border-2 border-gray-700">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 to-green-900 opacity-60" />
                      )}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                        <Package className="h-10 w-10 text-blue-400 mb-2 drop-shadow" />
                        <h3 className="text-lg md:text-xl font-extrabold text-gray-100 mb-1 text-center drop-shadow tracking-widest uppercase">{category.name}</h3>
                        <span className="text-sm text-gray-200 bg-gray-900/80 rounded px-3 py-1 mt-1 shadow border border-gray-700">{category.count} productos</span>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex left-0 top-1/2 -translate-y-1/2" />
            <CarouselNext className="hidden sm:flex right-0 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      {/* Productos Destacados tipo marketplace industrial */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-xl font-extrabold text-gray-100 mb-2 tracking-wide uppercase">Productos Destacados</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Descubre nuestros productos más populares y solicita tu cotización al instante.
            </p>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow p-6 flex flex-col items-center relative group border-2 border-gray-700">
                  {/* Marca arriba de la imagen, fuera del área de la imagen */}
                  <div className="w-full flex justify-start mb-2">
                    <span className="bg-white text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow border border-blue-200 z-20" style={{minWidth:'60px', textAlign:'center', letterSpacing:'0.08em'}}>{product.brand?.toUpperCase()}</span>
                  </div>
                  {/* Imagen (enlace) */}
                  <Link to={`/producto/${product.id}`} className="block w-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-auto aspect-square object-contain mb-4 mx-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-xl bg-gray-900 rounded-lg p-2 border border-gray-700"
                    />
                  </Link>
                  <Link to={`/producto/${product.id}`} className="block w-full">
                    <h3 className="font-extrabold text-sm text-gray-100 mb-1 text-left line-clamp-2 hover:underline uppercase tracking-wider drop-shadow">{product.name}</h3>
                  </Link>
                  {/* Precio */}
                  <div className="text-yellow-300 font-extrabold text-base mb-2 drop-shadow text-left w-full">USD {product.unitPrice.toFixed(2)}</div>
                  {/* Etiquetas */}
                  {Array.isArray(product.tags) && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 w-full justify-start">
                      {product.tags.map((tag, idx) => (
                        <span key={idx} className="bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded tracking-widest" style={{letterSpacing: '0.08em'}}>{tag.toUpperCase()}</span>
                      ))}
                    </div>
                  )}
                  {/* Botón WhatsApp */}
                  <button
                    onClick={() => handleWhatsAppQuote(product, 1)}
                    className="mt-auto w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg tracking-wider text-xs md:text-sm border-2 border-green-700"
                  >
                    Cotizar en WhatsApp
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No hay productos disponibles en este momento</p>
              <Link to="/admin">
                <Button variant="outline">Ir al Panel de Administración</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Home;