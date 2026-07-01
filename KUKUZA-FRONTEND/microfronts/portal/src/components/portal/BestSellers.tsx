import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './bestsellers.css';

type BestSellerItem = {
  id: number;
  src: string;
  alt: string;
  title: string;
  price: string;
  category: string;
  featured?: boolean;
};

export default function BestSellers() {
  const [sectionRef, isVisible] = useScrollAnimation();
  const bestSellers: BestSellerItem[] = [
    {
      id: 1,
      src: '/assets/mVentes/im2.png',
      alt: 'Tenue streetwear noir et blanc',
      title: 'Élégance streetwear',
      price: '69,99 €',
      category: 'Nouveauté',
    },
    {
      id: 2,
      src: '/assets/mVentes/im1.png',
      alt: 'Robe rouge élégante',
      title: 'Robe soirée rouge',
      price: '129,00 €',
      category: 'Best seller',
      featured: true,
    },
    {
      id: 3,
      src: '/assets/mVentes/im3.png',
      alt: 'Caftan rayé multicolore',
      title: 'Caftan luxe',
      price: '89,90 €',
      category: 'Édition limitée',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`bestsellers-section ${isVisible ? 'fade-in' : ''}`}
    >
      <div className="bestsellers-container">
        <div className="bestsellers-header">
          <span className="bestsellers-label">Collection premium</span>
          <h2 className={`bestsellers-title font-display ${isVisible ? 'fade-in-down' : ''}`}>
            <strong>LES MEILLEURES VENTES</strong>
          </h2>
          <p className="bestsellers-description">
            Les pièces les plus plébiscitées de la saison réunies dans une sélection élégante.
          </p>
        </div>

        <div className="bestsellers-grid">
          {bestSellers.map((item: BestSellerItem, index: number) => (
            <article
              key={item.id}
              className={`bestseller-card ${item.featured ? 'bestseller-card--featured' : ''} ${isVisible ? 'scale-in' : ''}`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <img src={item.src} alt={item.alt} className="bestseller-image" />

              <div className="bestseller-card-overlay" />

              <div className="bestseller-card-top">
                <span className="bestseller-chip">{item.category}</span>
                <a className="bestseller-action" href="/products">
                  <span>Voir détails</span>
                  <span aria-hidden="true" className="bestseller-action-arrow">
                    →
                  </span>
                </a>
              </div>

              <div className="bestseller-card-meta">
                <p className="bestseller-kicker">Kukuza selection</p>
                <h3 className="bestseller-name">{item.title}</h3>
                <p className="bestseller-price">{item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
