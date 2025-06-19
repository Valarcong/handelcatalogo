import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Users, Award, Shield, Truck, Clock } from 'lucide-react';
import { Product } from '@/types/product';

const Home = () => {
  const { products, categories, loading } = useProducts();

  const handleWhatsAppQuote = (product: Product, quantity: number) => {
    const totalPrice = (quantity >= 10 ? product.wholesalePrice : product.unitPrice) * quantity;
    const priceType = quantity >= 10 ? 'Por Mayor' : 'Unitario';
    
    const message = `¡Hola! Me interesa este producto:

🧾 *${product.name}*
📋 Código: ${product.code}
📦 Cantidad: ${quantity}
💰 Precio ${priceType}: S/. ${(quantity >= 10 ? product.wholesalePrice : product.unitPrice).toFixed(2)}
💵 Total: *S/. ${totalPrice.toFixed(2)}*

¿Podrían enviarme más información sobre disponibilidad y tiempo de entrega?

¡Gracias!`;
    
    const whatsappUrl = `https://wa.me/51970337910?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    console.log('Cotización WhatsApp desde Home:', { product: product.name, quantity, totalPrice });
  };

  const featuredProducts = products.slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-brand-orange">Handel</span>SAC
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Especialistas en soluciones industriales de alta calidad. 
              Productos confiables para empresas que buscan excelencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/productos">
                <Button className="bg-brand-orange hover:bg-orange-600 text-white px-8 py-3 text-lg">
                  Ver Catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-brand-primary px-8 py-3 text-lg"
                onClick={() => window.open('https://wa.me/51970337910', '_blank')}
              >
                Contactar WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-primary mb-4">¿Por qué elegir HandelSAC?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Más de 20 años de experiencia nos respaldan como líderes en soluciones industriales
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-brand-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-primary">Calidad Garantizada</h3>
              <p className="text-gray-600">Productos certificados con los más altos estándares de calidad industrial</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-brand-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-primary">Entrega Rápida</h3>
              <p className="text-gray-600">Distribución eficiente a nivel nacional con tiempos de entrega optimizados</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-primary">Soporte 24/7</h3>
              <p className="text-gray-600">Asesoría técnica especializada disponible cuando la necesites</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-brand-gray-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-primary mb-4">Nuestras Categorías</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Amplio catálogo de productos industriales para satisfacer todas tus necesidades empresariales
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/productos?categoria=${encodeURIComponent(category.name)}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center group"
              >
                <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-accent/30 transition-colors">
                  <Package className="h-8 w-8 text-brand-accent" />
                </div>
                <h3 className="font-semibold text-brand-primary mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} productos</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-primary mb-4">Productos Destacados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestros productos más solicitados con precios competitivos
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onWhatsAppQuote={handleWhatsAppQuote}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hay productos disponibles en este momento</p>
              <Link to="/admin">
                <Button variant="outline">Ir al Panel de Administración</Button>
              </Link>
            </div>
          )}
          
          <div className="text-center">
            <Link to="/productos">
              <Button className="bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3">
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-16 bg-brand-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Sobre HandelSAC</h2>
              <p className="text-lg mb-6 text-blue-100">
                Somos una empresa peruana especializada en la comercialización de productos industriales 
                de alta calidad. Con más de dos décadas de experiencia, nos hemos consolidado como 
                referentes en el sector industrial nacional.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-brand-orange mr-3" />
                  <span>Más de 20 años de experiencia</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-brand-orange mr-3" />
                  <span>Más de 1000 clientes satisfechos</span>
                </div>
                <div className="flex items-center">
                  <Package className="h-6 w-6 text-brand-orange mr-3" />
                  <span>Amplio catálogo de productos</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">¿Necesitas una cotización?</h3>
                <p className="mb-6 text-blue-100">
                  Nuestro equipo de expertos está listo para ayudarte a encontrar 
                  la solución perfecta para tu empresa.
                </p>
                <Button 
                  className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-3"
                  onClick={() => window.open('https://wa.me/51970337910', '_blank')}
                >
                  Solicitar Cotización
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
};

export default Home;