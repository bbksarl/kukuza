import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { bestSellers, BestSellerItem } from '../../data/bestSellers';
import { useLanguage } from '@/core/i18n';
import './bestsellers.css';

export default function BestSellers() {
  const [sectionRef, isVisible] = useScrollAnimation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const goToDetails = (item: BestSellerItem) => {
    navigate(`/best-sellers/${item.slug}`);
  };

  return (
    <section
      ref={sectionRef}
      className={`bestsellers-section ${isVisible ? 'fade-in' : ''}`}
    >
      <div className="bestsellers-container">
        <div className="bestsellers-header">
          <span className="bestsellers-label">{t('sections.bestCollection')}</span>
          <h2 className={`bestsellers-title font-display ${isVisible ? 'fade-in-down' : ''}`}>
            <strong>{t('sections.bestSellers')}</strong>
          </h2>
          <p className="bestsellers-description">
            {t('sections.bestDescription')}
          </p>
        </div>

        <div className="bestsellers-grid">
          {bestSellers.map((item: BestSellerItem, index: number) => (
            <article
              key={item.id}
              className={`bestseller-card ${item.featured ? 'bestseller-card--featured' : ''} ${isVisible ? 'scale-in' : ''}`}
              style={{ animationDelay: `${index * 120}ms` }}
              role="link"
              tabIndex={0}
              onClick={() => goToDetails(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  goToDetails(item);
                }
              }}
              aria-label={`${t('sections.viewDetails')} ${t(item.titleKey)}`}
            >
              <img src={item.src} alt={item.alt} className="bestseller-image" />

              <div className="bestseller-card-overlay" />

              <div className="bestseller-card-top">
                <span className="bestseller-chip">{t(item.categoryKey)}</span>
                <button
                  type="button"
                  className="bestseller-action"
                  onClick={(event) => {
                    event.stopPropagation();
                    goToDetails(item);
                  }}
                >
                  <span>{t('sections.viewDetails')}</span>
                  <span aria-hidden="true" className="bestseller-action-arrow">
                    →
                  </span>
                </button>
              </div>

              <div className="bestseller-card-meta">
                <p className="bestseller-kicker">{t('sections.kukuzaSelection')}</p>
                <h3 className="bestseller-name">{t(item.titleKey)}</h3>
                <p className="bestseller-price">{item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
