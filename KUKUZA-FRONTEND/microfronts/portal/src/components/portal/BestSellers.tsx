import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './bestsellers.css';

export default function BestSellers() {
  const [sectionRef, isVisible] = useScrollAnimation();
  const bestSellers = [
    { 
      id: 1, 
      src: '/assets/mVentes/im2.png', 
      alt: 'Tenue streetwear noir et blanc' 
    },
    { 
      id: 2, 
      src: '/assets/mVentes/im1.png', 
      alt: 'Robe rouge élégante', 
      featured: true 
    },
    { 
      id: 3, 
      src: '/assets/mVentes/im3.png', 
      alt: 'Caftan rayé multicolore' 
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className={`bestsellers-section ${isVisible ? 'fade-in' : ''}`}
    >
      <div className="bestsellers-container">
        <h2 className={`bestsellers-title font-display ${isVisible ? 'fade-in-down' : ''}`}><strong>LES MEILLEURES VENTES</strong></h2>

        <div className="bestsellers-grid">
          {bestSellers.map((item, index) => (
            <div 
              key={item.id} 
              className={`bestseller-item ${item.featured ? 'bestseller-featured' : ''} ${isVisible ? 'scale-in' : ''}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="bestseller-image"
              />
              <div className="bestseller-overlay">
                <button className="bestseller-btn">
                  Voir le produit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
