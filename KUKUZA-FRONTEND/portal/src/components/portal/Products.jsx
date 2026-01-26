import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useParallaxButton } from '../../hooks/useParallaxButton';
import './products.css';

/**
 * Products component displays a grid of products with parallax button effects and show more/less functionality
 * @returns {JSX.Element} The Products section
 */
export default function Products() {
  const { products, loading, error } = useProducts();
  const [sectionRef, isVisible] = useScrollAnimation();
  const [showAll, setShowAll] = React.useState(false);

  // Exclude the last two products from the rendered list as requested
  const visibleProducts = React.useMemo(() => {
    if (!products) return products;
    if (showAll) return products;
    if (products.length <= 2) return products;
    return products.slice(0, products.length - 2);
  }, [products, showAll]);

  const { cardRefs } = useParallaxButton(visibleProducts);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading products: {error}</div>;
  }

  return (
    <section 
      ref={sectionRef}
      className={`products-section py-12 ${isVisible ? 'fade-in' : ''}`}
    >
      <h2 className={`text-2xl font-bold text-center mb-8 ${isVisible ? 'fade-in-down' : ''}`}>
        Produits
      </h2>
        <div className="products-grid">
        {visibleProducts.map((product, index) => (
          <div 
            key={product.id} 
            className={`product-card ${isVisible ? 'scale-in' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
            ref={(el) => cardRefs.current[product.id] = el}
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
            <button className="shop-now-btn">
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
            onClick={() => setShowAll((s) => !s)}
            aria-expanded={showAll}
          >
            {showAll ? 'Voir moins' : 'Voir plus'}
          </button>
        )}
      </div>
    </section>
  );
}
