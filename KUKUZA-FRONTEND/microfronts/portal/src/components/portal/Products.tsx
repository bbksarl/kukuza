import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useNavigate } from 'react-router-dom';
import './products.css';

export default function Products() {
  const { products, loading, error } = useProducts();
  const [sectionRef, isVisible] = useScrollAnimation();
  const navigate = useNavigate();
  const visibleProducts = React.useMemo(() => {
    if (!products) return products;
    if (products.length <= 2) return products;
    return products.slice(0, products.length - 2);
  }, [products]);
  const cardRefs = React.useRef<any>({});
  const offsetRefs = React.useRef<any>({});
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      Object.keys(cardRefs.current).forEach((key) => {
        const card = cardRefs.current[key];
        if (!card) return;

        const button = card.querySelector('.shop-now-btn');
        if (!button) return;

        const cardRect = card.getBoundingClientRect();
        const cardHeight = cardRect.height;
        const viewportHeight = window.innerHeight;
        
        const cardTop = cardRect.top;
        const cardBottom = cardRect.bottom;
        
        let offset = 0;
        
        if (cardBottom > 0 && cardTop < viewportHeight) {
          if (cardTop < viewportHeight / 2) {
            offset = Math.min(
              Math.abs(Math.min(0, cardTop)),
              cardHeight - 100 // Keep button away from extreme edge of card
            );
          }
        }

        const isTop = button.dataset.position === 'top';
        const translate = offset ? (isTop ? offset : -offset) : 0;
        (button as HTMLElement).style.transform = `translateY(${translate}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [products]);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading products: {error}</div>;
  }

  return (
    <section 
      ref={sectionRef as any}
      className={`products-section py-12 ${isVisible ? 'fade-in' : ''}`}
    >
      <h2 className={`text-2xl font-bold text-center mb-8 ${isVisible ? 'fade-in-down' : ''}`}>
        Produits
      </h2>
        <div className="products-grid">
        {visibleProducts.map((product: any, index: number) => (
          <div 
            key={product.id} 
            className={`product-card ${isVisible ? 'scale-in' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
            ref={(el) => (cardRefs.current[product.id] = el)}
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />
            <div className="product-overlay">
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brand || product.creator_name || 'Boutique'}</p>
              </div>
            </div>
            <button className="shop-now-btn" data-position="top">
              Shop Now
            </button>
          </div>
        ))}
      </div>

      {/* Load more / show less button */}
      <div className="load-more-container">
        {products && products.length > 2 && (
          <button
            className="load-more-btn"
            onClick={() => navigate('/products')}
            aria-label="Voir la liste complète des produits"
          >
            Voir plus
          </button>
        )}
      </div>
    </section>
  );
}
