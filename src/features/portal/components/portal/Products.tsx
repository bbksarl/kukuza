import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useNavigate } from 'react-router-dom';
import type { PortalProduct } from '../../data/catalog';
import { useLanguage } from '@/core/i18n';
import './products.css';

export default function Products() {
  const { products, loading, error } = useProducts();
  const [sectionRef, isVisible] = useScrollAnimation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const openProduct = (product: PortalProduct) => {
    navigate(`/products/${product.id}`, { state: { product } });
  };
  const visibleProducts = React.useMemo(() => {
    if (!products) return products;
    return products.slice(0, 10);
  }, [products]);
  const cardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  React.useEffect(() => {
    const handleScroll = () => {
      Object.keys(cardRefs.current).forEach((key) => {
        const card = cardRefs.current[key];
        if (!card) return;

        const button = card.querySelector<HTMLElement>('.shop-now-btn');
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
        button.style.transform = `translateY(${translate}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [products]);

  if (loading) {
    return <div className="text-center py-8">{t('portal.loadingProducts')}</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{t('portal.errorProducts', { value: error })}</div>;
  }

  return (
    <section 
      ref={sectionRef}
      className={`products-section py-12 ${isVisible ? 'fade-in' : ''}`}
    >
      <h2 className={`text-2xl font-bold text-center mb-8 ${isVisible ? 'fade-in-down' : ''}`}>
        {t('catalog.allProducts')}
      </h2>
        <div className="products-grid">
        {visibleProducts.map((product: PortalProduct, index: number) => (
          <div 
            key={product.id} 
            className={`product-card ${isVisible ? 'scale-in' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
            ref={(el) => (cardRefs.current[product.id] = el)}
            role="link"
            tabIndex={0}
            aria-label={`${t('catalog.viewProduct')} ${product.name}`}
            onClick={() => openProduct(product)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProduct(product);
              }
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />
            <div className="product-overlay">
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
            <p className="product-brand">{product.boutique_name || product.brand || product.creator_name || 'Boutique'}</p>
              </div>
            </div>
            <button
              type="button"
              className="shop-now-btn"
              data-position="top"
              onClick={(event) => {
                event.stopPropagation();
                openProduct(product);
              }}
            >
              {t('sections.shopNow')}
            </button>
          </div>
        ))}
      </div>

      {/* Load more / show less button */}
      <div className="load-more-container">
        {products && products.length > 10 && (
          <button
            className="load-more-btn"
            onClick={() => navigate('/products')}
            aria-label={t('portal.viewAllProducts')}
          >
            {t('sections.viewMore')}
          </button>
        )}
      </div>
    </section>
  );
}
