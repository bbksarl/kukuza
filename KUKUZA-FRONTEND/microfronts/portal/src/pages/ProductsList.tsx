import React from 'react';
import Header from '../components/portal/Header';
import Footer from '../components/portal/Footer';
import { usePaginatedProducts } from '../hooks/usePaginatedProducts';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function ProductsList(){
  const { items: products, loading, error, loadMore, total } = usePaginatedProducts(1, 12);
  const [sectionRef, isVisible] = useScrollAnimation();

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading products: {error}</div>;

  return (
    <div className="bg-portal-bg min-h-screen overflow-x-hidden">
      <Header />
      <main className="min-h-[calc(100vh-52px)] flex flex-col bg-gray-50 w-full overflow-x-hidden">
        <section ref={sectionRef as any} className={`products-section py-12 ${isVisible ? 'fade-in' : ''}`}>
          <h2 className={`text-2xl font-bold text-center mb-8 ${isVisible ? 'fade-in-down' : ''}`}>Tous les produits</h2>
          <div className="grid grid-flow-col gap-7 px-7 md:gap-6 lg:gap-9 justify-center" style={{ gridAutoColumns: 'minmax(180px, 1fr)', gridTemplateRows: 'repeat(2, auto)' }}>
            {products && products.map((product: any, index: number) => (
              <div
                key={product.id}
                className={`${isVisible ? 'scale-in' : ''} relative overflow-hidden rounded-xl w-full min-h-[380px] cursor-pointer transition-transform duration-300 ease shadow-lg flex flex-col`}
                style={{ animationDelay: `${index * 50}ms`, aspectRatio: '3 / 4' }}
              >
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 ease" />
                <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 flex flex-col justify-end">
                  <div className="text-white mb-2">
                    <h3 className="text-lg font-bold drop-shadow">{product.name}</h3>
                    <p className="text-sm font-medium uppercase tracking-wide opacity-90 drop-shadow">{product.brand || product.creator_name || 'Boutique'}</p>
                  </div>
                </div>
                <button className="absolute top-4 right-4 px-4 py-2 bg-white/15 text-white border border-white/30 rounded-full text-sm font-semibold uppercase tracking-wider backdrop-blur-md shadow-2xl hover:bg-white/25 hover:border-white/50 transform hover:scale-105 transition" data-position="top">Shop Now</button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            {(total === null || products.length < total) && (
              <button className="px-4 py-2 bg-primary text-white rounded" onClick={loadMore}>
                Charger plus
              </button>
            )}
            {total !== null && products.length >= total && (
              <div className="text-sm text-gray-500">Tous les produits affichés</div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
