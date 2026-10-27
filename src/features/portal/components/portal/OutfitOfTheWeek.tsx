import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/core/i18n';
import { outfits } from '../../data/outfits';
import './outfitoftheweek.css';

export default function OutfitOfTheWeek() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sectionRef, isVisible] = useScrollAnimation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % outfits.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentOutfit = outfits[currentIndex];
  const openOutfit = (imageIndex: number) => {
    navigate(`/outfits/${currentOutfit.id}`, { state: { imageIndex } });
  };

  return (
    <section 
      ref={sectionRef}
      className={`outfit-section py-16 px-4 ${isVisible ? 'fade-in' : ''}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className={`outfit-main-title text-3xl md:text-4xl font-bold text-center mb-4 ${isVisible ? 'fade-in-down' : ''}`}>
          {t('sections.outfitTitle')}
        </h2>
        <p className={`outfit-main-description text-center text-gray-600 mb-12 max-w-3xl mx-auto ${isVisible ? 'fade-in-up' : ''}`}>
          {t('sections.outfitDescription')}
        </p>
        
        <div 
          className="outfit-carousel-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="outfit-group">
            <h3 className="outfit-group-title">
              {t(currentOutfit.titleKey)}
            </h3>
            <p className="outfit-group-description">
              {t(currentOutfit.descriptionKey)}
            </p>
            
            <div className={`outfit-grid ${isVisible ? 'scale-in' : ''}`}>
              <button
                type="button"
                className={`outfit-item outfit-item-1 ${isVisible ? 'fade-in-left' : ''}`}
                style={{ animationDelay: '200ms' }}
                onClick={() => openOutfit(0)}
                aria-label={`${t('sections.viewDetails')} ${t(currentOutfit.images[0].altKey)}`}
              >
                <img
                  src={currentOutfit.images[0].src}
                  alt={t(currentOutfit.images[0].altKey)}
                  className="outfit-image"
                />
              </button>
              
              <button
                type="button"
                className={`outfit-item outfit-item-2 ${isVisible ? 'scale-in-bounce' : ''}`}
                style={{ animationDelay: '400ms' }}
                onClick={() => openOutfit(1)}
                aria-label={`${t('sections.viewDetails')} ${t(currentOutfit.images[1].altKey)}`}
              >
                <img
                  src={currentOutfit.images[1].src}
                  alt={t(currentOutfit.images[1].altKey)}
                  className="outfit-image"
                />
              </button>
              
              <button
                type="button"
                className={`outfit-item outfit-item-3 ${isVisible ? 'fade-in-right' : ''}`}
                style={{ animationDelay: '600ms' }}
                onClick={() => openOutfit(2)}
                aria-label={`${t('sections.viewDetails')} ${t(currentOutfit.images[2].altKey)}`}
              >
                <img
                  src={currentOutfit.images[2].src}
                  alt={t(currentOutfit.images[2].altKey)}
                  className="outfit-image"
                />
              </button>
            </div>
          </div>

          <div className="outfit-dots">
            {outfits.map((_, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`outfit-dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={t('sections.goToLook', { value: index + 1 })}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
